import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="CareConnect Ghana - Telemedicine & Online Doctor Consultations | Healthcare Made Simple"
        description="Ghana's leading telemedicine platform. Book video consultations with licensed doctors, get digital prescriptions, and pay with Mobile Money. Available 24/7 across Accra, Kumasi, Takoradi, and all regions. Quality healthcare from GH₵50."
        keywords="telemedicine Ghana, online doctor Ghana, video consultation Accra, virtual healthcare, telehealth Kumasi, medical appointments online, MTN Mobile Money healthcare, Vodafone Cash doctor payment, licensed doctors Ghana, e-prescription, digital health records, remote healthcare, virtual doctor visit, same-day consultation, 24/7 medical advice Ghana"
        ogTitle="CareConnect - Modern Healthcare for Every Ghanaian | Book Doctors Online"
        ogDescription="Connect with 500+ verified doctors across Ghana. Video consultations, digital prescriptions, and secure Mobile Money payments. Join 5,000+ satisfied patients. Consultations from GH₵50."
        ogImage="/telemedicine.jpg"
        canonicalUrl="https://careconnect.com.gh"
      />
      <div>
        <Navbar />
        <main>
          <Hero />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Home;
