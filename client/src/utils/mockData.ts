import { User, Meal, Booking, MenuDay, Hall } from '../types';

// Store for created user profiles
export const userProfiles: { [rollNo: string]: User } = {
  '240670': {
    id: 'user-1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    rollNo: '240670',
    branch: 'Computer Science',
    hostelRoom: 'H3-204',
    phoneNumber: '+91 9876543210',
    walletBalance: 1500.00
  }
};

// Store for user bookings
export const userBookings: { [userId: string]: Booking[] } = {};

export const currentUser: User = userProfiles['240670'];

export const halls: Hall[] = [
  { id: 'hall-1', name: 'hall1', displayName: 'Hall 1' },
  { id: 'hall-2', name: 'hall2', displayName: 'Hall 2' },
  { id: 'hall-4', name: 'hall4', displayName: 'Hall 4' },
  { id: 'hall-13', name: 'hall13', displayName: 'Hall 13' }
];

export const meals: Meal[] = [
  // Hall 1 Meals
  {
    id: 'meal-h1-1',
    name: 'Continental Breakfast',
    type: 'breakfast',
    description: 'Fresh bread, butter, jam, fruits, and coffee',
    price: 99,
    image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    hall: 'hall1'
  },
  {
    id: 'meal-h1-2',
    name: 'Chicken Biryani',
    type: 'lunch',
    description: 'Aromatic basmati rice with tender chicken and spices',
    price: 199,
    image: 'https://images.pexels.com/photos/6210959/pexels-photo-6210959.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    hall: 'hall1'
  },
  {
    id: 'meal-h1-3',
    name: 'Grilled Salmon',
    type: 'dinner',
    description: 'Fresh salmon with vegetables and quinoa',
    price: 299,
    image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    hall: 'hall1'
  },
  
  // Hall 2 Meals
  {
    id: 'meal-h2-1',
    name: 'Indian Breakfast',
    type: 'breakfast',
    description: 'Idli, sambar, chutney, and filter coffee',
    price: 79,
    image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    hall: 'hall2'
  },
  {
    id: 'meal-h2-2',
    name: 'Vegetarian Thali',
    type: 'lunch',
    description: 'Complete Indian meal with dal, vegetables, rice, and roti',
    price: 149,
    image: 'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    hall: 'hall2'
  },
  {
    id: 'meal-h2-3',
    name: 'Pasta Primavera',
    type: 'dinner',
    description: 'Fresh pasta with seasonal vegetables and herbs',
    price: 179,
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    hall: 'hall2'
  },

  // Hall 4 Meals
  {
    id: 'meal-h4-1',
    name: 'Pancakes & Syrup',
    type: 'breakfast',
    description: 'Fluffy pancakes with maple syrup and fresh berries',
    price: 109,
    image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    hall: 'hall4'
  },
  {
    id: 'meal-h4-2',
    name: 'Mutton Curry',
    type: 'lunch',
    description: 'Spicy mutton curry with basmati rice and naan',
    price: 229,
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    hall: 'hall4'
  },
  {
    id: 'meal-h4-3',
    name: 'BBQ Chicken',
    type: 'dinner',
    description: 'Grilled BBQ chicken with mashed potatoes and coleslaw',
    price: 219,
    image: 'https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    hall: 'hall4'
  },

  // Hall 13 Meals
  {
    id: 'meal-h13-1',
    name: 'Omelette & Toast',
    type: 'breakfast',
    description: 'Cheese omelette with buttered toast and orange juice',
    price: 89,
    image: 'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    hall: 'hall13'
  },
  {
    id: 'meal-h13-2',
    name: 'Fish Curry',
    type: 'lunch',
    description: 'Bengali fish curry with steamed rice and vegetables',
    price: 179,
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    hall: 'hall13'
  },
  {
    id: 'meal-h13-3',
    name: 'Vegetable Stir Fry',
    type: 'dinner',
    description: 'Mixed vegetables stir-fried with tofu and brown rice',
    price: 159,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    hall: 'hall13'
  }
];

export const generateWeekMenu = (): MenuDay[] => {
  const days = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    days.push({
      date: date.toISOString().split('T')[0],
      breakfast: meals.filter(m => m.type === 'breakfast'),
      lunch: meals.filter(m => m.type === 'lunch'),
      dinner: meals.filter(m => m.type === 'dinner')
    });
  }
  
  return days;
};

export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    userId: 'user-1',
    mealId: 'meal-h1-1',
    date: new Date().toISOString().split('T')[0],
    mealType: 'breakfast',
    status: 'confirmed',
    bookedAt: new Date().toISOString(),
    meal: meals[0],
    hall: 'hall1'
  }
];

// Helper functions for user management
export const createUser = (rollNo: string, password: string, name: string): User => {
  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email: `${rollNo.toLowerCase()}@college.edu`,
    rollNo,
    branch: 'Not specified',
    hostelRoom: '',
    phoneNumber: '',
    walletBalance: 1000.00 // Starting balance for new users
  };
  
  userProfiles[rollNo] = newUser;
  userBookings[newUser.id] = [];
  
  return newUser;
};

export const authenticateUser = (rollNo: string, password: string): User | null => {
  // In a real app, you would verify the password against a hashed version
  // For demo purposes, we'll just check if the user exists
  return userProfiles[rollNo] || null;
};

export const updateUserProfile = (rollNo: string, updatedUser: User): void => {
  if (userProfiles[rollNo]) {
    userProfiles[rollNo] = updatedUser;
  }
};

export const getUserBookings = (userId: string): Booking[] => {
  return userBookings[userId] || [];
};

export const addUserBooking = (userId: string, booking: Booking): void => {
  if (!userBookings[userId]) {
    userBookings[userId] = [];
  }
  userBookings[userId].push(booking);
};

export const updateUserBooking = (userId: string, bookingId: string, updates: Partial<Booking>): void => {
  if (userBookings[userId]) {
    const index = userBookings[userId].findIndex(b => b.id === bookingId);
    if (index !== -1) {
      userBookings[userId][index] = { ...userBookings[userId][index], ...updates };
    }
  }
};