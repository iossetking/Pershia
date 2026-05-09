import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000' });

export interface Collection {
  collection_id: number;
  user_id: number;
  title: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  garment_ids: number[];
  outfit_ids: number[];
}

export interface CollectionCreate {
  user_id?: number;
  title: string;
  description?: string;
  is_public?: boolean;
  garment_ids: number[];
  outfit_ids: number[];
}

export interface CollectionUpdate {
  title?: string;
  description?: string;
  is_public?: boolean;
}

export const getCollections = async (): Promise<Collection[]> => {
  const { data } = await api.get<Collection[]>('/api/collections/', { params: { limit: 100 } });
  return data;
};

export const getCollection = async (id: number): Promise<Collection> => {
  const { data } = await api.get<Collection>(`/api/collections/${id}`);
  return data;
};

export const createCollection = async (collection: CollectionCreate): Promise<Collection> => {
  const { data } = await api.post<Collection>('/api/collections/', collection);
  return data;
};

export const updateCollection = async (id: number, updates: CollectionUpdate): Promise<Collection> => {
  const { data } = await api.put<Collection>(`/api/collections/${id}`, updates);
  return data;
};

export const deleteCollection = async (id: number): Promise<void> => {
  await api.delete(`/api/collections/${id}`);
};
