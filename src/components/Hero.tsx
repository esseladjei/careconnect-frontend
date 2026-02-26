import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DevicePhoneMobileIcon,
  DocumentTextIcon,
  HeartIcon,
  MapPinIcon,
  ShieldCheckIcon,
  StarIcon,
  UserGroupIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

const Hero: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <>
      {/* Main Hero Section */}
      <section
        role="region"
        aria-labelledby="hero-heading"
        className="bg-gradient-to-br from-slate-700 via-blue-700 to-blue-800 text-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Text column */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
                <ShieldCheckIcon className="h-5 w-5 text-green-300" />
                <span className="text-sm font-semibold text-white">
                  Licensed & Verified Healthcare Providers
                </span>
              </div>

              <h1
                id="hero-heading"
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
              >
                Healthcare Made{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                  Simple
                </span>{' '}
                for Every Ghanaian
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed max-w-xl">
                Connect with licensed doctors, get prescriptions, and book
                appointments—all from your phone. Pay securely with MTN or
                Vodafone Mobile Money. Healthcare is now just a click away.
              </p>

              {!isLoggedIn && (
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mb-8">
                  <Link
                    to="/register"
                    role="button"
                    aria-label="Register for CareConnect"
                    data-analytics="hero-register"
                    data-gtm="cta-register"
                    className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                  >
                    Get Started — Free
                    <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/search"
                    aria-label="Find a provider"
                    data-analytics="hero-find"
                    className="inline-flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all duration-300"
                  >
                    <UserGroupIcon className="h-5 w-5" />
                    Find a Doctor
                  </Link>
                </div>
              )}

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-blue-100">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-300" />
                  <span>Available 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <DevicePhoneMobileIcon className="h-5 w-5 text-green-300" />
                  <span>Mobile Money</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-green-300" />
                  <span>Same-Day Appointments</span>
                </div>
              </div>
            </div>

            {/* Image column */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <div className="relative w-full max-w-lg">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur-2xl opacity-30"></div>
                <img
                  src="/telemedicine.jpg"
                  alt="Virtual consultation with licensed Ghanaian doctor"
                  className="relative w-full h-auto rounded-2xl shadow-2xl border-4 border-white/20"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Ghanaians Choose CareConnect
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The most trusted telemedicine platform in Ghana, serving thousands
              of patients and providers nationwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <VideoCameraIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Video Consultations
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Face-to-face consultations with licensed Ghanaian doctors via
                secure video calls. Get professional medical advice from
                anywhere.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-gradient-to-br from-green-50 to-white rounded-2xl border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <DocumentTextIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Digital Prescriptions
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Receive verified e-prescriptions instantly. Share them with any
                pharmacy in Ghana for quick medication pickup.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-gradient-to-br from-purple-50 to-white rounded-2xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CalendarDaysIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Easy Appointment Booking
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Book appointments in seconds. Choose your preferred doctor,
                date, and time—all in one simple platform.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 bg-gradient-to-br from-amber-50 to-white rounded-2xl border-2 border-amber-100 hover:border-amber-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CurrencyDollarIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Mobile Money Payments
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Pay securely with MTN Mobile Money or Vodafone Cash. No bank
                account needed—just your phone.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 bg-gradient-to-br from-rose-50 to-white rounded-2xl border-2 border-rose-100 hover:border-rose-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-rose-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheckIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Verified Providers
              </h3>
              <p className="text-gray-600 leading-relaxed">
                All doctors are licensed and verified by medical councils. Your
                safety and care quality are our top priorities.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 bg-gradient-to-br from-cyan-50 to-white rounded-2xl border-2 border-cyan-100 hover:border-cyan-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ChatBubbleLeftRightIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Follow-Up Care
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get continuous care with easy follow-up appointments. Message
                your doctor and track your health progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="flex items-center justify-center mb-2">
                <UserGroupIcon className="h-8 w-8 text-blue-200" />
              </div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-blue-100 text-sm">Active Patients</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <HeartIcon className="h-8 w-8 text-blue-200" />
              </div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100 text-sm">Licensed Doctors</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <CalendarDaysIcon className="h-8 w-8 text-blue-200" />
              </div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100 text-sm">Consultations</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <StarIcon className="h-8 w-8 text-blue-200" />
              </div>
              <div className="text-4xl font-bold mb-2">4.8/5</div>
              <div className="text-blue-100 text-sm">Patient Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Map Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
              <MapPinIcon className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">
                Nationwide Coverage
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Available Across Ghana
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with healthcare providers in all major cities and regions
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {[
              'Accra',
              'Kumasi',
              'Takoradi',
              'Tamale',
              'Cape Coast',
              'Sunyani',
              'Ho',
              'Koforidua',
              'Wa',
              'Bolgatanga',
            ].map((city) => (
              <div
                key={city}
                className="bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all text-center"
              >
                <MapPinIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <span className="font-semibold text-gray-900">{city}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section
        id="seo-section"
        className="bg-white py-20 border-t border-gray-200"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              Ghana's Leading Telemedicine Platform
            </h2>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p className="text-xl leading-relaxed">
                <strong>CareConnect by KOADEL</strong> is revolutionizing
                healthcare access in Ghana by connecting patients with licensed
                medical professionals through our advanced telemedicine
                platform. Whether you're in Accra, Kumasi, Takoradi, or any
                corner of Ghana, quality healthcare is now at your fingertips.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Comprehensive Telemedicine Services for All Ghanaians
              </h3>
              <p className="leading-relaxed">
                Our platform offers a complete suite of healthcare services
                designed specifically for the Ghanaian healthcare ecosystem.
                From <strong>video consultations with licensed doctors</strong>{' '}
                to <strong>digital prescriptions</strong> and{' '}
                <strong>appointment booking</strong>, we've streamlined the
                entire healthcare journey. Patients can consult with specialists
                in cardiology, pediatrics, general medicine, dermatology, mental
                health, and more—all from the comfort of their homes.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Secure Mobile Money Payments - MTN & Vodafone
              </h3>
              <p className="leading-relaxed">
                Understanding the Ghanaian payment landscape, CareConnect has
                integrated seamless <strong>MTN Mobile Money</strong> and{' '}
                <strong>Vodafone Cash</strong> payment options. Pay for
                consultations, prescriptions, and follow-up appointments
                securely using your mobile wallet—no bank account required. All
                transactions are encrypted and comply with international
                security standards.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Verified Healthcare Professionals You Can Trust
              </h3>
              <p className="leading-relaxed">
                Every doctor on CareConnect is{' '}
                <strong>verified and licensed</strong> by the Ghana Medical and
                Dental Council. We conduct thorough background checks and
                credential verification to ensure you receive care from
                qualified professionals. Our providers include general
                practitioners, specialists, nurses, and allied health
                professionals serving communities across Ghana.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                24/7 Healthcare Access - Anytime, Anywhere
              </h3>
              <p className="leading-relaxed">
                Healthcare emergencies don't follow office hours. That's why
                CareConnect offers{' '}
                <strong>round-the-clock appointment booking</strong>
                and access to on-call doctors. Whether you need urgent medical
                advice at 2 AM or want to schedule a routine check-up for next
                week, our platform is always available. Same-day consultations
                are available for urgent cases.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Digital Health Records & Prescription Management
              </h3>
              <p className="leading-relaxed">
                Keep all your medical records in one secure place. CareConnect
                provides
                <strong>encrypted digital health records</strong>, consultation
                history, and prescription tracking. Share your e-prescriptions
                with any pharmacy in Ghana for medication pickup. Your health
                data is protected with bank-level encryption and GDPR-compliant
                security measures.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Serving Communities Across Ghana
              </h3>
              <p className="leading-relaxed">
                From <strong>Greater Accra to Northern Region</strong>,{' '}
                <strong>Ashanti to Western Region</strong>, CareConnect is
                bridging the healthcare access gap across Ghana. We're
                particularly focused on bringing specialist care to underserved
                areas where physical healthcare facilities are limited. Our
                telemedicine platform enables rural communities to access the
                same quality healthcare available in major cities.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8">
                <p className="text-gray-800 font-semibold mb-2">
                  Join Thousands of Satisfied Patients
                </p>
                <p className="text-gray-700">
                  Over <strong>5,000 active patients</strong> trust CareConnect
                  for their healthcare needs. With{' '}
                  <strong>500+ licensed doctors</strong> and a{' '}
                  <strong>4.8/5 patient satisfaction rating</strong>, we're
                  Ghana's fastest-growing telemedicine platform. Experience
                  modern healthcare that fits your lifestyle and budget.
                </p>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Affordable Healthcare for Every Budget
              </h3>
              <p className="leading-relaxed">
                Quality healthcare shouldn't break the bank. CareConnect offers{' '}
                <strong>transparent pricing</strong> with no hidden fees.
                Consultations start from as low as GH₵50, making professional
                medical advice accessible to all Ghanaians. Pay only for what
                you use—no monthly subscriptions or complicated billing.
              </p>
            </div>

            {/* Keywords Section for SEO */}
            <div className="mt-12 pt-8 border-t-2 border-gray-200">
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong className="text-gray-900">Healthcare Services:</strong>{' '}
                Telemedicine Ghana, Online Doctor Consultation Ghana, Virtual
                Healthcare Accra, Telehealth Kumasi, Medical Appointments
                Online, Video Consultation Doctor, E-Health Ghana, Digital
                Prescriptions, Remote Healthcare, Virtual Doctor Visit, Online
                Medical Consultation, Telemedicine Platform, Healthcare App
                Ghana, Medical Video Call, Online Prescription Ghana, Doctor
                Appointment Booking, MTN Momo Healthcare, Vodafone Cash Medical
                Payment, Licensed Doctors Ghana, Medical Council Verified
                Doctors, Healthcare Accra Kumasi Takoradi, Same-Day Doctor
                Consultation, 24/7 Medical Advice Ghana
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
