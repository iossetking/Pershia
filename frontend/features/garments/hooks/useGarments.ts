import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getGarments, uploadGarment } from '../api/garments';
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
