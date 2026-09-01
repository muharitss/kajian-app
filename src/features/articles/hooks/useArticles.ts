import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articleApi } from '../api/article.api';
import type { ArticleQueryParams, CreateArticlePayload, UpdateArticlePayload } from '../types/article.types';

export const usePublicArticles = (params?: ArticleQueryParams) => {
  return useQuery({
    queryKey: ['public-articles', params],
    queryFn: () => articleApi.getPublicArticles(params),
    staleTime: 1000 * 60 * 2,
  });
};

export const useAdminArticles = (params?: ArticleQueryParams) => {
  return useQuery({
    queryKey: ['admin-articles', params],
    queryFn: () => articleApi.getAdminArticles(params),
  });
};

export const useArticleDetail = (slug: string) => {
  return useQuery({
    queryKey: ['article-detail', slug],
    queryFn: () => articleApi.getBySlug(slug),
    enabled: Boolean(slug),
  });
};

export const useRelatedArticles = (slug: string, limit: number = 3) => {
  return useQuery({
    queryKey: ['related-articles', slug, limit],
    queryFn: () => articleApi.getRelatedArticles(slug, limit),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });
};

export const useArticleMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateArticlePayload) => articleApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-articles'] });
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateArticlePayload }) =>
      articleApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-articles'] });
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      queryClient.invalidateQueries({ queryKey: ['article-detail'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => articleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-articles'] });
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
