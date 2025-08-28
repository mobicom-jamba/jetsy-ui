// ================================================================
// FRONTEND TYPES - UPDATED
// ================================================================

// client/src/types/auth.ts (UPDATED)
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  MetaApps?: MetaApp[];
  MetaAccounts?: MetaAccount[];
  createdAt: string;
  updatedAt: string;
}

export interface MetaApp {
  id: string;
  appId: string;
  appName: string;
  isVerified: boolean;
  verificationStatus: "PENDING" | "VERIFIED" | "FAILED";
  webhookUrl?: string;
  createdAt: string;
}

export interface MetaAccount {
  id: string;
  accountId: string;
  accountName: string;
  currency: string;
  accountStatus: string;
  isActive: boolean;
  metaAppId: string;
  createdAt: string;
}

export interface CreateMetaAppData {
  appId: string;
  appSecret: string;
  appName: string;
  webhookUrl?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}
