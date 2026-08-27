import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagApi } from '../api/tag.api';

export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: tagApi.getAll,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTagMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: tagApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: tagApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });

  return { createMutation, deleteMutation };
};
