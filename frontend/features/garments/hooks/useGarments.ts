import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getGarments, uploadGarment } from '../api/garments';

export const useGarments = () =>
  useQuery({
    queryKey: ['garments'],
    queryFn: () => getGarments(),
  });

export const useUploadGarment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadGarment(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garments'] });
    },
  });
};