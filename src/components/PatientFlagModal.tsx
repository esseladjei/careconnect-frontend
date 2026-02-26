import React, { useState } from 'react';
import { useSubmitFlag } from '../hooks/useReviews';
import type { ProviderFlag } from '../types/reviews';

interface PatientFlagModalProps {
  appointmentId: string;
  patientId: string;
  onClose: () => void;
}

const flagOptions: { value: ProviderFlag['flagType']; label: string }[] = [
  { value: 'no-show', label: 'No-show' },
  { value: 'abusive-behavior', label: 'Abusive behavior' },
  { value: 'payment-dispute', label: 'Payment dispute' },
  { value: 'suspicious-activity', label: 'Suspicious activity' },
];

const PatientFlagModal: React.FC<PatientFlagModalProps> = ({
  appointmentId,
  patientId,
  onClose,
}) => {
  const [flagType, setFlagType] = useState<ProviderFlag['flagType']>('no-show');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const { mutate: submitFlag, isPending } = useSubmitFlag();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (description.trim().length < 20) {
      setError('Description must be at least 20 characters.');
      return;
    }
    setError('');
    submitFlag(
      { appointmentId, patientId, flagType, description: description.trim() },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Report Patient Issue
          </h2>
          <p className="text-sm text-gray-500">
            Flags are private and only visible to admins.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Type
            </label>
            <select
              value={flagType}
              onChange={(event) =>
                setFlagType(event.target.value as ProviderFlag['flagType'])
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              {flagOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Describe what happened..."
            />
            <p className="mt-1 text-xs text-gray-500">Minimum 20 characters.</p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {isPending ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientFlagModal;
