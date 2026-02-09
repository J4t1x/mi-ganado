const PRODUCTION_API_URL = 'https://jard.up.railway.app';
const DEVELOPMENT_API_URL = 'http://localhost:8089';

function resolveApiUrl(): string {
  // 1. Explicit env var always wins (check both names for Turbopack compatibility)
  const url = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (url) {
    return url;
  }

  // 2. Auto-detect by NODE_ENV
  if (process.env.NODE_ENV === 'production') {
    return PRODUCTION_API_URL;
  }

  return DEVELOPMENT_API_URL;
}

export const API_CONFIG = {
  baseUrl: resolveApiUrl(),
  apiKey: process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY || '',
} as const;

export function getApiConfig() {
  return {
    baseUrl: API_CONFIG.baseUrl,
    apiKey: API_CONFIG.apiKey,
  };
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function buildHeaders(token: string | null, apiKey: string) {
  return {
    'Content-Type': 'application/json',
    ...(apiKey && { 'X-API-Key': apiKey }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}
