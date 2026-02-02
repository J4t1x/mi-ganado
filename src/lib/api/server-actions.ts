'use server';

function getApiConfig() {
  return {
    baseUrl: process.env.API_URL || 'http://localhost:8089',
    apiKey: process.env.API_KEY || '',
  };
}

export async function loginAction(email: string, password: string) {
  const { baseUrl, apiKey } = getApiConfig();
  
  console.log('[Server Action] Login attempt:', { baseUrl, hasApiKey: !!apiKey });
  
  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Error al iniciar sesión' };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error de conexión' };
  }
}

export async function getProfileAction(token: string) {
  const { baseUrl, apiKey } = getApiConfig();
  
  try {
    const response = await fetch(`${baseUrl}/auth/profile`, {
      headers: {
        'X-API-Key': apiKey,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { success: false, error: 'No autenticado' };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error de conexión' };
  }
}

export async function apiRequest<T>(
  endpoint: string,
  token: string,
  options?: {
    method?: string;
    body?: unknown;
  }
): Promise<{ success: boolean; data?: T; error?: string }> {
  const { baseUrl, apiKey } = getApiConfig();
  
  try {
    const response = await fetch(`${baseUrl}/api/v1/ganado${endpoint}`, {
      method: options?.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'Authorization': `Bearer ${token}`,
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      return { success: false, error: error.message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error de conexión' };
  }
}
