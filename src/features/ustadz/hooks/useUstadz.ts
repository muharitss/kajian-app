import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ustadzApi } from '../api/ustadz.api';

export const useUstadz = () => {
  return useQuery({
    queryKey: ['ustadz'],
    queryFn: ustadzApi.getAll,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUstadzMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: ustadzApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ustadz'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; bio?: string; avatarUrl?: string } }) =>
      ustadzApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ustadz'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ustadzApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ustadz'] });
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};

export const useUstadzProfile = (slug: string, page = 1) => {
  return useQuery({
    queryKey: ['ustadz-profile', slug, page],
    queryFn: () => ustadzApi.getBySlug(slug, { page, limit: 10 }),
    enabled: !!slug,
  });
};

