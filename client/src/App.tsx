import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { MealBooking } from './components/MealBooking';
import { Wallet } from './components/Wallet';
import { BookingHistory } from './components/BookingHistory';
import { WeeklyMenu } from './components/WeeklyMenu';
import { 
  generateWeekMenu, 
  createUser, 
  authenticateUser, 
  updateUserProfile,
  getUserBookings,
  addUserBooking,
  updateUserBooking,
  userProfiles
} from './utils/mockData';
import { Booking, User, AppSettings } from './types';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<AppSettings>({ darkMode: false });
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const weekMenu = generateWeekMenu();

  // Load user data when logged in
  useEffect(() => {
    if (user) {
      const userBookings = getUserBookings(user.id);
      setBookings(userBookings);
    }
  }, [user]);

  const handleLogin = (rollNo: string, password: string) => {
    const authenticatedUser = authenticateUser(rollNo, password);
    if (authenticatedUser) {
      setUser(authenticatedUser);
      setIsLoggedIn(true);
      // Load user's bookings
      const userBookings = getUserBookings(authenticatedUser.id);
      setBookings(userBookings);
    } else {
      alert('Invalid credentials. Please check your roll number and password.');
    }
  };

  const handleSignup = (rollNo: string, password: string, name: string) => {
    // Check if user already exists
    if (userProfiles[rollNo]) {
      alert('User with this roll number already exists. Please login instead.');
      return;
    }
    
    const newUser = createUser(rollNo, password, name);
    console.log('User created:', newUser);
    // Success message will be shown by the Login component
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('dashboard');
    setUser(null);
    setBookings([]);
  };

  const handleBookMeal = (mealId: string, date: string, mealType: string) => {
    if (!user) return;

    const meal = weekMenu
      .find(day => day.date === date)
      ?.[mealType as keyof typeof weekMenu[0]]
      ?.find(m => m.id === mealId);

    if (meal) {
      // Check if user has sufficient balance
      if (user.walletBalance < meal.price) {
        alert('Insufficient wallet balance. Please add money to your wallet.');
        return;
      }

      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        userId: user.id,
        mealId,
        date,
        mealType: mealType as 'breakfast' | 'lunch' | 'dinner',
        status: 'confirmed',
        bookedAt: new Date().toISOString(),
        meal,
        hall: meal.hall
      };

      // Update local state
      setBookings(prev => [...prev, newBooking]);
      
      // Update user wallet balance
      const updatedUser = {
        ...user,
        walletBalance: user.walletBalance - meal.price
      };
      setUser(updatedUser);
      
      // Persist to mock database
      addUserBooking(user.id, newBooking);
      updateUserProfile(user.rollNo, updatedUser);

      // Show success message
      setShowBookingSuccess(true);
      setTimeout(() => setShowBookingSuccess(false), 3000);
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (!user) return;

    const booking = bookings.find(b => b.id === bookingId);
    if (booking && booking.status === 'confirmed') {
      // Update local state
      setBookings(prev => 
        prev.map(b => 
          b.id === bookingId 
            ? { ...b, status: 'cancelled' as const }
            : b
        )
      );
      
      // Refund money to wallet
      const updatedUser = {
        ...user,
        walletBalance: user.walletBalance + booking.meal.price
      };
      setUser(updatedUser);
      
      // Persist changes
      updateUserBooking(user.id, bookingId, { status: 'cancelled' });
      updateUserProfile(user.rollNo, updatedUser);
    }
  };

  const handleAddMoney = (amount: number) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      walletBalance: user.walletBalance + amount
    };
    setUser(updatedUser);
    
    // Persist to mock database
    updateUserProfile(user.rollNo, updatedUser);
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
    updateUserProfile(updatedUser.rollNo, updatedUser);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    if (!user) return null;

    switch (currentView) {
      case 'dashboard':
        return <Dashboard bookings={bookings} user={user} onViewChange={handleViewChange} />;
      case 'booking':
        return (
          <MealBooking 
            weekMenu={weekMenu}
            bookings={bookings}
            onBookMeal={handleBookMeal}
            onCancelBooking={handleCancelBooking}
            userWalletBalance={user.walletBalance}
            autoSelectNextDate={true}
          />
        );
      case 'wallet':
        return (
          <Wallet 
            user={user}
            bookings={bookings}
            onAddMoney={handleAddMoney}
          />
        );
      case 'history':
        return (
          <BookingHistory 
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
          />
        );
      case 'weekly-menu':
        return (
          <WeeklyMenu 
            weekMenu={weekMenu}
            onClose={() => setCurrentView('dashboard')}
          />
        );
      default:
        return <Dashboard bookings={bookings} user={user} onViewChange={handleViewChange} />;
    }
  };

  if (!isLoggedIn || !user) {
    return <Login onLogin={handleLogin} onSignup={handleSignup} />;
  }

  return (
    <div className={`min-h-screen ${settings.darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header 
        currentView={currentView}
        onViewChange={handleViewChange}
        user={user}
        weekMenu={weekMenu}
        onLogout={handleLogout}
        settings={settings}
        onSettingsChange={setSettings}
        onUpdateProfile={handleUpdateProfile}
      />
      {renderCurrentView()}
      
      {/* Booking Success Message */}
      {showBookingSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          <p className="font-medium">✅ Your meal has been booked successfully!</p>
        </div>
      )}
    </div>
  );
}

export default App;