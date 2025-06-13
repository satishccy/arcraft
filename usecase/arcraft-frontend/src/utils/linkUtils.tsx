import React from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

type Network = 'mainnet' | 'testnet' | 'localnet';

// Helper function to generate explorer URLs
export const getExplorerUrl = (network: Network, type: 'asset' | 'tx', id: string | number): string | null => {
  if (network === 'localnet') return null;
  
  const baseUrl = network === 'testnet' 
    ? 'https://lora.algokit.io/testnet' 
    : 'https://lora.algokit.io/mainnet';
    
  return `${baseUrl}/${type}/${id}`;
};

// Helper function to detect if a value is likely an asset ID or transaction ID
export const detectIdType = (key: string, value: any): 'asset' | 'tx' | null => {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  
  const keyLower = key.toLowerCase();
  
  // Asset ID patterns
  if (keyLower.includes('asset') && keyLower.includes('id')) return 'asset';
  if (keyLower === 'asset-id') return 'asset';
  if (keyLower === 'id' && typeof value === 'number' && value > 0) return 'asset';
  
  // Transaction ID patterns (52 character base32 strings)
  if (keyLower.includes('tx') || keyLower.includes('transaction')) {
    if (typeof value === 'string' && value.length === 52) return 'tx';
  }
  if (keyLower.includes('txn') && typeof value === 'string' && value.length === 52) return 'tx';
  if (keyLower === 'txid' && typeof value === 'string' && value.length === 52) return 'tx';
  
  return null;
};

// Component to render a clickable ID link
export const IdLink = ({ id, type, network, children, className = '' }: { 
  id: string | number; 
  type: 'asset' | 'tx'; 
  network: Network; 
  children: React.ReactNode;
  className?: string;
}) => {
  const url = getExplorerUrl(network, type, id);
  
  if (!url) {
    return <span className={`text-gray-700 ${className}`}>{children}</span>;
  }
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-blue-600 hover:text-blue-800 underline decoration-1 underline-offset-2 hover:decoration-2 transition-all duration-200 inline-flex items-center gap-1 ${className}`}
    >
      {children}
      <ArrowTopRightOnSquareIcon className="w-3 h-3 opacity-60" />
    </a>
  );
};

// Custom JSON renderer that makes IDs clickable
export const JsonRenderer = ({ data, network, indent = 0 }: { data: any; network: Network; indent?: number }) => {
  const indentStr = '  '.repeat(indent);
  
  if (data === null) return <span className="text-gray-500">null</span>;
  if (data === undefined) return <span className="text-gray-500">undefined</span>;
  if (typeof data === 'boolean') return <span className="text-blue-600">{String(data)}</span>;
  if (typeof data === 'number') return <span className="text-green-600">{data}</span>;
  if (typeof data === 'string') return <span className="text-red-600">"{data}"</span>;
  
  if (Array.isArray(data)) {
    if (data.length === 0) return <span>[]</span>;
    
    return (
      <span>
        [
        <div style={{ marginLeft: '1rem' }}>
          {data.map((item, index) => (
            <div key={index}>
              {indentStr}  <JsonRenderer data={item} network={network} indent={indent + 1} />
              {index < data.length - 1 && ','}
            </div>
          ))}
        </div>
        {indentStr}]
      </span>
    );
  }
  
  if (typeof data === 'object') {
    const entries = Object.entries(data);
    if (entries.length === 0) return <span>{'{}'}</span>;
    
    return (
      <span>
        {'{'}
        <div style={{ marginLeft: '1rem' }}>
          {entries.map(([key, value], index) => {
            const idType = detectIdType(key, value);
            
            return (
              <div key={key}>
                {indentStr}  <span className="text-purple-600">"{key}"</span>: {
                  idType ? (
                    <IdLink id={value as string | number} type={idType} network={network}>
                      {typeof value === 'string' ? `"${value}"` : String(value)}
                    </IdLink>
                  ) : (
                    <JsonRenderer data={value} network={network} indent={indent + 1} />
                  )
                }
                {index < entries.length - 1 && ','}
              </div>
            );
          })}
        </div>
        {indentStr}{'}'}
      </span>
    );
  }
  
  return <span>{String(data)}</span>;
}; 