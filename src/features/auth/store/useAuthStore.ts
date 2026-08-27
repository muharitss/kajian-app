import { create } from 'zustand';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: AdminUser | null;
  setAuth: (token: string, user: AdminUser) => void;
  logout: () => void;
}

const getInitialToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('kajian_admin_token') : null;
const getInitialUser = (): AdminUser | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('kajian_admin_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  token: getInitialToken(),
  user: getInitialUser(),
  setAuth: (token, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kajian_admin_token', token);
      localStorage.setItem('kajian_admin_user', JSON.stringify(user));
    }
    set({ token, user });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kajian_admin_token');
      localStorage.removeItem('kajian_admin_user');
    }
    set({ token: null, user: null });
  },
}));
