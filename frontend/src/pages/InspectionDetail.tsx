import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Restaurant, Inspection } from '../types';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

export default function InspectionDetail() {
  const { id, inspectionId } = useParams<{ id: string; inspectionId: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id && inspectionId) {
      loadData();
    }
  }, [id, inspectionId]);

  const loadData = async () => {
    try {
      const [restaurantData, inspectionData] = await Promise.all([
        api.restaurants.getById(id!),
        api.inspections.getById(id!, inspectionId!),
      ]);
      setRestaurant(restaurantData.restaurant);
      setInspection(inspectionData.inspection);
    } catch (err) {
      setError('Failed to load inspection details');
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

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'yes_no':
        return 'Yes/No';
      case 'number':
        return 'Number';
      case 'text':
        return 'Text';
      case 'rating':
        return 'Rating';
      default:
        return type;
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!inspection) {
    return <div className="p-8">Inspection not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(`/restaurant/${id}/inspections`)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">{restaurant?.name} - Inspection Details</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{inspection.title}</h2>
              <p className="text-gray-600">
                Created: {new Date(inspection.createdAt).toLocaleString()}
              </p>
              {inspection.sentAt && (
                <p className="text-gray-600">
                  Sent: {new Date(inspection.sentAt).toLocaleString()}
                </p>
              )}
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                inspection.status
              )}`}
            >
              {inspection.status.toUpperCase()}
            </span>
          </div>

          {inspection.whatsappFlowId && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>WhatsApp Flow ID:</strong> {inspection.whatsappFlowId}
              </p>
            </div>
          )}

          {inspection.sentTo && inspection.sentTo.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Sent To:</h3>
              <div className="flex flex-wrap gap-2">
                {inspection.sentTo.map((phone, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {phone}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {inspection.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4 pb-2 border-b">
                {section.title}
              </h3>
              <div className="space-y-3">
                {section.questions.map((question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium flex-1">{question.text}</p>
                      <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {getQuestionTypeLabel(question.type)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {inspection.status === 'pending' && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              <strong>Note:</strong> This inspection is pending. The WhatsApp form
              has not been sent yet.
            </p>
          </div>
        )}

        {inspection.status === 'sent' && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              <strong>Status:</strong> The WhatsApp form has been sent to employees.
              Waiting for responses.
            </p>
          </div>
        )}

        {inspection.status === 'completed' && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="text-green-600" size={24} />
            <p className="text-green-800">
              <strong>Completed:</strong> All responses have been collected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
