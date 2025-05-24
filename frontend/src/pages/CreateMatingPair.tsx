import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matingService, type MatingPair } from '../api/matingService';
import { type Sheep } from '../api/sheepService';
import ErrorMessage from '../components/ErrorMessage';

const CreateMatingPair: React.FC = () => {
  const navigate = useNavigate();
  const [rams, setRams] = useState<Sheep[]>([]);
  const [ewes, setEwes] = useState<Sheep[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<Omit<MatingPair, 'id'>>({
    ramId: 0,
    eweId: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: null,
    status: 'active',
    notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [ramsData, ewesData] = await Promise.all([
          matingService.getAvailableRams(),
          matingService.getAvailableEwes(),
        ]);
        setRams(ramsData);
        setEwes(ewesData);
      } catch (err) {
        console.error('Error fetching sheep data:', err);
        setError('Failed to load sheep data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validateForm = (): boolean => {
    if (!formData.ramId) {
      setError('Please select a ram');
      return false;
    }
    if (!formData.eweId) {
      setError('Please select a ewe');
      return false;
    }
    if (formData.ramId === formData.eweId) {
      setError('Ram and ewe cannot be the same sheep');
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
      await matingService.createMatingPair(formData);
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Error creating mating pair:', error);
      setError('Failed to create mating pair. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      <h1 className="text-3xl font-bold mb-6">Create Mating Pair</h1>
      {error && <ErrorMessage message={error} />}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">Mating pair created successfully!</p>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-lg shadow p-6 mt-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="ramId" className="block text-sm font-medium text-gray-700">
              Ram
            </label>
            <select
              id="ramId"
              name="ramId"
              value={formData.ramId}
              onChange={handleChange}
              required
              disabled={submitting}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select a ram</option>
              {rams.map((ram) => (
                <option key={ram.id} value={ram.id}>
                  {ram.name} ({ram.breed})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="eweId" className="block text-sm font-medium text-gray-700">
              Ewe
            </label>
            <select
              id="eweId"
              name="eweId"
              value={formData.eweId}
              onChange={handleChange}
              required
              disabled={submitting}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select a ewe</option>
              {ewes.map((ewe) => (
                <option key={ewe.id} value={ewe.id}>
                  {ewe.name} ({ewe.breed})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              disabled={submitting}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              disabled={submitting}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Add any additional notes about the mating pair..."
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
            {submitting ? 'Creating...' : 'Create Mating Pair'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMatingPair; 