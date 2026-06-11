// In a static build there is no separate backend service to talk to. Instead
// `apiClient` resolves paths into JSON files located under `/data`. A call
// like `apiClient('/industries')` will read from `/data/industries.json`. For
// non‑GET requests the function returns a dummy successful response.
const API_BASE_URL = "/data";

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  // Normalise the path: strip any leading slash and append `.json` if
  // necessary. Nested paths like `/categories/123` will be truncated to the
  // base collection name because the static JSON files contain lists of
  // records rather than individual objects.
  const clean = path.replace(/^\/+/, "");
  const collection = clean.split("/")[0];
  const jsonPath = `${API_BASE_URL}/${collection}.json`;

  // If the request is not a GET, there is no backend to process it. Return a
  // dummy object so that UI flows relying on a resolved promise don't break.
  const method = init?.method ? init.method.toUpperCase() : "GET";
  if (method !== "GET") {
    // Simulate a minimal fetch Response for compatibility
    return Promise.resolve({} as T);
  }

  const response = await fetch(jsonPath);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

