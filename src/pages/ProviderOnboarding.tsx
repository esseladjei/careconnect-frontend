import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

type ProviderStatus = 'pending' | 'verified' | 'rejected' | undefined;

const ProviderOnboarding: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status] = useState<ProviderStatus>(
    (location.state?.status as ProviderStatus) || 'pending'
  );
  const [userId] = useState<string>(location.state?.userId as string);
  const getStatusConfig = (providerStatus: ProviderStatus) => {
    switch (providerStatus) {
      case 'verified':
        return {
          icon: CheckCircleIcon,
          title: 'Profile Verified',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          message:
            'Your provider profile has been verified. You can now start accepting patients.',
          steps: [
            { title: 'Set up your schedule', completed: false },
            { title: 'Configure consultation rates', completed: false },
            { title: 'Review and accept terms', completed: false },
          ],
        };
      case 'rejected':
        return {
          icon: XCircleIcon,
          title: 'Profile Rejected',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          message:
            'Your provider profile could not be verified. Please contact support for more details.',
          action: 'Contact Support',
        };
      case 'pending':
      default:
        return {
          icon: ClockIcon,
          title: 'Verification Pending',
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          message:
            'Your provider profile is under review. We will verify your credentials within 24-48 hours.',
          steps: [
            { title: 'Profile submitted', completed: true },
            { title: 'License verification', completed: false },
            { title: 'Background check', completed: false },
            { title: 'Account activation', completed: false },
          ],
        };
    }
  };

  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8">
        {/* Status Header */}
        <div className={`${config.bgColor} rounded-lg p-8 mb-8 text-center`}>
          <StatusIcon className={`${config.color} w-16 h-16 mx-auto mb-4`} />
          <h1 className={`text-2xl font-bold ${config.color} mb-2`}>
            {config.title}
          </h1>
          <p className="text-gray-600 mb-4">{config.message}</p>
          {config.action && (
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {config.action}
            </button>
          )}
        </div>

        {/* Verification Steps */}
        {config.steps && status === 'pending' && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Verification Process
            </h2>
            <div className="space-y-4">
              {config.steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white ${
                      step.completed ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    {step.completed ? '✓' : index + 1}
                  </div>
                  <span className="ml-4 text-gray-700">{step.title}</span>
                  {step.completed && (
                    <span className="ml-auto text-green-600 text-sm">
                      Completed
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Onboarding Steps */}
        {config.steps && status === 'verified' && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Next Steps to Get Started
            </h2>
            <div className="space-y-4">
              {config.steps.map((step, index) => (
                <button
                  key={index}
                  className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold">
                    {index + 1}
                  </div>
                  <span className="ml-4 text-gray-700">{step.title}</span>
                  <span className="ml-auto text-gray-400">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Info */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-800 mb-3">
            What happens next?
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {status === 'pending' && (
              <>
                <li>
                  • We'll verify your license and credentials against official
                  databases
                </li>
                <li>
                  • A quick background check will be performed for patient
                  safety
                </li>
                <li>
                  • You'll receive an email notification once verification is
                  complete
                </li>
                <li>• Typical verification time: 24-48 hours</li>
              </>
            )}
            {status === 'verified' && (
              <>
                <li>
                  • Complete your profile setup to start accepting patients
                </li>
                <li>• Set your availability and consultation rates</li>
                <li>• Enable telemedicine features if needed</li>
                <li>• Review our provider terms and privacy policy</li>
              </>
            )}
            {status === 'rejected' && (
              <>
                <li>• There was an issue verifying your credentials</li>
                <li>
                  • Our team will contact you within 24 hours with details
                </li>
                <li>• You may be able to resubmit your information</li>
                <li>• Contact our support team for immediate assistance</li>
              </>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
          >
            Back to Home
          </button>
          {status === 'verified' && (
            <button
              onClick={() => navigate(`/dashboard/${userId || ''}`)}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
            >
              Go to Dashboard
            </button>
          )}
          {status === 'pending' && (
            <button
              onClick={() => navigate(`/dashboard/${userId || ''}`)}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
            >
              View Dashboard
            </button>
          )}
          {status === 'rejected' && (
            <button
              onClick={() => navigate('/support')}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Contact Support
            </button>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-200">
          <p className="font-semibold text-gray-700 mb-2">Need Help?</p>
          <p>
            If you have any questions about the verification process or need
            assistance, please contact our support team at{' '}
            <a
              href="mailto:support@careconnect.com"
              className="text-blue-600 hover:underline"
            >
              support@careconnect.com
            </a>{' '}
            or call{' '}
            <a href="tel:+1234567890" className="text-blue-600 hover:underline">
              +1-234-567-890
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProviderOnboarding;
