import { api } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
  Article,
  ArticleQueryParams,
  CreateArticlePayload,
  UpdateArticlePayload,
} from '../types/article.types';

export const articleApi = {
  getPublicArticles: async (params?: ArticleQueryParams) => {
    const res = await api.get<ApiResponse<Article[]>>('/articles', { params });
    return res.data;
  },

  getAdminArticles: async (params?: ArticleQueryParams) => {
    const res = await api.get<ApiResponse<Article[]>>('/articles/admin', { params });
    return res.data;
  },

  getBySlug: async (slug: string): Promise<Article> => {
    const res = await api.get<ApiResponse<Article>>(`/articles/${slug}`);
    return res.data.data;
  },

  getRelatedArticles: async (slug: string, limit: number = 3): Promise<Article[]> => {
    const res = await api.get<ApiResponse<Article[]>>(`/articles/${slug}/related`, {
      params: { limit },
    });
    return res.data.data;
  },

  create: async (data: CreateArticlePayload): Promise<Article> => {
    const res = await api.post<ApiResponse<Article>>('/articles', data);
    return res.data.data;
  },

  update: async (id: string, data: UpdateArticlePayload): Promise<Article> => {
    const res = await api.put<ApiResponse<Article>>(`/articles/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/articles/${id}`);
  },

  uploadCoverImage: async (file: File): Promise<string> => {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
    const res = await api.post<ApiResponse<{ url: string }>>('/articles/upload', { file: base64 });
    return res.data.data.url;
  },
};
