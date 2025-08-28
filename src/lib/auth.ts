import api from "./api";
import {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "@/types/auth";

export class AuthService {
  /**
   * Authenticate user with credentials
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/login", credentials);
      const { user, token } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", token);

      // Set default auth header for future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { user, token };
    } catch (error: any) {
      const message = error.response?.data?.error || "Login failed";
      throw new Error(message);
    }
  }

  /**
   * Register new user account
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/register", data);
      const { user, token } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", token);

      // Set default auth header for future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { user, token };
    } catch (error: any) {
      const message = error.response?.data?.error || "Registration failed";
      throw new Error(message);
    }
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get("/auth/me");
      return response.data.user;
    } catch (error: any) {
      // If unauthorized, clear stored token
      if (error.response?.status === 401) {
        this.logout();
      }
      throw error;
    }
  }

  /**
   * Get Meta OAuth authorization URL
   */
  static async getMetaAuthUrl(): Promise<string> {
    try {
      const response = await api.get("/auth/meta/connect");
      return response.data.authUrl;
    } catch (error) {
      console.error("Failed to get Meta auth URL:", error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await api.put("/auth/profile", data);
      return response.data.user;
    } catch (error: any) {
      const message = error.response?.data?.error || "Profile update failed";
      throw new Error(message);
    }
  }

  /**
   * Change password
   */
  static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
    } catch (error: any) {
      const message = error.response?.data?.error || "Password change failed";
      throw new Error(message);
    }
  }

  /**
   * Logout user and clear authentication
   */
  static logout(): void {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Remove auth header from axios defaults
    delete api.defaults.headers.common["Authorization"];

    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Get stored auth token
   */
  static getToken(): string | null {
    return localStorage.getItem("token");
  }

  /**
   * Initialize authentication on app start
   */
  static initializeAuth(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else if (token) {
      // Token expired, remove it
      this.logout();
    }
  }

  /**
   * Handle authentication errors globally
   */
  static handleAuthError(error: any): void {
    if (error.response?.status === 401) {
      console.warn("Authentication expired, logging out...");
      this.logout();
    }
  }

  /**
   * Refresh user session
   */
  static async refreshSession(): Promise<User | null> {
    try {
      const token = this.getToken();
      if (!token || this.isTokenExpired(token)) {
        return null;
      }

      // Ensure token is set in headers
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const user = await this.getCurrentUser();
      return user;
    } catch (error) {
      console.error("Failed to refresh session:", error);
      this.logout();
      return null;
    }
  }

  /**
   * Validate token format
   */
  static isValidTokenFormat(token: string): boolean {
    // Basic JWT format validation (3 parts separated by dots)
    const parts = token.split(".");
    return parts.length === 3;
  }

  /**
   * Get token expiration time
   */
  static getTokenExpiration(token: string): Date | null {
    try {
      if (!this.isValidTokenFormat(token)) {
        return null;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));

      if (!payload.exp) {
        return null;
      }

      return new Date(payload.exp * 1000);
    } catch (error) {
      console.error("Failed to parse token expiration:", error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) {
      return true;
    }

    // Add 5 minute buffer
    return new Date().getTime() > expiration.getTime() - 5 * 60 * 1000;
  }

  /**
   * Auto-logout when token expires
   */
  static startTokenExpirationCheck(): void {
    const checkInterval = 60000; // Check every minute

    setInterval(() => {
      const token = this.getToken();
      if (token && this.isTokenExpired(token)) {
        console.warn("Token expired, logging out...");
        this.logout();
      }
    }, checkInterval);
  }

  /**
   * Get user permissions for Meta account
   */
  static async getUserPermissions(): Promise<string[]> {
    try {
      const response = await api.get("/auth/permissions");
      return response.data.permissions;
    } catch (error) {
      console.error("Failed to get user permissions:", error);
      return [];
    }
  }
}
