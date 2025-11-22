// User types
export type User = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role: 'user' | 'evaluator' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// Auth types
export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  email: string;
  full_name: string;
  password: string;
  phone?: string;
  role: string;
  document_id?: string;
  bio?: string;
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
  user: User;
};

// Evaluation types
export type EvaluationStatus = 'created' | 'accepted' | 'in_progress' | 'completed' | 'canceled';

export type Evaluation = {
  id: number;
  city_id: number;
  evaluator_id: number;
  requester_id: number;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_plate: string;
  vehicle_year: number;
  notes: string;
  status: EvaluationStatus;
  created_at: string;
  updated_at: string;
  photos?: EvaluationPhoto[];
  report?: Report;
};

export type EvaluationPhoto = {
  id: number;
  evaluation_id: number;
  s3_bucket: string;
  s3_key: string;
  content_type: string;
  size_bytes: number;
  photo_url: string;
  created_at: string;
};

export type CreateEvaluationRequest = {
  city_id: number;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_plate: string;
  vehicle_year: number;
  notes: string;
};

export type UpdateEvaluationRequest = {
  evaluator_id?: number;
  notes?: string;
  status?: EvaluationStatus;
};

export type EvaluationListParams = {
  status?: EvaluationStatus;
};

export type EvaluationListResponse = Evaluation[];

// Report types
export type Report = {
  id: number;
  evaluation_id: number;
  evaluator_id: number;
  summary: string;
  status: 'draft' | 'finalized';
  created_at: string;
  updated_at: string;
};

export type CreateReportRequest = {
  evaluation_id: number;
  summary: string;
};

export type ReportFileResponse = {
  url: string;
};

// Device types
export type DevicePlatform = 'ios' | 'android';

export type RegisterDeviceRequest = {
  device_token: string;
  platform: DevicePlatform;
};

export type Device = {
  id: number;
  user_id: number;
  device_token: string;
  platform: DevicePlatform;
  last_seen_at: string;
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
