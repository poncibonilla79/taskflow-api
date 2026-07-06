export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}
