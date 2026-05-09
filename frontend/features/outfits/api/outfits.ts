import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000' });

export interface OutfitGarmentPosition {
  garment_id: number;
  pos_top: number;
  pos_left: number;
  pos_scale: number;
  pos_z_index: number;
}

export interface Outfit {
  outfit_id: number;
  user_id: number;
  title: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  garments: OutfitGarmentPosition[];
}

export interface OutfitCreate {
  user_id?: number;
  title: string;
  description?: string;
  garments: OutfitGarmentPosition[];
}

export const getOutfits = async (): Promise<Outfit[]> => {
  const { data } = await api.get<Outfit[]>('/api/outfits/', { params: { limit: 100 } });
  return data;
};

export const createOutfit = async (outfit: OutfitCreate): Promise<Outfit> => {
  const { data } = await api.post<Outfit>('/api/outfits/', outfit);
  return data;
};

export const deleteOutfit = async (outfitId: number): Promise<void> => {
  await api.delete(`/api/outfits/${outfitId}`);
};
