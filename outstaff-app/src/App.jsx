import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageRights from "./pages/ManageRights";
import Logs from "./pages/Logs";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import SalaryReport from "./pages/user/SalaryReport";
import UserLayout from "./components/UserLayout";
import EmployeeMaster from "./pages/user/EmployeeMaster";
import ItemMaster from "./pages/user/ItemMaster";
import VendorMaster from "./pages/user/VendorMaster";
import ProductProcess from "./pages/user/ProductProcess";
import GroupMaster from "./pages/user/GroupMaster";
import DailyProduction from "./pages/user/DailyProduction";
import DailyProductionEntry from "./pages/user/DailyProductionEntry";
import UploadProduction from "./pages/user/UploadProduction";
import ItemWiseReport from "./pages/user/ItemWiseReport";
import EmployeeWiseReport from "./pages/user/EmployeeWiseReport";
import VendorWiseReport from "./pages/user/VendorWiseReport";
import AllPunches from "./pages/AllPunches";

/* ===== TEMP PLACEHOLDER COMPONENT ===== */
const ComingSoon = ({ title }) => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="text-gray-500 mt-2">Module under development...</p>
  </div>
);

function App() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/" element={<Login />} />

      {/* ================= ADMIN ROUTES ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="manage-users" element={<ManageUsers />} />
        <Route path="manage-rights" element={<ManageRights />} />
        <Route path="logs" element={<Logs />} />
        <Route path="all-punches/:id" element={<AllPunches />} />
      </Route>

      {/* ================= USER ROUTES ================= */}
      <Route
  path="/user"
  element={
    <ProtectedRoute>
      <UserLayout />
    </ProtectedRoute>
  }
>
        <Route index element={<UserDashboard />} />
        <Route path="dashboard" element={<UserDashboard />} />

        {/* ===== MASTERS ===== */}
        <Route
          path="employee-master"
          element={
            <ProtectedRoute menuKey="EMPLOYEE_MASTER">
              <EmployeeMaster />
            </ProtectedRoute>
          }
        />

        <Route
          path="item-master"
          element={
            <ProtectedRoute menuKey="ITEM_MASTERS">
              <ItemMaster />
            </ProtectedRoute>
          }
        />

        <Route
          path="contractor-vendor-masters"
          element={
            <ProtectedRoute menuKey="CONTRACTOR_VENDOR_MASTERS">
              <VendorMaster />
            </ProtectedRoute>
          }
        />

        <Route
          path="product-process"
          element={
            <ProtectedRoute menuKey="PRODUCT_PROCESS">
              <ProductProcess />
            </ProtectedRoute>
          }
        />

        <Route
          path="group-master"
          element={
            <ProtectedRoute menuKey="GROUP_MASTER">
              <GroupMaster />
            </ProtectedRoute>
          }
        />

        {/* ===== DAILY TRANSACTION ===== */}
        <Route
          path="daily-production"
          element={
            <ProtectedRoute menuKey="DAILY_PRODUCTION">
              <DailyProduction />
            </ProtectedRoute>
          }
        />

        <Route
          path="daily-production/add"
          element={
            <ProtectedRoute menuKey="DAILY_PRODUCTION">
              <DailyProductionEntry mode="add" />
            </ProtectedRoute>
          }
        />

        <Route
          path="daily-production/edit"
          element={
            <ProtectedRoute menuKey="DAILY_PRODUCTION">
              <DailyProductionEntry mode="edit" />
            </ProtectedRoute>
          }
        />

        {/* ===== FUTURE MODULES (Placeholders) ===== */}

        <Route
          path="monthly-production"
          element={
            <ProtectedRoute menuKey="MONTHLY_PRODUCTION">
              <ComingSoon title="Monthly Production" />
            </ProtectedRoute>
          }
        />

        <Route
          path="advance-upload"
          element={
            <ProtectedRoute menuKey="ADVANCE_UPLOAD">
              <ComingSoon title="Advance Upload" />
            </ProtectedRoute>
          }
        />

        {/* ===== REPORTS ===== */}

        <Route
          path="employee-wise-report"
          element={
            <ProtectedRoute menuKey="EMPLOYEE_WISE_REPORT">
              <EmployeeWiseReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="contractor-vendor-wise-report"
          element={
            <ProtectedRoute menuKey="CONTRACTOR_VENDOR_WISE_REPORT">
              <VendorWiseReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="salary-report"
          element={
            <ProtectedRoute menuKey="SALARY_REPORT">
              <SalaryReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="upload-production"
          element={
            <ProtectedRoute menuKey="UPLOAD_PRODUCTION">
              <UploadProduction />
            </ProtectedRoute>
          }
        />

        <Route
          path="item-wise-report"
          element={
            <ProtectedRoute menuKey="ITEM_WISE_REPORT">
              <ItemWiseReport />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* UNAUTHORIZED */}
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}

export default App;
