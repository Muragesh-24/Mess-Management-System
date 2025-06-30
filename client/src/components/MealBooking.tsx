import React, { useState, useEffect } from 'react';
import { Calendar, Coffee, Utensils, Moon, Plus, Check, Clock, Star, Building } from 'lucide-react';
import { MenuDay, Booking, Hall } from '../types';
import { halls } from '../utils/mockData';

interface MealBookingProps {
  weekMenu: MenuDay[];
  bookings: Booking[];
  onBookMeal: (mealId: string, date: string, mealType: string) => void;
  onCancelBooking: (bookingId: string) => void;
  userWalletBalance: number;
  autoSelectNextDate?: boolean;
}

export const MealBooking: React.FC<MealBookingProps> = ({ 
  weekMenu, 
  bookings, 
  onBookMeal, 
  onCancelBooking,
  userWalletBalance,
  autoSelectNextDate = false
}) => {
  const getNextMealDate = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState(
    autoSelectNextDate ? getNextMealDate() : (weekMenu[0]?.date || '')
  );
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');
  const [selectedHall, setSelectedHall] = useState<string>('');

  useEffect(() => {
    if (autoSelectNextDate) {
      setSelectedDate(getNextMealDate());
    }
  }, [autoSelectNextDate]);

  const selectedDay = weekMenu.find(day => day.date === selectedDate);
  let selectedMeals = selectedDay ? selectedDay[selectedMealType] : [];

  // Filter by hall if selected
  if (selectedHall) {
    selectedMeals = selectedMeals.filter(meal => meal.hall === selectedHall);
  }

  const isBooked = (mealId: string, date: string, mealType: string) => {
    return bookings.some(b => 
      b.mealId === mealId && 
      b.date === date && 
      b.mealType === mealType && 
      b.status === 'confirmed'
    );
  };

  const getBooking = (mealId: string, date: string, mealType: string) => {
    return bookings.find(b => 
      b.mealId === mealId && 
      b.date === date && 
      b.mealType === mealType && 
      b.status === 'confirmed'
    );
  };

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return Coffee;
      case 'lunch': return Utensils;
      case 'dinner': return Moon;
      default: return Utensils;
    }
  };

  const getMealTypeColor = (type: string) => {
    switch (type) {
      case 'breakfast': return 'from-yellow-500 to-orange-500';
      case 'lunch': return 'from-green-500 to-teal-500';
      case 'dinner': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const canAfford = (price: number) => {
    return userWalletBalance >= price;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Meals</h1>
        <p className="text-gray-600">Select your preferred meals for the week ahead.</p>
        <div className="mt-2 flex items-center space-x-2">
          <span className="text-sm text-gray-500">Wallet Balance:</span>
          <span className="text-lg font-semibold text-green-600">₹{userWalletBalance.toFixed(2)}</span>
        </div>
      </div>

      {/* Date Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Select Date
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weekMenu.map((day) => {
            const isToday = day.date === new Date().toISOString().split('T')[0];
            const isSelected = day.date === selectedDate;
            
            return (
              <button
                key={day.date}
                onClick={() => setSelectedDate(day.date)}
                className={`p-3 rounded-lg text-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-orange-500 text-white transform scale-105'
                    : isToday
                    ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <p className="text-sm font-medium">{formatDate(day.date)}</p>
                {isToday && <p className="text-xs mt-1 opacity-75">Today</p>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hall Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Building className="w-5 h-5 mr-2" />
          Select Hall (Optional)
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedHall('')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedHall === ''
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Halls
          </button>
          {halls.map((hall) => (
            <button
              key={hall.id}
              onClick={() => setSelectedHall(hall.name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                selectedHall === hall.name
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>{hall.displayName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Meal Type Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Meal Type</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
            const Icon = getMealIcon(mealType);
            const isSelected = mealType === selectedMealType;
            
            return (
              <button
                key={mealType}
                onClick={() => setSelectedMealType(mealType)}
                className={`p-4 rounded-lg flex items-center space-x-3 transition-all duration-200 ${
                  isSelected
                    ? `bg-gradient-to-r ${getMealTypeColor(mealType)} text-white transform scale-105`
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-6 h-6" />
                <div className="text-left">
                  <p className="font-medium capitalize">{mealType}</p>
                  <p className={`text-sm ${isSelected ? 'text-white opacity-75' : 'text-gray-500'}`}>
                    {mealType === 'breakfast' ? '7:00 - 9:00 AM' :
                     mealType === 'lunch' ? '12:00 - 2:00 PM' :
                     '7:00 - 9:00 PM'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Meal Options */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Utensils className="w-5 h-5 mr-2" />
          Available {selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)} Options
          {selectedHall && (
            <span className="ml-2 text-sm text-gray-500">
              - {halls.find(h => h.name === selectedHall)?.displayName}
            </span>
          )}
        </h2>

        {selectedMeals.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectedMeals.map((meal) => {
              const booked = isBooked(meal.id, selectedDate, selectedMealType);
              const booking = getBooking(meal.id, selectedDate, selectedMealType);
              const affordable = canAfford(meal.price);
              
              return (
                <div key={meal.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="aspect-w-16 aspect-h-9">
                    <img 
                      src={meal.image} 
                      alt={meal.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{meal.name}</h3>
                        <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                          <Building className="w-4 h-4" />
                          <span>{halls.find(h => h.name === meal.hall)?.displayName}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm text-gray-600">4.5</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{meal.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold text-gray-900">₹{meal.price}</span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Available</span>
                        </div>
                      </div>
                      
                      {booked ? (
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <Check className="w-4 h-4 mr-1" />
                            Booked
                          </span>
                          <button
                            onClick={() => booking && onCancelBooking(booking.id)}
                            className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onBookMeal(meal.id, selectedDate, selectedMealType)}
                          disabled={!affordable}
                          className={`inline-flex items-center px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                            affordable
                              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {affordable ? 'Book Now' : 'Insufficient Balance'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No meals available for this selection</p>
            <p className="text-gray-400 mt-2">Please try a different date, meal type, or hall</p>
          </div>
        )}
      </div>
    </div>
  );
};