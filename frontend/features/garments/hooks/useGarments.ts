import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadGarment } from '../api/garments';

export const useUploadGarment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadGarment(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['garments'] });
      console.log('Upload successful:', data);
    },
    onError: (error) => {
      console.error('Upload failed:', error);
    },
  });
};