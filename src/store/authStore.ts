import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: localStorage.getItem('is_admin') === '1',

  setUser: (user) => {
    if (user) {
      const isAdmin = user.is_admin === '1'; // Explicitly check if "1"
      localStorage.setItem('is_admin', isAdmin ? '1' : '0');
    } else {
      localStorage.removeItem('is_admin');
    }

    set({
      user,
      isAdmin: user ? user.is_admin === '1' : false,
    });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('is_admin');
    set({ user: null, isAdmin: false });
  },
}));
