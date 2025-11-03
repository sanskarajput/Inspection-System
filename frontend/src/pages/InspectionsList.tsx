import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Restaurant, Inspection } from '../types';
import { ArrowLeft, FileText, Calendar } from 'lucide-react';

export default function InspectionsList() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      const [restaurantData, inspectionsData] = await Promise.all([
        api.restaurants.getById(id!),
        api.inspections.list(id!),
      ]);
      setRestaurant(restaurantData?.restaurant);
      setInspections(inspectionsData?.inspections);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(`/restaurant/${id}`)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">{restaurant?.name} - Inspections</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {inspections.map((inspection) => (
            <div
              key={inspection._id}
              onClick={() => navigate(`/restaurant/${id}/inspection/${inspection._id}`)}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-600" size={24} />
                  <div>
                    <h3 className="font-semibold text-lg">{inspection.title}</h3>
                    <p className="text-sm text-gray-500">
                      {inspection.sections.length} sections
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    inspection.status
                  )}`}
                >
                  {inspection.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  Created: {new Date(inspection.createdAt).toLocaleDateString()}
                </div>
                {inspection.sentAt && (
                  <div className="flex items-center gap-2">
                    Sent: {new Date(inspection.sentAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              {inspection.sentTo && inspection.sentTo.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  Sent to: {inspection.sentTo.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>

        {inspections.length === 0 && (
          <div className="text-center text-gray-500 py-12 bg-white rounded-lg">
            No inspections yet. Create your first inspection form.
          </div>
        )}
      </div>
    </div>
  );
}
