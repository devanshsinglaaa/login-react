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

export default function GroupMaster() {

  /* ================= PERMISSIONS ================= */
  const permissions =
    JSON.parse(localStorage.getItem("permissions")) || [];

  const groupPerm =
    permissions.find(p => p.menu_key === "GROUP_MASTER") || {};

  const canAdd = groupPerm.can_add === 1;
  const canEdit = groupPerm.can_edit === 1;
  const canDelete = groupPerm.can_delete === 1;

  /* ================= STATES ================= */
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    item_group_name: "",
    status: "Active"
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const res = await axios.get("http://localhost:5000/item-groups-all");
    setGroups(res.data);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!form.item_group_name) {
      alert("Group name required");
      return;
    }

    if (editData) {
      await axios.put(
        `http://localhost:5000/update-group/${editData.item_group_id}`,
        form
      );
    } else {
      await axios.post(
        "http://localhost:5000/add-group",
        form
      );
    }

    resetForm();
    fetchGroups();
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (window.confirm("Delete this group?")) {
      await axios.delete(
        `http://localhost:5000/delete-group/${id}`
      );
      fetchGroups();
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (group) => {
    setEditData(group);
    setForm({
      item_group_name: group.item_group_name,
      status: group.status === 1 ? "Active" : "Inactive"
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({
      item_group_name: "",
      status: "Active"
    });
    setEditData(null);
    setShowModal(false);
  };

  /* ================= ANALYTICS ================= */

  const activeCount = groups.filter(g => g.status === 1).length;
  const inactiveCount = groups.length - activeCount;

  const statusData = [
    { name: "Active", value: activeCount },
    { name: "Inactive", value: inactiveCount },
  ];

  const COLORS = ["#14B8A6", "#0EA5E9"]; // Teal + Sky Blue

  const filteredGroups = groups.filter(g =>
    g.item_group_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-teal-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Group Master</h1>
          <p className="text-gray-500">
            Manage product group classifications
          </p>
        </div>

        {canAdd && (
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-teal-500 to-sky-500 
                       text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition"
          >
            + Add Group
          </button>
        )}
      </div>

      {/* ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        {/* DONUT CHART */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="font-semibold mb-4 text-center">
            Group Status Overview
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

        {/* BAR CHART */}
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
          placeholder="Search group..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-xl w-full shadow-sm"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-teal-600 to-sky-600 text-white">
            <tr>
              <th className="p-3 text-left">Group Name</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.map(group => (
              <tr key={group.item_group_id}
                  className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {group.item_group_name}
                </td>
                <td>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${group.status === 1
                      ? "bg-teal-100 text-teal-700"
                      : "bg-sky-100 text-sky-600"}`}>
                    {group.status === 1 ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="text-center space-x-2">
                  {canEdit && (
                    <button
                      onClick={() => handleEdit(group)}
                      className="bg-teal-500 text-white px-3 py-1 rounded-lg"
                    >
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(group.item_group_id)}
                      className="bg-sky-500 text-white px-3 py-1 rounded-lg"
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
              {editData ? "Edit Group" : "Add Group"}
            </h2>

            <input
              type="text"
              placeholder="Group Name"
              value={form.item_group_name}
              onChange={e =>
                setForm({ ...form, item_group_name: e.target.value })
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
                className="bg-gradient-to-r from-teal-500 to-sky-500 
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