import { api } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api.types';
import type { CategoryItem } from '@/features/articles/types/article.types';

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  parentId?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  parentId?: string | null;
}

export const categoryApi = {
  getAll: async (flat?: boolean): Promise<CategoryItem[]> => {
    const res = await api.get<ApiResponse<CategoryItem[]>>(`/categories${flat ? '?flat=true' : ''}`);
    return res.data.data;
  },

  create: async (data: CreateCategoryPayload): Promise<CategoryItem> => {
    const res = await api.post<ApiResponse<CategoryItem>>('/categories', data);
    return res.data.data;
  },

  update: async (id: string, data: UpdateCategoryPayload): Promise<CategoryItem> => {
    const res = await api.put<ApiResponse<CategoryItem>>(`/categories/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};


