import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import useAutoLogout from "../hooks/useAutoLogout";
import SessionWarningModal from "./SessionWarningModal";
import SessionTimer from "./SessionTimer";

export default function UserLayout() {

  const { remaining, showWarning, logout } = useAutoLogout();

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* Sidebar */}
      <UserSidebar />

      {/* Content */}
      <div className="ml-64 min-h-screen p-8">
        <Outlet />
      </div>

      {/* Warning Modal */}
      <SessionWarningModal
        show={showWarning}
        countdown={remaining}
        onLogout={logout}
      />

      {/* Timer */}
      <SessionTimer remaining={remaining} />

    </div>
  );
}