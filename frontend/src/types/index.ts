export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Restaurant {
  _id: string;
  name: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  _id?: string;
  text: string;
  type: 'yes_no' | 'number' | 'text' | 'rating';
  order?: number;
}

export interface Section {
  _id?: string;
  title: string;
  questions: Question[];
}

export interface Inspection {
  _id: string;
  restaurant: string;
  title: string;
  sentTo: string[];
  whatsappFlowId?: string;
  sentAt?: string;
  status: 'pending' | 'sent' | 'completed';
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}
