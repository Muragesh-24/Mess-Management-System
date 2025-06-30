import React, { useState } from 'react';
import { Calendar, Coffee, Utensils, Moon, Building, X } from 'lucide-react';
import { MenuDay, Hall } from '../types';
import { halls } from '../utils/mockData';

interface WeeklyMenuProps {
  weekMenu: MenuDay[];
  onClose: () => void;
}

export const WeeklyMenu: React.FC<WeeklyMenuProps> = ({ weekMenu, onClose }) => {
  const [selectedHall, setSelectedHall] = useState<string>('');
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');

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

  const getFilteredMeals = () => {
    return weekMenu.map(day => ({
      ...day,
      [selectedMealType]: day[selectedMealType].filter(meal => 
        !selectedHall || meal.hall === selectedHall
      )
    }));
  };

  const filteredMenu = getFilteredMeals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Weekly Menu</h2>
              <p className="text-orange-100">View meals for the entire week</p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Hall (Optional)</label>
              <div className="flex flex-wrap gap-2">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Meal Type</label>
              <div className="flex space-x-2">
                {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
                  const Icon = getMealIcon(mealType);
                  return (
                    <button
                      key={mealType}
                      onClick={() => setSelectedMealType(mealType)}
                      className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                        selectedMealType === mealType
                          ? `bg-gradient-to-r ${getMealTypeColor(mealType)} text-white`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="capitalize">{mealType}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {filteredMenu.map((day) => (
              <div key={day.date} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-center">
                  {formatDate(day.date)}
                </h3>
                
                <div className="space-y-3">
                  {day[selectedMealType].map((meal) => (
                    <div key={meal.id} className="bg-white rounded-lg p-3 shadow-sm">
                      <img 
                        src={meal.image} 
                        alt={meal.name}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                      <h4 className="font-medium text-sm text-gray-900 mb-1">{meal.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-600">₹{meal.price}</span>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Building className="w-3 h-3" />
                          <span>{halls.find(h => h.name === meal.hall)?.displayName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {day[selectedMealType].length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No meals available
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};