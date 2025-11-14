import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { WalletButton } from '@txnlab/use-wallet-ui-react';
import { NetworkId, useNetwork } from '@txnlab/use-wallet-react';
import { Menu, Transition } from '@headlessui/react';
import React from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { activeNetwork, setActiveNetwork } = useNetwork();

  const handleNetworkChange = (network: NetworkId) => {
    setActiveNetwork(network);
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Create NFT', href: '/create' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Docs', href: '/docs' },
  ];

  const toolsNavigation = [
    { name: 'Explorer', href: '/explorer' },
    { name: 'Tracker', href: '/tracker' },
    { name: 'Burn (54)', href: '/burn' },
    { name: 'Inbox (59)', href: '/inbox' },
    { name: 'Supply (62)', href: '/supply' },
  ];

  const isActive = (href: string) => location.pathname === href;
  const isToolsActive = () =>
    toolsNavigation.some((item) => isActive(item.href));

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-gradient">Arcraft</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive(item.href)
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                } px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}
            {/* Tools Dropdown */}
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button
                  className={`${
                    isToolsActive()
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  } px-3 py-2 text-sm font-medium transition-colors duration-200 inline-flex items-center`}
                >
                  Tools
                  <ChevronDownIcon
                    className="w-5 h-5 ml-2 -mr-1 text-gray-400"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>
              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="z-10 absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    {toolsNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <Link
                            to={item.href}
                            className={`${
                              active
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-900'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          >
                            {item.name}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            <div className="flex items-center space-x-2">
              <select
                value={activeNetwork}
                onChange={(e) =>
                  handleNetworkChange(e.target.value as NetworkId)
                }
                className="bg-white border border-gray-300 text-gray-700 py-1 px-2 rounded-md text-sm hover:bg-gray-100"
              >
                <option value={NetworkId.TESTNET}>Testnet</option>
                <option value={NetworkId.MAINNET}>Mainnet</option>
              </select>
            </div>
            <WalletButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {[...navigation, ...toolsNavigation].map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
