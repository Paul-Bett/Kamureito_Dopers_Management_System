import apiClient from './client';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
}

class AuthService {
  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string; refreshToken: string }> {
    const response = await apiClient.post('/auth/login', credentials);
    const { user, token, refreshToken } = response.data;
    this.setTokens(token, refreshToken);
    return { user, token, refreshToken };
  }

  async register(data: RegisterData): Promise<{ user: User; token: string; refreshToken: string }> {
    const response = await apiClient.post('/auth/register', data);
    const { user, token, refreshToken } = response.data;
    this.setTokens(token, refreshToken);
    return { user, token, refreshToken };
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      this.clearTokens();
    }
  }

  async refreshToken(): Promise<{ token: string; refreshToken: string }> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post('/auth/refresh', { refreshToken });
    const { token: newToken, refreshToken: newRefreshToken } = response.data;
    this.setTokens(newToken, newRefreshToken);
    return { token: newToken, refreshToken: newRefreshToken };
  }

  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post('/auth/password-reset-request', { email });
  }

  async confirmPasswordReset(token: string, password: string): Promise<void> {
    await apiClient.post('/auth/password-reset-confirm', { token, password });
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  private setTokens(token: string, refreshToken: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService(); 