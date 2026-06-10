import { Link, Outlet, useNavigate } from "react-router-dom";
import useAutoLogout from "../hooks/useAutoLogout";
import SessionWarningModal from "./SessionWarningModal";
import SessionTimer from "./SessionTimer";

export default function AdminLayout() {

  const navigate = useNavigate();

  const { remaining, showWarning, logout } = useAutoLogout();

  const handleLogout = async () => {

    console.log("LOGOUT BUTTON CLICKED");

    const user = JSON.parse(localStorage.getItem("user"));

    console.log("USER DATA:", user);

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

        console.log("LOGOUT API SENT");

      } catch (err) {
        console.error("Logout log error:", err);
      }
    }

    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-purple-900 to-indigo-900 text-white p-6 flex flex-col justify-between">

        <div>
          <h2 className="text-xl font-bold mb-10">Admin Panel</h2>

          <ul className="space-y-4">
            <li>
              <Link to="/admin/dashboard" className="hover:text-purple-300">
                Dashboard
              </Link>
            </li>

            <li>
              <Link to="/admin/manage-users" className="hover:text-purple-300">
                Manage Users
              </Link>
            </li>

            <li>
              <Link to="/admin/manage-rights" className="hover:text-purple-300">
                Manage Rights
              </Link>
            </li>

            <li>
              <Link to="/admin/logs" className="hover:text-purple-300">
                Logs
              </Link>
            </li>
          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 transition text-white py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>

      {/* Session Warning Modal */}
      <SessionWarningModal
        show={showWarning}
        countdown={remaining}
        onLogout={logout}
      />

      {/* Floating Session Timer */}
      <SessionTimer remaining={remaining} />

    </div>
  );
}