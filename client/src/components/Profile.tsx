import React from 'react';
import { User, Mail, Phone, Home, GraduationCap, CreditCard, X } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileProps {
  user: UserType;
  onClose: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-blue-100 mt-1">Student Profile</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <GraduationCap className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">Roll Number</p>
              <p className="font-medium text-gray-900">{user.rollNo}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <GraduationCap className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">Branch</p>
              <p className="font-medium text-gray-900">{user.branch}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
          </div>

          {user.hostelRoom && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Home className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">Hostel Room</p>
                <p className="font-medium text-gray-900">{user.hostelRoom}</p>
              </div>
            </div>
          )}

          {user.phoneNumber && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-900">{user.phoneNumber}</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <CreditCard className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-green-600">Wallet Balance</p>
              <p className="font-bold text-green-700 text-lg">${user.walletBalance.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};