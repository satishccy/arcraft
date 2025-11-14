import { useEffect, useState } from 'react';
import {
  DocumentTextIcon,
  CodeBracketIcon,
  LinkIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  CogIcon,
  CommandLineIcon,
  DevicePhoneMobileIcon,
  FireIcon,
  InboxIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

type Section =
  | 'overview'
  | 'installation'
  | 'arc3'
  | 'arc19'
  | 'arc54'
  | 'arc59'
  | 'arc62'
  | 'arc69'
  | 'arc82'
  | 'ipfs'
  | 'typescript'
  | 'cross-platform'
  | 'examples'
  | 'api';

export function Documentation() {
  const [activeSection, setActiveSection] = useState<Section>('overview');

  const sections = [
    { id: 'overview', name: 'Overview', icon: BookOpenIcon },
    { id: 'installation', name: 'Installation', icon: CommandLineIcon },
    { id: 'arc3', name: 'ARC-3', icon: DocumentTextIcon },
    { id: 'arc19', name: 'ARC-19', icon: DocumentTextIcon },
    { id: 'arc54', name: 'ARC-54: Burning', icon: FireIcon },
    { id: 'arc59', name: 'ARC-59: Inbox', icon: InboxIcon },
    { id: 'arc62', name: 'ARC-62: Supply', icon: ChartBarIcon },
    { id: 'arc69', name: 'ARC-69', icon: DocumentTextIcon },
    { id: 'arc82', name: 'ARC-82', icon: CodeBracketIcon },
    { id: 'ipfs', name: 'IPFS Integration', icon: LinkIcon },
    { id: 'typescript', name: 'TypeScript', icon: ShieldCheckIcon },
    {
      id: 'cross-platform',
      name: 'Cross-Platform',
      icon: DevicePhoneMobileIcon,
    },
    { id: 'examples', name: 'Examples', icon: CodeBracketIcon },
    { id: 'api', name: 'API Reference', icon: CogIcon },
  ];

  useEffect(() => {
    // scroll to top of the selected section
    const section = document.getElementById('top');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSection]);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'installation':
        return <InstallationSection />;
      case 'arc3':
        return <Arc3Section />;
      case 'arc19':
        return <Arc19Section />;
      case 'arc54':
        return <Arc54Section />;
      case 'arc59':
        return <Arc59Section />;
      case 'arc62':
        return <Arc62Section />;
      case 'arc69':
        return <Arc69Section />;
      case 'arc82':
        return <Arc82Section />;
      case 'ipfs':
        return <IPFSSection />;
      case 'typescript':
        return <TypeScriptSection />;
      case 'cross-platform':
        return <CrossPlatformSection />;
      case 'examples':
        return <ExamplesSection />;
      case 'api':
        return <APISection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Arcraft SDK Documentation
          </h1>
          <p className="text-xl text-gray-600">
            Complete guide to building NFTs and blockchain applications with
            Algorand ARC standards
          </p>
          <div id="top" className="mt-6 flex justify-center space-x-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              v0.0.27
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              TypeScript Ready
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              Cross-Platform
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-8">
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id as Section)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{section.name}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Quick Links */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Quick Links
                </h3>
                <div className="space-y-2">
                  <a
                    href="https://github.com/satishccy/arcraft"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub Repository
                  </a>
                  <a
                    href="https://www.npmjs.com/package/arcraft"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-600 hover:text-red-600"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.377h-3.456L12.04 19.17H5.113z" />
                    </svg>
                    NPM Package
                  </a>
                  <a
                    href="https://satishccy.github.io/arcraft/docs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-600 hover:text-purple-600"
                  >
                    <DocumentTextIcon className="w-4 h-4 mr-2" />
                    TypeDoc Documentation
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        🚀 Arcraft SDK Overview
      </h2>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 mb-8 border border-blue-200">
        <h3 className="text-xl font-semibold text-blue-900 mb-3">
          🎯 What is Arcraft?
        </h3>
        <p className="text-blue-800 leading-relaxed">
          Arcraft is a comprehensive TypeScript/JavaScript SDK that simplifies
          working with Algorand Request for Comments (ARC) standards. It
          provides a unified interface for creating, managing, and querying NFTs
          across multiple ARC standards while handling the complexity of IPFS
          integration, cross-platform compatibility, and blockchain
          interactions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <DocumentTextIcon className="w-6 h-6 mr-2" />
            Multi-ARC Support
          </h3>
          <p className="text-blue-800 mb-3">
            Create and manage NFTs using ARC-3, ARC-19, and ARC-69 standards
            with a unified interface.
          </p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• ARC-3: External metadata storage</li>
            <li>• ARC-19: Template-based updatable NFTs</li>
            <li>• ARC-69: Embedded metadata in transaction notes</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-6 border border-cyan-200">
          <h3 className="text-lg font-semibold text-cyan-900 mb-3 flex items-center">
            <LinkIcon className="w-6 h-6 mr-2" />
            IPFS Integration
          </h3>
          <p className="text-cyan-800 mb-3">
            Seamless file uploads to IPFS using multiple providers with
            automatic fallback.
          </p>
          <ul className="text-sm text-cyan-700 space-y-1">
            <li>• Pinata integration</li>
            <li>• Filebase support</li>
            <li>• Universal interface</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
            <CodeBracketIcon className="w-6 h-6 mr-2" />
            ARC-82 Queries
          </h3>
          <p className="text-green-800 mb-3">
            Query application and asset data using standardized URI schemes.
          </p>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Box storage queries</li>
            <li>• Global state access</li>
            <li>• TEAL code retrieval</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
            <ShieldCheckIcon className="w-6 h-6 mr-2" />
            Enterprise Ready
          </h3>
          <p className="text-purple-800 mb-3">
            Production-ready with comprehensive TypeScript support and error
            handling.
          </p>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Full TypeScript definitions</li>
            <li>• Comprehensive error handling</li>
            <li>• Cross-platform compatibility</li>
          </ul>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-yellow-900 mb-4 flex items-center">
          <CommandLineIcon className="w-6 h-6 mr-2" />
          🔥 Key Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-yellow-800">
          <div>
            <h4 className="font-semibold mb-2">For Developers</h4>
            <ul className="text-sm space-y-1">
              <li>• Reduces development time by 80%</li>
              <li>• Handles complex ARC standard requirements</li>
              <li>• Provides consistent API across standards</li>
              <li>• Built-in error handling and validation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">For Projects</h4>
            <ul className="text-sm space-y-1">
              <li>• Accelerates time-to-market</li>
              <li>• Ensures ARC standard compliance</li>
              <li>• Supports multiple deployment environments</li>
              <li>• Comprehensive documentation and examples</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🎯 Use Cases
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-4 rounded border">
            <h4 className="font-semibold text-gray-900 mb-2">
              NFT Marketplaces
            </h4>
            <p className="text-gray-600">
              Build comprehensive NFT platforms with support for multiple
              standards
            </p>
          </div>
          <div className="bg-white p-4 rounded border">
            <h4 className="font-semibold text-gray-900 mb-2">
              DeFi Applications
            </h4>
            <p className="text-gray-600">
              Create financial applications with asset management capabilities
            </p>
          </div>
          <div className="bg-white p-4 rounded border">
            <h4 className="font-semibold text-gray-900 mb-2">
              Gaming Platforms
            </h4>
            <p className="text-gray-600">
              Develop games with tradeable in-game assets and collectibles
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InstallationSection() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        📦 Installation & Setup
      </h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Quick Installation
        </h3>
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
          <code>npm install arcraft</code>
        </pre>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Package Managers
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">NPM</h4>
          <pre className="bg-gray-900 text-gray-100 rounded text-sm p-2 overflow-x-auto">
            <code>npm install arcraft</code>
          </pre>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Yarn</h4>
          <pre className="bg-gray-900 text-gray-100 rounded text-sm p-2 overflow-x-auto">
            <code>yarn add arcraft</code>
          </pre>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">PNPM</h4>
          <pre className="bg-gray-900 text-gray-100 rounded text-sm p-2 overflow-x-auto">
            <code>pnpm add arcraft</code>
          </pre>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Prerequisites
      </h3>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-yellow-900 mb-3">
              Environment Requirements
            </h4>
            <ul className="text-yellow-800 space-y-2 text-sm">
              <li>
                • <strong>Node.js:</strong> {'>'}= 18.0.0 (for Node.js usage)
              </li>
              <li>
                • <strong>Browser:</strong> Modern browsers with ES6 modules
              </li>
              <li>
                • <strong>TypeScript:</strong> {'>'}= 5.0.0 (optional but
                recommended)
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-900 mb-3">
              Algorand Setup
            </h4>
            <ul className="text-yellow-800 space-y-2 text-sm">
              <li>• Algorand account with funds for asset creation</li>
              <li>• Access to Algod and Indexer services</li>
              <li>• Network connectivity (mainnet/testnet/localnet)</li>
            </ul>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        IPFS Provider Setup
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
          <h4 className="font-semibold text-pink-900 mb-3">Pinata Setup</h4>
          <ol className="text-pink-800 space-y-2 text-sm">
            <li>
              1. Sign up at{' '}
              <a
                href="https://pinata.cloud"
                className="text-pink-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                pinata.cloud
              </a>
            </li>
            <li>2. Generate JWT token from API Keys section</li>
            <li>3. Use JWT token in your configuration</li>
          </ol>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <h4 className="font-semibold text-indigo-900 mb-3">Filebase Setup</h4>
          <ol className="text-indigo-800 space-y-2 text-sm">
            <li>
              1. Sign up at{' '}
              <a
                href="https://filebase.com"
                className="text-indigo-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                filebase.com
              </a>
            </li>
            <li>2. Create API token from Access Keys</li>
            <li>3. Use token in your configuration</li>
          </ol>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Basic Setup Example
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`import { Arc3, IPFS } from 'arcraft';
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk';

// Setup IPFS provider
const ipfs = new IPFS('pinata', {
  provider: 'pinata',
  jwt: process.env.PINATA_JWT_TOKEN,
});

// Create Algorand account
const account = algosdk.mnemonicToSecretKey(process.env.MNEMONIC);

// Ready to create NFTs!
console.log('Setup complete! Ready to create NFTs.');`}</code>
      </pre>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Environment Variables
      </h3>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <p className="text-gray-600 mb-4">
          Create a <code className="bg-gray-200 px-2 py-1 rounded">.env</code>{' '}
          file in your project root:
        </p>
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
          <code>{`# IPFS Provider (choose one)
PINATA_JWT_TOKEN=your_pinata_jwt_token_here
FILEBASE_TOKEN=your_filebase_token_here

# Algorand Account
MNEMONIC=your_algorand_account_mnemonic_here

# Network (optional, defaults to testnet)
NETWORK=testnet`}</code>
        </pre>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-red-900 mb-3">
          ⚠️ Browser Compatibility Issues
        </h3>
        <p className="text-red-800 mb-4">
          When using Arcraft in frontend applications (React, Vue, etc.) with
          bundlers like Vite, you may encounter errors related to Node.js
          globals not being available in the browser.
        </p>
        <div className="bg-red-100 rounded p-3 mb-4">
          <code className="text-red-900 text-sm">
            • "RangeError: Offset is outside the bounds of the DataView"
            <br />
            • "global is not defined"
            <br />• "Buffer is not defined"
          </code>
        </div>

        <h4 className="font-semibold text-red-900 mb-3">
          Solution: Use Node Polyfills for Vite
        </h4>

        <div className="space-y-4">
          <div>
            <p className="text-red-800 font-medium mb-2">
              1. Install the Vite node polyfills plugin:
            </p>
            <pre className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
              <code>npm install vite-plugin-node-polyfills</code>
            </pre>
          </div>

          <div>
            <p className="text-red-800 font-medium mb-2">
              2. Update your `vite.config.ts` to use the plugin and prevent
              dependency issues:
            </p>
            <pre className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
              <code>{`import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  define: {
    'global': 'globalThis',
  },
  resolve: {
    // Deduplicate algosdk to avoid issues with linked packages
    dedupe: ['algosdk'],
  },
  optimizeDeps: {
    esbuildOptions: {
      // Define global for esbuild optimizer
      define: {
        global: 'globalThis',
      },
    },
  },
});`}</code>
            </pre>
          </div>
        </div>

        <div className="mt-4 p-3 bg-red-100 rounded">
          <p className="text-red-800 text-sm">
            <strong>Note:</strong> This configuration is crucial because
            `arcraft` and its dependency `algosdk` use Node.js-specific modules
            (like `Buffer`) that need to be polyfilled in browser environments.
            The `dedupe` option is especially important if you are linking
            `arcraft` locally to prevent multiple, incompatible versions of
            `algosdk` from being bundled.
          </p>
        </div>
      </div>
    </div>
  );
}

function Arc3Section() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">ARC-3 Standard</h2>

      <p className="text-gray-600 mb-6">
        ARC-3 is the traditional NFT standard where metadata is stored
        externally (typically on IPFS) and referenced via URL. This is the most
        widely supported NFT standard on Algorand.
      </p>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Creating an ARC-3 NFT
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`import { Arc3, IPFS } from 'arcraft';

const result = await Arc3.create({
  name: 'My ARC-3 NFT',
  unitName: 'ARC3NFT',
  creator: {
    address: account.addr,
    signer: makeBasicAccountTransactionSigner(account),
  },
  ipfs,
  image: { file: imageFile, name: 'artwork.png' },
  properties: {
    description: 'A beautiful ARC-3 NFT',
    collection: 'My Collection',
    attributes: [
      { trait_type: 'Color', value: 'Blue' },
      { trait_type: 'Rarity', value: 'Rare' }
    ]
  },
  network: 'testnet',
});`}</code>
      </pre>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Loading an Existing ARC-3 NFT
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`// Load by asset ID
const nft = await Arc3.fromId(assetId, 'testnet');

// Check if it's ARC-3 compliant
if (nft.isArc3()) {
  console.log('Metadata:', nft.getMetadata());
  console.log('Image URL:', nft.getImageUrl());
  
  // Get image as base64
  const base64Image = await nft.getImageBase64();
}`}</code>
      </pre>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-blue-900 mb-2">Key Features</h4>
        <ul className="text-blue-800 space-y-1">
          <li>• External metadata storage on IPFS</li>
          <li>• Wide ecosystem support</li>
          <li>• Immutable metadata (unless URL is updatable)</li>
          <li>• Standard JSON metadata format</li>
        </ul>
      </div>
    </div>
  );
}

function Arc19Section() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">ARC-19 Standard</h2>

      <p className="text-gray-600 mb-6">
        ARC-19 is an advanced NFT standard that uses template-based IPFS URIs,
        allowing for more efficient storage and updatable metadata through
        reserve address manipulation.
      </p>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Creating an ARC-19 NFT
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`import { Arc19, IPFS } from 'arcraft';

const result = await Arc19.create({
  name: 'Updatable NFT',
  unitName: 'ARC19NFT',
  creator: {
    address: account.addr,
    signer: makeBasicAccountTransactionSigner(account),
  },
  ipfs,
  image: { file: imageFile, name: 'artwork.jpg' },
  properties: {
    description: 'An NFT with updatable metadata',
    version: '1.0.0'
  },
  network: 'testnet',
});`}</code>
      </pre>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Updating ARC-19 Metadata
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`// Update the NFT metadata
await Arc19.update({
  manager: {
    address: account.addr,
    signer: makeBasicAccountTransactionSigner(account),
  },
  properties: {
    description: 'Updated description',
    version: '2.0.0'
  },
  assetId: result.assetId,
  ipfs,
  network: 'testnet',
});`}</code>
      </pre>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Tracking Metadata Versions
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`// Get all metadata versions
const versions = await Arc19.getMetadataVersions(assetId, 'testnet');

versions.forEach((version, index) => {
  console.log(\`Version \${index + 1}:\`, version);
});`}</code>
      </pre>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-green-900 mb-2">Key Features</h4>
        <ul className="text-green-800 space-y-1">
          <li>• Template-based IPFS URIs</li>
          <li>• Updatable metadata</li>
          <li>• Version tracking</li>
          <li>• Efficient storage through reserve address</li>
        </ul>
      </div>
    </div>
  );
}

function Arc54Section() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        ARC-54: Asset Burning
      </h2>
      <p className="text-gray-600 mb-6">
        ARC-54 provides a standardized smart contract for burning Algorand
        Standard Assets (ASAs). By sending assets to this contract, they are
        permanently removed from circulation, provided the asset does not have a
        clawback address configured.
      </p>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Burning an Asset (Node.js)
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`import { Arc54 } from 'arcraft';
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk';
import { MNEMONIC } from './config';

async function main() {
  const sender = algosdk.mnemonicToSecretKey(MNEMONIC);
  const assetId = 10458941; // Example asset on Testnet

  const assetBurnedPrev = await Arc54.getBurnedAmount('testnet', assetId);
  console.log(\`Prev burned amount of asset \${assetId}: \${assetBurnedPrev}\`);

  const result = await Arc54.burnAsset('testnet', assetId, 1000000, {
    address: sender.addr.toString(),
    signer: makeBasicAccountTransactionSigner(sender),
  });
  console.log(\`Burned asset \${assetId} amount: 1000000 txid: \${result}\`);

  const assetBurnedAfter = await Arc54.getBurnedAmount('testnet', assetId);
  console.log(\`After burned amount of asset \${assetId}: \${assetBurnedAfter}\`);
}

main();`}</code>
      </pre>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-orange-900 mb-2">Key Features</h4>
        <ul className="text-orange-800 space-y-1">
          <li>• Standardized burn address and App ID for discoverability.</li>
          <li>• Facilitates accurate calculation of circulating supply.</li>
          <li>• Simple contract that only accepts assets, cannot send them.</li>
          <li>
            • `burnAsset` handles contract opt-in and MBR funding if necessary.
          </li>
        </ul>
      </div>
    </div>
  );
}

function Arc59Section() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        ARC-59: Asset Inbox
      </h2>
      <p className="text-gray-600 mb-6">
        ARC-59 defines an inbox-based system for sending ASAs, allowing users to
        send assets to a recipient without requiring them to opt-in first. The
        assets are held in a contract-controlled inbox from which the recipient
        can either claim or reject them.
      </p>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Full Workflow Example (Node.js)
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`import { Arc59 } from 'arcraft';
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk';
import { MNEMONIC, MNEMONIC2 } from './config';

async function main() {
  const sender = algosdk.mnemonicToSecretKey(MNEMONIC);
  const receiver = algosdk.mnemonicToSecretKey(MNEMONIC2);
  const claimingAssetId = 10458941;

  // 1. Send an asset to the receiver's inbox
  const result = await Arc59.sendAsset({
    network: 'testnet',
    assetId: claimingAssetId,
    amount: 1000000,
    receiver: receiver.addr.toString(),
    sender: {
      address: sender.addr.toString(),
      signer: makeBasicAccountTransactionSigner(sender),
    },
  });
  console.log(\`Sent asset to receiver's inbox, txid: \${result}\`);

  // 2. Check the assets in the receiver's inbox
  const newAssetInbox = await Arc59.getAssetsInInbox({
    network: 'testnet',
    receiver: receiver.addr.toString(),
  });
  console.log(\`Receiver's inbox contains \${newAssetInbox.length} asset(s)\`);

  // 3. Receiver claims the asset
  const claimResult = await Arc59.claimAsset({
    network: 'testnet',
    receiver: {
      address: receiver.addr.toString(),
      signer: makeBasicAccountTransactionSigner(receiver),
    },
    assetId: claimingAssetId,
  });
  console.log(\`Claimed asset, txid: \${claimResult}\`);
}

main();`}</code>
      </pre>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-purple-900 mb-2">Key Features</h4>
        <ul className="text-purple-800 space-y-1">
          <li>• Send assets without requiring the receiver to opt-in.</li>
          <li>
            • `sendAsset` performs a direct transfer if the receiver is already
            opted-in.
          </li>
          <li>• `getAssetsInInbox` lists all assets pending in an inbox.</li>
          <li>
            • `claimAsset` allows the receiver to accept and receive the asset.
          </li>
          <li>
            • `rejectAsset` allows the receiver to return the asset to its
            creator.
          </li>
        </ul>
      </div>
    </div>
  );
}

function Arc62Section() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        ARC-62: Circulating Supply
      </h2>
      <p className="text-gray-600 mb-6">
        ARC-62 provides a standardized smart contract interface for determining
        an asset's true circulating supply. It offers a reliable, on-chain
        method for dApps and explorers to query this information, accounting for
        burned tokens and reserve holdings.
      </p>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Getting Circulating Supply (Node.js)
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`import { Arc62 } from 'arcraft';

async function main() {
  const testnetArc62AssetId = 733094741;
  const testnetNonArc62AssetId = 10458941; // Does not implement ARC-62

  // --- Check an ARC-62 compatible asset ---
  const isCompatible = await Arc62.isArc62Compatible(testnetArc62AssetId, 'testnet');
  console.log(\`Asset is ARC-62 compatible: \${isCompatible.compatible}\`);

  const circulatingSupply = await Arc62.getCirculatingSupply(testnetArc62AssetId, 'testnet');
  console.log(\`ARC-62 circulating supply: \${circulatingSupply}\`);


  // --- Check a non-ARC-62 asset (fallback calculation) ---
  const isCompatible2 = await Arc62.isArc62Compatible(testnetNonArc62AssetId, 'testnet');
  console.log(\`Asset is ARC-62 compatible: \${isCompatible2.compatible}\`);

  const circulatingSupply2 = await Arc62.getCirculatingSupply(testnetNonArc62AssetId, 'testnet');
  console.log(\`Fallback circulating supply: \${circulatingSupply2}\`);
}

main();`}</code>
      </pre>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-green-900 mb-2">Key Features</h4>
        <ul className="text-green-800 space-y-1">
          <li>
            • `isArc62Compatible` checks if an asset follows the standard.
          </li>
          <li>
            • `getCirculatingSupply` calls the on-chain contract method if
            compatible.
          </li>
          <li>
            • Provides a reliable fallback calculation for non-ARC-62 assets.
          </li>
          <li>
            • The fallback calculation is: `Total - Burned (ARC-54) - Reserve
            Amount`.
          </li>
        </ul>
      </div>
    </div>
  );
}

function Arc69Section() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">ARC-69 Standard</h2>

      <p className="text-gray-600 mb-6">
        ARC-69 stores metadata directly in transaction notes, eliminating the
        need for external storage and making metadata immediately available
        on-chain.
      </p>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Creating an ARC-69 NFT
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`import { Arc69, IPFS } from 'arcraft';

const result = await Arc69.create({
  name: 'Embedded Metadata NFT',
  unitName: 'ARC69NFT',
  creator: {
    address: account.addr,
    signer: makeBasicAccountTransactionSigner(account),
  },
  ipfs,
  image: { file: imageFile, name: 'image.png' },
  properties: {
    standard: 'arc69',
    description: 'NFT with embedded metadata',
    external_url: 'https://example.com',
    attributes: [
      { trait_type: 'Background', value: 'Sunset' },
      { trait_type: 'Character', value: 'Robot' }
    ]
  },
  network: 'testnet',
});`}</code>
      </pre>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Updating ARC-69 Metadata
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`// Update metadata (stored in transaction notes)
await Arc69.update({
  manager: {
    address: account.addr,
    signer: makeBasicAccountTransactionSigner(account),
  },
  properties: {
    standard: 'arc69',
    description: 'Updated embedded metadata',
    version: '2.0.0'
  },
  assetId: result.assetId,
  network: 'testnet',
});`}</code>
      </pre>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Checking ARC-69 Compliance
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`// Check if asset has valid ARC-69 metadata
const hasValidMetadata = await Arc69.hasValidMetadata(assetId, 'testnet');

if (hasValidMetadata) {
  const nft = await Arc69.fromId(assetId, 'testnet');
  console.log('Metadata:', nft.getMetadata());
}`}</code>
      </pre>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-purple-900 mb-2">Key Features</h4>
        <ul className="text-purple-800 space-y-1">
          <li>• Metadata stored in transaction notes</li>
          <li>• No external dependencies</li>
          <li>• Immediate on-chain availability</li>
          <li>• Updatable through new transactions</li>
        </ul>
      </div>
    </div>
  );
}

function Arc82Section() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        ARC-82 URI Standard
      </h2>

      <p className="text-gray-600 mb-6">
        ARC-82 defines a standardized URI scheme for querying application and
        asset data directly from the Algorand blockchain.
      </p>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Parsing ARC-82 URIs
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`import { Arc82 } from 'arcraft';

// Parse an ARC-82 URI
const uri = 'algorand://app/123456?box=YWNjb3VudA==&global=dG90YWw=';
const parsed = Arc82.parse(uri);

console.log('Parsed URI:', parsed);`}</code>
      </pre>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Querying Application Data
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`// Query application data
const appResult = await Arc82.queryApplication(parsed, 'mainnet');

if (appResult.success) {
  console.log('Box storage:', appResult.boxes);
  console.log('Global state:', appResult.global);
  console.log('Local state:', appResult.local);
  console.log('TEAL code:', appResult.tealCode);
}`}</code>
      </pre>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Building URIs Programmatically
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`// Build application URI
const appUri = Arc82.buildAppUri(123456, {
  box: [Arc82.encodeBase64Url('user_balance')],
  global: [Arc82.encodeBase64Url('total_supply')],
  tealcode: true
});

// Build asset URI
const assetUri = Arc82.buildAssetUri(789012, {
  total: true,
  decimals: true,
  url: true
});`}</code>
      </pre>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-orange-900 mb-2">Key Features</h4>
        <ul className="text-orange-800 space-y-1">
          <li>• Standardized blockchain data queries</li>
          <li>• Support for box, global, and local storage</li>
          <li>• TEAL code retrieval</li>
          <li>• Asset parameter queries</li>
        </ul>
      </div>
    </div>
  );
}

function IPFSSection() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        IPFS Integration
      </h2>

      <p className="text-gray-600 mb-6">
        Arcraft supports multiple IPFS providers for decentralized storage,
        including Pinata and Filebase.
      </p>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">Using Pinata</h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`import { IPFS, uploadToPinata } from 'arcraft';

// Using IPFS class
const ipfs = new IPFS('pinata', {
  provider: 'pinata',
  jwt: 'YOUR_PINATA_JWT_TOKEN',
});

// Upload file
const imageCid = await ipfs.upload(file, 'image.png');

// Upload JSON metadata
const metadataCid = await ipfs.uploadJson({
  name: 'My NFT',
  description: 'A beautiful NFT',
  image: \`ipfs://\${imageCid}\`
}, 'metadata.json');

// Direct upload function
const result = await uploadToPinata({
  file: file,
  name: 'image.png',
  token: 'YOUR_PINATA_JWT_TOKEN',
});`}</code>
      </pre>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Using Filebase
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`import { IPFS, uploadToFilebase } from 'arcraft';

// Using IPFS class
const ipfs = new IPFS('filebase', {
  provider: 'filebase',
  token: 'YOUR_FILEBASE_TOKEN',
});

// Upload file
const imageCid = await ipfs.upload(file, 'image.png');

// Direct upload function
const result = await uploadToFilebase({
  file: file,
  name: 'document.pdf',
  token: 'YOUR_FILEBASE_TOKEN',
});`}</code>
      </pre>

      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-cyan-900 mb-2">
          Supported Providers
        </h4>
        <ul className="text-cyan-800 space-y-1">
          <li>
            • <strong>Pinata:</strong> Popular IPFS pinning service
          </li>
          <li>
            • <strong>Filebase:</strong> S3-compatible IPFS storage
          </li>
          <li>• Universal interface for both providers</li>
          <li>• Automatic CID generation and management</li>
        </ul>
      </div>
    </div>
  );
}

function TypeScriptSection() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        🔷 TypeScript Support
      </h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-blue-900 mb-3">
          🎯 Why TypeScript?
        </h3>
        <p className="text-blue-800 leading-relaxed">
          Arcraft is built with TypeScript from the ground up, providing
          comprehensive type safety, better developer experience, and reduced
          runtime errors. Every function, class, and interface is fully typed
          and documented.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
            <ShieldCheckIcon className="w-6 h-6 mr-2" />
            Type Safety
          </h3>
          <ul className="text-green-800 text-sm space-y-2">
            <li>
              • <strong>Compile-time error detection</strong> - Catch errors
              before runtime
            </li>
            <li>
              • <strong>Strict type checking</strong> - Ensures data integrity
              across all operations
            </li>
            <li>
              • <strong>Interface validation</strong> - Validates function
              parameters and return types
            </li>
            <li>
              • <strong>Generic support</strong> - Type-safe operations across
              different asset types
            </li>
          </ul>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
            <CogIcon className="w-6 h-6 mr-2" />
            Developer Experience
          </h3>
          <ul className="text-purple-800 text-sm space-y-2">
            <li>
              • <strong>IntelliSense support</strong> - Auto-completion in VS
              Code and other IDEs
            </li>
            <li>
              • <strong>Parameter hints</strong> - Detailed information about
              function parameters
            </li>
            <li>
              • <strong>Documentation on hover</strong> - TypeDoc comments
              accessible in editor
            </li>
            <li>
              • <strong>Refactoring support</strong> - Safe code refactoring
              with type checking
            </li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Type Definitions
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`// Core interfaces
interface Arc3CreateOptions {
  name: string;
  unitName: string;
  creator: { address: string; signer: TransactionSigner };
  ipfs: IPFS;
  image: { file: string | File; name: string };
  properties: Record<string, any>;
  network: Network;
  defaultFrozen?: boolean;
  manager?: string;
  reserve?: string;
  freeze?: string;
  clawback?: string;
  total?: number;
  decimals?: number;
}

// Network types
type Network = 'mainnet' | 'testnet' | 'localnet';

// IPFS provider types
type PinataConfig = {
  provider: 'pinata';
  jwt: string;
};

type FilebaseConfig = {
  provider: 'filebase';
  token: string;
};`}</code>
      </pre>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Usage with TypeScript
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`import { Arc3, IPFS, Network, PinataConfig } from 'arcraft';
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk';

// Type-safe configuration
const ipfsConfig: PinataConfig = {
  provider: 'pinata',
  jwt: process.env.PINATA_JWT_TOKEN!,
};

const ipfs = new IPFS('pinata', ipfsConfig);
const network: Network = 'testnet';

// Type-safe NFT creation
async function createTypedNFT(imageFile: File): Promise<void> {
  const account = algosdk.mnemonicToSecretKey(process.env.MNEMONIC!);
  
  const result = await Arc3.create({
    name: 'Typed NFT',
    unitName: 'TNFT',
    creator: {
      address: account.addr,
      signer: makeBasicAccountTransactionSigner(account),
    },
    ipfs,
    image: { file: imageFile, name: 'typed-nft.png' },
    properties: {
      description: 'A type-safe NFT creation',
      attributes: [
        { trait_type: 'Framework', value: 'TypeScript' },
        { trait_type: 'Type Safety', value: 'Enabled' }
      ]
    },
    network,
  });
  
  console.log(\`Created NFT with Asset ID: \${result.assetId}\`);
}`}</code>
      </pre>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Error Handling with Types
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`import { Arc82ParseError, Arc82QueryError } from 'arcraft';

try {
  const parsed = Arc82.parse(uri);
  const result = await Arc82.queryApplication(parsed, 'mainnet');
  
  if (result.success) {
    // Type-safe access to results
    result.boxes?.forEach(box => {
      console.log(\`Box \${box.decodedKey}: \${box.decodedValue}\`);
    });
  }
} catch (error) {
  if (error instanceof Arc82ParseError) {
    console.error('URI parsing failed:', error.message);
    console.error('Failed URI:', error.uri);
  } else if (error instanceof Arc82QueryError) {
    console.error('Query failed:', error.message);
    console.error('Query type:', error.queryType);
    console.error('ID:', error.id);
  } else {
    console.error('Unexpected error:', error);
  }
}`}</code>
      </pre>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-3">
          📚 Complete TypeDoc Documentation
        </h3>
        <p className="text-indigo-800 mb-3">
          Every function, class, and interface in Arcraft has comprehensive
          TypeDoc documentation:
        </p>
        <ul className="text-indigo-700 text-sm space-y-1">
          <li>
            • <strong>Function signatures</strong> with parameter and return
            type descriptions
          </li>
          <li>
            • <strong>Usage examples</strong> for complex operations
          </li>
          <li>
            • <strong>Error documentation</strong> with @throws tags
          </li>
          <li>
            • <strong>Cross-references</strong> between related types and
            functions
          </li>
        </ul>
        <div className="mt-4">
          <a
            href="https://satishccy.github.io/arcraft/docs/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-indigo-300 rounded-md text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50"
          >
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            View Full TypeDoc Documentation
          </a>
        </div>
      </div>
    </div>
  );
}

function CrossPlatformSection() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        🌐 Cross-Platform Compatibility
      </h2>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-8 border border-green-200">
        <h3 className="text-xl font-semibold text-green-900 mb-3">
          🚀 Universal SDK
        </h3>
        <p className="text-green-800 leading-relaxed">
          Arcraft is designed to work seamlessly across all JavaScript
          environments. Whether you're building a Node.js backend, a React web
          application, or a React Native mobile app, Arcraft provides the same
          consistent API with automatic platform detection and optimization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <CommandLineIcon className="w-6 h-6 mr-2" />
            Node.js Server
          </h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>
              • <strong>File system access</strong> - Direct file path support
            </li>
            <li>
              • <strong>Environment variables</strong> - Secure configuration
              management
            </li>
            <li>
              • <strong>Async/await</strong> - Modern asynchronous operations
            </li>
            <li>
              • <strong>ES modules</strong> - Full ES6 module support
            </li>
            <li>
              • <strong>Buffer handling</strong> - Native Node.js buffer
              operations
            </li>
          </ul>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
            <DevicePhoneMobileIcon className="w-6 h-6 mr-2" />
            Browser/Web
          </h3>
          <ul className="text-purple-800 text-sm space-y-2">
            <li>
              • <strong>File objects</strong> - HTML5 File API integration
            </li>
            <li>
              • <strong>Drag & drop</strong> - File upload via drag and drop
            </li>
            <li>
              • <strong>Web Crypto API</strong> - Browser-native cryptography
            </li>
            <li>
              • <strong>Fetch API</strong> - Modern HTTP requests
            </li>
            <li>
              • <strong>LocalStorage</strong> - Client-side data persistence
            </li>
          </ul>
        </div>

        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-cyan-900 mb-3 flex items-center">
            <CogIcon className="w-6 h-6 mr-2" />
            React Native
          </h3>
          <ul className="text-cyan-800 text-sm space-y-2">
            <li>
              • <strong>Mobile optimization</strong> - Optimized for mobile
              devices
            </li>
            <li>
              • <strong>Image picker</strong> - Camera and gallery integration
            </li>
            <li>
              • <strong>Async storage</strong> - Persistent mobile storage
            </li>
            <li>
              • <strong>Network detection</strong> - Handle connectivity changes
            </li>
            <li>
              • <strong>Performance</strong> - Lightweight and fast operations
            </li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Platform-Specific Examples
      </h3>

      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">
            Node.js Backend
          </h4>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
            <code>{`// Node.js server example
import { Arc3, IPFS } from 'arcraft';
import path from 'path';
import fs from 'fs';

const ipfs = new IPFS('pinata', {
  provider: 'pinata',
  jwt: process.env.PINATA_JWT_TOKEN,
});

// Upload from file path (Node.js specific)
const imagePath = path.resolve('./assets/nft-image.png');
const result = await Arc3.create({
  name: 'Server NFT',
  unitName: 'SNFT',
  creator,
  ipfs,
  image: { file: imagePath, name: 'server-nft.png' },
  properties: { 
    description: 'Created on Node.js server',
    environment: 'server'
  },
  network: 'testnet',
});`}</code>
          </pre>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">
            React Web Application
          </h4>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
            <code>{`// React web app example
import { Arc3, IPFS } from 'arcraft';
import { useState } from 'react';

function NFTCreator() {
  const [file, setFile] = useState<File | null>(null);
  
  const ipfs = new IPFS('pinata', {
    provider: 'pinata',
    jwt: import.meta.env.VITE_PINATA_JWT_TOKEN,
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const createNFT = async () => {
    if (!file) return;
    
    // Upload from File object (Browser specific)
    const result = await Arc3.create({
      name: 'Web NFT',
      unitName: 'WNFT',
      creator,
      ipfs,
      image: { file, name: file.name },
      properties: { 
        description: 'Created in web browser',
        environment: 'browser'
      },
      network: 'testnet',
    });
    
    console.log('NFT created:', result.assetId);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} accept="image/*" />
      <button onClick={createNFT}>Create NFT</button>
    </div>
  );
}`}</code>
          </pre>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">
            React Native Mobile App
          </h4>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
            <code>{`// React Native mobile app example
import { Arc3, IPFS } from 'arcraft';
import { launchImageLibrary } from 'react-native-image-picker';

const ipfs = new IPFS('filebase', {
  provider: 'filebase',
  token: Config.FILEBASE_TOKEN,
});

const createMobileNFT = async () => {
  // Pick image from gallery
  launchImageLibrary({ mediaType: 'photo' }, async (response) => {
    if (response.assets && response.assets[0]) {
      const asset = response.assets[0];
      
      // Create file-like object for mobile
      const file = {
        uri: asset.uri,
        type: asset.type,
        name: asset.fileName || 'mobile-nft.jpg',
      } as any;

      const result = await Arc3.create({
        name: 'Mobile NFT',
        unitName: 'MNFT',
        creator,
        ipfs,
        image: { file, name: file.name },
        properties: { 
          description: 'Created on mobile device',
          environment: 'mobile'
        },
        network: 'testnet',
      });
      
      Alert.alert('Success', \`NFT Created: \${result.assetId}\`);
    }
  });
};`}</code>
          </pre>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-yellow-900 mb-3">
          🔧 Automatic Platform Detection
        </h3>
        <p className="text-yellow-800 mb-3">
          Arcraft automatically detects the runtime environment and adapts its
          behavior:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-yellow-800 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Runtime Detection</h4>
            <ul className="space-y-1">
              <li>• Detects Node.js vs Browser environment</li>
              <li>• Chooses appropriate crypto implementation</li>
              <li>• Selects optimal file handling method</li>
              <li>• Uses platform-specific networking</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Polyfills & Fallbacks</h4>
            <ul className="space-y-1">
              <li>• Buffer polyfill for browsers</li>
              <li>• Crypto API fallbacks</li>
              <li>• Universal MIME type detection</li>
              <li>• Cross-platform error handling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExamplesSection() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Code Examples</h2>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Batch NFT Creation
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`async function createNFTCollection() {
  const ipfs = new IPFS('pinata', { 
    provider: 'pinata', 
    jwt: 'YOUR_JWT' 
  });
  
  const artworks = [
    { file: './art1.png', name: 'Sunset Dreams' },
    { file: './art2.png', name: 'City Lights' },
    { file: './art3.png', name: 'Ocean Waves' },
  ];

  for (const [index, artwork] of artworks.entries()) {
    const result = await Arc3.create({
      name: artwork.name,
      unitName: \`ART\${index + 1}\`,
      creator,
      ipfs,
      image: { file: artwork.file, name: artwork.name },
      properties: {
        description: \`Artwork #\${index + 1}\`,
        collection: 'Dreams Collection',
        edition: index + 1,
      },
      network: 'testnet',
    });
    
    console.log(\`Created NFT: \${result.assetId}\`);
  }
}`}</code>
      </pre>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Cross-Platform File Upload
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`// Node.js Environment
import { uploadToPinata } from 'arcraft';
import path from 'path';

const nodeUpload = await uploadToPinata({
  file: path.resolve('./assets/image.png'),
  name: 'image.png',
  token: 'YOUR_TOKEN',
});

// Browser Environment
const browserUpload = async (fileInput) => {
  const file = fileInput.files[0];
  const result = await uploadToPinata({
    file: file,
    name: file.name,
    token: 'YOUR_TOKEN',
  });
  return result;
};`}</code>
      </pre>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Complex ARC-82 Queries
      </h3>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6">
        <code>{`async function complexQuery() {
  const appUri = Arc82.buildAppUri(123456789, {
    box: [
      Arc82.encodeBase64Url('user_balance'),
      Arc82.encodeBase64Url('total_supply'),
    ],
    global: [
      Arc82.encodeBase64Url('paused'),
      Arc82.encodeBase64Url('fee_rate'),
    ],
    local: [{
      key: Arc82.encodeBase64Url('user_score'),
      algorandaddress: 'ALGORAND_ADDRESS_HERE',
    }],
    tealcode: true,
  });

  const parsed = Arc82.parse(appUri);
  const result = await Arc82.queryApplication(parsed, 'mainnet');
  
  if (result.success) {
    // Process box storage data
    result.boxes?.forEach(box => {
      console.log(\`Box \${box.decodedKey}: \${box.decodedValue}\`);
    });
    
    // Process global state
    result.global?.forEach(state => {
      console.log(\`Global \${state.decodedKey}: \${state.decodedValue}\`);
    });
    
    // Access TEAL code
    if (result.tealCode) {
      console.log('Approval Program:', result.tealCode.approvalProgram);
      console.log('Clear Program:', result.tealCode.clearProgram);
    }
  }
}`}</code>
      </pre>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <h4 className="font-semibold text-indigo-900 mb-2">More Examples</h4>
        <p className="text-indigo-800">
          Explore the other sections of this showcase app to see these examples
          in action:
        </p>
        <ul className="text-indigo-800 mt-2 space-y-1">
          <li>
            • <strong>Create NFT:</strong> Interactive NFT creation with all ARC
            standards
          </li>
          <li>
            • <strong>Gallery:</strong> Browse and explore existing NFTs
          </li>
          <li>
            • <strong>Explorer:</strong> Query blockchain data with ARC-82
          </li>
          <li>
            • <strong>Tracker:</strong> Track metadata versions for updatable
            NFTs
          </li>
        </ul>
      </div>
    </div>
  );
}

function APISection() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        📚 API Reference
      </h2>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-8 border border-indigo-200">
        <h3 className="text-xl font-semibold text-indigo-900 mb-3">
          🔧 Complete API Documentation
        </h3>
        <p className="text-indigo-800 leading-relaxed">
          Comprehensive API reference for all classes, functions, and interfaces
          in the Arcraft SDK. Every method is fully documented with parameters,
          return types, and usage examples.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Core Classes
          </h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>
              • <code>Arc3</code> - ARC-3 NFT operations
            </li>
            <li>
              • <code>Arc19</code> - ARC-19 updatable NFTs
            </li>
            <li>
              • <code>Arc69</code> - ARC-69 embedded metadata
            </li>
            <li>
              • <code>Arc82</code> - Blockchain queries
            </li>
            <li>
              • <code>IPFS</code> - Decentralized storage
            </li>
            <li>
              • <code>CoreAsset</code> - Base asset functionality
            </li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3">
            Utility Functions
          </h3>
          <ul className="text-green-800 text-sm space-y-1">
            <li>
              • <code>uploadToPinata</code> - Direct Pinata upload
            </li>
            <li>
              • <code>uploadToFilebase</code> - Direct Filebase upload
            </li>
            <li>
              • <code>calculateSHA256</code> - Hash calculation
            </li>
            <li>
              • <code>getAlgodClient</code> - Algorand client
            </li>
            <li>
              • <code>getIndexerClient</code> - Indexer client
            </li>
            <li>
              • <code>lookupFromFile</code> - MIME type detection
            </li>
          </ul>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">
            Type Definitions
          </h3>
          <ul className="text-purple-800 text-sm space-y-1">
            <li>
              • <code>Network</code> - Network types
            </li>
            <li>
              • <code>PinataConfig</code> - Pinata configuration
            </li>
            <li>
              • <code>FilebaseConfig</code> - Filebase configuration
            </li>
            <li>
              • <code>Arc3CreateOptions</code> - Creation options
            </li>
            <li>
              • <code>Arc3Metadata</code> - Metadata structure
            </li>
            <li>
              • <code>ParsedAlgorandUri</code> - Parsed URI data
            </li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        🎨 Arc3 Class
      </h3>
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Static Methods</h4>
        <div className="space-y-4">
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              Arc3.create(options: Arc3CreateOptions)
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Creates a new ARC-3 compliant NFT with external metadata storage.
            </p>
          </div>
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              Arc3.fromId(assetId: number, network: Network)
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Loads an existing ARC-3 NFT by asset ID and validates compliance.
            </p>
          </div>
        </div>

        <h4 className="font-semibold text-gray-900 mb-3 mt-6">
          Instance Methods
        </h4>
        <div className="space-y-4">
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              getMetadata(): Arc3Metadata | null
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Returns the parsed ARC-3 metadata or null if not available.
            </p>
          </div>
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              getImageUrl(): string | null
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Extracts and returns the image URL from metadata.
            </p>
          </div>
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              getImageBase64(): Promise&lt;string | null&gt;
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Downloads and converts the image to base64 format.
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        🔄 Arc19 Class
      </h3>
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Static Methods</h4>
        <div className="space-y-4">
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              Arc19.create(options: Arc19CreateOptions)
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Creates a new ARC-19 NFT with template-based IPFS URIs for
              updatable metadata.
            </p>
          </div>
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              Arc19.update(options: Arc19UpdateOptions)
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Updates the metadata of an existing ARC-19 NFT by changing the
              reserve address.
            </p>
          </div>
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              Arc19.getMetadataVersions(assetId: number, network: Network)
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Retrieves all metadata versions for tracking update history.
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        📝 Arc69 Class
      </h3>
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Static Methods</h4>
        <div className="space-y-4">
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              Arc69.create(options: Arc69CreateOptions)
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Creates an ARC-69 NFT with metadata embedded in transaction notes.
            </p>
          </div>
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              Arc69.update(options: Arc69UpdateOptions)
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Updates ARC-69 metadata by creating a new transaction with updated
              notes.
            </p>
          </div>
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              Arc69.hasValidMetadata(assetId: number, network: Network)
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Checks if an asset has valid ARC-69 metadata in its transaction
              history.
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        🔍 Arc82 Class
      </h3>
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Static Methods</h4>
        <div className="space-y-4">
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              Arc82.parse(uri: string): ParsedAlgorandUri
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Parses an ARC-82 URI into structured query parameters.
            </p>
          </div>
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              Arc82.queryApplication(parsed: ParsedAlgorandUri, network:
              Network)
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Executes blockchain queries for application data including box
              storage and global state.
            </p>
          </div>
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              Arc82.buildAppUri(appId: number, params: AppQueryParams): string
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Constructs ARC-82 compliant URIs for application queries.
            </p>
          </div>
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              Arc82.encodeBase64Url(input: string): string
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Encodes strings to base64url format for URI parameters.
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        🗄️ IPFS Class
      </h3>
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">
          Constructor & Methods
        </h4>
        <div className="space-y-4">
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              new IPFS(provider: string, config: PinataConfig | FilebaseConfig)
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Creates an IPFS instance with the specified provider
              configuration.
            </p>
          </div>
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              upload(file: File | string, name?: string): Promise&lt;string&gt;
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Uploads a file to IPFS and returns the content identifier (CID).
            </p>
          </div>
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              uploadJson(data: object, name?: string): Promise&lt;string&gt;
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Uploads JSON data to IPFS and returns the CID.
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        📋 Usage Examples
      </h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">
            Complete NFT Creation Flow
          </h4>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
            <code>{`import { Arc3, IPFS, Network } from 'arcraft';
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk';

// Setup
const ipfs = new IPFS('pinata', {
  provider: 'pinata',
  jwt: process.env.PINATA_JWT_TOKEN!,
});

const account = algosdk.mnemonicToSecretKey(process.env.MNEMONIC!);
const network: Network = 'testnet';

// Create ARC-3 NFT
const nft = await Arc3.create({
  name: 'My Awesome NFT',
  unitName: 'AWESOME',
  creator: {
    address: account.addr,
    signer: makeBasicAccountTransactionSigner(account),
  },
  ipfs,
  image: { file: imageFile, name: 'awesome-nft.png' },
  properties: {
    description: 'An amazing digital collectible',
    external_url: 'https://mywebsite.com',
    attributes: [
      { trait_type: 'Rarity', value: 'Legendary' },
      { trait_type: 'Edition', value: '1 of 100' }
    ]
  },
  network,
  defaultFrozen: false,
  manager: account.addr,
  total: 1,
});

console.log(\`NFT created with Asset ID: \${nft.assetId}\`);

// Load and verify the NFT
const loadedNft = await Arc3.fromId(nft.assetId, network);
const metadata = loadedNft.getMetadata();
console.log('NFT Metadata:', metadata);`}</code>
          </pre>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">
            Advanced ARC-82 Queries
          </h4>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
            <code>{`import { Arc82 } from 'arcraft';

// Build complex application query URI
const appUri = Arc82.buildAppUri(123456789, {
  box: [
    Arc82.encodeBase64Url('user_balance'),
    Arc82.encodeBase64Url('total_supply'),
  ],
  global: [
    Arc82.encodeBase64Url('paused'),
    Arc82.encodeBase64Url('fee_rate'),
  ],
  local: [{
    key: Arc82.encodeBase64Url('user_score'),
    algorandaddress: 'ALGORAND_ADDRESS_HERE',
  }],
  tealcode: true,
});

// Execute the query
const parsed = Arc82.parse(appUri);
const result = await Arc82.queryApplication(parsed, 'mainnet');

if (result.success) {
  // Process box storage data
  result.boxes?.forEach(box => {
    console.log(\`Box \${box.decodedKey}: \${box.decodedValue}\`);
  });
  
  // Process global state
  result.global?.forEach(state => {
    console.log(\`Global \${state.decodedKey}: \${state.decodedValue}\`);
  });
  
  // Access TEAL code
  if (result.tealCode) {
    console.log('Approval Program:', result.tealCode.approvalProgram);
    console.log('Clear Program:', result.tealCode.clearProgram);
  }
}`}</code>
          </pre>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-emerald-900 mb-3">
          🔗 Additional Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-emerald-800 mb-2">
              Documentation
            </h4>
            <ul className="text-emerald-700 text-sm space-y-1">
              <li>
                •{' '}
                <a
                  href="https://satishccy.github.io/arcraft/docs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Full TypeDoc API Reference
                </a>
              </li>
              <li>
                •{' '}
                <a
                  href="https://github.com/satishccy/arcraft"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                •{' '}
                <a
                  href="https://www.npmjs.com/package/arcraft"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  NPM Package
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-800 mb-2">
              ARC Standards
            </h4>
            <ul className="text-emerald-700 text-sm space-y-1">
              <li>
                •{' '}
                <a
                  href="https://arc.algorand.foundation/ARCs/arc-0003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  ARC-3 Specification
                </a>
              </li>
              <li>
                •{' '}
                <a
                  href="https://arc.algorand.foundation/ARCs/arc-0019"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  ARC-19 Specification
                </a>
              </li>
              <li>
                •{' '}
                <a
                  href="https://arc.algorand.foundation/ARCs/arc-0069"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  ARC-69 Specification
                </a>
              </li>
              <li>
                •{' '}
                <a
                  href="https://arc.algorand.foundation/ARCs/arc-0082"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  ARC-82 Specification
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
