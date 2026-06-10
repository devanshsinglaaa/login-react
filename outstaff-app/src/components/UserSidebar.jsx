import { Link, useLocation, useNavigate } from "react-router-dom";
import { menuConfig } from "../config/menuConfig";

export default function UserSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const permissions =
    JSON.parse(localStorage.getItem("permissions")) || [];

  const allowedMenus = permissions
    .filter((p) => p.can_active === 1)
    .map((p) => p.menu_key);

const handleLogout = async () => {

  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id
        }),
      });

      console.log("USER LOGOUT SENT");

    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  localStorage.removeItem("user");
  localStorage.removeItem("permissions");
  localStorage.removeItem("token");

  navigate("/");
};

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white flex flex-col shadow-xl">

      {/* ===== HEADER ===== */}
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-bold tracking-wide">
          User Panel
        </h2>
      </div>

      {/* ===== MENU SECTION (Scrollable if needed) ===== */}
      <div className="flex-1 overflow-y-auto p-6">

        {/* Permanent Dashboard */}
        <div className="mb-6">
          <Link
            to="/user/dashboard"
            className={`block p-2 rounded-lg transition font-medium ${
              location.pathname === "/user/dashboard"
                ? "bg-white/20"
                : "hover:bg-white/10"
            }`}
          >
            Dashboard
          </Link>
        </div>

        {/* Permission Based Sections */}
        {menuConfig.map((section) => {
          const visibleItems = section.items.filter((item) =>
            allowedMenus.includes(item.key)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.category} className="mb-6">

              <h3 className="text-xs uppercase text-purple-300 mb-3 tracking-wider">
                {section.category.replace("_", " ")}
              </h3>

              <ul className="space-y-2">
                {visibleItems.map((item) => {
                  const isActive =
                    location.pathname === item.path;

                  return (
                    <li key={item.key}>
                      <Link
                        to={item.path}
                        className={`block p-2 rounded-lg transition ${
                          isActive
                            ? "bg-white/20"
                            : "hover:bg-white/10"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

            </div>
          );
        })}
      </div>

      {/* ===== LOGOUT (Always Bottom) ===== */}
      <div className="p-6 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 transition py-2 rounded-lg font-medium"
        >
          Logout
        </button>
      </div>

    </div>
  );
}