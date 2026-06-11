import { Outlet, useNavigate } from "react-router-dom";

import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import type { AdminUser } from "@/features/admin/api/authApi";
import { logoutAdmin } from "@/features/admin/api/authApi";

type AdminLayoutProps = {
  user: AdminUser | null;
};

export function AdminLayout({ user }: AdminLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } finally {
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <section className="admin-dashboard-panel">
        <header className="admin-dashboard-header">
          <div>
            <h1>Welcome back, {user?.name || "Admin"}</h1>
            <p>{user?.email || user?.mobile || "overview"}</p>
          </div>
          <button className="quote-btn" onClick={handleLogout} type="button">
            Logout
          </button>
        </header>
        <Outlet />
      </section>
    </div>
  );
}
