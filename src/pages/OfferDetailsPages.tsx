import React, { useState } from 'react';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 

// --- Mock Data ---
interface DoctorDetails {
  name: string;
  specialisation: string;
  rating: number;
  fee: number;
  bio: string;
  services: string[];
  telemedicineOffer: string;
}

const mockDoctor: DoctorDetails = {
  name: 'Dr. Evelyn Reed',
  specialisation: 'Cardiology (Heart Specialist)',
  rating: 4.8,
  fee: 150.00,
  bio: "Dr. Reed is a board-certified cardiologist with over 15 years of experience specializing in preventative heart care and rhythm disorders. She is dedicated to patient education and personalized treatment plans.",
  services: ['Full Cardiac Check-up', 'Echocardiogram Review', 'Rhythm Disorder Consultation'],
  telemedicineOffer: 'First 15-minute video consultation is discounted by 20% for new patients.',
};

// --- Calendar/Slot Logic (Simplified Placeholder) ---
const mockSlots = ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM'];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];


const DoctorDetailPage: React.FC = () => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  const finalFee = mockDoctor.fee * (selectedSlot ? 1 : 0); // Logic for applying fee when slot is selected

  // --- Sub-Component: Calendar/Booking Widget ---
  const BookingWidget = () => (
    <div className="bg-white p-6 rounded-xl shadow-xl sticky top-4">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
        Book Appointment
      </h3>

      {/* 1. Day Selector (Simplified) */}
      <h4 className="text-md font-semibold text-gray-700 mb-2">Select Date</h4>
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex-shrink-0 ${
              selectedDay === day 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {day} (Dec 12)
          </button>
        ))}
      </div>

      {/* 2. Available Slots */}
      <h4 className="text-md font-semibold text-gray-700 mb-3 mt-4">Available Slots on {selectedDay}</h4>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {mockSlots.map(slot => (
          <button
            key={slot}
            onClick={() => setSelectedSlot(slot)}
            className={`py-2 text-sm font-medium rounded-lg transition-colors border ${
              selectedSlot === slot 
                ? 'bg-green-600 text-white border-green-700' 
                : 'bg-white text-green-700 border-green-300 hover:bg-green-50'
            }`}
          >
            {slot}
          </button>
        ))}
      </div>

      {/* 3. Payment Checkout */}
      {selectedSlot && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Checkout</h4>
          
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Consultation Fee:</span>
            <span className="font-semibold">${mockDoctor.fee.toFixed(2)}</span>
          </div>

          <p className="text-sm text-red-600 mb-3 italic">{mockDoctor.telemedicineOffer}</p>

          <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-2 mt-2">
            <span>Total:</span>
            <span>${finalFee.toFixed(2)}</span>
          </div>
          
          <button
            onClick={() => setIsBookingConfirmed(true)}
            disabled={!selectedSlot}
            className="w-full py-3 mt-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-lg disabled:opacity-50"
          >
            Pay & Confirm Booking
          </button>
        </div>
      )}
    </div>
  );

  if (isBookingConfirmed) {
      return (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
              <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-lg">
                  <h2 className="text-4xl font-bold text-green-600 mb-4">Booking Confirmed! 🎉</h2>
                  <p className="text-xl text-gray-700 mb-6">Your appointment with **{mockDoctor.name}** is scheduled for **{selectedDay}** at **{selectedSlot}**.</p>
                  <p className="text-gray-500">A confirmation email has been sent to your registered address.</p>
                  <button onClick={() => setIsBookingConfirmed(false)} className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      View My Appointments
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> 
      
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Appointment Details
        </h1>

        {/* Two-Column Layout for Desktop, Stacks for Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Doctor Profile Details (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                
              {/* Doctor Header */}
              <div className="flex items-center space-x-6 mb-6 border-b pb-4">
                  <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                    {/* Placeholder for Doctor's Photo */}
                    <span className="text-4xl text-blue-500">👩‍⚕️</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{mockDoctor.name}</h2>
                    <p className="text-xl text-blue-600 font-medium">{mockDoctor.specialisation}</p>
                    <div className="flex items-center text-yellow-500 mt-1">
                        <span className="mr-1">⭐</span> {mockDoctor.rating.toFixed(1)} Rating
                    </div>
                  </div>
              </div>

              {/* Bio and Details */}
              <h3 className="text-xl font-semibold text-gray-800 mb-3">About Dr. Reed</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{mockDoctor.bio}</p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Services & Expertise</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6 pl-4">
                  {mockDoctor.services.map((service, index) => (
                      <li key={index}>{service}</li>
                  ))}
              </ul>
              
              {/* Telemedicine Offer */}
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                  <h4 className="font-semibold text-yellow-700">Special Offer</h4>
                  <p className="text-sm text-yellow-800">{mockDoctor.telemedicineOffer}</p>
              </div>

            </div>
          </div>
          
          {/* Column 2: Booking Widget (1/3 width) */}
          <aside className="lg:col-span-1">
            <BookingWidget />
          </aside>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DoctorDetailPage;