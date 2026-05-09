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

export const useCollections = () =>
  useQuery({
    queryKey: ['collections'],
    queryFn: getCollections,
  });

export const useCollection = (id: number) =>
  useQuery({
    queryKey: ['collections', id],
    queryFn: () => getCollection(id),
    enabled: !!id,
  });

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (collection: CollectionCreate) => createCollection(collection),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['collections'] }),
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: CollectionUpdate }) =>
      updateCollection(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['collections'] }),
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCollection(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['collections'] }),
  });
};
