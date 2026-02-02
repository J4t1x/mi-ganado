'use server';

import {
  Titular,
  TitularWithEstablecimientos,
  CreateTitularDto,
  UpdateTitularDto,
  PaginatedResponse,
} from '@/types';

function getApiConfig() {
  return {
    baseUrl: process.env.API_URL || 'http://localhost:8089',
    apiKey: process.env.API_KEY || '',
  };
}

export interface TitularesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  estado?: string;
  tipo?: string;
}

export async function getTitularesAction(
  token: string,
  params?: TitularesQueryParams
): Promise<{ success: boolean; data?: PaginatedResponse<TitularWithEstablecimientos>; error?: string }> {
  const { baseUrl, apiKey } = getApiConfig();

  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.search) searchParams.set('search', params.search);
  if (params?.estado) searchParams.set('estado', params.estado);
  if (params?.tipo) searchParams.set('tipo', params.tipo);

  const query = searchParams.toString();

  try {
    const response = await fetch(
      `${baseUrl}/api/v1/ganado/titulares${query ? `?${query}` : ''}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      return { success: false, error: error.message || 'Error al obtener titulares' };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching titulares:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error de conexión' };
  }
}

export async function getTitularByIdAction(
  token: string,
  id: string
): Promise<{ success: boolean; data?: TitularWithEstablecimientos; error?: string }> {
  const { baseUrl, apiKey } = getApiConfig();

  try {
    const response = await fetch(`${baseUrl}/api/v1/ganado/titulares/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      return { success: false, error: error.message || 'Titular no encontrado' };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error de conexión' };
  }
}

export async function createTitularAction(
  token: string,
  data: CreateTitularDto
): Promise<{ success: boolean; data?: Titular; error?: string }> {
  const { baseUrl, apiKey } = getApiConfig();

  try {
    const response = await fetch(`${baseUrl}/api/v1/ganado/titulares`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      return { success: false, error: error.message || 'Error al crear titular' };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error de conexión' };
  }
}

export async function updateTitularAction(
  token: string,
  id: string,
  data: UpdateTitularDto
): Promise<{ success: boolean; data?: Titular; error?: string }> {
  const { baseUrl, apiKey } = getApiConfig();

  try {
    const response = await fetch(`${baseUrl}/api/v1/ganado/titulares/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      return { success: false, error: error.message || 'Error al actualizar titular' };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error de conexión' };
  }
}

export async function deleteTitularAction(
  token: string,
  id: string
): Promise<{ success: boolean; error?: string }> {
  const { baseUrl, apiKey } = getApiConfig();

  try {
    const response = await fetch(`${baseUrl}/api/v1/ganado/titulares/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      return { success: false, error: error.message || 'Error al eliminar titular' };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error de conexión' };
  }
}

export async function toggleTitularEstadoAction(
  token: string,
  id: string
): Promise<{ success: boolean; data?: Titular; error?: string }> {
  const { baseUrl, apiKey } = getApiConfig();

  try {
    const response = await fetch(
      `${baseUrl}/api/v1/ganado/titulares/${id}/toggle-estado`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      return { success: false, error: error.message || 'Error al cambiar estado' };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error de conexión' };
  }
}
