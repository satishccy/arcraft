import { useState } from 'react';
import { Arc19, Arc69 } from 'arcraft';
import {
  ClockIcon,
  DocumentTextIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useNetwork } from '@txnlab/use-wallet-react';
import { IdLink } from '../utils/linkUtils';

type Network = 'mainnet' | 'testnet' | 'localnet';

interface MetadataVersion {
  version: number;
  timestamp: string;
  metadata: any;
  transactionId?: string;
}

interface TrackerResult {
  assetId: number;
  standard: 'arc19' | 'arc69';
  versions: MetadataVersion[];
  currentMetadata: any;
  success: boolean;
  error?: string;
}

export function MetadataTracker() {
  const [assetId, setAssetId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [result, setResult] = useState<TrackerResult | null>(null);
  const { activeNetwork } = useNetwork();

  const trackMetadata = async () => {
    try {
      setIsTracking(true);
      setResult(null);

      const id = parseInt(assetId);
      if (isNaN(id) || id <= 0) {
        throw new Error('Please enter a valid asset ID');
      }

      // Try ARC-19 first
      let trackerResult: TrackerResult | null = null;

      try {
        const arc19Versions = await Arc19.getMetadataVersions(
          id,
          activeNetwork as Network
        );
        console.log(arc19Versions, 'arc19Versions');
        if (arc19Versions && arc19Versions.length > 0) {
          const arc19Asset = await Arc19.fromId(id, activeNetwork as Network);
          trackerResult = {
            assetId: id,
            standard: 'arc19',
            versions: arc19Versions.map((version: any, index: number) => ({
              version: index + 1,
              timestamp: version.timestamp || new Date().toISOString(),
              metadata: version.metadata || version,
              transactionId: version.txid,
            })),
            currentMetadata: arc19Asset.getMetadata(),
            success: true,
          };
        }
      } catch (e) {
        console.log('Not ARC-19 or failed to fetch ARC-19 versions');
      }

      // If not ARC-19, try ARC-69
      if (!trackerResult) {
        try {
          const arc69Versions = await Arc69.getMetadataVersions(
            id,
            activeNetwork as Network
          );
          console.log(arc69Versions, 'arc69Versions');
          if (arc69Versions && arc69Versions.length > 0) {
            const arc69Asset = await Arc69.fromId(id, activeNetwork as Network);
            trackerResult = {
              assetId: id,
              standard: 'arc69',
              versions: arc69Versions.map((version: any, index: number) => ({
                version: index + 1,
                timestamp: version.timestamp || new Date().toISOString(),
                metadata: version.metadata || version,
                transactionId: version.txid,
              })),
              currentMetadata: arc69Asset.getMetadata(),
              success: true,
            };
          }
        } catch (e) {
          console.log('Not ARC-69 or failed to fetch ARC-69 versions');
        }
      }

      if (!trackerResult) {
        throw new Error(
          'Asset does not appear to be ARC-19 or ARC-69, or has no metadata versions'
        );
      }

      setResult(trackerResult);
    } catch (error: any) {
      setResult({
        assetId: parseInt(assetId) || 0,
        standard: 'arc19',
        versions: [],
        currentMetadata: null,
        success: false,
        error: error.message,
      });
    } finally {
      setIsTracking(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  const getMetadataChanges = (currentVersion: any, previousVersion: any) => {
    if (!previousVersion) return [];

    const changes: string[] = [];
    const current = currentVersion.metadata || currentVersion;
    const previous = previousVersion.metadata || previousVersion;

    // Simple comparison for demonstration
    Object.keys(current || {}).forEach((key) => {
      if (JSON.stringify(current[key]) !== JSON.stringify(previous[key])) {
        changes.push(key);
      }
    });

    return changes;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Metadata Tracker
          </h1>
          <p className="text-xl text-gray-600">
            Track metadata versions for ARC-19 and ARC-69 NFTs
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset ID
              </label>
              <input
                type="number"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                placeholder="Enter asset ID to track"
                className="input-field"
              />
            </div>

            <button
              onClick={trackMetadata}
              disabled={isTracking || !assetId.trim()}
              className="btn-primary px-6 py-2 flex items-center space-x-2"
            >
              {isTracking ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Tracking...</span>
                </>
              ) : (
                <>
                  <ArrowPathIcon className="h-4 w-4" />
                  <span>Track Metadata</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {result.success ? (
              <>
                {/* Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Asset{' '}
                      <IdLink
                        id={result.assetId}
                        type="asset"
                        network={activeNetwork as Network}
                      >
                        {result.assetId}
                      </IdLink>{' '}
                      Metadata History
                    </h2>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        result.standard === 'arc19'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {result.standard.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">
                        Total Versions:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {result.versions.length}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Standard:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {result.standard.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Network:
                      </span>
                      <span className="ml-2 text-gray-900 capitalize">
                        {activeNetwork}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Current Metadata */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Current Metadata
                  </h3>
                  <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm overflow-auto max-h-64">
                    {JSON.stringify(result.currentMetadata, null, 2)}
                  </pre>
                </div>

                {/* Version History */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    Version History
                  </h3>

                  <div className="space-y-6">
                    {result.versions.map((version, index) => {
                      const isLatest = index === result.versions.length - 1;
                      const previousVersion =
                        index > 0 ? result.versions[index - 1] : null;
                      const changes = getMetadataChanges(
                        version,
                        previousVersion
                      );

                      return (
                        <div
                          key={version.version}
                          className={`border rounded-lg p-4 ${
                            isLatest
                              ? 'border-blue-200 bg-blue-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  isLatest
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                Version {version.version}
                                {isLatest && ' (Current)'}
                              </span>
                              <span className="text-sm text-gray-600">
                                {formatTimestamp(version.timestamp)}
                              </span>
                            </div>

                            {changes.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {changes.map((change) => (
                                  <span
                                    key={change}
                                    className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded"
                                  >
                                    {change} changed
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {version.transactionId && (
                            <div className="mb-3 text-sm">
                              <span className="font-medium text-gray-700">
                                Transaction ID:
                              </span>
                              <IdLink
                                id={version.transactionId}
                                type="tx"
                                network={activeNetwork as Network}
                                className="ml-2 font-mono text-xs break-all"
                              >
                                {version.transactionId}
                              </IdLink>
                            </div>
                          )}

                          <details className="group">
                            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                              View Metadata
                              <span className="ml-1 group-open:rotate-90 transition-transform inline-block">
                                ▶
                              </span>
                            </summary>
                            <pre className="mt-3 bg-gray-50 border border-gray-200 rounded p-3 text-xs overflow-auto max-h-48">
                              {JSON.stringify(version.metadata, null, 2)}
                            </pre>
                          </details>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              /* Error State */
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-red-700 font-medium">
                    ✗ Tracking failed
                  </span>
                </div>
                <p className="text-red-600">{result.error}</p>
                <div className="mt-4 text-sm text-red-600">
                  <p>
                    <strong>Possible reasons:</strong>
                  </p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Asset ID does not exist on the selected network</li>
                    <li>Asset is not ARC-19 or ARC-69 compliant</li>
                    <li>Asset has no metadata update history</li>
                    <li>Network connectivity issues</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            About Metadata Tracking
          </h3>
          <div className="text-blue-800 space-y-2 text-sm">
            <p>
              <strong>ARC-19:</strong> Metadata versions are tracked through
              reserve address changes and IPFS content updates.
            </p>
            <p>
              <strong>ARC-69:</strong> Metadata versions are stored in
              transaction notes during asset configuration updates.
            </p>
            <p>
              This tracker demonstrates how the Arcraft SDK can retrieve and
              display the complete metadata evolution of updatable NFTs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
