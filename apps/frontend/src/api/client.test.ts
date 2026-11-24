import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, TOKEN_KEY, apiFetch } from './client';

describe('apiFetch', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('throws ApiError with fieldErrors on a 400 validation_failed response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            title: 'Bad Request',
            status: 400,
            detail: 'Validation failed',
            code: 'validation_failed',
            errors: {
              fullName: 'must not be blank',
              locale: 'must look like pl or en-GB',
            },
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/problem+json' },
          }
        )
      )
    );

    await expect(
      apiFetch('/api/landing/v1/auth/otp/verify', { method: 'POST', body: '{}' })
    ).rejects.toMatchObject({
      name: 'ApiError',
      status: 400,
      code: 'validation_failed',
      message: 'Validation failed',
      fieldErrors: [
        { field: 'fullName', message: 'must not be blank' },
        { field: 'locale', message: 'must look like pl or en-GB' },
      ],
    });
  });

  it('attaches Authorization Bearer header when token is stored in localStorage', async () => {
    localStorage.setItem(TOKEN_KEY, 'test-jwt-token');

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: 'UP' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    await apiFetch('/health');

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = new Headers(init.headers);
    expect(headers.get('Authorization')).toBe('Bearer test-jwt-token');
  });

  it('throws ApiError with status 0 on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(apiFetch('/health')).rejects.toBeInstanceOf(ApiError);
  });
});
