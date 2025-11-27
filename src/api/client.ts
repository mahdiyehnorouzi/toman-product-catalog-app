const API_BASE = "http://localhost:3001/api";

const API_TIMEOUT = 10000; 

import type { BackendErrorResponse } from "../types";

export interface ApiError extends Error {
  details?: BackendErrorResponse;
}

export interface ApiError extends Error {
  status?: number;
  details?: BackendErrorResponse;
}

export type FetchOptions = RequestInit & {
  signal?: AbortSignal;
  timeoutMs?: number;
};

export async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { timeoutMs = API_TIMEOUT, ...fetchOptions } = opts;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(fetchOptions.headers || {}),
      },
      signal: controller.signal,
      ...fetchOptions,
    });

    clearTimeout(timeoutId);

    const isJson =
      res.headers.get("content-type")?.includes("application/json") ?? false;

    const body = isJson ? await res.json().catch(() => null) : null;

    if (!res.ok) {
      const err: ApiError = new Error(body?.message || res.statusText);
      err.status = res.status;
      err.details = body;
      throw err;
    }

    return body as T;
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof DOMException && err.name === "AbortError") {
      const timeoutError: ApiError = new Error("Request timed out.");
      timeoutError.status = 408;
      throw timeoutError;
    }

    if (err instanceof TypeError) {
      const netError: ApiError = new Error("Network error. Please check your connection.");
      netError.status = 0;
      throw netError;
    }

    throw err as ApiError;
  }
}
