import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { healthService, type HealthEvent, type HealthEventUpdate } from '../api/healthService';

const EditHealthEvent: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [event, setEvent] = useState<HealthEvent | null>(null);
  const [formData, setFormData] = useState<HealthEventUpdate>({
    event_date: '',
    event_type: 'checkup',
    details: '',
    next_due_date: '',
    attachments: []
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!id) return;
        const data = await healthService.getHealthEvent(parseInt(id));
        setEvent(data);
        setFormData({
          event_date: data.event_date,
          event_type: data.event_type,
          details: data.details,
          next_due_date: data.next_due_date || '',
          attachments: []
        });
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to fetch health event'
        });
        navigate('/health');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate, addNotification]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        attachments: files
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    try {
      await healthService.updateHealthEvent(parseInt(id), formData);
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Health event updated successfully'
      });
      navigate('/health');
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update health event'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="text-center text-red-600">Health event not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Edit Health Event</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="event_date" className="block text-sm font-medium text-gray-700">
                      Event Date
                    </label>
                    <input
                      type="date"
                      id="event_date"
                      name="event_date"
                      required
                      value={formData.event_date}
                      onChange={handleInputChange}
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
                      required
                      value={formData.event_type}
                      onChange={handleInputChange}
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
                      required
                      value={formData.details}
                      onChange={handleInputChange}
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
                      value={formData.next_due_date}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="attachments" className="block text-sm font-medium text-gray-700">
                      Add Attachments (Optional)
                    </label>
                    <input
                      type="file"
                      id="attachments"
                      name="attachments"
                      multiple
                      onChange={handleFileChange}
                      className="mt-1 block w-full"
                    />
                    {event.attachments.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Current attachments:</p>
                        <ul className="mt-1 text-sm text-gray-600">
                          {event.attachments.map((attachment, index) => (
                            <li key={index}>{attachment}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => navigate('/health')}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
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

export default EditHealthEvent; 