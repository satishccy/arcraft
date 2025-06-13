import React, { useState, useRef } from "react";
import {
  PhotoIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Arc3, Arc19, Arc69, IPFS } from "arcraft";
import { type Network } from "arcraft";
import { useNetwork, useWallet } from "@txnlab/use-wallet-react";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { IdLink } from "../utils/linkUtils";

type ARCStandard = "arc3" | "arc19" | "arc69";
type IPFSProvider = "pinata" | "filebase";

interface FormData {
  // Basic NFT Info
  name: string;
  unitName: string;
  description: string;

  // ARC Standard
  arcStandard: ARCStandard;

  // IPFS Configuration
  ipfsProvider: IPFSProvider;
  pinataJWT: string;
  filebaseToken: string;

  // Properties
  properties: Record<string, any>;
  attributes: Array<{ trait_type: string; value: string }>;

  // Additional Options
  total: number;
  decimals: number;
  defaultFrozen: boolean;

  reserveEnabled: boolean;
  managerEnabled: boolean;
  freezeEnabled: boolean;
  clawbackEnabled: boolean;

  reserveAddress: string;
  managerAddress: string;
  freezeAddress: string;
  clawbackAddress: string;
}

export function NFTCreate() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    unitName: "",
    description: "",
    arcStandard: "arc3",
    ipfsProvider: "pinata",
    pinataJWT: "",
    filebaseToken: "",
    properties: {},
    attributes: [{ trait_type: "", value: "" }],
    total: 1,
    decimals: 0,
    defaultFrozen: false,
    reserveEnabled: false,
    managerEnabled: false,
    freezeEnabled: false,
    clawbackEnabled: false,
    reserveAddress: "",
    managerAddress: "",
    freezeAddress: "",
    clawbackAddress: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<{
    transactionId: string;
    assetId: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { activeAddress,transactionSigner } = useWallet();
  const { activeNetwork } = useNetwork();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileSelect(file);
    }
  };

  const addAttribute = () => {
    setFormData((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { trait_type: "", value: "" }],
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
    field: "trait_type" | "value",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) =>
        i === index ? { ...attr, [field]: value } : attr
      ),
    }));
  };

  const createNFT = async () => {
    try {
      setIsCreating(true);
      setResult(null);

      if (!selectedFile) {
        showErrorToast("Please select an image file");
        return;
      }

      if (!activeAddress) {
        showErrorToast("Please connect your wallet");
        return;
      }

      if (!formData.name || !formData.unitName) {
        showErrorToast("Please fill in all required fields");
        return;
      }

      if (formData.ipfsProvider === "pinata" && !formData.pinataJWT) {
        showErrorToast("Please enter your Pinata JWT token");
        return;
      }

      if (formData.ipfsProvider === "filebase" && !formData.filebaseToken) {
        showErrorToast("Please enter your Filebase API token");
        return;
      }

    //   const acc = getLocalAccount();

      // Initialize IPFS
      const ipfsConfig =
        formData.ipfsProvider === "pinata"
          ? { provider: "pinata" as const, jwt: formData.pinataJWT }
          : { provider: "filebase" as const, token: formData.filebaseToken };

      const ipfs = new IPFS(formData.ipfsProvider, ipfsConfig);

    //   const creator = {
    //     address: acc.addr.toString(),
    //     signer: algosdk.makeBasicAccountTransactionSigner(acc),
    //   };

      const creator = {
        address: activeAddress,
        signer: transactionSigner,
      };

      // Prepare metadata
      const properties = {
        description: formData.description,
        ...formData.properties,
        attributes: formData.attributes.filter(
          (attr) => attr.trait_type && attr.value
        ),
      };

      const commonParams = {
        name: formData.name,
        unitName: formData.unitName,
        creator,
        ipfs,
        image: {
          file: selectedFile,
          name: selectedFile.name,
        },
        properties,
        network: activeNetwork as Network,
        total: formData.total,
        decimals: formData.decimals,
        defaultFrozen: formData.defaultFrozen,
        reserveAddress: formData.reserveEnabled
          ? formData.reserveAddress === ""
            ? undefined
            : formData.reserveAddress
          : undefined,
        managerAddress: formData.managerEnabled
          ? formData.managerAddress === ""
            ? undefined
            : formData.managerAddress
          : undefined,
        freezeAddress: formData.freezeEnabled
          ? formData.freezeAddress === ""
            ? undefined
            : formData.freezeAddress
          : undefined,
        clawbackAddress: formData.clawbackEnabled
          ? formData.clawbackAddress === ""
            ? undefined
            : formData.clawbackAddress
          : undefined,
      };

      console.log(commonParams,"commonParams");

      let nftResult;

      switch (formData.arcStandard) {
        case "arc3":
          nftResult = await Arc3.create(commonParams);
          break;
        case "arc19":
          nftResult = await Arc19.create(commonParams);
          break;
        case "arc69":
          nftResult = await Arc69.create(commonParams);
          break;
        default:
          throw new Error(`Unsupported ARC standard: ${formData.arcStandard}`);
      }

      setResult(nftResult);
      showSuccessToast("NFT created successfully");
    } catch (err: any) {
      console.error(err);
      showErrorToast(err.message || "Failed to create NFT");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ARC Standard Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Choose ARC Standard
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              key: "arc3",
              name: "ARC-3",
              desc: "External metadata on IPFS",
            },
            {
              key: "arc19",
              name: "ARC-19",
              desc: "Template-based URIs, updatable",
            },
            {
              key: "arc69",
              name: "ARC-69",
              desc: "Embedded metadata in notes",
            },
          ].map((standard) => (
            <div
              key={standard.key}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  arcStandard: standard.key as ARCStandard,
                }))
              }
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                formData.arcStandard === standard.key
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <h4 className="font-semibold text-gray-900">{standard.name}</h4>
              <p className="text-sm text-gray-600">{standard.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Upload Image
        </h3>
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
              <p className="text-sm text-gray-600">{selectedFile?.name}</p>
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

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            NFT Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="input-field"
            placeholder="My Awesome NFT"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit Name *
          </label>
          <input
            type="text"
            value={formData.unitName}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                unitName: e.target.value,
              }))
            }
            className="input-field"
            placeholder="MYNFT"
          />
        </div>
      </div>

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
          <h3 className="text-lg font-semibold text-gray-900">Attributes</h3>
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
                  updateAttribute(index, "trait_type", e.target.value)
                }
                placeholder="Trait type"
                className="input-field flex-1"
              />
              <input
                type="text"
                value={attr.value}
                onChange={(e) =>
                  updateAttribute(index, "value", e.target.value)
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

      {/* IPFS Configuration */}
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
          {formData.ipfsProvider === "pinata" ? (
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

      {/* Advanced Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Supply
          </label>
          <input
            type="number"
            value={formData.total}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                total: parseInt(e.target.value) || 1,
              }))
            }
            className="input-field"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Decimals
          </label>
          <input
            type="number"
            value={formData.decimals}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                decimals: parseInt(e.target.value) || 0,
              }))
            }
            className="input-field"
            min="0"
            max="19"
          />
        </div>
        <div className="flex items-center pt-8">
          <input
            type="checkbox"
            id="defaultFrozen"
            checked={formData.defaultFrozen}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                defaultFrozen: e.target.checked,
              }))
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="defaultFrozen"
            className="ml-2 block text-sm text-gray-700"
          >
            Default Frozen
          </label>
        </div>
      </div>

      {/* Address Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="reserveEnabled"
              checked={formData.reserveEnabled}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  reserveEnabled: e.target.checked,
                }))
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="reserveEnabled"
              className="block text-sm font-medium text-gray-700"
            >
              Reserve Enabled
            </label>
            {formData.reserveEnabled && activeAddress && (
              <button
                className="btn-outline text-sm ml-2 cursor-pointer p-1 px-2"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    reserveAddress: activeAddress,
                  }));
                }}
              >
                Set Your Address
              </button>
            )}
          </div>
          {formData.reserveEnabled && (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reserve Address
              </label>
              <input
                type="text"
                value={formData.reserveAddress}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    reserveAddress: e.target.value,
                  }))
                }
                className="input-field"
              />
            </>
          )}
        </div>
        {formData.arcStandard === "arc3" && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="managerEnabled"
                checked={formData.managerEnabled}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    managerEnabled: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="managerEnabled"
                className="block text-sm font-medium text-gray-700"
              >
                Manager Enabled
              </label>
              {formData.managerEnabled && activeAddress && (
                <button
                  className="btn-outline text-sm ml-2 cursor-pointer p-1 px-2"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      managerAddress: activeAddress,
                    }));
                  }}
                >
                  Set Your Address
                </button>
              )}
            </div>
            {formData.managerEnabled && (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manager Address
                </label>
                <input
                  type="text"
                  value={formData.managerAddress}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      managerAddress: e.target.value,
                    }))
                  }
                  className="input-field"
                />
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="freezeEnabled"
              checked={formData.freezeEnabled}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  freezeEnabled: e.target.checked,
                }))
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="freezeEnabled"
              className="block text-sm font-medium text-gray-700"
            >
              Freeze Enabled
            </label>
            {formData.freezeEnabled && activeAddress && (
              <button
                className="btn-outline text-sm ml-2 cursor-pointer p-1 px-2"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    freezeAddress: activeAddress,
                  }));
                }}
              >
                Set Your Address
              </button>
            )}
          </div>

          {formData.freezeEnabled && (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Freeze Address
              </label>

              <input
                type="text"
                value={formData.freezeAddress}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    freezeAddress: e.target.value,
                  }))
                }
                className="input-field"
              />
            </>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="clawbackEnabled"
              checked={formData.clawbackEnabled}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  clawbackEnabled: e.target.checked,
                }))
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="clawbackEnabled"
              className="block text-sm font-medium text-gray-700"
            >
              Clawback Enabled
            </label>
            {formData.clawbackEnabled && activeAddress && (
              <button
                className="btn-outline text-sm ml-2 cursor-pointer p-1 px-2"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    clawbackAddress: activeAddress,
                  }));
                }}
              >
                Set Your Address
              </button>
            )}
          </div>
          {formData.clawbackEnabled && (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clawback Address
              </label>
              <input
                type="text"
                value={formData.clawbackAddress}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    clawbackAddress: e.target.value,
                  }))
                }
                className="input-field"
              />
            </>
          )}
        </div>
      </div>

      {/* Create Button */}
      <div className="flex justify-center">
        <button
          onClick={createNFT}
          disabled={
            isCreating || !selectedFile || !formData.name || !formData.unitName
          }
          className="btn-primary px-8 py-3 text-lg flex items-center space-x-2"
        >
          {isCreating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Creating NFT...</span>
            </>
          ) : (
            <>
              <CloudArrowUpIcon className="h-5 w-5" />
              <span>Create NFT</span>
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
            <span className="text-green-700 font-semibold text-lg">
              NFT Created Successfully!
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Asset ID:</span>
              <IdLink id={result.assetId} type="asset" network={activeNetwork as Network} className="ml-2">
                {result.assetId}
              </IdLink>
            </div>
            <div>
              <span className="font-medium text-gray-700">Transaction ID:</span>
              <IdLink id={result.transactionId} type="tx" network={activeNetwork as Network} className="ml-2 break-all">
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
    </div>
  );
}
