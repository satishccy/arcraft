import { useState, useEffect } from 'react';
import {
  InboxIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { Arc59 } from 'arcraft';
import { type Network } from 'arcraft';
import { useNetwork, useWallet } from '@txnlab/use-wallet-react';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import { IdLink } from '../utils/linkUtils';

interface InboxAsset {
  assetId: number;
  amount: number;
}

export function Arc59Inbox() {
  const [receiverAddress, setReceiverAddress] = useState<string>('');
  const [assetId, setAssetId] = useState<string>('');
  const [amount, setAmount] = useState<string>('1000000');
  const [inboxAssets, setInboxAssets] = useState<InboxAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [lastTxId, setLastTxId] = useState<string | null>(null);

  const { activeAddress, transactionSigner } = useWallet();
  const { activeNetwork } = useNetwork();

  const network: Network = activeNetwork === 'mainnet' ? 'mainnet' : 'testnet';

  // Auto-set receiver address to connected wallet
  useEffect(() => {
    if (activeAddress && !receiverAddress) {
      setReceiverAddress(activeAddress);
    }
  }, [activeAddress]);

  const fetchInbox = async (address?: string) => {
    const targetAddress = address || receiverAddress;
    if (!targetAddress) {
      showErrorToast('Please provide a receiver address');
      return;
    }

    try {
      setIsLoading(true);
      const assets = await Arc59.getAssetsInInbox({
        network,
        receiver: targetAddress,
      });
      setInboxAssets(assets);
    } catch (error: any) {
      console.error('Error fetching inbox:', error);
      showErrorToast(error.message || 'Failed to fetch inbox');
      setInboxAssets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAsset = async () => {
    if (!activeAddress || !transactionSigner) {
      showErrorToast('Please connect your wallet');
      return;
    }

    if (!receiverAddress || !assetId || !amount) {
      showErrorToast('Please fill in all fields');
      return;
    }

    const parsedAssetId = parseInt(assetId);
    const parsedAmount = parseInt(amount);

    if (isNaN(parsedAssetId) || isNaN(parsedAmount)) {
      showErrorToast('Invalid asset ID or amount');
      return;
    }

    try {
      setIsSending(true);
      const txId = await Arc59.sendAsset({
        network,
        assetId: parsedAssetId,
        amount: parsedAmount,
        receiver: receiverAddress,
        sender: {
          address: activeAddress,
          signer: transactionSigner,
        },
      });

      setLastTxId(txId);
      showSuccessToast(`Asset sent to inbox successfully!`);

      // Refresh inbox
      await fetchInbox(receiverAddress);
    } catch (error: any) {
      console.error('Error sending asset:', error);
      showErrorToast(error.message || 'Failed to send asset');
    } finally {
      setIsSending(false);
    }
  };

  const handleClaimAsset = async (assetId: number) => {
    if (!activeAddress || !transactionSigner) {
      showErrorToast('Please connect your wallet');
      return;
    }

    try {
      setIsClaiming(true);
      const txId = await Arc59.claimAsset({
        network,
        receiver: {
          address: activeAddress,
          signer: transactionSigner,
        },
        assetId,
      });

      setLastTxId(txId);
      showSuccessToast(`Asset ${assetId} claimed successfully!`);

      // Refresh inbox
      await fetchInbox(activeAddress);
    } catch (error: any) {
      console.error('Error claiming asset:', error);
      showErrorToast(error.message || 'Failed to claim asset');
    } finally {
      setIsClaiming(false);
    }
  };

  const handleRejectAsset = async (assetId: number) => {
    if (!activeAddress || !transactionSigner) {
      showErrorToast('Please connect your wallet');
      return;
    }

    try {
      setIsRejecting(true);
      const txId = await Arc59.rejectAsset({
        network,
        receiver: {
          address: activeAddress,
          signer: transactionSigner,
        },
        assetId,
      });

      setLastTxId(txId);
      showSuccessToast(`Asset ${assetId} rejected successfully!`);

      // Refresh inbox
      await fetchInbox(activeAddress);
    } catch (error: any) {
      console.error('Error rejecting asset:', error);
      showErrorToast(error.message || 'Failed to reject asset');
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
          <InboxIcon className="h-10 w-10 text-purple-600 mr-3" />
          ARC-59: Asset Inbox
        </h1>
        <p className="text-xl text-gray-600">
          Send assets to an inbox without requiring the receiver to opt-in first
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <InboxIcon className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              About ARC-59
            </h3>
            <p className="text-purple-800 mb-2">
              ARC-59 enables sending assets to a receiver without requiring them
              to opt-in first. Assets are held in an "inbox" until the receiver
              claims or rejects them.
            </p>
            <p className="text-xs text-purple-700 mt-4">
              Learn more:{' '}
              <a
                href="https://dev.algorand.co/arc-standards/arc-0059/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-purple-900"
              >
                ARC-59 Specification
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Send to Inbox */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <PaperAirplaneIcon className="h-6 w-6 mr-2 text-purple-600" />
            Send to Inbox
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receiver Address
              </label>
              <input
                type="text"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                placeholder="Enter receiver address"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset ID
              </label>
              <input
                type="text"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                placeholder="Enter asset ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleSendAsset}
              disabled={isSending || !activeAddress}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSending ? (
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
                  Sending...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                  Send to Inbox
                </>
              )}
            </button>

            {!activeAddress && (
              <p className="text-sm text-red-600 text-center">
                Please connect your wallet to send assets
              </p>
            )}
          </div>
        </div>

        {/* Check Inbox */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <InboxIcon className="h-6 w-6 mr-2 text-purple-600" />
            Check Inbox
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address to Check
              </label>
              <input
                type="text"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                placeholder="Enter address"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => fetchInbox()}
              disabled={isLoading}
              className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                'Loading...'
              ) : (
                <>
                  <ArrowPathIcon className="h-5 w-5 mr-2" />
                  Refresh Inbox
                </>
              )}
            </button>

            {activeAddress && (
              <button
                onClick={() => {
                  setReceiverAddress(activeAddress);
                  fetchInbox(activeAddress);
                }}
                className="w-full text-sm text-purple-600 hover:text-purple-800"
              >
                Check My Inbox
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Inbox Assets */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Inbox Assets ({inboxAssets.length})
        </h2>

        {inboxAssets.length === 0 ? (
          <div className="text-center py-12">
            <InboxIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No assets in inbox</p>
            <p className="text-sm text-gray-400 mt-2">
              {receiverAddress
                ? 'The inbox is empty for this address'
                : 'Enter an address to check their inbox'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {inboxAssets.map((asset) => (
              <div
                key={asset.assetId}
                className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      Asset ID:{' '}
                      <IdLink type="asset" id={asset.assetId} network={network}>
                        {asset.assetId}
                      </IdLink>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Amount: <span className="font-mono">{asset.amount}</span>
                    </p>
                  </div>

                  {activeAddress &&
                    receiverAddress.toLowerCase() ===
                      activeAddress.toLowerCase() && (
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleClaimAsset(asset.assetId)}
                          disabled={isClaiming || isRejecting}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
                        >
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Claim
                        </button>
                        <button
                          onClick={() => handleRejectAsset(asset.assetId)}
                          disabled={isClaiming || isRejecting}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
                        >
                          <XCircleIcon className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Result */}
      {lastTxId && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-sm text-green-800 mb-2">
            <strong>✓ Transaction successful!</strong>
          </p>
          <p className="text-xs text-green-700 break-all">
            Transaction ID:{' '}
            <IdLink type="tx" id={lastTxId} network={network}>
              {lastTxId}
            </IdLink>
          </p>
        </div>
      )}

      {/* How It Works */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Send</h3>
            <p className="text-sm text-gray-600">
              Sender transfers assets to the receiver's inbox without requiring
              opt-in
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Review</h3>
            <p className="text-sm text-gray-600">
              Receiver checks their inbox to see pending assets
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Claim or Reject
            </h3>
            <p className="text-sm text-gray-600">
              Receiver can claim assets to their account or reject them back to
              sender
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
