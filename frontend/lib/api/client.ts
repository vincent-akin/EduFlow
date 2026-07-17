const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiFailure {
  success: false;
  message: string;
  errors?: ApiFieldError[];
}

export class ApiError extends Error {
  status: number;
  errors?: ApiFieldError[];

  constructor(message: string, status: number, errors?: ApiFieldError[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

interface RequestOptions extends RequestInit {
  accessToken?: string;
  /** Internal: set on the retried request so we don't refresh-loop forever. */
  _retried?: boolean;
}

async function rawRequest<T>(
  path: string,
  { accessToken, headers, ...init }: RequestOptions
): Promise<{ response: Response; body: ApiSuccess<T> | ApiFailure | null }> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new ApiError(
      `Couldn't reach the EduFlow API at ${API_BASE_URL}. Make sure the backend is running and NEXT_PUBLIC_API_BASE_URL is set correctly — or try one of the demo dashboards below.`,
      0
    );
  }

  const body = (await response.json().catch(() => null)) as
    | ApiSuccess<T>
    | ApiFailure
    | null;

  return { response, body };
}

// Shared across concurrent requests so two 401s don't trigger two refreshes.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  // Lazy import avoids a hard module cycle (store -> client -> store).
  const { useAuthStore } = await import("@/lib/store/auth-store");
  const { refreshToken, isDemo } = useAuthStore.getState();

  if (!refreshToken || isDemo) return null;

  if (!refreshPromise) {
    refreshPromise = rawRequest<{ accessToken: string }>("/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    })
      .then(({ response, body }) => {
        if (!response.ok || !body || body.success === false) return null;
        const newToken = body.data.accessToken;
        useAuthStore.getState().setAccessToken(newToken);
        return newToken;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { response, body } = await rawRequest<T>(path, options);

  if (response.status === 401 && !options._retried) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return apiRequest<T>(path, {
        ...options,
        accessToken: newToken,
        _retried: true,
      });
    }
    // Refresh failed — clear the session so the UI redirects to /login.
    const { useAuthStore } = await import("@/lib/store/auth-store");
    useAuthStore.getState().clearSession();
  }

  if (!response.ok || !body || body.success === false) {
    throw new ApiError(
      body?.message ?? "Something went wrong. Please try again.",
      response.status,
      body && "errors" in body ? body.errors : undefined
    );
  }

  return body.data;
}

export interface ApiListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Same as apiRequest, but automatically attaches the current user's access
 * token — use this from resource files (lib/api/assessments.ts etc.) for
 * every endpoint that isn't under /auth and doesn't return pagination meta.
 */
export async function authedRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { useAuthStore } = await import("@/lib/store/auth-store");
  const { accessToken } = useAuthStore.getState();
  return apiRequest<T>(path, { ...options, accessToken: accessToken ?? undefined });
}

/**
 * For list endpoints that return `meta` alongside `data` (see API doc
 * §"Pagination"). Same auth/refresh handling as authedRequest.
 */
export async function authedRequestPaginated<T>(
  path: string,
  options: RequestOptions = {}
): Promise<{ data: T; meta: ApiListMeta | null }> {
  const { useAuthStore } = await import("@/lib/store/auth-store");
  const { accessToken } = useAuthStore.getState();

  const { response, body } = await rawRequest<T>(path, {
    ...options,
    accessToken: accessToken ?? undefined,
  });

  if (!response.ok || !body || body.success === false) {
    throw new ApiError(
      body?.message ?? "Something went wrong. Please try again.",
      response.status,
      body && "errors" in body ? body.errors : undefined
    );
  }

  return {
    data: body.data,
    meta: "meta" in body ? ((body as { meta?: ApiListMeta }).meta ?? null) : null,
  };
}
