import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
  type CollectionCreate,
  type CollectionUpdate,
} from '../api/collections';
import { useAuth } from '@/app/context/AuthContext';

export const useCollections = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['collections', user?.user_id],
    queryFn: () => getCollections(user!.user_id),
    enabled: !!user,
  });
};

export const useCollection = (id: number) =>
  useQuery({
    queryKey: ['collections', id],
    queryFn: () => getCollection(id),
    enabled: !!id,
  });

export const useCreateCollection = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (collection: Omit<CollectionCreate, 'user_id'>) =>
      createCollection({ ...collection, user_id: user?.user_id ?? 1 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['collections', user?.user_id] }),
  });
};

export const useUpdateCollection = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: CollectionUpdate }) =>
      updateCollection(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['collections', user?.user_id] }),
  });
};

export const useDeleteCollection = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCollection(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['collections', user?.user_id] }),
  });
};
