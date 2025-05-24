import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { sheepService, type Sheep } from '../api/sheepService';

interface HealthEventCreate {
  sheep_id: string;
  event_date: string;
  event_type: 'vaccination' | 'treatment' | 'checkup' | 'other';
  details: string;
  next_due_date?: string;
}

const RecordHealthEvent: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [sheep, setSheep] = useState<{ id: number; tag_id: string }[]>([]);
  const [formData, setFormData] = useState<HealthEventCreate>({
    sheep_id: '',
    event_date: new Date().toISOString().split('T')[0],
    event_type: 'checkup',
    details: '',
  });

  useEffect(() => {
    const fetchSheep = async () => {
      try {
        const response = await sheepService.getAllSheep();
        setSheep(response.data.map((s: Sheep) => ({ id: s.id, tag_id: s.tag_id })));
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to fetch sheep list'
        });
      }
    };
    fetchSheep();
  }, [addNotification]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: HealthEventCreate) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.sheep_id) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please select a sheep'
      });
      return false;
    }
    if (!formData.event_date) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please select an event date'
      });
      return false;
    }
    if (!formData.details.trim()) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide event details'
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // TODO: Implement health event creation
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Health event recorded successfully'
      });
      navigate('/sheep');
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to record health event'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Record Health Event</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="sheep_id" className="block text-sm font-medium text-gray-700">
                      Sheep
                    </label>
                    <select
                      id="sheep_id"
                      name="sheep_id"
                      value={formData.sheep_id}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Select a sheep</option>
                      {sheep.map(s => (
                        <option key={s.id} value={s.id.toString()}>
                          {s.tag_id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="event_date" className="block text-sm font-medium text-gray-700">
                      Event Date
                    </label>
                    <input
                      type="date"
                      id="event_date"
                      name="event_date"
                      value={formData.event_date}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="event_type" className="block text-sm font-medium text-gray-700">
                      Event Type
                    </label>
                    <select
                      id="event_type"
                      name="event_type"
                      value={formData.event_type}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="vaccination">Vaccination</option>
                      <option value="treatment">Treatment</option>
                      <option value="checkup">Checkup</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                      Details
                    </label>
                    <textarea
                      id="details"
                      name="details"
                      value={formData.details}
                      onChange={handleChange}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="next_due_date" className="block text-sm font-medium text-gray-700">
                      Next Due Date (Optional)
                    </label>
                    <input
                      type="date"
                      id="next_due_date"
                      name="next_due_date"
                      value={formData.next_due_date || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Record Event
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordHealthEvent; 