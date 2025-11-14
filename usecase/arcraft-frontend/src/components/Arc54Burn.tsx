import { useState } from 'react';
import { FireIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Arc54 } from 'arcraft';
import { type Network } from 'arcraft';
import { useNetwork, useWallet } from '@txnlab/use-wallet-react';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import { IdLink } from '../utils/linkUtils';

export function Arc54Burn() {
  const [assetId, setAssetId] = useState<string>('');
  const [amount, setAmount] = useState<string>('1');
  const [isBurning, setIsBurning] = useState(false);
  const [burnedAmount, setBurnedAmount] = useState<string | null>(null);
  const [isLoadingBurnedAmount, setIsLoadingBurnedAmount] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);

  const { activeAddress, transactionSigner } = useWallet();
  const { activeNetwork } = useNetwork();

  const network: Network = activeNetwork === 'mainnet' ? 'mainnet' : 'testnet';

  const handleBurnAsset = async () => {
    if (!activeAddress || !transactionSigner) {
      showErrorToast('Please connect your wallet');
      return;
    }

    if (!assetId || !amount) {
      showErrorToast('Please provide asset ID and amount');
      return;
    }

    const parsedAssetId = parseInt(assetId);
    const parsedAmount = parseInt(amount);

    if (isNaN(parsedAssetId) || isNaN(parsedAmount)) {
      showErrorToast('Invalid asset ID or amount');
      return;
    }

    if (parsedAmount <= 0) {
      showErrorToast('Amount must be greater than 0');
      return;
    }

    try {
      setIsBurning(true);
      const result = await Arc54.burnAsset(
        network,
        parsedAssetId,
        parsedAmount,
        {
          address: activeAddress,
          signer: transactionSigner,
        }
      );

      setTxId(result);
      showSuccessToast(
        `Successfully burned ${parsedAmount} units of asset ${parsedAssetId}`
      );

      // Refresh burned amount
      await fetchBurnedAmount();
    } catch (error: any) {
      console.error('Error burning asset:', error);
      showErrorToast(error.message || 'Failed to burn asset');
    } finally {
      setIsBurning(false);
    }
  };

  const fetchBurnedAmount = async () => {
    if (!assetId) return;

    const parsedAssetId = parseInt(assetId);
    if (isNaN(parsedAssetId)) {
      showErrorToast('Invalid asset ID');
      return;
    }

    try {
      setIsLoadingBurnedAmount(true);
      const amount = await Arc54.getBurnedAmount(network, parsedAssetId);
      setBurnedAmount(amount.toString());
    } catch (error: any) {
      console.error('Error fetching burned amount:', error);
      showErrorToast(error.message || 'Failed to fetch burned amount');
      setBurnedAmount(null);
    } finally {
      setIsLoadingBurnedAmount(false);
    }
  };

  const appInfo = Arc54.getAppInfo(network);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
          <FireIcon className="h-10 w-10 text-orange-600 mr-3" />
          ARC-54: Asset Burning
        </h1>
        <p className="text-xl text-gray-600">
          Permanently burn ASAs using the standardized ARC-54 burning
          application
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <InformationCircleIcon className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              About ARC-54
            </h3>
            <p className="text-blue-800 mb-4">
              ARC-54 provides a standardized application for burning Algorand
              Standard Assets. Once an asset is sent to the burn contract, it is
              effectively removed from circulation permanently (unless the asset
              has clawback enabled).
            </p>
            <div className="bg-white rounded-md p-4 border border-blue-200">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Burn Contract ({network}):</strong>
              </p>
              <p className="text-sm font-mono text-gray-900 mb-1">
                App ID:{' '}
                <a
                  href={`https://lora.algokit.io/${network}/application/${appInfo.appId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {appInfo.appId}
                </a>
              </p>
              <p className="text-sm font-mono text-gray-900 break-all">
                Address:{' '}
                <a
                  href={`https://lora.algokit.io/${network}/account/${appInfo.appAddress.toString()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {appInfo.appAddress.toString()}
                </a>
              </p>
            </div>
            <p className="text-xs text-blue-700 mt-4">
              Learn more:{' '}
              <a
                href="https://dev.algorand.co/arc-standards/arc-0054/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-900"
              >
                ARC-54 Specification
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Burn Asset Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Burn Asset</h2>

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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount to Burn
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Note: Consider the asset's decimals when entering the amount
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Warning:</strong> This action is irreversible! Assets
                without clawback enabled will be permanently removed from
                circulation.
              </p>
            </div>

            <button
              onClick={handleBurnAsset}
              disabled={isBurning || !activeAddress}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isBurning ? (
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
                  Burning Asset...
                </>
              ) : (
                <>
                  <FireIcon className="h-5 w-5 mr-2" />
                  Burn Asset
                </>
              )}
            </button>

            {!activeAddress && (
              <p className="text-sm text-red-600 text-center">
                Please connect your wallet to burn assets
              </p>
            )}

            {txId && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-sm text-green-800 mb-2">
                  <strong>✓ Asset burned successfully!</strong>
                </p>
                <p className="text-xs text-green-700 break-all">
                  Transaction ID:{' '}
                  <IdLink type="tx" id={txId} network={network}>
                    {txId}
                  </IdLink>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Check Burned Amount */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Check Burned Amount
          </h2>

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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={fetchBurnedAmount}
              disabled={isLoadingBurnedAmount || !assetId}
              className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingBurnedAmount ? 'Loading...' : 'Get Burned Amount'}
            </button>

            {burnedAmount !== null && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <p className="text-sm text-gray-700 mb-2">
                  Total Burned Amount:
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {burnedAmount}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  This is the total amount of asset {assetId} that has been sent
                  to the ARC-54 burn contract.
                </p>
              </div>
            )}
          </div>

          {/* Example Assets */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Example Assets
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setAssetId('10458941')}
                className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm transition-colors"
              >
                <span className="font-mono text-blue-600">10458941</span>
                <span className="text-gray-600 ml-2">(Testnet)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Opt-In</h3>
            <p className="text-sm text-gray-600">
              The burn contract automatically opts into the asset if needed
              (requires MBR payment)
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Transfer</h3>
            <p className="text-sm text-gray-600">
              Your assets are transferred to the burn contract address
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Burned</h3>
            <p className="text-sm text-gray-600">
              Assets are permanently removed from circulation (unless clawback
              is enabled)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
