import { useState, useEffect } from "react";
import {
  Arc3,
  Arc19,
  Arc69,
  AssetFactory,
  type Network,
} from "arcraft";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { useNetwork, useWallet } from "@txnlab/use-wallet-react";
import { showErrorToast } from "../utils/toast";
import { IdLink } from "../utils/linkUtils";

type ARCStandard = "arc3" | "arc19" | "arc69" | "unknown";

interface NFTItem {
  assetId: number;
  name: string;
  unitName: string;
  creator: string;
  url: string;
  arcStandard: ARCStandard;
  metadata?: any;
  imageUrl?: string;
}

export function NFTGallery() {
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { activeNetwork } = useNetwork();
  const { activeAddress, algodClient } = useWallet();
  const [selectedStandard, setSelectedStandard] = useState<ARCStandard | "all">(
    "all"
  );
  const [assetIdInput, setAssetIdInput] = useState("");
  const [batchAssetIds, setBatchAssetIds] = useState("");

  const loadNFT = async (assetId: number) => {
    try {
      setLoading(true);

      // Use AssetFactory to automatically detect the correct ARC standard
      const asset = await AssetFactory.fromId(
        assetId,
        activeNetwork as Network
      );
      const arcType = await AssetFactory.getArcType(
        assetId,
        activeNetwork as Network
      );

      let nft: NFTItem = {
        assetId,
        name: asset.getName() || "Unknown",
        unitName: asset.getUnitName() || "Unknown",
        creator: asset.getCreator() || "Unknown",
        url: asset.getUrl() || "",
        arcStandard: arcType,
      };

      // Load metadata and image based on the detected ARC standard
      if (asset instanceof Arc3) {
        nft.metadata = asset.getMetadata();
        nft.imageUrl = asset.getImageUrl();
      } else if (asset instanceof Arc19) {
        nft.metadata = asset.getMetadata();
        nft.imageUrl = asset.getImageUrl();
      } else if (asset instanceof Arc69) {
        nft.metadata = asset.getMetadata();
        nft.imageUrl = asset.getImageUrl();
      }

      setNfts((prev) => {
        const exists = prev.find((n) => n.assetId === assetId);
        if (exists) {
          return prev.map((n) => (n.assetId === assetId ? nft : n));
        }
        return [...prev, nft];
      });
    } catch (error: any) {
      console.error("Failed to load NFT:", error);
      showErrorToast(`Failed to load asset ${assetId}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNFT = () => {
    const assetId = parseInt(assetIdInput);
    if (isNaN(assetId) || assetId <= 0) {
      showErrorToast("Please enter a valid asset ID");
      return;
    }

    loadNFT(assetId);
    setAssetIdInput("");
  };

  const handleBatchLoad = async () => {
    const ids = batchAssetIds
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id) && id > 0);

    if (ids.length === 0) {
      showErrorToast("Please enter valid asset IDs separated by commas");
      return;
    }

    setLoading(true);
    for (const id of ids) {
      try {
        await loadNFT(id);
      } catch (error) {
        console.error(`Failed to load asset ${id}:`, error);
      }
    }
    setLoading(false);
    setBatchAssetIds("");
  };

  const filteredNFTs = nfts.filter((nft) => {
    const matchesSearch =
      nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.unitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.assetId.toString().includes(searchTerm);

    const matchesStandard =
      selectedStandard === "all" || nft.arcStandard === selectedStandard;

    return matchesSearch && matchesStandard;
  });

  // Sample NFTs for demonstration
  useEffect(() => {
    const fetchUserNFTs = async () => {
      if (activeAddress && algodClient) {
        const accountInfo = await algodClient
          .accountInformation(activeAddress)
          .do();
        const assets = accountInfo.assets || [];
        for (const asset of assets) {
          try {
            await loadNFT(Number(asset.assetId));
          } catch (error) {
            console.error(`Failed to load asset ${asset.assetId}:`, error);
          }
        }
      }
    };
    fetchUserNFTs();
  }, [activeNetwork, activeAddress, algodClient]);

  console.log(nfts, "nfts");

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">NFT Gallery</h1>
          <p className="text-xl text-gray-600">
            Explore NFTs across different ARC standards
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            {/* Single Asset ID Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Single NFT
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={assetIdInput}
                  onChange={(e) => setAssetIdInput(e.target.value)}
                  placeholder="Enter Asset ID"
                  className="input-field flex-1"
                  onKeyPress={(e) => e.key === "Enter" && handleAddNFT()}
                />
                <button
                  onClick={handleAddNFT}
                  disabled={loading}
                  className="btn-primary px-6"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Batch Asset IDs Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Load NFTs
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={batchAssetIds}
                  onChange={(e) => setBatchAssetIds(e.target.value)}
                  placeholder="Enter Asset IDs (comma-separated)"
                  className="input-field flex-1"
                  onKeyPress={(e) => e.key === "Enter" && handleBatchLoad()}
                />
                <button
                  onClick={handleBatchLoad}
                  disabled={loading}
                  className="btn-secondary px-6"
                >
                  Batch Load
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, unit name, or asset ID..."
                  className="pl-10 input-field"
                />
              </div>
            </div>

            {/* Standard Filter */}
            <div className="sm:w-48">
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedStandard}
                  onChange={(e) =>
                    setSelectedStandard(e.target.value as ARCStandard | "all")
                  }
                  className="pl-10 input-field"
                >
                  <option value="all">All Standards</option>
                  <option value="arc3">ARC-3</option>
                  <option value="arc19">ARC-19</option>
                  <option value="arc69">ARC-69</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-600 font-medium">Loading NFTs...</span>
            </div>
          </div>
        )}

        {/* NFT Grid */}
        {filteredNFTs.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No NFTs found</div>
            <p className="text-gray-600">
              Add some NFTs by entering their Asset IDs above, or create new
              ones in the Creator.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNFTs.map((nft) => (
              <NFTCard key={nft.assetId} nft={nft} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface NFTCardProps {
  nft: NFTItem;
}

function NFTCard({ nft }: NFTCardProps) {
  const { activeNetwork } = useNetwork();
  const getStandardColor = (standard: ARCStandard) => {
    switch (standard) {
      case "arc3":
        return "bg-pink-100 text-pink-800";
      case "arc19":
        return "bg-blue-100 text-blue-800";
      case "arc69":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStandardName = (standard: ARCStandard) => {
    switch (standard) {
      case "arc3":
        return "ARC-3";
      case "arc19":
        return "ARC-19";
      case "arc69":
        return "ARC-69";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="card-hover">
      {/* Image */}
      <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
        {nft.imageUrl ? (
          <img
            src={nft.imageUrl}
            alt={nft.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {/* NFT Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 truncate">{nft.name}</h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getStandardColor(
              nft.arcStandard
            )}`}
          >
            {getStandardName(nft.arcStandard)}
          </span>
        </div>

        <p className="text-sm text-gray-600">Unit: {nft.unitName}</p>
        <p className="text-sm text-gray-600">
          ID: <IdLink id={nft.assetId} type="asset" network={activeNetwork as Network}>
            {nft.assetId}
          </IdLink>
        </p>

        {nft.metadata?.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {nft.metadata.description}
          </p>
        )}

        {/* Attributes */}
        {nft.metadata?.attributes && nft.metadata.attributes.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {nft.metadata.attributes
                .slice(0, 3)
                .map((attr: any, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                  >
                    {attr.trait_type}: {attr.value}
                  </span>
                ))}
              {nft.metadata.attributes.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                  +{nft.metadata.attributes.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
