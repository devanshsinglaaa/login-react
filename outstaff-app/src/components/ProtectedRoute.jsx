import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, menuKey }) {

  const user = JSON.parse(localStorage.getItem("user"));
  const permissions =
    JSON.parse(localStorage.getItem("permissions")) || [];

  /* ===== LOGIN CHECK ===== */

  if (!user) {
    return <Navigate to="/" replace />;
  }

  /* ===== ROLE PROTECTION ===== */

  const path = window.location.pathname;

  if (path.startsWith("/admin") && user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  if (path.startsWith("/user") && user.role !== "user") {
    return <Navigate to="/unauthorized" replace />;
  }

  /* ===== MENU PERMISSION CHECK ===== */

  if (menuKey) {
    const hasAccess = permissions.some(
      (p) => p.menu_key === menuKey && p.can_active === 1
    );

    if (!hasAccess) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}