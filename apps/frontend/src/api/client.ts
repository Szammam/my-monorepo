import type { FieldError, ProblemDetail } from './types';

const BASE_URL = (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? '').replace(
  /\/+$/,
  ''
);

export const TOKEN_KEY = 'szammam.token';

export class ApiError extends Error {
  status: number;
  code?: string;
  fieldErrors: FieldError[];

  constructor(status: number, message: string, fieldErrors: FieldError[] = [], code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

function extractFieldErrors(problem: Partial<ProblemDetail>): FieldError[] {
  if (Array.isArray(problem.fieldErrors)) {
    return problem.fieldErrors;
  }
  if (problem.errors && typeof problem.errors === 'object') {
    return Object.entries(problem.errors).map(([field, message]) => ({
      field,
      message,
    }));
  }
  return [];
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch (e) {
    if (options.signal?.aborted) throw e;
    throw new ApiError(0, 'Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie.');
  }

  if (!response.ok) {
    const problem: Partial<ProblemDetail> = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      problem.detail ?? 'Wystąpił błąd. Spróbuj ponownie.',
      extractFieldErrors(problem),
      problem.code
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
