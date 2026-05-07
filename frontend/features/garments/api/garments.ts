import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post('/api/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const createGarment = async (garmentData: any) => {
  const { data } = await api.post('/api/garments/', garmentData);
  return data;
};
