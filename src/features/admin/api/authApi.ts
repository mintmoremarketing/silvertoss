import { apiRequest } from "@/features/admin/api/http";

export type AdminUser = {
  _id?: string;
  name?: string;
  email?: string;
  mobile?: string;
  role?: string;
};

export async function loginAdmin(identifier: string, password: string) {
  const payload: Record<string, string> = { password };

  if (identifier.includes("@")) {
    payload.email = identifier;
  } else {
    payload.mobile = identifier;
  }

  return apiRequest("/login", {
    method: "POST",
    bodyType: "json",
    body: payload,
  });
}

export async function logoutAdmin() {
  return apiRequest("/logout", { method: "GET" });
}

export async function getLoggedInAdmin() {
  return apiRequest("/getLoginUser", { method: "GET" });
}
