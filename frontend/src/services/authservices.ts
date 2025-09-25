import apiClient from './api';

export const requestOtp = async (npi: string, email: string) => {
  return apiClient.post('/auth/request-otp', { npi, email });
};

export const verifyOtp = async (npi: string, otp: string) => {
  return apiClient.post('/auth/verify-otp', { npi, otp });
};