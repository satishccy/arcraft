import { useState } from 'react';
import { Arc82 } from 'arcraft';
import {
  MagnifyingGlassIcon,
  CodeBracketIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { JsonRenderer } from '../utils/linkUtils';
import { useNetwork } from '@txnlab/use-wallet-react';

type Network = 'mainnet' | 'testnet' | 'localnet';
type QueryType = 'app' | 'asset';

interface QueryResult {
  type: QueryType;
  id: number;
  data: any;
  success: boolean;
  error?: string;
}

export function AssetExplorer() {
  const [queryType, setQueryType] = useState<QueryType>('app');
  const { activeNetwork } = useNetwork(); 
  const [assetId, setAssetId] = useState('');
  const [appId, setAppId] = useState('');
  const [customUri, setCustomUri] = useState('');
  const [useCustomUri, setUseCustomUri] = useState(false);

  // App query parameters
  const [boxKeys, setBoxKeys] = useState<string[]>(['']);
  const [globalKeys, setGlobalKeys] = useState<string[]>(['']);
  const [localQueries, setLocalQueries] = useState<
    Array<{ key: string; address: string }>
  >([{ key: '', address: '' }]);
  const [includeTealCode, setIncludeTealCode] = useState(false);

  // Asset query parameters
  const [assetParams, setAssetParams] = useState({
    total: false,
    decimals: false,
    frozen: false,
    unitname: false,
    assetname: false,
    url: false,
    metadatahash: false,
    manager: false,
    reserve: false,
    freeze: false,
    clawback: false,
  });

  const [isQuerying, setIsQuerying] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [generatedUri, setGeneratedUri] = useState('');

  const addBoxKey = () => setBoxKeys([...boxKeys, '']);
  const removeBoxKey = (index: number) =>
    setBoxKeys(boxKeys.filter((_, i) => i !== index));
  const updateBoxKey = (index: number, value: string) => {
    const newKeys = [...boxKeys];
    newKeys[index] = value;
    setBoxKeys(newKeys);
  };

  const addGlobalKey = () => setGlobalKeys([...globalKeys, '']);
  const removeGlobalKey = (index: number) =>
    setGlobalKeys(globalKeys.filter((_, i) => i !== index));
  const updateGlobalKey = (index: number, value: string) => {
    const newKeys = [...globalKeys];
    newKeys[index] = value;
    setGlobalKeys(newKeys);
  };

  const addLocalQuery = () =>
    setLocalQueries([...localQueries, { key: '', address: '' }]);
  const removeLocalQuery = (index: number) =>
    setLocalQueries(localQueries.filter((_, i) => i !== index));
  const updateLocalQuery = (
    index: number,
    field: 'key' | 'address',
    value: string
  ) => {
    const newQueries = [...localQueries];
    newQueries[index][field] = value;
    setLocalQueries(newQueries);
  };

  const buildUri = () => {
    try {
      let uri: string;

      if (queryType === 'app') {
        const id = parseInt(appId);
        if (isNaN(id)) throw new Error('Invalid app ID');

        const params: any = {};

        // Add box keys
        const validBoxKeys = boxKeys.filter((key) => key.trim());
        if (validBoxKeys.length > 0) {
          params.box = validBoxKeys.map((key) => Arc82.encodeBase64Url(key));
        }

        // Add global keys
        const validGlobalKeys = globalKeys.filter((key) => key.trim());
        if (validGlobalKeys.length > 0) {
          params.global = validGlobalKeys.map((key) =>
            Arc82.encodeBase64Url(key)
          );
        }

        // Add local queries
        const validLocalQueries = localQueries.filter(
          (q) => q.key.trim() && q.address.trim()
        );
        if (validLocalQueries.length > 0) {
          params.local = validLocalQueries.map((q) => ({
            key: Arc82.encodeBase64Url(q.key),
            algorandaddress: q.address,
          }));
        }

        if (includeTealCode) {
          params.tealcode = true;
        }

        uri = Arc82.buildAppUri(id, params);
      } else {
        const id = parseInt(assetId);
        if (isNaN(id)) throw new Error('Invalid asset ID');

        uri = Arc82.buildAssetUri(id, assetParams);
      }

      setGeneratedUri(uri);
      return uri;
    } catch (error: any) {
      alert(`Failed to build URI: ${error.message}`);
      return '';
    }
  };

  const executeQuery = async () => {
    try {
      setIsQuerying(true);
      setResult(null);

      let uri: string;

      if (useCustomUri) {
        uri = customUri;
        if (!uri.trim()) {
          throw new Error('Please enter a custom URI');
        }
      } else {
        uri = buildUri();
        if (!uri) return;
      }

      // Parse the URI
      const parsed = Arc82.parse(uri);

      let queryResult: any;
      if (parsed.type === 'app') {
        queryResult = await Arc82.queryApplication(parsed, activeNetwork as Network);
        setResult({
          type: 'app',
          id: parsed.id,
          data: queryResult,
          success: queryResult.success,
          error: queryResult.error,
        });
      } else {
        queryResult = await Arc82.queryAsset(parsed, activeNetwork as Network);
        setResult({
          type: 'asset',
          id: parsed.id,
          data: queryResult,
          success: queryResult.success,
          error: queryResult.error,
        });
      }
    } catch (error: any) {
      setResult({
        type: queryType,
        id: 0,
        data: null,
        success: false,
        error: error.message,
      });
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ARC82 URI Explorer
          </h1>
          <p className="text-xl text-gray-600">
            Query blockchain data using ARC-82 URI standards
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Query Type and Network */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Query Type
                </label>
                <select
                  value={queryType}
                  onChange={(e) => setQueryType(e.target.value as QueryType)}
                  className="input-field"
                >
                  <option value="app">Application</option>
                  <option value="asset">Asset</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={useCustomUri}
                    onChange={(e) => setUseCustomUri(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Use Custom URI
                  </span>
                </label>
              </div>
            </div>

            {useCustomUri ? (
              /* Custom URI Input */
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom ARC-82 URI
                </label>
                <input
                  type="text"
                  value={customUri}
                  onChange={(e) => setCustomUri(e.target.value)}
                  placeholder="algorand://app/123456?box=YWNjb3VudA==&global=dG90YWw="
                  className="input-field"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a complete ARC-82 URI to query
                </p>
              </div>
            ) : (
              /* Query Builder */
              <div className="space-y-8">
                {queryType === 'app' ? (
                  /* Application Query Builder */
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Application ID *
                      </label>
                      <input
                        type="number"
                        value={appId}
                        onChange={(e) => setAppId(e.target.value)}
                        placeholder="Enter application ID"
                        className="input-field"
                      />
                    </div>

                    {/* Box Storage Keys */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Box Storage Keys
                        </label>
                        <button
                          type="button"
                          onClick={addBoxKey}
                          className="btn-outline text-sm"
                        >
                          Add Key
                        </button>
                      </div>
                      <div className="space-y-2">
                        {boxKeys.map((key, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={key}
                              onChange={(e) =>
                                updateBoxKey(index, e.target.value)
                              }
                              placeholder="Box key (will be base64url encoded)"
                              className="input-field flex-1"
                            />
                            {boxKeys.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeBoxKey(index)}
                                className="text-red-500 hover:text-red-700 px-2"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Global State Keys */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Global State Keys
                        </label>
                        <button
                          type="button"
                          onClick={addGlobalKey}
                          className="btn-outline text-sm"
                        >
                          Add Key
                        </button>
                      </div>
                      <div className="space-y-2">
                        {globalKeys.map((key, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={key}
                              onChange={(e) =>
                                updateGlobalKey(index, e.target.value)
                              }
                              placeholder="Global state key"
                              className="input-field flex-1"
                            />
                            {globalKeys.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeGlobalKey(index)}
                                className="text-red-500 hover:text-red-700 px-2"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Local State Queries */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Local State Queries
                        </label>
                        <button
                          type="button"
                          onClick={addLocalQuery}
                          className="btn-outline text-sm"
                        >
                          Add Query
                        </button>
                      </div>
                      <div className="space-y-2">
                        {localQueries.map((query, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={query.key}
                              onChange={(e) =>
                                updateLocalQuery(index, 'key', e.target.value)
                              }
                              placeholder="Local state key"
                              className="input-field flex-1"
                            />
                            <input
                              type="text"
                              value={query.address}
                              onChange={(e) =>
                                updateLocalQuery(
                                  index,
                                  'address',
                                  e.target.value
                                )
                              }
                              placeholder="Algorand address"
                              className="input-field flex-1"
                            />
                            {localQueries.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeLocalQuery(index)}
                                className="text-red-500 hover:text-red-700 px-2"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* TEAL Code Option */}
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={includeTealCode}
                          onChange={(e) => setIncludeTealCode(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Include TEAL Code
                        </span>
                      </label>
                    </div>
                  </div>
                ) : (
                  /* Asset Query Builder */
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Asset ID *
                      </label>
                      <input
                        type="number"
                        value={assetId}
                        onChange={(e) => setAssetId(e.target.value)}
                        placeholder="Enter asset ID"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Asset Parameters to Query
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {Object.entries(assetParams).map(([param, checked]) => (
                          <label key={param} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) =>
                                setAssetParams((prev) => ({
                                  ...prev,
                                  [param]: e.target.checked,
                                }))
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700 capitalize">
                              {param}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Generated URI Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Generated URI Preview
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <code className="text-sm text-gray-800 break-all">
                      {generatedUri ||
                        'URI will be generated when you build the query'}
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={buildUri}
                    className="btn-outline text-sm mt-2"
                  >
                    <CodeBracketIcon className="w-4 h-4 mr-1" />
                    Generate URI
                  </button>
                </div>
              </div>
            )}

            {/* Execute Query Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={executeQuery}
                disabled={isQuerying || (!useCustomUri && !generatedUri)}
                className="btn-primary px-8 py-3 text-lg flex items-center space-x-2"
              >
                {isQuerying ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Querying...</span>
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="h-5 w-5" />
                    <span>Execute Query</span>
                  </>
                )}
              </button>
            </div>

            {/* Results */}
            {result && (
              <div className="mt-8">
                <div className="flex items-center space-x-2 mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Query Results
                  </h3>
                </div>

                {result.success ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="mb-4">
                      <span className="text-green-700 font-medium">
                        ✓ Query successful for {result.type} ID: {result.id}
                      </span>
                    </div>
                    <pre className="bg-white border border-green-200 rounded p-4 text-sm overflow-auto max-h-96">
                      <JsonRenderer data={result.data} network={activeNetwork as Network} />
                    </pre>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="mb-2">
                      <span className="text-red-700 font-medium">
                        ✗ Query failed
                      </span>
                    </div>
                    <p className="text-red-600">{result.error}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
