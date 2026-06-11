import { NavLink } from "react-router-dom";

import { adminResources } from "@/features/admin/config/resources";

export function AdminSidebar() {
  // Use a static relative path for the logo when no backend is present.
  const logoSrc = "/assets/images/logo.webp";

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo-wrap">
        <img
          src={logoSrc}
          alt="Silvertoos"
          className="admin-sidebar-logo"
          onError={(event) => {
            const target = event.currentTarget;
            target.style.display = "none";
          }}
        />
      </div>
      <nav className="admin-sidebar-nav">
        <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? "is-active" : "")}>Overview</NavLink>
        {adminResources.map((resource) => (
          <NavLink key={resource.key} to={resource.route} className={({ isActive }) => (isActive ? "is-active" : "")}>
            {resource.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
