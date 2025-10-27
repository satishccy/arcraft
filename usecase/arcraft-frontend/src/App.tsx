import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { NFTCreator } from './components/NFTCreator';
import { NFTGallery } from './components/NFTGallery';
import { AssetExplorer } from './components/AssetExplorer';
import { MetadataTracker } from './components/MetadataTracker';
import { Documentation } from './components/Documentation';
import { Footer } from './components/Footer';
import {
  WalletProvider,
  WalletManager,
  WalletId,
  NetworkId,
} from '@txnlab/use-wallet-react';
import { WalletUIProvider } from '@txnlab/use-wallet-ui-react';
import { ToastContainer } from 'react-toastify';

function App() {
  // const manager = new WalletManager({
  //   wallets: [{ id: WalletId.MNEMONIC, options: { persistToStorage: true } }],
  //   defaultNetwork: NetworkId.TESTNET,
  // });
  const manager = new WalletManager({
    wallets: [WalletId.PERA, WalletId.LUTE, WalletId.DEFLY],
    defaultNetwork: NetworkId.TESTNET,
  });

  return (
    <WalletProvider manager={manager}>
      <WalletUIProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<NFTCreator />} />
              <Route path="/gallery" element={<NFTGallery />} />
              <Route path="/explorer" element={<AssetExplorer />} />
              <Route path="/tracker" element={<MetadataTracker />} />
              <Route path="/docs" element={<Documentation />} />
            </Routes>
            <Footer />
          </div>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Router>
      </WalletUIProvider>
    </WalletProvider>
  );
}

function HomePage() {
  return (
    <div>
      <Hero />
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Arcraft SDK Showcase
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Explore the full potential of Algorand ARC standards with our
              comprehensive demo
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Multi-ARC Support"
              description="Create NFTs using ARC-3, ARC-19, and ARC-69 standards with a unified interface"
              icon="🎨"
            />
            <FeatureCard
              title="IPFS Integration"
              description="Seamless file uploads to IPFS using Pinata and Filebase providers"
              icon="🗄️"
            />
            <FeatureCard
              title="Blockchain Queries"
              description="Query application and asset data using ARC-82 URI standards"
              icon="🔍"
            />
            <FeatureCard
              title="Metadata Versioning"
              description="Track and manage NFT metadata versions across different standards"
              icon="📝"
            />
            <FeatureCard
              title="Cross-Platform"
              description="Works seamlessly in both Node.js and browser environments"
              icon="🌐"
            />
            <FeatureCard
              title="TypeScript Support"
              description="Full type definitions for better development experience"
              icon="⚡"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="card-hover">
      <div className="text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export default App;
