export class StudioRequestError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function studioRequest(path: string, options?: RequestInit) {
  const response = await fetch(path, {
    ...options,
    credentials: "same-origin",
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new StudioRequestError(
      response.status,
      body?.message || `Request failed (${response.status}).`,
    );
  }

  return response;
}

export function prepareStudioWrite() {
  return studioRequest("/api/host/session", { method: "POST" });
}

export function loginReturnUrl(path: string) {
  return `/login?returnTo=${encodeURIComponent(path)}`;
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Please try again.";
}
