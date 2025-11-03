import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Restaurant, Section, Question } from '../types';
import { Plus, Trash2, ArrowLeft, Send } from 'lucide-react';

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [inspectionTitle, setInspectionTitle] = useState('');
  const [sections, setSections] = useState<Section[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) {
      loadRestaurant();
    }
  }, [id]);

  const loadRestaurant = async () => {
    try {
      const data = await api.restaurants.getById(id!);
      console.log(data);
      setRestaurant(data?.restaurant);
    } catch (err) {
      setError('Failed to load restaurant');
    }
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        title: '',
        questions: [],
      },
    ]);
  };

  const updateSectionTitle = (index: number, title: string) => {
    const updated = [...sections];
    updated[index].title = title;
    setSections(updated);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const addQuestion = (sectionIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].questions.push({
      text: '',
      type: 'yes_no',
    });
    setSections(updated);
  };

  const updateQuestion = (
    sectionIndex: number,
    questionIndex: number,
    field: keyof Question,
    value: string
  ) => {
    const updated = [...sections];
    updated[sectionIndex].questions[questionIndex] = {
      ...updated[sectionIndex].questions[questionIndex],
      [field]: value,
    };
    setSections(updated);
  };

  const removeQuestion = (sectionIndex: number, questionIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].questions = updated[sectionIndex].questions.filter(
      (_, i) => i !== questionIndex
    );
    setSections(updated);
  };

  const handleGenerateAndSend = async () => {
    if (!inspectionTitle.trim()) {
      setError('Please enter inspection title');
      return;
    }

    if (sections.length === 0) {
      setError('Please add at least one section');
      return;
    }

    for (const section of sections) {
      if (!section.title.trim()) {
        setError('All sections must have a title');
        return;
      }
      if (section.questions.length === 0) {
        setError('Each section must have at least one question');
        return;
      }
      for (const question of section.questions) {
        if (!question.text.trim()) {
          setError('All questions must have text');
          return;
        }
      }
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.inspections.create(id!, {
        title: inspectionTitle,
        sections: sections.map((section) => ({
          title: section.title,
          questions: section.questions.map((q) => ({
            text: q.text,
            type: q.type,
          })),
        })),
      });

      setSuccess('Inspection form created successfully!');
      setInspectionTitle('');
      setSections([]);
      setPhoneNumbers('');

      setTimeout(() => {
        navigate(`/restaurant/${id}/inspections`);
      }, 1500);
    } catch (err) {
      setError('Failed to create inspection');
    } finally {
      setLoading(false);
    }
  };

  if (!restaurant) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/restaurants')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">{restaurant.name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => navigate(`/restaurant/${id}/inspections`)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            View Inspections
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Create Inspection Form</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Inspection Title
              </label>
              <input
                type="text"
                value={inspectionTitle}
                onChange={(e) => setInspectionTitle(e.target.value)}
                placeholder="e.g., Daily Hygiene Check - Nov 2"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Sections</h3>
                <button
                  onClick={addSection}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus size={18} />
                  Add Section
                </button>
              </div>

              {sections.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className="border rounded-lg p-4 mb-4 bg-gray-50"
                >
                  <div className="flex gap-4 mb-4">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) =>
                        updateSectionTitle(sectionIndex, e.target.value)
                      }
                      placeholder="Section Title (e.g., Billing Counter)"
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeSection(sectionIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="ml-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium">Questions</h4>
                      <button
                        onClick={() => addQuestion(sectionIndex)}
                        className="flex items-center gap-1 text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        <Plus size={16} />
                        Add Question
                      </button>
                    </div>

                    {section.questions.map((question, questionIndex) => (
                      <div
                        key={questionIndex}
                        className="flex gap-2 mb-2 items-start"
                      >
                        <input
                          type="text"
                          value={question.text}
                          onChange={(e) =>
                            updateQuestion(
                              sectionIndex,
                              questionIndex,
                              'text',
                              e.target.value
                            )
                          }
                          placeholder="Question text"
                          className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                          value={question.type}
                          onChange={(e) =>
                            updateQuestion(
                              sectionIndex,
                              questionIndex,
                              'type',
                              e.target.value
                            )
                          }
                          className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="yes_no">Yes/No</option>
                          <option value="number">Number</option>
                          <option value="text">Text</option>
                          <option value="rating">Rating</option>
                        </select>
                        <button
                          onClick={() =>
                            removeQuestion(sectionIndex, questionIndex)
                          }
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {sections.length === 0 && (
                <div className="text-center text-gray-500 py-8 border-2 border-dashed rounded-lg">
                  No sections added yet. Click "Add Section" to start.
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Employee Phone Numbers (optional, comma-separated)
              </label>
              <input
                type="text"
                value={phoneNumbers}
                onChange={(e) => setPhoneNumbers(e.target.value)}
                placeholder="e.g., +919876543210, +919876543211"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleGenerateAndSend}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold"
            >
              <Send size={20} />
              {loading ? 'Creating...' : 'Generate & Send WhatsApp Form'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
