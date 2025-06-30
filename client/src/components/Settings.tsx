import React from 'react';
import { X, Moon, Sun, User, Edit } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsProps {
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  onCompleteProfile: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  onClose, 
  settings, 
  onSettingsChange, 
  onCompleteProfile 
}) => {
  const toggleDarkMode = () => {
    onSettingsChange({
      ...settings,
      darkMode: !settings.darkMode
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold">Settings</h2>
            <p className="text-gray-200 mt-1">Customize your experience</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {settings.darkMode ? (
                <Moon className="w-5 h-5 text-gray-600" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
              )}
              <div>
                <p className="font-medium text-gray-900">Dark Mode</p>
                <p className="text-sm text-gray-500">Toggle dark theme</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.darkMode ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Complete Profile */}
          <button
            onClick={onCompleteProfile}
            className="w-full flex items-center justify-between p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Edit className="w-5 h-5 text-orange-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Complete Profile</p>
                <p className="text-sm text-gray-500">Add more details to your profile</p>
              </div>
            </div>
            <span className="text-orange-600">→</span>
          </button>

          {/* App Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">About MessBook</h3>
            <p className="text-sm text-gray-600">
              Version 1.0.0 - Hostel Mess Booking System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};