import React, {useEffect, useState} from 'react';
import axiosClient from "../api/axiosClient";
import SearchFilterPanel from '../components/SearchFilterPanel';
import SideBarFilter from '../components/SideBarFilter';
import SearchResultItem from '../components/SearchResultItem'; 
import Navbar from '../components/Navbar'; // Assuming the Navbar from previous steps is used
import Footer from '../components/Footer'; // Assuming the Footer from previous steps is used


// Mock data for search results (unchanged)
/*const mockResults = [
    { id: 1, name: 'Dr. Evelyn Reed', specialisation: 'Cardiology', service:'Treating diseases of the heart, blood vessels, and circulatory system', location: '123 Health St, London', rating: 4.8, imageUrl: '', availableSlots: 5 , price: '150'},
    { id: 2, name: 'Dr. Michael Cho', specialisation: 'Dermatology', service:'Medical practitioner specializing in the diagnosis and treatment of skin disorders.', location: '45 Wellness Ave, London', rating: 4.5, imageUrl: '', availableSlots: 3, price: '200' },
    { id: 3, name: 'Dr. Sarah Jonson', specialisation: 'Pediatrics', service:'Medical practitioner specializing in the diagnosis and treatment of childrent.', location: '78 Childcare Blvd, London', rating: 4.9, imageUrl: '', availableSlots: 8, price: '100' },
    { id: 4, name: 'Dr. Robert Blake', specialisation: 'Neurology', service:'Medical practitioner specializing in the diagnosis and treatment of skin disorders.', location: '99 Brain Rd, London', rating: 4.7, imageUrl: '', availableSlots: 4 , price: '250' },
    { id: 5, name: 'Dr. Michael Blay', specialisation: 'Neurology', service:'Medical practitioner specializing in the diagnosis and treatment of skin disorders.',location: '99 Brain Rd, London', rating: 4.7, imageUrl: '', availableSlots: 4,  price: '300'  },
    { id: 6, name: 'Dr. Charles Taylor', specialisation: 'Neurology', service:'Medical practitioner specializing in the diagnosis and treatment of skin disorders.',location: '99 Brain Rd, London', rating: 4.7, imageUrl: '', availableSlots: 4 ,   price: '350' },
];*/
interface AppointmentOffer {
    provider: {
        _id: string;
        userId: {
            _id: string;
            email: string;
            role: string;
            firstname: string;
            lastname: string;
        };
        gender: string;
        specialization: string;
        bio: string;
        experience: number;
        hourlyRate: number;
        available: boolean;
        location: string;
        languages: string[];
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
    slots: Array<{
        start: string;
        end: string;
        price: number;
    }>;
}
const SearchPage: React.FC = () => {
    const [appointmentOffers, setAppointmentOffers] = useState<AppointmentOffer[]>([]);

    useEffect(() => {
        const fetchAppointments = async ()=>{
            try {
                const response = await axiosClient.get('/appointments/offers/',
                    {params: {
                            start: '2025-03-18T09:00:00.000Z',
                            end: '2025-03-18T20:00:00.000Z',
                            durationMinutes: 30,
                            slotMinutes: 15,
                        }});
                setAppointmentOffers(response.data);
            } catch (error) {
                console.error('Failed to fetch appointments:', error);
            }
        };
        fetchAppointments().catch(error => {
            console.error('Error fetching appointments:', error);
        });
    },[])

    return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> 
      
      <div className="container mx-auto p-4 md:p-8">
        
        {/* Primary Search Bar (Top of page) */}
        <SearchFilterPanel />
        
       
        {/* Main Content: Sidebar + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-20">
          
          {/* Column 1: Filter Sidebar (Hidden on small screens, 1/3 width on large screens) */}
          <aside className="w-200px lg:col-span-1 hidden lg:block">
            <SideBarFilter mockResults={appointmentOffers}/>
          </aside>
          
          {/* Column 2: Search Results (Full width on small, 2/3 width on large) */}
          <div className="lg:col-span-2">
              
            {/* Search Results List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
              {appointmentOffers.map((result) => (
                <SearchResultItem key={result.provider._id} result={result} />
              ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center mt-8 p-4 bg-white rounded-xl shadow-md">
                <span className="text-sm text-gray-500">Pagination Placeholder...</span>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;