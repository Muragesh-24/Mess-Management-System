import React, { useState } from 'react';
import { CreditCard, Plus, TrendingDown, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { User, Booking } from '../types';

interface WalletProps {
  user: User;
  bookings: Booking[];
  onAddMoney: (amount: number) => void;
}

export const Wallet: React.FC<WalletProps> = ({ user, bookings, onAddMoney }) => {
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState('');

  const handleAddMoney = () => {
    const value = parseFloat(amount);
    if (value > 0) {
      onAddMoney(value);
      setAmount('');
      setShowAddMoney(false);
    }
  };

  const totalSpent = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.meal.price, 0);

  const recentTransactions = bookings
    .filter(b => b.status === 'confirmed')
    .sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime())
    .slice(0, 10);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet</h1>
        <p className="text-gray-600">Manage your meal booking payments and balance.</p>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium mb-2">Current Balance</p>
            <p className="text-4xl font-bold">₹{user.walletBalance.toFixed(2)}</p>
            <p className="text-green-100 text-sm mt-2">Available for meal bookings</p>
          </div>
          <div className="p-4 bg-white bg-opacity-20 rounded-full">
            <CreditCard className="w-8 h-8" />
          </div>
        </div>
        
        <button
          onClick={() => setShowAddMoney(true)}
          className="mt-6 bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Money</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalSpent.toFixed(2)}</p>
              <p className="text-gray-400 text-sm mt-1">This month</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{bookings.filter(b => b.status === 'confirmed').length}</p>
              <p className="text-gray-400 text-sm mt-1">Confirmed meals</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Recent Transactions
        </h2>

        {recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {recentTransactions.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{booking.meal.name}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(booking.bookedAt)} • {booking.mealType.charAt(0).toUpperCase() + booking.mealType.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">-₹{booking.meal.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Meal booking</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No transactions yet</p>
            <p className="text-gray-400 text-sm mt-1">Your meal bookings will appear here</p>
          </div>
        )}
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Money to Wallet</h3>
            
            <div className="mb-6">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter amount"
                  min="1"
                  step="0.01"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddMoney(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMoney}
                disabled={!amount || parseFloat(amount) <= 0}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Money
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};