import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getOutfits, createOutfit, deleteOutfit, type OutfitCreate } from '../api/outfits';
import { useAuth } from '@/app/context/AuthContext';

export const useOutfits = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['outfits', user?.user_id],
    queryFn: () => getOutfits(user!.user_id),
    enabled: !!user,
  });
};

export const useCreateOutfit = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (outfit: Omit<OutfitCreate, 'user_id'>) =>
      createOutfit({ ...outfit, user_id: user?.user_id ?? 1 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['outfits', user?.user_id] }),
  });
};

export const useDeleteOutfit = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (outfitId: number) => deleteOutfit(outfitId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['outfits', user?.user_id] }),
  });
};
