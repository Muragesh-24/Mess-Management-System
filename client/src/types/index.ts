export interface User {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  branch: string;
  hostelRoom?: string;
  phoneNumber?: string;
  walletBalance: number;
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner';
  description: string;
  price: number;
  image: string;
  available: boolean;
  hall: string;
}

export interface Booking {
  id: string;
  userId: string;
  mealId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  status: 'confirmed' | 'cancelled';
  bookedAt: string;
  meal: Meal;
  hall: string;
}

export interface MenuDay {
  date: string;
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
}

export interface Hall {
  id: string;
  name: string;
  displayName: string;
}

export interface AppSettings {
  darkMode: boolean;
}