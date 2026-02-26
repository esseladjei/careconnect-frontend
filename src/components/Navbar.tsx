import React, { useState } from 'react';
import { ArrowDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/16/solid';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { userId, isLoggedIn, role } = useAuth();
  // Navigation Links
  const navLinks = [
    {
      name: 'Create Listing',
      href: `/createlisting/${userId}`,
      title: 'As medical professional - create a listing ',
      roles: ['provider'], // Only visible to providers
    },
    {
      name: 'Find a Provider',
      href: `/search`,
      title: 'Find a Provider - Search for a medical professional',
      roles: ['patient'], // Only visible to patients
    },
    {
      name: 'Account',
      href: '#',
      submenu: [
        {
          name: 'Help',
          href: '/help',
          title: 'Get support on how to use careconnect app',
        },
        {
          name: 'My Profile',
          href: `/profile/${userId}`,
          title: 'Review and updated your profile',
        },
        {
          name: 'My Payments',
          href: `/payments/${userId}`,
          title: 'Get an overview of all your payments',
        },
        {
          name: 'My Dashboard',
          href: `/dashboard/${userId}`,
          title: 'Get a visualisation dashboard of your transaction and usage',
        },
        {
          name: 'My Appointments',
          href: `/appointments/${userId}`,
          title: 'Get an overview of your Appointments',
        },
        {
          name: 'Verification Status',
          href: `/provider/onboarding/${userId}`,
          title: 'Check the verification status progress',
          roles: ['provider'], // Only visible to providers
        },
        {
          name: 'Refer a Patient',
          href: `/referral/patient/${userId}`,
          title: 'Refer a friend to careconnect',
          roles: ['patient'], // Only visible to patients
        },
        {
          name: 'Refer a Provider',
          href: `/referral/provider/${userId}`,
          title: 'Refer a friend to careconnect',
          roles: ['provider'], // Only visible to providers
        },
        { name: 'Logout', href: '/logout' },
      ],
    },
  ];

  // Filter navigation links based on user role
  const filteredNavLinks = navLinks.filter(
    (link) => !link.roles || link.roles.includes(role)
  );

  // Filter submenu items based on user role
  const filteredNavLinksWithSubmenu = filteredNavLinks.map((link) => {
    if (link.submenu) {
      return {
        ...link,
        submenu: link.submenu.filter(
          (item) => !item.roles || item.roles.includes(role)
        ),
      };
    }
    return link;
  });

  return (
    <nav className="sticky top-0 z-50 bg-linear-to-l from-blue-700 via-blue-800 to-gray-900 text-white p-4">
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
            filteredNavLinksWithSubmenu.map((link) => (
              <div key={link.name} className="relative group">
                <a
                  href={link.href}
                  title={link.title}
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
                        title={item.title}
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
            filteredNavLinksWithSubmenu.map((link) => (
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
                        title={item.title}
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
              title="Log In"
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
