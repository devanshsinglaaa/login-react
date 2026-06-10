import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function ProductProcess() {

  /* ================= PERMISSIONS ================= */
  const permissions =
    JSON.parse(localStorage.getItem("permissions")) || [];

  const processPerm =
    permissions.find(p => p.menu_key === "PRODUCT_PROCESS") || {};

  const canAdd = processPerm.can_add === 1;
  const canEdit = processPerm.can_edit === 1;
  const canDelete = processPerm.can_delete === 1;

  /* ================= STATES ================= */
  const [processes, setProcesses] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    item_process_name: "",
    status: "Active"
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    fetchProcesses();
  }, []);

  const fetchProcesses = async () => {
    const res = await axios.get("http://localhost:5000/item-processes-all");
    setProcesses(res.data);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!form.item_process_name) {
      alert("Process name required");
      return;
    }

    if (editData) {
      await axios.put(
        `http://localhost:5000/update-process/${editData.item_process_id}`,
        form
      );
    } else {
      await axios.post(
        "http://localhost:5000/add-process",
        form
      );
    }

    resetForm();
    fetchProcesses();
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (window.confirm("Delete this process?")) {
      await axios.delete(
        `http://localhost:5000/delete-process/${id}`
      );
      fetchProcesses();
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (process) => {
    setEditData(process);
    setForm({
      item_process_name: process.item_process_name,
      status: process.status === 1 ? "Active" : "Inactive"
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({
      item_process_name: "",
      status: "Active"
    });
    setEditData(null);
    setShowModal(false);
  };

  /* ================= ANALYTICS ================= */

  const activeCount = processes.filter(p => p.status === 1).length;
  const inactiveCount = processes.length - activeCount;

  const statusData = [
    { name: "Active", value: activeCount },
    { name: "Inactive", value: inactiveCount },
  ];

  const COLORS = ["#6366F1", "#F43F5E"]; // Indigo + Pink

  const filteredProcesses = processes.filter(p =>
    p.item_process_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-indigo-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Product Process</h1>
          <p className="text-gray-500">
            Manage production workflow stages
          </p>
        </div>

        {canAdd && (
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-indigo-500 to-pink-500 
                       text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition"
          >
            + Add Process
          </button>
        )}
      </div>

      {/* ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        {/* DONUT CHART */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="font-semibold mb-4 text-center">
            Process Status Overview
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                innerRadius={55}
                outerRadius={85}
              >
                {statusData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* STATUS BAR */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="font-semibold mb-4 text-center">
            Active vs Inactive Comparison
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          placeholder="Search process..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-xl w-full shadow-sm"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white">
            <tr>
              <th className="p-3 text-left">Process Name</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProcesses.map(process => (
              <tr key={process.item_process_id}
                  className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {process.item_process_name}
                </td>
                <td>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${process.status === 1
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-pink-100 text-pink-600"}`}>
                    {process.status === 1 ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="text-center space-x-2">
                  {canEdit && (
                    <button
                      onClick={() => handleEdit(process)}
                      className="bg-indigo-500 text-white px-3 py-1 rounded-lg"
                    >
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(process.item_process_id)}
                      className="bg-pink-500 text-white px-3 py-1 rounded-lg"
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
            className="bg-white p-6 rounded-2xl w-[400px] shadow-2xl"
          >
            <h2 className="text-xl font-bold mb-4">
              {editData ? "Edit Process" : "Add Process"}
            </h2>

            <input
              type="text"
              placeholder="Process Name"
              value={form.item_process_name}
              onChange={e =>
                setForm({ ...form, item_process_name: e.target.value })
              }
              className="border w-full mb-3 px-3 py-2 rounded-xl"
            />

            <select
              value={form.status}
              onChange={e =>
                setForm({ ...form, status: e.target.value })
              }
              className="border w-full mb-4 px-3 py-2 rounded-xl"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="flex justify-end space-x-3">
              <button
                onClick={resetForm}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-gradient-to-r from-indigo-500 to-pink-500 
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