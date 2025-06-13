import React, { useState, useRef } from 'react';
import {
  PhotoIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { Arc19, Arc69, IPFS, AssetFactory } from 'arcraft';
import { type Network } from 'arcraft';
import { useNetwork, useWallet } from '@txnlab/use-wallet-react';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import { IdLink } from '../utils/linkUtils';

type ARCStandard = 'arc19' | 'arc69';
type IPFSProvider = 'pinata' | 'filebase';

interface FormData {
  description: string;
  ipfsProvider: IPFSProvider;
  pinataJWT: string;
  filebaseToken: string;
  properties: Record<string, any>;
  attributes: Array<{ trait_type: string; value: string }>;
  arcStandard: ARCStandard;
}

export function NFTUpdate() {
  const [assetIdToUpdate, setAssetIdToUpdate] = useState('');
  const [isLoadingAsset, setIsLoadingAsset] = useState(false);
  const [loadedAsset, setLoadedAsset] = useState<Arc19 | Arc69 | null>(null);

  const [formData, setFormData] = useState<FormData>({
    description: '',
    arcStandard: 'arc19',
    ipfsProvider: 'pinata',
    pinataJWT: '',
    filebaseToken: '',
    properties: {},
    attributes: [{ trait_type: '', value: '' }],
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [result, setResult] = useState<{
    transactionId: string;
    assetId: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { activeAddress, transactionSigner } = useWallet();
  const { activeNetwork } = useNetwork();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const loadAssetForUpdate = async () => {
    try {
      setIsLoadingAsset(true);

      const assetId = parseInt(assetIdToUpdate);
      if (isNaN(assetId) || assetId <= 0) {
        showErrorToast('Please enter a valid asset ID');
        return;
      }

      // Use AssetFactory to automatically detect the correct ARC standard
      const asset = await AssetFactory.fromId(
        assetId,
        activeNetwork as Network
      );
      const arcType = await AssetFactory.getArcType(
        assetId,
        activeNetwork as Network
      );

      // Only allow ARC-19 and ARC-69 for updates
      if (arcType !== 'arc19' && arcType !== 'arc69') {
        throw new Error(
          'Updates are only supported for ARC-19 and ARC-69 NFTs'
        );
      }

      setLoadedAsset(asset as Arc19 | Arc69);

      // Populate form with existing data
      let metadata: any = {};
      let imageUrl = '';

      if (asset instanceof Arc19) {
        metadata = asset.getMetadata();
        imageUrl = asset.getImageUrl() || '';
        showSuccessToast('ARC-19 NFT loaded successfully');
      } else if (asset instanceof Arc69) {
        metadata = asset.getMetadata();
        imageUrl = asset.getImageUrl() || '';
        showSuccessToast('ARC-69 NFT loaded successfully');
      }

      setFormData((prev) => ({
        ...prev,
        description:
          metadata.properties?.description || metadata.description || '',
        arcStandard: arcType as ARCStandard,
        properties: metadata.properties || {},
        attributes:
          metadata.properties?.attributes || metadata.attributes || [],
      }));

      // Set preview URL if image exists
      if (imageUrl) {
        setPreviewUrl(imageUrl);
      }
    } catch (error: any) {
      console.error(error);
      showErrorToast(error.message || 'Failed to load asset');
      setLoadedAsset(null);
    } finally {
      setIsLoadingAsset(false);
    }
  };

  const addAttribute = () => {
    setFormData((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { trait_type: '', value: '' }],
    }));
  };

  const removeAttribute = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  const updateAttribute = (
    index: number,
    field: 'trait_type' | 'value',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) =>
        i === index ? { ...attr, [field]: value } : attr
      ),
    }));
  };

  const updateNFT = async () => {
    try {
      setIsUpdating(true);
      setResult(null);

      if (!loadedAsset) {
        showErrorToast('Please load an asset first');
        return;
      }

      if (!activeAddress) {
        showErrorToast('Please connect your wallet');
        return;
      }

      // Check IPFS requirements based on standard
      let ipfs = null;

      if (formData.arcStandard === 'arc19') {
        // ARC-19 always requires IPFS token for updates (even metadata-only)
        if (formData.ipfsProvider === 'pinata' && !formData.pinataJWT) {
          showErrorToast(
            'Please enter your Pinata JWT token (required for ARC-19 updates)'
          );
          return;
        }

        if (formData.ipfsProvider === 'filebase' && !formData.filebaseToken) {
          showErrorToast(
            'Please enter your Filebase API token (required for ARC-19 updates)'
          );
          return;
        }

        if (!activeAddress) {
          showErrorToast('Please connect your wallet');
          return;
        }

        const ipfsConfig =
          formData.ipfsProvider === 'pinata'
            ? { provider: 'pinata' as const, jwt: formData.pinataJWT }
            : { provider: 'filebase' as const, token: formData.filebaseToken };

        ipfs = new IPFS(formData.ipfsProvider, ipfsConfig);
      }

      const updater = {
        address: activeAddress,
        signer: transactionSigner,
      };

      // Prepare updated metadata
      const properties = {
        description: formData.description,
        ...formData.properties,
        attributes: formData.attributes.filter(
          (attr) => attr.trait_type && attr.value
        ),
      };

      let updateResult;

      if (formData.arcStandard === 'arc19') {
        // ARC-19 can update both metadata and image
        const updateParams: any = {
          manager: updater,
          properties,
          assetId: parseInt(assetIdToUpdate),
          network: activeNetwork as Network,
          ipfs,
        };

        // Add image if provided
        if (selectedFile) {
          updateParams.image = {
            file: selectedFile,
            name: selectedFile.name,
          };
        }

        console.log(updateParams, 'updateParams');

        updateResult = await Arc19.update(updateParams);

        console.log(updateResult, 'updateResult');
      } else if (formData.arcStandard === 'arc69') {
        // ARC-69 can only update metadata (not image)
        const arc69Properties = {
          ...properties,
          standard: 'arc69',
        };
        updateResult = await Arc69.update({
          manager: updater,
          properties: arc69Properties,
          assetId: parseInt(assetIdToUpdate),
          network: activeNetwork as Network,
        });
      } else {
        throw new Error('Updates are only supported for ARC-19 and ARC-69');
      }

      setResult({
        transactionId: updateResult?.transactionId || '',
        assetId: parseInt(assetIdToUpdate),
      });
      showSuccessToast(
        `${formData.arcStandard.toUpperCase()} NFT updated successfully`
      );
    } catch (err: any) {
      console.error(err);
      showErrorToast(err.message || 'Failed to update NFT');
    } finally {
      setIsUpdating(false);
    }
  };

  const isArc19UpdateDisabled = () => {
    return (
      formData.arcStandard === 'arc19' &&
      ((formData.ipfsProvider === 'pinata' && !formData.pinataJWT) ||
        (formData.ipfsProvider === 'filebase' && !formData.filebaseToken))
    );
  };

  const isManagerOfAsset = () => {
    return loadedAsset?.getManager() === activeAddress;
  };

  return (
    <div className="space-y-8">
      {/* Asset Loading */}
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Load NFT to Update
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asset ID
            </label>
            <input
              type="number"
              value={assetIdToUpdate}
              onChange={(e) => setAssetIdToUpdate(e.target.value)}
              placeholder="Enter asset ID to update"
              className="input-field"
            />
          </div>
          <button
            onClick={loadAssetForUpdate}
            disabled={isLoadingAsset || !assetIdToUpdate.trim()}
            className="btn-primary px-6 py-2 flex items-center space-x-2"
          >
            {isLoadingAsset ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="h-4 w-4" />
                <span>Load NFT</span>
              </>
            )}
          </button>
        </div>

        {loadedAsset && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-green-700 font-medium">
              ✓ NFT loaded successfully!
            </p>
            <div className="mt-2 text-sm text-green-600">
              <span className="font-medium">Standard:</span>{' '}
              {formData.arcStandard.toUpperCase()}
              {loadedAsset && (
                <>
                  <span className="ml-4 font-medium">Name:</span>{' '}
                  {loadedAsset.getName()}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Show form only if asset is loaded */}
      {loadedAsset && (
        <>
          {!isManagerOfAsset() && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                You are not the manager of this NFT
              </h3>
              <p className="text-sm text-red-800">
                Only the manager of the NFT can update it.
              </p>
            </div>
          )}
          {/* File Upload - Only for ARC-19 */}
          {formData.arcStandard === 'arc19' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Update Image (Optional)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Leave empty to keep the current image, or upload a new one to
                replace it.
              </p>
              <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                {previewUrl ? (
                  <div className="space-y-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <p className="text-sm text-gray-600">
                      {selectedFile?.name || 'Current image'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div>
                      <p className="text-gray-600">
                        Drop your image here or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] && handleFileSelect(e.target.files[0])
                  }
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* ARC-69 Image Update Notice */}
          {formData.arcStandard === 'arc69' && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                Image Update Not Available
              </h3>
              <p className="text-sm text-yellow-800">
                ARC-69 NFTs store images permanently on IPFS. Only metadata can
                be updated for ARC-69 NFTs.
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={4}
              className="input-field"
              placeholder="Describe your NFT..."
            />
          </div>

          {/* Attributes */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Attributes
              </h3>
              <button
                type="button"
                onClick={addAttribute}
                className="btn-outline text-sm"
              >
                Add Attribute
              </button>
            </div>
            <div className="space-y-3">
              {formData.attributes.map((attr, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={attr.trait_type}
                    onChange={(e) =>
                      updateAttribute(index, 'trait_type', e.target.value)
                    }
                    placeholder="Trait type"
                    className="input-field flex-1"
                  />
                  <input
                    type="text"
                    value={attr.value}
                    onChange={(e) =>
                      updateAttribute(index, 'value', e.target.value)
                    }
                    placeholder="Value"
                    className="input-field flex-1"
                  />
                  {formData.attributes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAttribute(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* IPFS Configuration - Only for ARC-19 */}
          {formData.arcStandard === 'arc19' && (
            <div>
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Required:</strong> IPFS credentials are required for
                  all ARC-19 updates, even when only updating metadata.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IPFS Provider
                  </label>
                  <select
                    value={formData.ipfsProvider}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ipfsProvider: e.target.value as IPFSProvider,
                      }))
                    }
                    className="input-field"
                  >
                    <option value="pinata">Pinata</option>
                    <option value="filebase">Filebase</option>
                  </select>
                </div>

                <div>
                  {formData.ipfsProvider === 'pinata' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pinata JWT Token *
                      </label>
                      <input
                        type="password"
                        value={formData.pinataJWT}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            pinataJWT: e.target.value,
                          }))
                        }
                        className="input-field"
                        placeholder="Your Pinata JWT token"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filebase API Token *
                      </label>
                      <input
                        type="password"
                        value={formData.filebaseToken}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            filebaseToken: e.target.value,
                          }))
                        }
                        className="input-field"
                        placeholder="Your Filebase API token"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Update Button */}
          <div className="flex justify-center">
            <button
              onClick={updateNFT}
              disabled={
                isUpdating ||
                !loadedAsset ||
                isArc19UpdateDisabled() ||
                !isManagerOfAsset()
              }
              className="btn-primary px-8 py-3 text-lg flex items-center space-x-2"
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Updating NFT...</span>
                </>
              ) : (
                <>
                  <PencilSquareIcon className="h-5 w-5" />
                  <span>Update NFT</span>
                </>
              )}
            </button>
          </div>

          {result && (
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
                <span className="text-green-700 font-semibold text-lg">
                  NFT Updated Successfully!
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Asset ID:</span>
                  <IdLink
                    id={result.assetId}
                    type="asset"
                    network={activeNetwork as Network}
                    className="ml-2"
                  >
                    {result.assetId}
                  </IdLink>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Transaction ID:
                  </span>
                  <IdLink
                    id={result.transactionId}
                    type="tx"
                    network={activeNetwork as Network}
                    className="ml-2 break-all"
                  >
                    {result.transactionId}
                  </IdLink>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Standard:</span>
                  <span className="ml-2 text-gray-900 uppercase">
                    {formData.arcStandard}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Network:</span>
                  <span className="ml-2 text-gray-900 capitalize">
                    {activeNetwork}
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
