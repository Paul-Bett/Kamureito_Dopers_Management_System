import apiClient from './client';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    username: string;
  };
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async register(email: string, username: string, password: string): Promise<void> {
    await apiClient.post('/auth/register', {
      email,
      username,
      password,
    });
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    const response = await apiClient.get<AuthResponse['user']>('/users/me');
    return response.data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh');
    return response.data;
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }
}

export const authService = new AuthService(); 