// User types
export type User = {
  id: number;
  full_name: string;
  email: string;
  role: 'user' | 'evaluator' | 'admin';
  phone?: string;
  created_at: string;
  updated_at: string;
};

// Auth types
export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: User;
};

export type RefreshTokenRequest = {
  refresh_token: string;
};

export type RefreshTokenResponse = {
  access_token: string;
  refresh_token: string;
};

// Evaluation types
export type EvaluationStatus = 'created' | 'accepted' | 'in_progress' | 'completed' | 'canceled';

export type Evaluation = {
  id: number;
  city_id: number;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year?: number;
  notes?: string;
  status: EvaluationStatus;
  created_at: string;
  updated_at: string;
  photos?: EvaluationPhoto[];
  report?: Report;
};

export type EvaluationPhoto = {
  id: number;
  evaluation_id: number;
  photo_url: string;
  created_at: string;
};

export type CreateEvaluationRequest = {
  city_id: number;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year?: number;
  notes?: string;
};

export type UpdateEvaluationRequest = {
  status?: EvaluationStatus;
  notes?: string;
};

export type EvaluationListResponse = {
  evaluations: Evaluation[];
  total: number;
  page: number;
  limit: number;
};

// Report types
export type Report = {
  id: number;
  evaluation_id: number;
  status: 'draft' | 'finalized';
  file_url?: string;
  created_at: string;
  updated_at: string;
};

export type CreateReportRequest = {
  evaluation_id: number;
  status: 'draft' | 'finalized';
};

// Device types
export type DevicePlatform = 'ios' | 'android';

export type RegisterDeviceRequest = {
  platform: DevicePlatform;
  device_token: string;
};

export type Device = {
  id: number;
  user_id: number;
  platform: DevicePlatform;
  device_token: string;
  created_at: string;
};

// API Response types
export type ApiResponse<T = any> = {
  data: T;
  message?: string;
  success: boolean;
};

export type ApiError = {
  message: string;
  code?: string;
  details?: any;
};

// Photo upload types
export type PhotoUploadResponse = {
  photo_url: string;
  presigned_url?: string;
};

// City types
export type City = {
  id: number;
  name: string;
  state: string;
  country: string;
};

// Pagination types
export type PaginationParams = {
  page?: number;
  limit?: number;
  status?: EvaluationStatus;
};

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type Toast = {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
};
