// src/pages/admin/AdminSettings.jsx
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'BloodLife',
    contactEmail: 'admin@bloodlife.org',
    emergencyContact: '16263',
    maintenanceMode: false,
    allowRegistration: true,
    maxRequestsPerDay: 5,
    notificationEnabled: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // API call to save settings
      // await saveSettingsAPI(settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Settings</h1>
        <p className="text-gray-600">Manage system configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-800">General Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name
              </label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact
              </label>
              <input
                type="text"
                name="emergencyContact"
                value={settings.emergencyContact}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-800">System Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maintenance Mode
                </label>
                <p className="text-sm text-gray-500">Temporarily disable the site</p>
              </div>
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="toggle toggle-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allow New Registrations
                </label>
                <p className="text-sm text-gray-500">Enable/disable user registration</p>
              </div>
              <input
                type="checkbox"
                name="allowRegistration"
                checked={settings.allowRegistration}
                onChange={handleChange}
                className="toggle toggle-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enable Notifications
                </label>
                <p className="text-sm text-gray-500">Send email/SMS notifications</p>
              </div>
              <input
                type="checkbox"
                name="notificationEnabled"
                checked={settings.notificationEnabled}
                onChange={handleChange}
                className="toggle toggle-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Requests Per Day
              </label>
              <input
                type="number"
                name="maxRequestsPerDay"
                value={settings.maxRequestsPerDay}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="1"
                max="20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn btn-primary px-6"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;