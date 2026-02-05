import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <>
      <section
        role="region"
        aria-labelledby="hero-heading"
        className="bg-linear-to-l from-blue-700 via-blue-800 to-gray-900 text-white"
      >
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
          {/* Text column - takes half width on md+ */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1
              id="hero-heading"
              className="text-3xl md:text-4xl font-extrabold mb-3"
            >
              Telemedicine for Ghana — care when you need it
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-6">
              See licensed Ghanaian doctors online, get prescriptions, and pay
              securely with Momo.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3">
              <Link
                to="/register"
                role="button"
                aria-label="Register for CareConnect"
                data-analytics="hero-register"
                data-gtm="cta-register"
                className="inline-flex items-center bg-white text-blue-700 font-semibold px-5 py-3 rounded-lg shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white hero-cta"
              >
                Register — Pay with Momo
              </Link>

              <Link
                to="/search"
                aria-label="Find a provider"
                data-analytics="hero-find"
                className="text-white/90 mt-5  ml-10  md:mt-0 underline hover:text-white"
              >
                Find a doctor
              </Link>
            </div>

            <p className="mt-4 text-sm text-white/80">
              Available across Ghana • Secure Momo payments • Same-day
              e-consultations
            </p>
          </div>

          {/* Image column - fills half the container on md+ */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="w-full h-64 md:h-96">
              <img
                src="/telemedicine.jpg"
                alt="Virtual consultation"
                className="w-full h-full object-cover rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
      <section id="seo-section" className="bg-gray-100 pb-10">
        <div className="container mx-auto px-4 py-12">
          <h1 className="mb-20 text-3xl font-bold text-blue-900 text-center">
            “Careconnect by KOADEL — a Telemedicine Provider Connecting You to
            Quality Virtual Care”
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Quality telemedicine service across all regions of Ghana
          </h2>
          <p className="text-gray-700 text-lg mb-4">
            CareConnect connects you with licensed Ghanaian doctors and
            healthcare providers for quick online consultations, reliable
            prescriptions, and follow-up care — all on your schedule. Pay
            securely using MTN or Vodafone Momo and enjoy same-day
            e-consultations from Accra to Kumasi and beyond.
          </p>
          <p className="text-gray-600">
            Our services include video consultations, digital prescriptions,
            appointment booking, and integrated payments with Momo for a
            seamless, secure experience tailored to Ghanaian patients and
            providers.
          </p>
        </div>
      </section>

      {/* Additional marketing or features sections can be added here */}
    </>
  );
};

export default Hero;
