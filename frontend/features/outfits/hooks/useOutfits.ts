import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getOutfits, createOutfit, deleteOutfit, type OutfitCreate } from '../api/outfits';

export const useOutfits = () =>
  useQuery({
    queryKey: ['outfits'],
    queryFn: getOutfits,
  });

export const useCreateOutfit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (outfit: OutfitCreate) => createOutfit(outfit),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['outfits'] }),
  });
};

export const useDeleteOutfit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (outfitId: number) => deleteOutfit(outfitId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['outfits'] }),
  });
};
