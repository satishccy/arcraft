import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Build on Algorand</span>{' '}
                <span className="block text-gradient xl:inline">
                  with Arcraft
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                A complete SDK for creating, burning, and managing assets with ARC standards. 
                Seamlessly integrate IPFS, query blockchain data, and build faster.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    to="/docs"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-primary hover:opacity-90 md:py-4 md:text-lg md:px-10 transition-opacity duration-200"
                  >
                    Get Started
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a
                    href="https://github.com/satishccy/arcraft"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-full w-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center p-8">
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto transform -rotate-3">
            <div className="bg-white rounded-xl p-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="h-24 bg-gradient-to-br from-pink-400 to-purple-600 rounded-lg mb-2"></div>
              <div className="text-xs font-medium text-gray-900">ARC-3 NFT</div>
              <div className="text-xs text-gray-500">External Metadata</div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-lg transform hover:scale-105 transition-transform duration-300 mt-4">
              <div className="h-24 bg-gradient-to-br from-orange-400 to-red-600 rounded-lg mb-2"></div>
              <div className="text-xs font-medium text-gray-900">ARC-54 Burn</div>
              <div className="text-xs text-gray-500">Asset Burning</div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="h-24 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-lg mb-2"></div>
              <div className="text-xs font-medium text-gray-900">ARC-19 NFT</div>
              <div className="text-xs text-gray-500">Template URIs</div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-lg transform hover:scale-105 transition-transform duration-300 -mt-4">
              <div className="h-24 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-lg mb-2"></div>
              <div className="text-xs font-medium text-gray-900">ARC-59 Inbox</div>
              <div className="text-xs text-gray-500">Asset Inbox</div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg mb-2"></div>
              <div className="text-xs font-medium text-gray-900">ARC-69 NFT</div>
              <div className="text-xs text-gray-500">Embedded Data</div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-lg transform hover:scale-105 transition-transform duration-300 -mt-2">
              <div className="h-24 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg mb-2"></div>
              <div className="text-xs font-medium text-gray-900">ARC-62 Supply</div>
              <div className="text-xs text-gray-500">Circulating Supply</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
