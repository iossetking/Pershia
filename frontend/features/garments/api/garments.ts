import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const uploadGarment = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post('/api/garments/', formData);
  return data;
};
