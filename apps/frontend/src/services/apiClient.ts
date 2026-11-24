import { ApiError, apiFetch } from '../api/client';
import type { BackendHealthResult } from '../types/api';

const DEFAULT_API_BASE_URL = 'http://localhost:8080';
const DEFAULT_HEALTH_PATH = '/health';

export function getApiBaseUrl(): string {
  const raw = (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL)?.trim();
  const base = raw && raw.length > 0 ? raw : DEFAULT_API_BASE_URL;
  return base.replace(/\/+$/, '');
}

export function getHealthPath(): string {
  const rawPath = import.meta.env.VITE_API_HEALTH_PATH?.trim();
  const path = rawPath && rawPath.length > 0 ? rawPath : DEFAULT_HEALTH_PATH;
  return path.startsWith('/') ? path : `/${path}`;
}

export function getHealthEndpoint(): string {
  return `${getApiBaseUrl()}${getHealthPath()}`;
}

export async function checkBackendHealth(signal?: AbortSignal): Promise<BackendHealthResult> {
  const path = getHealthPath();
  const endpoint = getHealthEndpoint();

  try {
    const data = await apiFetch<unknown>(path, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
    });

    let detail = 'OK';
    if (
      typeof data === 'object' &&
      data !== null &&
      'status' in data &&
      typeof (data as { status: unknown }).status === 'string'
    ) {
      detail = (data as { status: string }).status;
    }

    return {
      state: 'online',
      endpoint,
      httpStatus: 200,
      message: `Connected (${detail})`,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }

    if (error instanceof ApiError) {
      return {
        state: 'offline',
        endpoint,
        httpStatus: error.status || undefined,
        message:
          error.status > 0
            ? `Backend responded with HTTP ${error.status}`
            : `Unavailable (${error.message})`,
      };
    }

    const reason = error instanceof Error ? error.message : 'Unable to reach backend';
    return {
      state: 'offline',
      endpoint,
      message: `Unavailable (${reason})`,
    };
  }
}
