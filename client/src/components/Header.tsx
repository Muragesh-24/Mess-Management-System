import React, { useState } from 'react';
import { User, Calendar, Menu, Settings, LogOut, Wallet, History } from 'lucide-react';
import { Profile } from './Profile';
import { WeeklyMenu } from './WeeklyMenu';
import { Settings as SettingsModal } from './Settings';
import { CompleteProfile } from './CompleteProfile';
import { User as UserType, MenuDay, AppSettings } from '../types';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  user: UserType;
  weekMenu: MenuDay[];
  onLogout: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  onUpdateProfile: (user: UserType) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onViewChange, 
  user, 
  weekMenu, 
  onLogout,
  settings,
  onSettingsChange,
  onUpdateProfile
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showWeeklyMenu, setShowWeeklyMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Calendar },
    { id: 'booking', name: 'Book Meals', icon: Menu },
    { id: 'wallet', name: 'Wallet', icon: Wallet },
    { id: 'history', name: 'History', icon: History },
  ];

  return (
    <>
      <header className={`shadow-lg border-b border-gray-200 ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Menu className="w-6 h-6 text-white" />
                </div>
                <h1 className={`text-xl font-bold ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>MessBook</h1>
              </div>
              
              <nav className="hidden md:flex space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onViewChange(item.id)}
                      className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                        currentView === item.id
                          ? 'bg-orange-100 text-orange-700 font-medium'
                          : settings.darkMode
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <p className={`text-sm font-medium ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
                  <p className={`text-xs ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.hostelRoom}</p>
                </div>
                <button
                  onClick={() => setShowProfile(true)}
                  className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <User className="w-4 h-4 text-white" />
                </button>
              </div>
              
              <button 
                onClick={() => setShowWeeklyMenu(true)}
                className={`p-2 transition-colors ${
                  settings.darkMode 
                    ? 'text-gray-400 hover:text-gray-200' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="View This Week's Menu"
              >
                <Calendar className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowSettings(true)}
                className={`p-2 transition-colors ${
                  settings.darkMode 
                    ? 'text-gray-400 hover:text-gray-200' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={onLogout}
                className={`p-2 transition-colors ${
                  settings.darkMode 
                    ? 'text-gray-400 hover:text-red-400' 
                    : 'text-gray-400 hover:text-red-600'
                }`}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden border-t ${settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex justify-around py-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-200 ${
                    currentView === item.id
                      ? 'text-orange-700 bg-orange-50'
                      : settings.darkMode
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {showProfile && (
        <Profile user={user} onClose={() => setShowProfile(false)} />
      )}

      {showWeeklyMenu && (
        <WeeklyMenu weekMenu={weekMenu} onClose={() => setShowWeeklyMenu(false)} />
      )}

      {showSettings && (
        <SettingsModal 
          onClose={() => setShowSettings(false)}
          settings={settings}
          onSettingsChange={onSettingsChange}
          onCompleteProfile={() => {
            setShowSettings(false);
            setShowCompleteProfile(true);
          }}
        />
      )}

      {showCompleteProfile && (
        <CompleteProfile
          user={user}
          onClose={() => setShowCompleteProfile(false)}
          onUpdateProfile={onUpdateProfile}
        />
      )}
    </>
  );
};