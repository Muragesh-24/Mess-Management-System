"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card.jsx';
import { Table } from '../../../components/ui/table.jsx';
import { Loader2, Search, BarChart2, Users, CalendarDays, Edit2, CheckCircle, XCircle, LogOut } from 'lucide-react';
import ProtectedRoute from '../../../components/ProtectedRoute.jsx';

function MealEditModal({ meal, open, onClose, onSave }) {
  const [menuItems, setMenuItems] = useState(meal ? (Array.isArray(meal.menuItems) ? meal.menuItems.join(', ') : String(meal.menuItems || '')) : '');
  useEffect(() => {
    setMenuItems(meal ? (Array.isArray(meal.menuItems) ? meal.menuItems.join(', ') : String(meal.menuItems || '')) : '');
  }, [meal]);
  if (!open || !meal) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-blue-100">
        <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
          <Edit2 className="h-5 w-5 text-blue-400" /> Edit Menu for {meal.mealType} <span className="text-gray-500">({meal.day})</span>
        </h2>
        <textarea
          className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-200"
          rows={3}
          value={menuItems}
          onChange={e => setMenuItems(e.target.value)}
          placeholder="Comma-separated menu items"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium">Cancel</button>
          <button
            onClick={() => onSave(menuItems.split(',').map(i => i.trim()).filter(Boolean))}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >Save</button>
        </div>
      </div>
    </div>
  );
}

export default function ManagerDashboardPage() {
  return (
    <ProtectedRoute requiredRole="manager">
      {() => <ManagerDashboard />}
    </ProtectedRoute>
  );
}

function ManagerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [date, setDate] = useState('');
  const [mealType, setMealType] = useState('');
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ total: 0, today: 0, uniqueWeek: 0 });
  const [meals, setMeals] = useState([]);
  const [mealsLoading, setMealsLoading] = useState(true);
  const [editMeal, setEditMeal] = useState(null);
  const [showUnavailable, setShowUnavailable] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch('https://mess-management-system-opsl.onrender.com/api/bookings/hall/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch {}
  };

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      if (mealType) params.append('mealType', mealType);
      if (search) params.append('search', search);
      const response = await fetch(`https://mess-management-system-opsl.onrender.com/api/bookings/hall?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error((await response.json()).error || 'Failed to fetch bookings');
      }
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message || 'Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchMeals = async () => {
    setMealsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch('https://mess-management-system-opsl.onrender.com/api/meals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setMeals(data);
      }
    } finally {
      setMealsLoading(false);
    }
  };

  const updateMealAvailability = async (meal, available) => {
    const token = localStorage.getItem('token');
    await fetch(`https://mess-management-system-opsl.onrender.com/api/meals/${meal._id}/availability`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ available }),
    });
    fetchMeals();
  };

  const updateMealMenu = async (meal, menuItems) => {
    const token = localStorage.getItem('token');
    await fetch(`https://mess-management-system-opsl.onrender.com/api/meals/${meal._id}/menu`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ menuItems }),
    });
    setEditMeal(null);
    fetchMeals();
  };

  useEffect(() => {
    fetchBookings();
    fetchStats();
    fetchMeals();
    // eslint-disable-next-line
  }, [router]);

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, [date, mealType, search]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-2 md:px-6 py-8">
      {/* Top Bar with Logout */}
      <div className="w-full max-w-6xl flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold shadow hover:bg-red-200 transition"
          title="Logout"
        >
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </div>
      {/* Stats Section */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-blue-100 hover:shadow-xl transition-shadow">
          <BarChart2 className="h-10 w-10 text-blue-500" />
          <div>
            <div className="text-3xl font-extrabold text-blue-700">{stats.total}</div>
            <div className="text-gray-500 text-base">Total Bookings</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-green-100 hover:shadow-xl transition-shadow">
          <CalendarDays className="h-10 w-10 text-green-500" />
          <div>
            <div className="text-3xl font-extrabold text-green-700">{stats.today}</div>
            <div className="text-gray-500 text-base">Today's Bookings</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-purple-100 hover:shadow-xl transition-shadow">
          <Users className="h-10 w-10 text-purple-500" />
          <div>
            <div className="text-3xl font-extrabold text-purple-700">{stats.uniqueWeek}</div>
            <div className="text-gray-500 text-base">Unique Students (This Week)</div>
          </div>
        </div>
      </div>
      {/* Filter/Search Bar */}
      <Card className="w-full max-w-6xl mb-8 border-0 shadow-md bg-white/80 backdrop-blur">
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-end gap-6 mb-2">
            <div className="flex flex-col flex-1 min-w-[150px]">
              <label className="text-sm font-semibold mb-1 text-blue-700">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[150px]">
              <label className="text-sm font-semibold mb-1 text-blue-700">Meal Type</label>
              <select
                value={mealType}
                onChange={e => setMealType(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
              >
                <option value="">All</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
            <div className="flex flex-col flex-1 min-w-[200px]">
              <label className="text-sm font-semibold mb-1 text-blue-700">Search Student</label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Name or Roll Number"
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 pr-10 shadow-sm"
                />
                <Search className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Bookings Table Section */}
      <Card className="w-full max-w-6xl mb-8 border-0 shadow-lg bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-800">Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2">Loading bookings...</span>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center py-4">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="text-gray-600 text-center py-4">No bookings found for your hall.</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-blue-100">
              <Table>
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-blue-700">User</th>
                    <th className="px-4 py-2 text-left font-semibold text-blue-700">Meal</th>
                    <th className="px-4 py-2 text-left font-semibold text-blue-700">Date</th>
                    <th className="px-4 py-2 text-left font-semibold text-blue-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-2">{booking.userId?.name || 'N/A'}</td>
                      <td className="px-4 py-2 capitalize">{booking.mealId?.mealType || booking.mealType}</td>
                      <td className="px-4 py-2">{new Date(booking.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${booking.status === 'booked' ? 'bg-blue-100 text-blue-700' : booking.status === 'consumed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{booking.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Meal Management Section */}
      <Card className="w-full max-w-6xl shadow-xl mt-4 border-0 bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-800 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" /> Meal Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showUnavailable}
                onChange={e => setShowUnavailable(e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Show Unavailable Meals</span>
            </label>
          </div>
          {mealsLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2">Loading meals...</span>
            </div>
          ) : meals.length === 0 ? (
            <div className="text-gray-600 text-center py-4">No meals found for your hall.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {meals
                .filter(meal => showUnavailable || meal.available)
                .map(meal => (
                  <div key={meal._id} className={`bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3 border-2 transition-all ${meal.available ? 'border-green-200 hover:border-green-400' : 'border-red-200 hover:border-red-400'}`}>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-lg capitalize text-blue-800">{meal.mealType} <span className="text-gray-500 text-sm">({meal.day})</span></div>
                      <button onClick={() => setEditMeal(meal)} className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors" title="Edit Menu">
                        <Edit2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="text-gray-700 text-sm mb-2">Menu: <span className="font-medium text-gray-900">{Array.isArray(meal.menuItems) ? meal.menuItems.join(', ') : String(meal.menuItems || '')}</span></div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${meal.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {meal.available ? <CheckCircle className="h-4 w-4 mr-1" /> : <XCircle className="h-4 w-4 mr-1" />}
                        {meal.available ? 'Available' : 'Unavailable'}
                      </span>
                      <button
                        onClick={() => updateMealAvailability(meal, !meal.available)}
                        className={`ml-2 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${meal.available ? 'bg-red-200 text-red-800 hover:bg-red-300' : 'bg-green-200 text-green-800 hover:bg-green-300'}`}
                      >
                        {meal.available ? 'Mark Unavailable' : 'Mark Available'}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
      <MealEditModal
        meal={editMeal}
        open={!!editMeal}
        onClose={() => setEditMeal(null)}
        onSave={menuItems => updateMealMenu(editMeal, menuItems)}
      />
    </div>
  );
} 