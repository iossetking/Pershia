import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({ baseURL: API_BASE_URL });

export interface Garment {
  garment_id: number;
  user_id: number;
  s3_url: string;
  s3_key: string;
  color: string;
  fabric: string;
  category: string;
  style: string;
  description: string | null;
  is_public: boolean;
  is_owned: boolean;
  created_at: string;
}

export const getGarments = async (userId: number, offset = 0, limit = 100): Promise<Garment[]> => {
  const { data } = await api.get<Garment[]>('/api/garments/', { params: { user_id: userId, offset, limit } });
  return data;
};

export const uploadGarment = async (file: File, userId: number): Promise<Garment> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user_id', String(userId));
  const { data } = await api.post<Garment>('/api/garments/', formData);
  return data;
};
