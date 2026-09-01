import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi, type CreateCategoryPayload, type UpdateCategoryPayload } from '../api/category.api';

export const useCategories = (flat?: boolean) => {
  return useQuery({
    queryKey: ['categories', { flat }],
    queryFn: () => categoryApi.getAll(flat),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryPayload) => categoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryPayload }) =>
      categoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};

