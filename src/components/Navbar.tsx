import React, { useState } from 'react';
import { ArrowDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/16/solid';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { userId, isLoggedIn } = useAuth();
  // Navigation Links
  const navLinks = [
    {
      name: 'Account',
      href: '#',
      submenu: [
        { name: 'Help', href: '/help' },
        { name: 'My Profile', href: `/profile/${userId}` },
        { name: 'My Payments', href: `/payments/${userId}` },
        { name: 'My Dashboard', href: `/dashboard/${userId}` },
        { name: 'Find provider', href: `/search` },
        { name: 'My Appointments', href: `/appointments/${userId}` },
        { name: 'Verification Status', href: `/provider/onboarding/${userId}` },
        { name: 'Refer a Patient', href: `/referral/patient/${userId}` },
        { name: 'Refer a Provider', href: `/referral/provider/${userId}` },
        { name: 'Logout', href: '/logout' },
      ],
    },
  ];

  return (
    <nav className="bg-linear-to-l from-blue-700 via-blue-800 to-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and App Name */}
        <a href="/" aria-label="Back to Homepage" className="hover:opacity-95">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">
              <img src="/logo.png" alt="CareConnect logo" className="h-8 w-8" />
            </span>
            <span className="text-xl font-bold tracking-widest">
              CareConnect
            </span>
          </div>
        </a>

        {/* Desktop Menu and Toggle */}
        <div className="hidden md:flex items-center space-x-6">
          {isLoggedIn &&
            navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <a
                  href={link.href}
                  className="text-sm font-medium hover:text-blue-300 transition-colors flex items-center"
                >
                  {link.name}
                  {link.submenu && (
                    <span className="ml-1">
                      <ArrowDownIcon className="h-4 w-4 inline-block" />
                    </span>
                  )}
                </a>

                {/* Desktop Dropdown */}
                {link.submenu && (
                  <div className="absolute left-0 mt-1 w-48 bg-blue-800 border border-blue-600 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    {link.submenu.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm hover:bg-blue-700 first:rounded-t-md last:rounded-b-md transition-colors"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

          {/* Register CTA for unauthenticated users */}
          {!isLoggedIn && (
            <a
              href="/login"
              aria-label="Login or Register for CareConnect"
              data-analytics="navbar-login-register"
              className="bg-white text-blue-700 px-4 py-2 rounded-md font-semibold shadow hover:opacity-95"
            >
              Login
            </a>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-2 bg-blue-800 p-3 rounded-md">
          {isLoggedIn &&
            navLinks.map((link) => (
              <div key={link.name}>
                <button
                  onClick={() =>
                    link.submenu && setIsAccountOpen(!isAccountOpen)
                  }
                  className="w-full text-left px-3 py-2 text-sm font-medium hover:bg-blue-700 rounded-md transition-colors flex items-center justify-between"
                >
                  {link.name}
                  {link.submenu && (
                    <span
                      className={`transition-transform ${isAccountOpen ? 'rotate-180' : ''}`}
                    >
                      <ArrowDownIcon className="h-4 w-4 inline-block" />
                    </span>
                  )}
                </button>

                {/* Mobile Submenu */}
                {link.submenu && isAccountOpen && (
                  <div className="pl-4 space-y-1">
                    {link.submenu.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block px-3 py-2 text-sm hover:bg-blue-700 rounded-md transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

          {/* Register CTA for mobile */}
          {!isLoggedIn && (
            <a
              href="/login"
              aria-label="Login or Register for CareConnect"
              data-analytics="navbar-login-register-mobile"
              className="block bg-white text-blue-700 px-4 py-2 rounded-md font-semibold shadow text-center"
              onClick={() => setIsOpen(false)}
            >
              Login
            </a>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
