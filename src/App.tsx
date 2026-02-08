import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/RegisterUser';
import Logout from './pages/Logout';
import Doctors from './pages/Doctors';
//import BookAppointment from './pages/BookAppointment';
import Dashboard from './pages/Dashboard';
import SearchPage from './pages/SearchPage';
import OfferDetailsPage from './pages/OfferDetailsPage.tsx';
import UserProfilePage from './pages/UserProfilepage';
import Payments from './pages/PaymentsPages';
import Appointments from './pages/AppointmentPage';
import ReferralPage from './pages/ReferalPage';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './hooks/useAuth';
import './App.css';
import ProviderOnboarding from './pages/ProviderOnboarding.tsx';
import Home from './pages/Home';

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/provider/onboarding/:id"
          element={
            isLoggedIn ? <ProviderOnboarding /> : <Navigate to="/login" />
          }
        />
        <Route path="/search" element={<SearchPage />} />
        <Route
          path="/dashboard/:id"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/payments/:id"
          element={isLoggedIn ? <Payments /> : <Navigate to="/login" />}
        />
        <Route
          path="/appointments/:id"
          element={isLoggedIn ? <Appointments /> : <Navigate to="/login" />}
        />
        <Route
          path="/offerdetails/:id"
          element={isLoggedIn ? <OfferDetailsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:id"
          element={isLoggedIn ? <UserProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/doctors"
          element={isLoggedIn ? <Doctors /> : <Navigate to="/login" />}
        />
        <Route
          path="/referral/provider/:id"
          element={isLoggedIn ? <ReferralPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/referral/patient/:id"
          element={isLoggedIn ? <ReferralPage /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
