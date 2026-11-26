const API_ROOT = "https://ecommerce.routemisr.com/api/v1";

type ApiOptions = RequestInit & { token?: string };

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { token: providedToken, ...requestOptions } = options;
  const token =
    providedToken ??
    (typeof window !== "undefined" ? localStorage.getItem("freshcart-token") : null);
  const response = await fetch(`${API_ROOT}${path}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { token } : {}),
      ...requestOptions.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.status === "error") {
    throw new Error(payload.message || "Something went wrong. Please try again.");
  }
  return payload as T;
}

export type ApiEnvelope<T> = {
  status: string;
  results?: number;
  data: T;
  message?: string;
};

export async function getCollection<T>(path: string): Promise<T[]> {
  try {
    const response = await fetch(`${API_ROOT}${path}`, { next: { revalidate: 300 } });
    if (!response.ok) return [];
    const payload = await response.json();
    return payload.data ?? [];
  } catch {
    return [];
  }
}
