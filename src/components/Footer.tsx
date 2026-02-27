import React from 'react';
const Footer: React.FC = () => {
  // Define footer navigation links
  const footerLinks = [
    {
      title: 'Support',
      links: [
        {
          name: 'Support',
          title: 'Support center for help and FAQs',
          href: '/help',
        },
        {
          name: 'Cancellation options',
          title: 'Learn about cancellation policies and options',
          href: '/cancellation-options',
        },
        {
          name: 'New features',
          title: 'Learn about cancellation policies and options',
          href: '/New features',
        },
      ],
    },
    {
      title: 'Providers Quick Links',
      links: [
        {
          name: 'Providers In Sunyani',
          title: 'Search for a medical professionals in Sunyani',
          href: '/search?location=Sunyani',
        },
        {
          name: 'Providers In Kumasi',
          title: 'Search for a medical professionals in Kumasi',
          href: '/search?location=Kumasi',
        },
        {
          name: 'Providers In Accra',
          title: 'Search for a medical professionals in Accra',
          href: '/search?location=Accra',
        },
        {
          name: 'Providers In Takoradi',
          title: 'Search for a medical professionals in Takoradi',
          href: '/search?location=Takoradi',
        },
      ],
    },
    {
      title: 'CareConnect',
      links: [
        {
          name: 'About Us',
          title: 'Learn more about CareConnect and our mission',
          href: '/about',
        },
        {
          name: 'Careers',
          title: 'Explore career opportunities at CareConnect',
          href: '/careers',
        },
        {
          name: 'Investors',
          title: 'Information for investors interested in CareConnect',
          href: '/investors',
        },
      ],
    },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200  py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Navigation Grid (Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-gray-200 pb-8">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-600 text-sm hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section: Copyright and Legal Links */}
        <div className="pt-6 flex flex-col md:flex-row md:justify-between md:items-center text-sm text-gray-600">
          {/* Copyright and Basic Info */}
          <div className="order-2 md:order-1 mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} CareConnect, Product of KOADEL
            Connect of KOADEL Group.
            <a
              href="https://www.koadelgroup.com"
              target="_blank"
              className="hover:text-gray-900 transition-colors"
            >
              <img
                src="/connect.png"
                alt="CareConnect Logo"
                className="inline-block h-auto w-30 ml-2"
              />
            </a>
          </div>

          {/* Legal and Language Links */}
          <div className="order-1 md:order-2 flex flex-wrap gap-x-4 gap-y-2">
            <a href="/" className="hover:text-gray-900 transition-colors">
              Privacy
            </a>
            <a href="/" className="hover:text-gray-900 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Sitemap
            </a>
            |{/* Language/Currency Selectors (Placeholders) */}
            <div className="flex items-center space-x-2">
              {/* Social media Placeholder */}
              <a
                href="#"
                className="flex items-center hover:text-gray-900 transition-colors"
              >
                <span className="mr-1">
                  <img
                    src="/social/facebook.png"
                    alt="Facebook"
                    className="h-4 w-4"
                  />
                </span>
                Facebook
              </a>
              <a
                href="#"
                className="flex items-center hover:text-gray-900 transition-colors"
              >
                <span className="mr-1">
                  <img
                    src="/social/instagram.png"
                    alt="Instagram"
                    className="h-4 w-4"
                  />
                </span>
                Instagram
              </a>
              <a
                href="#"
                className="flex items-center hover:text-gray-900 transition-colors"
              >
                <span className="mr-1">
                  <img
                    src="/social/linkedin.png"
                    alt="linkedIn"
                    className="h-4 w-4"
                  />
                </span>
                LinkedIn
              </a>
              |{/* Currency Placeholder */}
              <a href="#" className="hover:text-gray-900 transition-colors">
                ¢ GHS
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
