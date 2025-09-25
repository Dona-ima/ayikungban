import apiClient from './api';
import type { User } from '../types';

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get('/users/me');
  return response.data;
};

export const getUserActivities = async () => {
  const response = await apiClient.get('/users/activities');
  return response.data;
};