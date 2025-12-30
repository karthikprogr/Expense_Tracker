import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import { updateProfile } from 'firebase/auth';

function Settings() {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [editingProfile, setEditingProfile] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [updating, setUpdating] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!displayName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      setUpdating(true);
      await updateProfile(currentUser, { displayName: displayName.trim() });
      toast.success('Profile updated successfully!');
      setEditingProfile(false);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          👤 Profile Settings
        </h2>

        {!editingProfile ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white truncate">
                  {currentUser?.displayName || 'Not set'}
                </p>
              </div>
              <button
                onClick={() => setEditingProfile(true)}
                className="btn-secondary shrink-0 self-start sm:self-center"
              >
                ✏️ Edit
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white break-all">
                  {currentUser?.email}
                </p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm rounded-full shrink-0 self-start sm:self-center inline-flex items-center gap-1">
                ✓ Verified
              </span>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">User ID</p>
                <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">
                  {currentUser?.uid}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label htmlFor="displayName" className="input-label">
                Full Name
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input-field"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={updating}
                className="btn-primary flex-1"
              >
                {updating ? 'Saving...' : '💾 Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingProfile(false);
                  setDisplayName(currentUser?.displayName || '');
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Appearance Settings */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          🎨 Appearance
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Dark Mode
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Switch between light and dark theme
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-9' : 'translate-x-1'
                }`}
              >
                {theme === 'dark' ? '🌙' : '☀️'}
              </span>
            </button>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Current Theme:</strong> {theme === 'dark' ? 'Dark 🌙' : 'Light ☀️'}
            </p>
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          🔒 Data & Privacy
        </h2>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Data Storage
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your data is securely stored in Firebase Cloud Firestore with end-to-end encryption.
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Privacy
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Only you can access your financial data. No one else can view your transactions.
            </p>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              ⚠️ Data Backup
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Remember to export your data regularly as a backup. Use the Export feature in the dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="card border-2 border-red-200 dark:border-red-800">
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-6">
          ⚠️ Account Actions
        </h2>

        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="w-full btn-secondary border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900"
          >
            🚪 Logout
          </button>

          <div className="p-4 bg-red-50 dark:bg-red-900 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>Note:</strong> Logging out will not delete your data. You can log back in anytime.
            </p>
          </div>
        </div>
      </div>

      {/* App Information */}
      <div className="card bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          ℹ️ About Expense Tracker
        </h2>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Built with:</strong> React + Firebase</p>
          <p><strong>Purpose:</strong> UM Internship Project</p>
          <p><strong>Developer:</strong> Full Stack JavaScript Developer</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
