export type RequestBodyType = "json" | "formData";

// When running as a purely static site there is no backend. Use the
// `/data` folder to satisfy list requests for collections like categories
// or products. See `convert_bson_to_json.py` for details.
const API_BASE_URL = "/data";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  bodyType?: RequestBodyType;
  body?: FormData | Record<string, unknown>;
};

const joinUrl = (path: string) => {
  // Convert an API path into a JSON file URL. Only the first segment of the
  // path is used because the static JSON files contain lists of records. For
  // example, `/products/123` and `/products` both resolve to `/data/products.json`.
  const clean = path.replace(/^\/+/, "");
  const collection = clean.split("/")[0];
  return `${API_BASE_URL}/${collection}.json`;
};

export async function apiRequest(path: string, options: RequestOptions = {}) {
  const { method = "GET" } = options;
  // Only GET requests are meaningful in a static build. For non‑GET methods
  // return a minimal Response object with an OK status so the UI can proceed.
  if (method.toUpperCase() !== "GET") {
    return new Response(null, { status: 200, statusText: "OK" });
  }
  const url = joinUrl(path);
  return fetch(url);
}

export async function readResponseBody(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return text;
  }
}

export async function extractErrorMessage(response: Response, fallback: string) {
  try {
    const parsed = await readResponseBody(response);

    if (typeof parsed === "string" && parsed.trim()) {
      return parsed;
    }

    if (parsed && typeof parsed === "object") {
      const message = parsed.message;
      if (typeof message === "string" && message.trim()) {
        return message;
      }
    }

    return `${fallback} (${response.status} ${response.statusText || "Error"})`;
  } catch {
    return fallback;
  }
}

export function extractArrayFromPayload(
  payload: unknown,
  preferredKeys: string[]
): Record<string, unknown>[] {
  if (!payload || typeof payload !== "object") return [];
  const data = payload as Record<string, unknown>;

  for (const key of preferredKeys) {
    const value = data[key];
    if (Array.isArray(value)) {
      return value as Record<string, unknown>[];
    }
  }

  const firstArray = Object.values(data).find((value) => Array.isArray(value));
  if (Array.isArray(firstArray)) {
    return firstArray as Record<string, unknown>[];
  }

  return [];
}

export function toAbsoluteAppPath(path: string) {
  // In a static build files live relative to the site root. Simply ensure
  // the returned path begins with a leading slash.
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedPath;
}

const FILE_BASE_URL = "";

export function getFileUrl(filePath: string): string {
  if (!filePath || typeof filePath !== "string") return "";
  // Preserve absolute URLs unchanged. Otherwise prefix a leading slash.
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }
  return filePath.startsWith("/") ? filePath : `/${filePath}`;
}
