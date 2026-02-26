import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import StarRatingInput from '../components/reviews/StarRatingInput';
import { useAuth } from '../hooks/useAuth';
import { useGetAppointment } from '../hooks/useAppointments';
import { useSubmitReview } from '../hooks/useReviews';

const AppointmentReviewPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { userId, role } = useAuth();
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ratings, setRatings] = useState({
    professionalism: 0,
    communication: 0,
    punctuality: 0,
    empathy: 0,
  });
  const { data: appointment, isLoading } = useGetAppointment({
    appointmentId: appointmentId ?? '',
  });
  const { mutate: submitReview, isPending } = useSubmitReview();

  if (!appointmentId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Invalid review link.
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Please check the link from your email or contact support.
          </p>
          <Link to="/" className="mt-4 inline-block text-blue-600">
            Back to home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const isEligible =
    appointment?.status === 'completed' &&
    appointment?.paymentStatus === 'paid';

  const handleSubmit = (event: React.SubmitEvent) => {
    event.preventDefault();
    if (!appointment) {
      setError('Appointment not found.');
      return;
    }

    const allRated = Object.values(ratings).every((value) => value >= 1);
    if (!allRated) {
      setError('Please rate all categories.');
      return;
    }
    const trimmed = comment.trim();
    if (trimmed.length > 0 && trimmed.length < 10) {
      setError('Comment must be at least 10 characters.');
      return;
    }

    setError('');
    submitReview(
      {
        appointmentId: appointment._id,
        providerId: appointment.providerId._id,
        rating: ratings,
        comment: trimmed,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          setTimeout(() => navigate(`/appointments/${userId}`), 1500);
        },
      }
    );
  };
  if (role && role !== 'patient') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Reviews are only available to patients.
          </h1>
          <Link to="/" className="mt-4 inline-block text-blue-600">
            Back to home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Review your appointment
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Share feedback on professionalism, communication, punctuality, and
            empathy.
          </p>

          {isLoading && (
            <div className="py-10 flex justify-center">
              <Spinner />
            </div>
          )}

          {!isLoading && !appointment && (
            <div className="mt-6 text-sm text-red-600">
              Appointment not found. Please check the link from your email.
            </div>
          )}

          {!isLoading && appointment && !isEligible && (
            <div className="mt-6 text-sm text-orange-600">
              Reviews are available only after the appointment is completed and
              paid.
            </div>
          )}

          {!isLoading && appointment && isEligible && !submitted && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="text-sm text-gray-600 mb-2">
                  Review for Provider
                </div>
                <div className="font-semibold text-blue-700 ">
                  {appointment.patientId.userId.title}{' '}
                  {appointment.patientId.userId.lastName}{' '}
                  {appointment.patientId.userId.firstName}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(appointment.scheduledAt).toLocaleDateString(
                    'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </div>
              </div>

              <StarRatingInput
                label="Professionalism"
                value={ratings.professionalism}
                onChange={(value) =>
                  setRatings((prev) => ({ ...prev, professionalism: value }))
                }
              />
              <StarRatingInput
                label="Communication"
                value={ratings.communication}
                onChange={(value) =>
                  setRatings((prev) => ({ ...prev, communication: value }))
                }
              />
              <StarRatingInput
                label="Punctuality"
                value={ratings.punctuality}
                onChange={(value) =>
                  setRatings((prev) => ({ ...prev, punctuality: value }))
                }
              />
              <StarRatingInput
                label="Empathy"
                value={ratings.empathy}
                onChange={(value) =>
                  setRatings((prev) => ({ ...prev, empathy: value }))
                }
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments (private to admins)
                </label>
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Tell us about your experience..."
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {isPending ? 'Submitting...' : 'Submit review'}
              </button>
            </form>
          )}

          {submitted && (
            <div className="mt-6 text-sm text-green-600">
              Thank you! Your review has been submitted.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AppointmentReviewPage;
