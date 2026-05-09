import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000' });

export interface User {
  user_id: number;
  username: string;
  email: string;
  name: string | null;
  preferences: string | null;
  joined_at: string;
}

export const googleAuth = async (token: string): Promise<User> => {
  const { data } = await api.post<User>('/api/users/google-auth', { token });
  return data;
};

export const getUser = async (userId: number): Promise<User> => {
  const { data } = await api.get<User>(`/api/users/${userId}`);
  return data;
};
