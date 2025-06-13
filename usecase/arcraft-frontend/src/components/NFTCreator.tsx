import { useState } from "react";
import {
  CloudArrowUpIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { NFTCreate } from "./NFTCreate";
import { NFTUpdate } from "./NFTUpdate";

type Mode = "create" | "update";

export function NFTCreator() {
  const [mode, setMode] = useState<Mode>("create");

  const resetAndSetMode = (newMode: Mode) => {
    setMode(newMode);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {mode === "create" ? "Create Your NFT" : "Update Your NFT"}
          </h1>
          <p className="text-xl text-gray-600">
            {mode === "create" 
              ? "Demonstrate the power of Arcraft SDK across all ARC standards"
              : "Update metadata and images for ARC-19 and ARC-69 NFTs"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Mode Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Choose Action
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => resetAndSetMode("create")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    mode === "create"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <CloudArrowUpIcon className="h-5 w-5" />
                    <h4 className="font-semibold text-gray-900">Create NFT</h4>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Create new ARC-3, ARC-19, or ARC-69 NFTs
                  </p>
                </div>
                <div
                  onClick={() => resetAndSetMode("update")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    mode === "update"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <PencilSquareIcon className="h-5 w-5" />
                    <h4 className="font-semibold text-gray-900">Update NFT</h4>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Update existing ARC-19 or ARC-69 NFTs
                  </p>
                </div>
              </div>
            </div>

            {/* Render the appropriate component based on mode */}
            {mode === "create" ? <NFTCreate /> : <NFTUpdate />}
          </div>
        </div>
      </div>
    </div>
  );
}
