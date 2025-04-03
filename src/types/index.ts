export interface User {
  id: string;
  email: string;
  full_name: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image_url: string;
  participants_count: number;
  description: string;
}

export interface Participant {
  id: string;
  event_id: string;
  name: string;
  phone: string;
  tickets: number;
  amount: number;
  payment_completed: boolean;
  checked_in: boolean;
}