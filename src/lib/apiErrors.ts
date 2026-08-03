import { ApiError } from '../api/client';

export function isNetworkError(err: unknown): boolean {
  return err instanceof TypeError;
}

export function isAuthError(err: unknown): boolean {
  return err instanceof ApiError && (err.status === 401 || err.status === 403);
}