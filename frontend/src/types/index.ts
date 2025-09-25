export type User = {
  user_id: string;
  npi: string;
  first_name: string;
  last_name: string;
  sex: string;
  date_of_birth: string;
  email?: string;
  phone_number?: string;
  address: string;
  profession?: string;
  created_at: string;
}

export interface OTPRequest {
  npi: string;
  email: string;
}

export interface OTPVerification {
  npi: string;
  otp: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface UploadResponse {
  id: string;
  filename: string;
  upload_date: string;
  user_id: string;
  processed: boolean;
  processing_results?: any;
  file_path: string;
  original_pdf?: string;
}

export interface ProcessingResult {
  id: string;
  filename: string;
  upload_date: string;
  user_id: string;
  processed: boolean;
  processing_results?: any;
  file_path: string;
  original_pdf?: string;
}

export interface ApiError {
  detail: string;
}
