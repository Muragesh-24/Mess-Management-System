import React from 'react';
import { Calendar, Clock, CheckCircle, TrendingUp, Coffee, Utensils, Moon, Wallet } from 'lucide-react';
import { Booking, User } from '../types';

interface DashboardProps {
  bookings: Booking[];
  user: User;
  onViewChange: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ bookings, user, onViewChange }) => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split('T')[0];

  const todayBookings = bookings.filter(b => b.date === today && b.status === 'confirmed');
  const thisWeekBookings = bookings.filter(b => {
    const bookingDate = new Date(b.date);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    return bookingDate >= weekStart && b.status === 'confirmed';
  });

  const stats = [
    {
      name: "Today's Bookings",
      value: todayBookings.length,
      icon: Calendar,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      name: 'This Week',
      value: thisWeekBookings.length,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      name: 'Wallet Balance',
      value: `₹${user.walletBalance.toFixed(2)}`,
      icon: Wallet,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
  ];

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return Coffee;
      case 'lunch': return Utensils;
      case 'dinner': return Moon;
      default: return Utensils;
    }
  };

  const getMealTime = (type: string) => {
    switch (type) {
      case 'breakfast': return '7:00 - 9:00 AM';
      case 'lunch': return '12:00 - 2:00 PM';
      case 'dinner': return '7:00 - 9:00 PM';
      default: return '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}! Here's your meal booking overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className={`${stat.bgColor} rounded-xl p-6 transition-transform hover:scale-105`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${stat.textColor} mb-1`}>{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Meals */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Today's Meals</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          
          {todayBookings.length > 0 ? (
            <div className="space-y-4">
              {todayBookings.map((booking) => {
                const MealIcon = getMealIcon(booking.mealType);
                return (
                  <div key={booking.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <MealIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{booking.meal.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span className="capitalize">{booking.mealType}</span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {getMealTime(booking.mealType)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{booking.meal.price}</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No meals booked for today</p>
              <p className="text-sm text-gray-400 mt-1">Book your meals to see them here</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            <button 
              onClick={() => onViewChange('booking')}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
            >
              <div className="flex items-center space-x-3">
                <Utensils className="w-5 h-5" />
                <span className="font-medium">Book Your Next Meal</span>
              </div>
              <span className="text-orange-200">→</span>
            </button>
            
            <button 
              onClick={() => onViewChange('wallet')}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-200 transform hover:scale-105"
            >
              <div className="flex items-center space-x-3">
                <Wallet className="w-5 h-5" />
                <span className="font-medium">Add Money to Wallet</span>
              </div>
              <span className="text-green-200">→</span>
            </button>
            
            <button 
              onClick={() => onViewChange('weekly-menu')}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
            >
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">View Weekly Menu</span>
              </div>
              <span className="text-purple-200">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};