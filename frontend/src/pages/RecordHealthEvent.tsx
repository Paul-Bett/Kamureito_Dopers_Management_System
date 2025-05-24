import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sheepService, type Sheep, type HealthEvent } from '../api/sheepService';
import ErrorMessage from '../components/ErrorMessage';

const RecordHealthEvent: React.FC = () => {
  const navigate = useNavigate();
  const [sheep, setSheep] = useState<Sheep[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<Omit<HealthEvent, 'id'>>({
    sheepId: 0,
    eventType: '',
    date: new Date().toISOString().split('T')[0],
    status: 'active',
    description: '',
  });

  const fetchSheep = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sheepService.getAllSheep();
      setSheep(response.data);
    } catch (err) {
      console.error('Error fetching sheep:', err);
      setError('Failed to load sheep data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheep();
  }, []);

  const validateForm = (): boolean => {
    if (!formData.sheepId) {
      setError('Please select a sheep');
      return false;
    }
    if (!formData.eventType) {
      setError('Please select an event type');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Please provide a description');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError(null);
      await sheepService.createHealthEvent(formData);
      setSuccess(true);
      // Redirect after a short delay to show success state
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Error creating health event:', error);
      setError('Failed to create health event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Record Health Event</h1>
      {error && <ErrorMessage message={error} onRetry={fetchSheep} />}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">Health event recorded successfully!</p>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-lg shadow p-6 mt-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="sheepId" className="block text-sm font-medium text-gray-700">
              Sheep
            </label>
            <select
              id="sheepId"
              name="sheepId"
              value={formData.sheepId}
              onChange={handleChange}
              required
              disabled={submitting}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select a sheep</option>
              {sheep.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.breed})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
              Event Type
            </label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
              disabled={submitting}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select event type</option>
              <option value="Vaccination">Vaccination</option>
              <option value="Treatment">Treatment</option>
              <option value="Check-up">Check-up</option>
              <option value="Injury">Injury</option>
              <option value="Disease">Disease</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              disabled={submitting}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              disabled={submitting}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={submitting}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Provide details about the health event..."
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            disabled={submitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {submitting ? 'Recording...' : 'Record Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecordHealthEvent; 