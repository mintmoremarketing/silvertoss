import { Navigate, createBrowserRouter } from "react-router-dom";

import AppLayout from "@/app/layouts/AppLayout";
import { routePaths } from "@/app/router/routePaths";
import { ProtectedAdminRoute } from "@/features/admin/components/ProtectedAdminRoute";
import { adminResources } from "@/features/admin/config/resources";
import { AdminDashboardPage } from "@/features/admin/pages/AdminDashboardPage";
import { AdminLoginPage } from "@/features/admin/pages/AdminLoginPage";
import { AdminResourcePage } from "@/features/admin/pages/AdminResourcePage";
import { HomePage } from "@/pages/HomePage";
import { Investors } from "@/pages/Investors";

const adminChildRoutes = [
  {
    index: true,
    element: <Navigate replace to="dashboard" />,
  },
  {
    path: "dashboard",
    element: <AdminDashboardPage />,
  },
  ...adminResources.map((resource) => ({
    path: resource.route.replace("/admin/", ""),
    element: <AdminResourcePage />,
  })),
];



const router = createBrowserRouter(
  [
    {
      path: routePaths.home,
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "investors",
          element: <Investors />,
        },
        {
          path: "*",
          element: <div>Page Not Found</div>,
        },
      ],
    },
    {
      path: "/admin/login",
      element: <AdminLoginPage />,
    },
    {
      path: "/admin",
      element: <ProtectedAdminRoute />,
      children: adminChildRoutes,
    },
    {
      path: "*",
      element: <div>Page Not Found</div>,
    },
  ],
  // {
  //   basename: "/new_silvertoss",
  // }
);

export default router;
