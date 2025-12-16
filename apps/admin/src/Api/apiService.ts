import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import ENV from '../config/env.variables';
import { jwtTokenManager } from './token/JwtTokenManager.class';
import { apiErrorResponseSchema, type ApiErrorResponse, type ApiResponse } from '../types22/api/ApiResponse';
import toastWrapper from '@/utils/toastWrapper';

const creatAxiosInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: ENV.BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

type CustomAxiosRequestOptions = AxiosRequestConfig & {
  params?: Record<string, unknown> | URLSearchParams;
};
class ApiService {
  private api: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
  }> = [];

  constructor() {
    this.api = creatAxiosInstance();

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      async (config) => {
        const token = await jwtTokenManager.getInitialAccessToken();
        if (token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;
        const originalRequest = error?.config;

        // No config = non-retriable error
        if (!originalRequest) return Promise.reject(error);

        // -------------------------------
        // 401 Handling
        // -------------------------------
        if (status === 401) {
          // Already retried once → hard fail
          if (originalRequest.__retry) {
            jwtTokenManager.clearTokens();
            window.location.href = '/signin';
            return Promise.reject(error);
          }

          // If refresh already happening → enqueue
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                resolve: (token: string) => {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  resolve(this.api(originalRequest));
                },
                reject,
              });
            });
          }

          // Begin token refresh sequence
          originalRequest.__retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshAccessToken();
            this.processQueue(null, newToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            jwtTokenManager.clearTokens();
            window.location.href = '/signin';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Non-401 errors
        return Promise.reject(error);
      },
    );
  }

  // Process failed request queue
  private processQueue(error: unknown, token: string | null = null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token!);
      }
    });

    this.failedQueue = [];
  }

  private displayDevAlert = (statusCode: number, error: string) => {
    toastWrapper.dev.error(`Request failed with status ${statusCode}`, {
      description: `${error}`,
    });
  };

  // Refresh access token
  private async refreshAccessToken(): Promise<string> {
    const newAccessToken = await jwtTokenManager.refreshAccessToken();
    if (!newAccessToken) {
      throw new Error('Failed to refresh access token');
    }
    return newAccessToken;
  }

  validateApiErrorSchema(response: ApiResponse<unknown>): response is ApiErrorResponse {
    const parsed = apiErrorResponseSchema.safeParse(response);
    if (parsed.success) {
      return true;
    }
    toastWrapper.dev.Critical('Response is not of type ApiErrorResponse');
    return false;
  }

  handleApiErrorResponse(error: unknown): ApiErrorResponse {
    if (typeof error !== 'object' && error === null) {
      toastWrapper.dev.Critical('Unknown error, error is not an object or is null');
      return {
        success: false,
        message: 'Unknown error occurred',
        timestamp: new Date(),
        path: '',
      };
    }

    const isAxiosError = axios.isAxiosError(error);

    if (isAxiosError && error.response) {
      this.validateApiErrorSchema(error.response.data);
      return error.response?.data as ApiErrorResponse;
    } else if (isAxiosError && error.request) {
      // ⚠️ No response received — network error or timeout
      this.displayDevAlert(NaN, 'No response received from server — network error or timeout');
      return {
        success: false,
        message: 'No response received from server',
        timestamp: new Date(),
        path: '',
      };
    } else {
      // ⚠️ Something else went wrong setting up the request
      toastWrapper.dev.Critical('Something else went wrong setting up the request');
      return { success: false, message: 'Request setup error', timestamp: new Date(), path: '' };
    }
  }

  private toApiSuccessResponse<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data,
    };
  }

  // Wrapper methods with error handling
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.get<T>(url, config);

      return this.toApiSuccessResponse(response.data);
    } catch (error: ApiErrorResponse | unknown) {
      return this.handleApiErrorResponse(error);
    }
  }

  async getThrowable<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.get<T>(url, config);

      return response.data;
    } catch (error: ApiErrorResponse | unknown) {
      const errorResponse = this.handleApiErrorResponse(error);
      throw errorResponse;
    }
  }

  async post<T>(url: string, data: unknown, config?: CustomAxiosRequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.post<T>(url, data, config);

      return this.toApiSuccessResponse(response.data);
    } catch (error: ApiErrorResponse | unknown) {
      const errorResponse = this.handleApiErrorResponse(error);
      return errorResponse;
    }
  }

  async postThrowable<T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.post<T>(url, data, config);

      return response.data;
    } catch (error: ApiErrorResponse | unknown) {
      const errorResponse = this.handleApiErrorResponse(error);
      throw errorResponse;
    }
  }

  async put<T>(url: string, data: unknown, config?: CustomAxiosRequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.put<T>(url, data, config);

      return this.toApiSuccessResponse(response.data);
    } catch (error: ApiErrorResponse | unknown) {
      const errorResponse = this.handleApiErrorResponse(error);
      return errorResponse;
    }
  }

  async putThrowable<T>(url: string, data: unknown, config?: CustomAxiosRequestOptions): Promise<T> {
    try {
      const response = await this.api.put<T>(url, data, config);

      return response.data;
    } catch (error: ApiErrorResponse | unknown) {
      const errorResponse = this.handleApiErrorResponse(error);
      throw errorResponse;
    }
  }

  async delete<T>(url: string, config?: CustomAxiosRequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.delete<T>(url, config);

      return this.toApiSuccessResponse(response.data);
    } catch (error: ApiErrorResponse | unknown) {
      const errorResponse = this.handleApiErrorResponse(error);
      return errorResponse;
    }
  }

  async deleteThrowable<T>(url: string, config?: CustomAxiosRequestOptions): Promise<T> {
    try {
      const response = await this.api.delete<T>(url, config);

      return response.data;
    } catch (error: ApiErrorResponse | unknown) {
      const errorResponse = this.handleApiErrorResponse(error);
      throw errorResponse;
    }
  }
}

export const apiService = new ApiService();
