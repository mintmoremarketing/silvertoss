import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { getLoggedInAdmin, type AdminUser } from "@/features/admin/api/authApi";
import { readResponseBody } from "@/features/admin/api/http";
import { AdminLayout } from "@/features/admin/components/AdminLayout";

export function ProtectedAdminRoute() {
  // When there is no backend the admin area is always accessible. Simply
  // render the AdminLayout without performing any authentication checks. A
  // dummy user object can be passed if the layout expects one; otherwise
  // `undefined` works as well.
  return <AdminLayout user={undefined as unknown as AdminUser} />;
}
