import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/RegisterUser';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import Logout from './pages/Logout';
import Dashboard from './pages/Dashboard';
import SearchPage from './pages/SearchPage';
import BookingPage from './pages/BookingPage.tsx';
import CreateListing from './pages/CreateListing';
import UserProfilePage from './pages/UserProfilepage';
import Payments from './pages/PaymentsPages';
import Appointments from './pages/AppointmentPage';
import AppointmentDetailsPage from './pages/AppointmentDetailsPage';
import ReferralPage from './pages/ReferalPage';
import NotFoundPage from './pages/NotFoundPage';
import ProviderOnboarding from './pages/ProviderOnboarding.tsx';
import Home from './pages/Home';
import { useAuth } from './hooks/useAuth';
import Spinner from './components/Spinner';
import './App.css';
import AppointmentReviewPage from './pages/AppointmentReviewPage';

function App() {
  const { isLoggedIn, isSessionLoading } = useAuth();

  // Show loading while verifying session
  if (isSessionLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/password-reset/:role/:userId/:timestamp"
          element={<ResetPassword />}
        />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/provider/onboarding/:userId"
          element={
            isLoggedIn ? <ProviderOnboarding /> : <Navigate to="/login" />
          }
        />
        <Route path="/search" element={<SearchPage />} />
        <Route
          path="/createlisting/:userId"
          element={isLoggedIn ? <CreateListing /> : <Navigate to="/login" />}
        />

        <Route
          path="/dashboard/:userId"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/payments/:userId"
          element={isLoggedIn ? <Payments /> : <Navigate to="/login" />}
        />
        <Route
          path="/appointments/:userId"
          element={isLoggedIn ? <Appointments /> : <Navigate to="/login" />}
        />
        <Route
          path="/offerdetails/:availabilityId"
          element={isLoggedIn ? <BookingPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:userId"
          element={isLoggedIn ? <UserProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/referral/provider/:userId"
          element={isLoggedIn ? <ReferralPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/referral/patient/:userId"
          element={isLoggedIn ? <ReferralPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/appointments/:appointmentId/review"
          element={
            isLoggedIn ? <AppointmentReviewPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/appointments/:appointmentId/details"
          element={
            isLoggedIn ? <AppointmentDetailsPage /> : <Navigate to="/login" />
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
