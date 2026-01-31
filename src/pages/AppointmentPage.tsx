import React, {useEffect, useState} from 'react';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer';
import axiosClient from "../api/axiosClient.ts";

// --- Mock Data ---
interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  specialisation: string;
  type: 'In-person' | 'Video Call';
  location: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled' | 'Pending';
}


// --- Status Styling Helper ---
const getStatusClasses = (status: Appointment['status']) => {
  switch (status) {
    case 'Confirmed':
    case 'Completed':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'Cancelled':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};


// --- Appointment Card Component ---
const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-600 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 hover:shadow-xl transition-shadow duration-300">
    
    {/* Details (Left Side) */}
    <div className="flex-grow space-y-1">
      <h3 className="text-xl font-bold text-gray-900">{appointment.doctor}</h3>
      <p className="text-blue-600 font-medium">{appointment.specialisation} Appointment</p>
      
      <div className="flex items-center text-gray-600 text-sm pt-1">
        <span className="mr-3">🗓️ {appointment.date} at {appointment.time}</span>
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
            {appointment.type}
        </span>
      </div>
      <p className="text-gray-500 text-sm">
          📍 {appointment.location}
      </p>
    </div>

    {/* Actions & Status (Right Side) */}
    <div className="flex flex-col items-start md:items-end space-y-3 pt-4 md:pt-0">
      
      {/* Status Badge */}
      <span className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full border ${getStatusClasses(appointment.status)}`}>
        {appointment.status}
      </span>

      {/* Action Buttons */}
      {appointment.status === 'Confirmed' && (
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm text-red-700 border border-red-300 rounded-lg hover:bg-red-50">
            Cancel
          </button>
          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Reschedule
          </button>
        </div>
      )}
      
      {appointment.status === 'Completed' && (
        <button className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
          View Summary
        </button>
      )}

    </div>
  </div>
);


// --- Main Component ---
const AppointmentHistoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async ()=>{
      try {
        const response = await axiosClient.get('/appointments/offers/',
            {params: {
                start: '2025-03-18T09:00:00.000Z',
                end: '2026-03-18T09:00:00.000Z',
                durationMinutes: 30,
                slotMinutes: 15,
            }});
        setAppointments(response.data);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      }
    };
    fetchAppointments().catch(error => {
      console.error('Error fetching appointments:', error);
    });
  },[])

  const upcomingAppointments = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending');
  const pastAppointments = appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');
  
  const appointmentsToShow = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> 
      
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Appointments</h1>

        {/* Tab Navigation */}
        <div className="bg-white p-2 rounded-xl shadow-lg mb-8 inline-flex">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'upcoming' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Upcoming ({upcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'past' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Past ({pastAppointments.length})
          </button>
        </div>

        {/* Appointment List */}
        <div className="space-y-6">
          {appointmentsToShow.length > 0 ? (
            appointmentsToShow.map((app) => (
              <AppointmentCard key={app.id} appointment={app} />
            ))
          ) : (
            <div className="p-8 bg-white rounded-xl shadow-lg text-center text-gray-500">
              {activeTab === 'upcoming' 
                ? "You have no upcoming appointments. Time to book one!"
                : "No past records found."}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppointmentHistoryPage;