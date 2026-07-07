/**
 * API-Client für Backend-Integration
 * Verbindet Frontend mit PHP-Backend
 */

export interface ApiResponse<T = any> {
  success?: boolean;
  error?: string;
  message?: string;
  data?: T;
  timestamp?: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  url: string;
  filename: string;
  size: number;
  type: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    // Verwende Env-Variable oder Fallback
    this.baseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL || '/server/api';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const baseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const url = `${baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();
      console.log('API Response:', { url, status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', { url, error });
      throw error;
    }
  }

  // Content API
  async getContent<T>(): Promise<T> {
    const response = await this.request<T>('/content.php', {
      method: 'GET',
    });
    return response as T;
  }

  async saveContent<T>(data: T): Promise<ApiResponse> {
    return this.request('/content.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateContent<T>(data: T): Promise<ApiResponse> {
    return this.request('/content.php', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Upload API
  async uploadImage(file: File, folder?: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    if (folder) {
      formData.append('folder', folder);
    }

    const url = `${this.baseUrl}/upload.php`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const api = new ApiClient();
