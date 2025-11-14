import { useState } from 'react';
import {
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { Arc62 } from 'arcraft';
import { type Network } from 'arcraft';
import { useNetwork } from '@txnlab/use-wallet-react';
import { showErrorToast } from '../utils/toast';

interface Arc62Result {
  compatible: boolean;
  applicationId: number;
  circulatingSupply?: number;
}

export function Arc62Supply() {
  const [assetId, setAssetId] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<Arc62Result | null>(null);

  const { activeNetwork } = useNetwork();
  const network: Network = activeNetwork === 'mainnet' ? 'mainnet' : 'testnet';

  const handleCheck = async () => {
    if (!assetId) {
      showErrorToast('Please provide an asset ID');
      return;
    }

    const parsedAssetId = parseInt(assetId);
    if (isNaN(parsedAssetId)) {
      showErrorToast('Invalid asset ID');
      return;
    }

    try {
      setIsChecking(true);
      setResult(null);

      // Check if ARC-62 compatible
      const compatibility = await Arc62.isArc62Compatible(
        parsedAssetId,
        network
      );

      // Get circulating supply
      const circulatingSupply = await Arc62.getCirculatingSupply(
        parsedAssetId,
        network
      );

      setResult({
        compatible: compatibility.compatible,
        applicationId: compatibility.applicationId,
        circulatingSupply,
      });
    } catch (error: any) {
      console.error('Error checking ARC-62:', error);
      showErrorToast(error.message || 'Failed to check ARC-62 compatibility');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
          <ChartBarIcon className="h-10 w-10 text-green-600 mr-3" />
          ARC-62: Circulating Supply
        </h1>
        <p className="text-xl text-gray-600">
          Check if an asset implements ARC-62 and get its circulating supply
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <InformationCircleIcon className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              About ARC-62
            </h3>
            <p className="text-green-800 mb-4">
              ARC-62 provides a standardized way to track an asset's circulating
              supply. It defines a smart contract method that returns the actual
              circulating supply, accounting for burned tokens, reserve
              holdings, and other factors.
            </p>
            <div className="bg-white rounded-md p-4 border border-green-200">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Key Features:</strong>
              </p>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Standardized circulating supply calculation</li>
                <li>Accounts for burned tokens (ARC-54)</li>
                <li>Excludes reserve address holdings</li>
                <li>On-chain verification through smart contracts</li>
              </ul>
            </div>
            <p className="text-xs text-green-700 mt-4">
              Learn more:{' '}
              <a
                href="https://dev.algorand.co/arc-standards/arc-0062/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-green-900"
              >
                ARC-62 Specification
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Check Asset Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Check Asset</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset ID
              </label>
              <input
                type="text"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                placeholder="Enter asset ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCheck();
                  }
                }}
              />
            </div>

            <button
              onClick={handleCheck}
              disabled={isChecking || !assetId}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isChecking ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Checking...
                </>
              ) : (
                <>
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Check ARC-62 Status
                </>
              )}
            </button>
          </div>

          {/* Example Assets */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Example Assets
            </h3>
            <div className="space-y-2">
              {network === 'testnet' ? (
                <>
                  <button
                    onClick={() => setAssetId('733094741')}
                    className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm transition-colors"
                  >
                    <span className="font-mono text-green-600">733094741</span>
                    <span className="text-gray-600 ml-2">(Testnet ARC-62)</span>
                  </button>
                  <button
                    onClick={() => setAssetId('10458941')}
                    className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm transition-colors"
                  >
                    <span className="font-mono text-green-600">10458941</span>
                    <span className="text-gray-600 ml-2">
                      (Testnet Non-ARC-62)
                    </span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setAssetId('2934354727')}
                  className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm transition-colors"
                >
                  <span className="font-mono text-green-600">2934354727</span>
                  <span className="text-gray-600 ml-2">(Mainnet ARC-62)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Results</h2>

          {result ? (
            <div className="space-y-6">
              {/* ARC-62 Compatibility */}
              <div
                className={`border rounded-lg p-4 ${
                  result.compatible
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center mb-2">
                  {result.compatible ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
                  ) : (
                    <XCircleIcon className="h-6 w-6 text-gray-400 mr-2" />
                  )}
                  <h3 className="font-semibold text-gray-900">
                    ARC-62 Compatibility
                  </h3>
                </div>
                <p
                  className={`text-sm ${
                    result.compatible ? 'text-green-800' : 'text-gray-600'
                  }`}
                >
                  {result.compatible
                    ? 'This asset implements ARC-62'
                    : 'This asset does not implement ARC-62'}
                </p>
                {result.compatible && result.applicationId > 0 && (
                  <p className="text-xs text-green-700 mt-2">
                    Application ID:{' '}
                    <a
                      href={`https://lora.algokit.io/${network}/application/${result.applicationId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {result.applicationId}
                    </a>
                  </p>
                )}
              </div>

              {/* Circulating Supply */}
              {result.circulatingSupply !== undefined && (
                <div className="border border-green-200 rounded-lg p-4 bg-gradient-to-br from-green-50 to-blue-50">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Circulating Supply
                  </h3>
                  <p className="text-4xl font-bold text-green-600 mb-2">
                    {result.circulatingSupply.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">
                    {result.compatible
                      ? 'Calculated using ARC-62 smart contract'
                      : 'Calculated as: Total Supply - Reserve Holdings - Burned Amount'}
                  </p>
                </div>
              )}

              {/* Additional Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>ℹ️ Note:</strong>
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  {result.compatible
                    ? 'The circulating supply is verified on-chain through the ARC-62 smart contract method.'
                    : 'Since this asset does not implement ARC-62, the circulating supply is calculated by subtracting the reserve holdings and burned amount from the total supply.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <ChartBarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No results yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Enter an asset ID to check its ARC-62 status
              </p>
            </div>
          )}
        </div>
      </div>

      {/* How Circulating Supply is Calculated */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          How Circulating Supply is Calculated
        </h2>
        <div className="space-y-6">
          {/* ARC-62 Assets */}
          <div>
            <h3 className="font-semibold text-green-600 mb-3 flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              For ARC-62 Compatible Assets
            </h3>
            <p className="text-gray-700 mb-2">
              The circulating supply is retrieved directly from the asset's
              ARC-62 smart contract using the{' '}
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                arc62_get_circulating_supply()
              </code>{' '}
              method.
            </p>
            <p className="text-sm text-gray-600">
              This ensures accurate, on-chain verified circulating supply that
              can account for custom logic like staking, vesting, or other token
              mechanics.
            </p>
          </div>

          {/* Non-ARC-62 Assets */}
          <div>
            <h3 className="font-semibold text-gray-600 mb-3 flex items-center">
              <XCircleIcon className="h-5 w-5 mr-2" />
              For Non-ARC-62 Assets
            </h3>
            <p className="text-gray-700 mb-2">
              The circulating supply is calculated using the formula:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 font-mono text-sm">
              Circulating Supply = Total Supply - Reserve Holdings - Burned
              Amount
            </div>
            <p className="text-sm text-gray-600 mt-2">
              This calculation excludes tokens held in the reserve address and
              tokens burned via the ARC-54 burn contract.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
