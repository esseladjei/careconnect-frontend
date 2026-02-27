import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { MFAEnrollmentType, MFAStateSettings } from '../types/mfa';
import {
  disableMFA,
  enableMFA,
  enrollMFAMethod,
  fetchMFASettings,
  removeMFAMethod,
  setPrimaryMFAMethod,
  verifyMFAEnrollment,
} from '../api/mfaApi';
import Spinner from './Spinner';

interface MFASettingsProps {
  userId: string;
  userEmail: string;
}

const MFASettings: React.FC<MFASettingsProps> = ({ userId, userEmail }) => {
  const [mfaSettings, setMFASettings] = useState<MFAStateSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [enrollingMethod, setEnrollingMethod] =
    useState<MFAEnrollmentType | null>(null);
  const [enrollmentCode, setEnrollmentCode] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [passwordForDisable, setPasswordForDisable] = useState('');
  const [showDisableForm, setShowDisableForm] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);

  // Load MFA settings
  useEffect(() => {
    const loadMFASettings = async () => {
      try {
        setIsLoading(true);
        const settings = await fetchMFASettings(userId);
        setMFASettings(settings);
      } catch (err: any) {
        toast.error(
          err.response?.data?.message || 'Failed to load MFA settings'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      (async () => {
        await loadMFASettings();
      })();
    }
  }, [userId]);

  // Handle enabling MFA
  const handleEnableMFA = async () => {
    try {
      setIsSaving(true);
      await enableMFA(userId);
      const settings = await fetchMFASettings(userId);
      setMFASettings(settings);
      toast.success('MFA enabled successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to enable MFA');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle disabling MFA
  const handleDisableMFA = async () => {
    if (!passwordForDisable) {
      toast.error('Please enter your password');
      return;
    }

    try {
      setIsSaving(true);
      await disableMFA(userId, {
        method: mfaSettings?.primaryMethod || 'email',
        password: passwordForDisable,
      });
      const settings = await fetchMFASettings(userId);
      setMFASettings(settings);
      setPasswordForDisable('');
      setShowDisableForm(false);
      toast.success('MFA disabled successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to disable MFA');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle enrolling MFA method
  const handleEnrollMethod = async (method: MFAEnrollmentType) => {
    try {
      setIsSaving(true);
      setEnrollingMethod(method);
      const response = await enrollMFAMethod(userId, userEmail, method);

      if (response.qrCode) {
        setQrCode(response.qrCode);
      }
      if (response.secret) {
        setTotpSecret(response.secret);
      }

      setShowVerificationForm(true);
      toast.success(
        method === 'email'
          ? 'Verification code sent to your email'
          : 'Scan the QR code with your authenticator app'
      );
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || `Failed to enroll ${method} method`
      );
      setEnrollingMethod(null);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle verifying enrollment code
  const handleVerifyEnrollment = async () => {
    if (!enrollmentCode || !enrollingMethod) {
      toast.error('Please enter the verification code');
      return;
    }

    try {
      setIsSaving(true);
      await verifyMFAEnrollment(userId, {
        code: enrollmentCode,
        method: enrollingMethod,
      });

      const settings = await fetchMFASettings(userId);
      setMFASettings(settings);

      // Reset form
      setEnrollmentCode('');
      setEnrollingMethod(null);
      setQrCode(null);
      setTotpSecret(null);
      setShowVerificationForm(false);
      setShowManualEntry(false);

      toast.success(`${enrollingMethod} method enrolled successfully!`);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || 'Failed to verify enrollment code'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handle setting primary method
  const handleSetPrimary = async (method: MFAEnrollmentType) => {
    try {
      setIsSaving(true);
      await setPrimaryMFAMethod(userId, method);
      const settings = await fetchMFASettings(userId);
      setMFASettings(settings);
      toast.success(`${method} set as primary method`);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || 'Failed to set primary method'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handle removing MFA method
  const handleRemoveMethod = async (method: MFAEnrollmentType) => {
    if (
      !confirm(`Are you sure you want to remove ${method} as an MFA method?`)
    ) {
      return;
    }

    try {
      setIsSaving(true);
      await removeMFAMethod(userId, method);
      const settings = await fetchMFASettings(userId);
      setMFASettings(settings);
      toast.success(`${method} method removed successfully!`);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || `Failed to remove ${method} method`
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" className="mr-3" />
        <span className="text-gray-600 font-medium">
          Loading MFA settings...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* MFA Enable/Disable Section */}
      <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Two-Factor Authentication
            </h3>
            <p className="text-gray-600 text-sm">
              {mfaSettings?.isMFAEnabled
                ? 'Your account is protected with two-factor authentication'
                : 'Secure your account with two-factor authentication'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {mfaSettings?.isMFAEnabled ? (
              <>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✓ Enabled
                </span>
                <button
                  onClick={() => setShowDisableForm(true)}
                  disabled={isSaving}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  Disable MFA
                </button>
              </>
            ) : (
              <>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Disabled
                </span>
                <button
                  onClick={handleEnableMFA}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? <Spinner size="sm" /> : null}
                  Enable MFA
                </button>
              </>
            )}
          </div>
        </div>

        {/* Disable MFA Form */}
        {showDisableForm && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Enter your password to disable MFA:
            </p>
            <div className="flex gap-3">
              <input
                type="password"
                value={passwordForDisable}
                onChange={(e) => setPasswordForDisable(e.target.value)}
                placeholder="Enter your password"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleDisableMFA}
                disabled={isSaving || !passwordForDisable}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? <Spinner size="sm" /> : null}
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowDisableForm(false);
                  setPasswordForDisable('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enrolled Methods Section */}
      {mfaSettings?.isMFAEnabled && mfaSettings.mfaMethods.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            Enrolled Methods
          </h3>
          <div className="space-y-2">
            {mfaSettings.mfaMethods.map((method) => (
              <div
                key={method.type}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    {method.type === 'email' ? (
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {method.type}
                      {method.type === 'totp' ? ' (Authenticator App)' : ''}
                      {mfaSettings.primaryMethod === method.type && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Primary
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {method.isVerified ? (
                        <>
                          ✓ Verified
                          {method.enrolledAt && (
                            <>
                              {' · Enrolled '}
                              {new Date(method.enrolledAt).toLocaleDateString()}
                            </>
                          )}
                        </>
                      ) : (
                        'Pending verification'
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {mfaSettings.primaryMethod !== method.type &&
                    mfaSettings.mfaMethods.length > 1 && (
                      <button
                        onClick={() =>
                          handleSetPrimary(method.type as MFAEnrollmentType)
                        }
                        disabled={isSaving}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                      >
                        Set Primary
                      </button>
                    )}
                  <button
                    onClick={() =>
                      handleRemoveMethod(method.type as MFAEnrollmentType)
                    }
                    disabled={isSaving}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Method Section */}
      {mfaSettings?.isMFAEnabled && !showVerificationForm && (
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Add Another Method
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Add backup methods to ensure you can always access your account.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleEnrollMethod('email')}
              disabled={
                isSaving ||
                mfaSettings.mfaMethods.some((m) => m.type === 'email')
              }
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Email 2FA
            </button>
            <button
              onClick={() => handleEnrollMethod('totp')}
              disabled={
                isSaving ||
                mfaSettings.mfaMethods.some((m) => m.type === 'totp')
              }
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Authenticator App
            </button>
          </div>
        </div>
      )}

      {/* Enrollment Verification Form */}
      {showVerificationForm && (
        <div className="border border-amber-200 rounded-lg p-6 bg-amber-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Verify Your{' '}
            {enrollingMethod === 'email' ? 'Email' : 'Authenticator'} Method
          </h3>

          {qrCode && enrollingMethod === 'totp' && (
            <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-3 font-medium">
                Step 1: Scan this QR code with your authenticator app
              </p>
              <div className="text-center mb-4">
                <img
                  src={qrCode}
                  alt="TOTP QR Code"
                  className="mx-auto w-48 h-48 border border-gray-300 p-2 bg-white rounded"
                />
              </div>

              {!showManualEntry && totpSecret && (
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-2">
                    Can't scan the QR code?
                  </p>
                  <button
                    onClick={() => setShowManualEntry(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 underline"
                  >
                    Enter setup key manually
                  </button>
                </div>
              )}

              {showManualEntry && totpSecret && (
                <div className="mt-4 p-3 bg-gray-100 rounded border border-gray-300">
                  <p className="text-xs text-gray-700 font-medium mb-2">
                    Enter this setup key in your authenticator app:
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <code className="flex-1 p-2 bg-white border border-gray-300 rounded font-mono text-sm text-center tracking-widest">
                      {totpSecret}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(totpSecret);
                        toast.success('Copied to clipboard!');
                      }}
                      className="px-3 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mb-6">
            <p className="text-sm text-gray-700 font-medium mb-3">
              Step {enrollingMethod === 'totp' ? '2' : '1'}: Enter verification
              code
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {enrollingMethod === 'email'
                ? 'Enter the code from your email'
                : 'Enter the 6-digit code from your authenticator app'}
            </label>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={enrollmentCode}
                onChange={(e) =>
                  setEnrollmentCode(e.target.value.toUpperCase())
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleVerifyEnrollment();
                  }
                }}
                placeholder={
                  enrollingMethod === 'email' ? 'e.g., ABC123' : '000000'
                }
                maxLength={10}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono tracking-widest text-lg text-center"
                autoFocus
              />
              <button
                onClick={handleVerifyEnrollment}
                disabled={isSaving || !enrollmentCode}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap font-medium"
              >
                {isSaving ? <Spinner size="sm" /> : null}
                Verify
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              setShowVerificationForm(false);
              setEnrollmentCode('');
              setEnrollingMethod(null);
              setQrCode(null);
              setTotpSecret(null);
              setShowManualEntry(false);
            }}
            disabled={isSaving}
            className="text-sm text-gray-600 hover:text-gray-700"
          >
            Cancel
          </button>

          <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded text-xs text-blue-800">
            <strong>Tip:</strong>{' '}
            {enrollingMethod === 'email'
              ? "Check your spam folder if you don't see the email within a minute."
              : 'Make sure the time on your device is synchronized. TOTP codes change every 30 seconds.'}
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3">
          About Two-Factor Authentication
        </h4>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>
            • <strong>Email 2FA:</strong> Receive a code via email that you'll
            need to enter to verify your identity.
          </li>
          <li>
            • <strong>Authenticator App:</strong> Use an app like Google
            Authenticator or Authy to generate time-based codes.
          </li>
          <li>
            • <strong>Security:</strong> You can have multiple methods enrolled
            for backup access.
          </li>
          <li>
            • <strong>Privacy:</strong> We never store your authenticator app
            secret on our servers.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MFASettings;
