import { api } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api.types';
import type { AdminUser } from '../store/useAuthStore';

export interface LoginResponseData {
  token: string;
  user: AdminUser;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponseData> => {
    const res = await api.post<ApiResponse<LoginResponseData>>('/auth/login', { email, password });
    return res.data.data;
  },

  getMe: async (): Promise<AdminUser> => {
    const res = await api.get<ApiResponse<AdminUser>>('/auth/me');
    return res.data.data;
  },
};
