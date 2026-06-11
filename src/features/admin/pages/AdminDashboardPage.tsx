import { Link } from "react-router-dom";

import { adminResources } from "@/features/admin/config/resources";

export function AdminDashboardPage() {
  return (
    <div className="admin-table">
      <h2>Overview</h2>
      <p>Use quick links to open each admin module.</p>
      <div className="admin-grid">
        {adminResources.map((resource) => (
          <Link key={resource.key} className="admin-card" to={resource.route}>
            <h3>{resource.label}</h3>
            <p>Manage {resource.label.toLowerCase()} records.</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
