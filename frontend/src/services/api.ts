import type { AuthResponse, Restaurant, Inspection } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`,
});

export const api = {
  auth: {
    register: async (data: {
      name: string;
      email: string;
      username: string;
      phone: string;
      password: string;
    }): Promise<AuthResponse> => {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      return response.json();
    },

    login: async (data: {
      identifier: string;
      password: string;
    }): Promise<AuthResponse> => {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      return response.json();
    },
  },

  restaurants: {
    create: async (name: string): Promise<Restaurant> => {
      const response = await fetch(`${API_BASE_URL}/api/restaurant`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      return response.json();
    },

    list: async (): Promise<Restaurant[]> => {
      const response = await fetch(`${API_BASE_URL}/api/restaurant`, {
        method: 'GET',
        headers: authHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      return response.json();
    },

    getById: async (id: string): Promise<Restaurant> => {
      const response = await fetch(`${API_BASE_URL}/api/restaurant/${id}`, {
        method: 'GET',
        headers: authHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      return response.json();
    },
  },

  inspections: {
    create: async (restaurantId: string, data: {
      title: string;
      sections: Array<{
        title: string;
        questions: Array<{
          text: string;
          type: 'yes_no' | 'number' | 'text' | 'rating';
        }>;
      }>;
    }): Promise<Inspection> => {
      const response = await fetch(
        `${API_BASE_URL}/api/restaurant/${restaurantId}/inspection`,
        {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      return response.json();
    },

    list: async (restaurantId: string): Promise<Inspection[]> => {
      const response = await fetch(
        `${API_BASE_URL}/api/restaurant/${restaurantId}/inspection`,
        {
          method: 'GET',
          headers: authHeaders(),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      return response.json();
    },

    getById: async (restaurantId: string, inspectionId: string): Promise<Inspection> => {
      const response = await fetch(
        `${API_BASE_URL}/api/restaurant/${restaurantId}/inspection/${inspectionId}`,
        {
          method: 'GET',
          headers: authHeaders(),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      return response.json();
    },
  },
};
