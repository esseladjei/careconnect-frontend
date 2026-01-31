import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/RegisterUser';
import Doctors from './pages/Doctors';
//import BookAppointment from './pages/BookAppointment';
import Dashboard from './pages/Dashboard';
import SearchPage from './pages/SearchPage';
import OfferDetails from './pages/OfferDetailsPages';
import UserProfilePage from './pages/UserProfilepage';
import Payments from './pages/PaymentsPages';
import Appointments from './pages/AppointmentPage';
import ReferralPage from './pages/ReferalPage';
import NotFoundPage from './pages/NotFoundPage'
import './App.css';

function App() {
  // Check if user is logged in (from localStorage)
  const isLoggedIn = !!localStorage.getItem('token')

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/searchpage" element={<SearchPage />} />
      <Route path="/dashboard/:id" element={<Dashboard />} />
      <Route path="/payments/:id" element={<Payments />} />
      <Route path="/appointments/:id" element={<Appointments />} />
      <Route path="/offerdetails/:id"  element={<OfferDetails />} />
      <Route path="/profile/:id"  element={<UserProfilePage />} />
      <Route path="/doctors" element={isLoggedIn ? <Doctors /> : <Navigate to="/login" />} />
      <Route path="/referral/provider/:id" element={isLoggedIn ? <ReferralPage /> : <Navigate to="/login" />} />
      <Route path="/referral/patient/:id" element={isLoggedIn ? <ReferralPage /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to={isLoggedIn ? "/searchpage" : "/login"} />} />
      <Route path="*" element={<NotFoundPage/>} />
    </Routes>
  )
}

export default App