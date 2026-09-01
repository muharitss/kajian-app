import { api } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api.types';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export const tagApi = {
  getAll: async (): Promise<Tag[]> => {
    const res = await api.get<ApiResponse<Tag[]>>('/tags');
    return res.data.data;
  },

  create: async (name: string): Promise<Tag> => {
    const res = await api.post<ApiResponse<Tag>>('/tags', { name });
    return res.data.data;
  },

  update: async (id: string, name: string): Promise<Tag> => {
    const res = await api.put<ApiResponse<Tag>>(`/tags/${id}`, { name });
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tags/${id}`);
  },
};
