import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function EmployeeMaster() {

  /* ================= PERMISSIONS ================= */
  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];
  const employeePerm =
    permissions.find((p) => p.menu_key === "EMPLOYEE_MASTER") || {};

  const canAdd = employeePerm.can_add === 1;
  const canEdit = employeePerm.can_edit === 1;
  const canDelete = employeePerm.can_delete === 1;

  /* ================= STATES ================= */
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    employee_code: "",
    employee_name: "",
    father_name: "",
    department_id: "",
    designation_id: "",
    vendor_id: "",
    contact: "",
    status: "Active",
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    fetchEmployees();
    fetchDropdowns();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:5000/employees");
    setEmployees(res.data);
  };

  const fetchDropdowns = async () => {
    const dep = await axios.get("http://localhost:5000/departments");
    const des = await axios.get("http://localhost:5000/designations");
    const ven = await axios.get("http://localhost:5000/vendors");

    setDepartments(dep.data);
    setDesignations(des.data);
    setVendors(ven.data);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!form.employee_code || !form.employee_name) {
      alert("Employee Code and Name required");
      return;
    }

    if (editData) {
      await axios.put(
        `http://localhost:5000/update-employee/${editData.employee_id}`,
        form
      );
    } else {
      await axios.post("http://localhost:5000/add-employee", form);
    }

    resetForm();
    fetchEmployees();
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (window.confirm("Delete this employee?")) {
      await axios.delete(`http://localhost:5000/delete-employee/${id}`);
      fetchEmployees();
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (emp) => {
    setEditData(emp);
    setForm({
      employee_code: emp.employee_code,
      employee_name: emp.employee_name,
      father_name: emp.father_name,
      department_id: emp.department_id,
      designation_id: emp.designation_id,
      vendor_id: emp.vendor_id,
      contact: emp.contact,
      status: emp.status,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({
      employee_code: "",
      employee_name: "",
      father_name: "",
      department_id: "",
      designation_id: "",
      vendor_id: "",
      contact: "",
      status: "Active",
    });
    setEditData(null);
    setShowModal(false);
  };

  /* ================= ANALYTICS ================= */

  const activeCount = employees.filter(e => e.status === "Active").length;
  const inactiveCount = employees.filter(e => e.status === "Inactive").length;

  const statusData = [
    { name: "Active", value: activeCount },
    { name: "Inactive", value: inactiveCount },
  ];

  const COLORS = ["#10B981", "#EF4444"];

  const filteredEmployees = employees.filter(emp =>
    emp.employee_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Employee Master</h1>
          <p className="text-gray-500">
            Manage workforce and monitor distribution
          </p>
        </div>

        {canAdd && (
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 
                       text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition"
          >
            + Add Employee
          </button>
        )}
      </div>

      {/* ANALYTICS + STATS (Compact 40-50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 
                       text-white p-6 rounded-xl shadow-lg flex flex-col items-center"
          >
            <p className="text-sm opacity-80">Total Employees</p>
            <h2 className="text-3xl font-bold mt-2">
              {employees.length}
            </h2>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 
                       text-white p-6 rounded-xl shadow-lg flex flex-col items-center"
          >
            <p className="text-sm opacity-80">Departments</p>
            <h2 className="text-3xl font-bold mt-2">
              {departments.length}
            </h2>
          </motion.div>
        </div>

        {/* STATUS CHART */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="font-semibold mb-4 text-center">
            Employee Status Overview
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                innerRadius={50}
                outerRadius={80}
              >
                {statusData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-xl w-full shadow-sm"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3">Code</th>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Vendor</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.employee_id} className="border-b hover:bg-gray-50">
                <td className="p-3">{emp.employee_code}</td>
                <td>{emp.employee_name}</td>
                <td>{emp.department_name}</td>
                <td>{emp.designation_name}</td>
                <td>{emp.vendor_name}</td>
                <td>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${emp.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="text-center space-x-2">
                  {canEdit && (
                    <button
                      onClick={() => handleEdit(emp)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                    >
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(emp.employee_id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-2xl w-[520px] shadow-2xl"
          >
            <h2 className="text-xl font-bold mb-4">
              {editData ? "Edit Employee" : "Add Employee"}
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <input
                placeholder="Employee Code"
                value={form.employee_code}
                onChange={(e) =>
                  setForm({ ...form, employee_code: e.target.value })
                }
                className="border px-3 py-2 rounded-xl"
              />

              <input
                placeholder="Employee Name"
                value={form.employee_name}
                onChange={(e) =>
                  setForm({ ...form, employee_name: e.target.value })
                }
                className="border px-3 py-2 rounded-xl"
              />

              <input
                placeholder="Father Name"
                value={form.father_name}
                onChange={(e) =>
                  setForm({ ...form, father_name: e.target.value })
                }
                className="border px-3 py-2 rounded-xl col-span-2"
              />

              <select
                value={form.department_id}
                onChange={(e) =>
                  setForm({ ...form, department_id: e.target.value })
                }
                className="border px-3 py-2 rounded-xl"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.department_id} value={d.department_id}>
                    {d.department_name}
                  </option>
                ))}
              </select>

              <select
                value={form.designation_id}
                onChange={(e) =>
                  setForm({ ...form, designation_id: e.target.value })
                }
                className="border px-3 py-2 rounded-xl"
              >
                <option value="">Select Designation</option>
                {designations.map((d) => (
                  <option key={d.designation_id} value={d.designation_id}>
                    {d.designation_name}
                  </option>
                ))}
              </select>

              <select
                value={form.vendor_id}
                onChange={(e) =>
                  setForm({ ...form, vendor_id: e.target.value })
                }
                className="border px-3 py-2 rounded-xl"
              >
                <option value="">Select Vendor</option>
                {vendors.map((v) => (
                  <option key={v.vendor_id} value={v.vendor_id}>
                    {v.vendor_name}
                  </option>
                ))}
              </select>

              <input
                placeholder="Contact"
                value={form.contact}
                onChange={(e) =>
                  setForm({ ...form, contact: e.target.value })
                }
                className="border px-3 py-2 rounded-xl"
              />

              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
                className="border px-3 py-2 rounded-xl"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={resetForm}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 
                           text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}