import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-gradient">Arcraft</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              A comprehensive JavaScript/TypeScript SDK for working with
              Algorand ARC standards. Create, manage, and explore NFTs with
              ease.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/satishccy/arcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://www.npmjs.com/package/arcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="sr-only">npm</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 7v10h6.5v1.5H12V17h12V7H0zm6.5 9H3V9h3.5v7zm6.5 0H9V9h1.5v5.5H12V9h1.5v7zm6.5-1.5H18v1.5h-1.5V15H15V9h6.5v6.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/create"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Create NFT
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/explorer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Explorer
                </Link>
              </li>
              <li>
                <Link
                  to="/tracker"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/docs"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <a
                  href="https://satishccy.github.io/arcraft/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  API Docs
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/satishccy/arcraft/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Issues
                </a>
              </li>
              <li>
                <a
                  href="https://arc.algorand.foundation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ARC Standards
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm">
              <p>
                Built with ❤️ for the Algorand ecosystem.
                <span className="ml-1">
                  Showcasing the power of ARC standards.
                </span>
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-6 text-sm text-gray-600">
              <span>Supports ARC-3, ARC-19, ARC-69, ARC-82</span>
              <span>•</span>
              <span>Node.js & Browser</span>
              <span>•</span>
              <span>TypeScript</span>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            <p>
              This is a demonstration application showcasing the Arcraft SDK
              capabilities. Not for production use with real assets or mainnet
              transactions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
