import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sheepService } from '../api/sheepService';
import type { Sheep } from '../api/sheepService';
import { useNotification } from '../context/NotificationContext';
import ErrorMessage from '../components/ErrorMessage';

const AddSheep: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState({
    tag_id: '',
    scrapie_id: '',
    breed: '',
    sex: '',
    date_of_birth: '',
    purchase_date: '',
    acquisition_price: '',
    origin_farm: '',
    rfid_code: '',
    qr_code: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    if (!formData.tag_id.trim()) {
      setError('Tag ID is required');
      return false;
    }
    if (!formData.breed.trim()) {
      setError('Breed is required');
      return false;
    }
    if (!formData.sex) {
      setError('Sex is required');
      return false;
    }
    if (!formData.date_of_birth) {
      setError('Date of birth is required');
      return false;
    }
    if (formData.acquisition_price && (isNaN(Number(formData.acquisition_price)) || Number(formData.acquisition_price) < 0)) {
      setError('Acquisition price must be a positive number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const sheepData: Omit<Sheep, 'id'> = {
        tag_id: formData.tag_id,
        scrapie_id: formData.scrapie_id || undefined,
        breed: formData.breed,
        sex: formData.sex as 'male' | 'female',
        date_of_birth: formData.date_of_birth,
        purchase_date: formData.purchase_date || undefined,
        acquisition_price: formData.acquisition_price ? Number(formData.acquisition_price) : undefined,
        origin_farm: formData.origin_farm || undefined,
        rfid_code: formData.rfid_code || undefined,
        qr_code: formData.qr_code || undefined,
        notes: formData.notes || undefined,
        status: 'active',
        current_section: 'general'
      };

      const response = await sheepService.createSheep(sheepData);
      const sheep = response.data;

      addNotification({
        type: 'success',
        title: 'Sheep Added',
        message: `Successfully added sheep with tag ID ${sheep.tag_id} to your flock.`,
        duration: 5000
      });

      navigate('/');
    } catch (err) {
      console.error('Error adding sheep:', err);
      setError('Failed to add sheep. Please try again.');
      addNotification({
        type: 'error',
        title: 'Add Failed',
        message: 'Failed to add sheep. Please try again.',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Sheep</h3>
            <p className="mt-1 text-sm text-gray-600">
              Enter the details of the new sheep to add to your flock.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  {error && <ErrorMessage message={error} />}

                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="tag_id" className="block text-sm font-medium text-gray-700">
                        Tag ID
                      </label>
                      <input
                        type="text"
                        name="tag_id"
                        id="tag_id"
                        required
                        value={formData.tag_id}
                        onChange={handleChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="scrapie_id" className="block text-sm font-medium text-gray-700">
                        Scrapie ID
                      </label>
                      <input
                        type="text"
                        name="scrapie_id"
                        id="scrapie_id"
                        value={formData.scrapie_id}
                        onChange={handleChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="breed" className="block text-sm font-medium text-gray-700">
                        Breed
                      </label>
                      <input
                        type="text"
                        name="breed"
                        id="breed"
                        required
                        value={formData.breed}
                        onChange={handleChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
                        Sex
                      </label>
                      <select
                        id="sex"
                        name="sex"
                        required
                        value={formData.sex}
                        onChange={handleChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Select sex</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="date_of_birth"
                        id="date_of_birth"
                        required
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700">
                        Purchase Date
                      </label>
                      <input
                        type="date"
                        name="purchase_date"
                        id="purchase_date"
                        value={formData.purchase_date}
                        onChange={handleChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="acquisition_price" className="block text-sm font-medium text-gray-700">
                        Acquisition Price
                      </label>
                      <input
                        type="number"
                        name="acquisition_price"
                        id="acquisition_price"
                        step="0.01"
                        min="0"
                        value={formData.acquisition_price}
                        onChange={handleChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="origin_farm" className="block text-sm font-medium text-gray-700">
                        Origin Farm
                      </label>
                      <input
                        type="text"
                        name="origin_farm"
                        id="origin_farm"
                        value={formData.origin_farm}
                        onChange={handleChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="rfid_code" className="block text-sm font-medium text-gray-700">
                        RFID Code
                      </label>
                      <input
                        type="text"
                        name="rfid_code"
                        id="rfid_code"
                        value={formData.rfid_code}
                        onChange={handleChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="qr_code" className="block text-sm font-medium text-gray-700">
                        QR Code
                      </label>
                      <input
                        type="text"
                        name="qr_code"
                        id="qr_code"
                        value={formData.qr_code}
                        onChange={handleChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6">
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        placeholder="Any additional notes about the sheep"
                      />
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Sheep'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSheep; 