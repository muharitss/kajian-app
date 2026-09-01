import { api } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api.types';

export interface Ustadz {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
}

export const ustadzApi = {
  getAll: async (): Promise<Ustadz[]> => {
    const res = await api.get<ApiResponse<Ustadz[]>>('/ustadz');
    return res.data.data;
  },

  create: async (data: { name: string; bio?: string; avatarUrl?: string }): Promise<Ustadz> => {
    const res = await api.post<ApiResponse<Ustadz>>('/ustadz', data);
    return res.data.data;
  },

  update: async (id: string, data: { name?: string; bio?: string; avatarUrl?: string }): Promise<Ustadz> => {
    const res = await api.put<ApiResponse<Ustadz>>(`/ustadz/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/ustadz/${id}`);
  },

  getBySlug: async (slug: string, params?: { page?: number; limit?: number }) => {
    const res = await api.get(`/ustadz/${slug}`, { params });
    return res.data;
  },
};

