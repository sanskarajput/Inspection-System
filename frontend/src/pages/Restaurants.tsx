import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Restaurant } from '../types';
import { Plus, Building2, LogOut } from 'lucide-react';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const data = await api.restaurants.list();
      setRestaurants(data?.restaurants);
    } catch (err) {
      setError('Failed to load restaurants');
    }
  };

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestaurantName.trim()) return;

    setLoading(true);
    setError('');
    try {
      await api.restaurants.create(newRestaurantName);
      setNewRestaurantName('');
      loadRestaurants();
    } catch (err) {
      setError('Failed to create restaurant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Restaurant Inspection System</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create New Restaurant</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleCreateRestaurant} className="flex gap-4">
            <input
              type="text"
              placeholder="Restaurant Name"
              value={newRestaurantName}
              onChange={(e) => setNewRestaurantName(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              <Plus size={18} />
              Create
            </button>
          </form>
        </div>

        <h2 className="text-lg font-semibold mb-4">Your Restaurants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="text-blue-600" size={24} />
                  <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Created: {new Date(restaurant.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white p-6 rounded-lg shadow text-center">
              <Building2 className="mx-auto text-blue-600" size={48} />
              <p className="mt-4 text-gray-600">No restaurants yet. Create your first restaurant above.</p>
            </div>
          )}
        </div>

        {restaurants.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No restaurants yet. Create your first restaurant above.
          </div>
        )}
      </div>
    </div>
  );
}
