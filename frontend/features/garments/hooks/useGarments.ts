import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getGarments, uploadGarment, searchGarments, getSimilarGarments } from '../api/garments';
import { useAuth } from '@/app/context/AuthContext';

export const useGarments = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['garments', user?.user_id],
    queryFn: () => getGarments(user!.user_id),
    enabled: !!user,
  });
};

export const useUploadGarment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadGarment(file, user?.user_id ?? 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garments', user?.user_id] });
    },
  });
};

export const useSearchGarments = (q: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['garments', 'search', user?.user_id, q],
    queryFn: () => searchGarments(q, user!.user_id),
    enabled: !!user && q.trim().length > 1,
    staleTime: 30_000,
  });
};

export const useSimilarGarments = (garmentId: number | null) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['garments', 'similar', user?.user_id, garmentId],
    queryFn: () => getSimilarGarments(garmentId!, user!.user_id),
    enabled: !!user && garmentId !== null,
    staleTime: 60_000,
  });
};
