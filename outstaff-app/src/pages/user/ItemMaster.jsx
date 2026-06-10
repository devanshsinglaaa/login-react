import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function ItemMaster() {

  const permissions =
    JSON.parse(localStorage.getItem("permissions")) || [];

  const itemPerm =
    permissions.find(p => p.menu_key === "ITEM_MASTERS") || {};

  const canAdd = itemPerm.can_add === 1;
  const canEdit = itemPerm.can_edit === 1;
  const canDelete = itemPerm.can_delete === 1;

  const [items, setItems] = useState([]);
  const [groups, setGroups] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    item_code: "",
    item_name: "",
    item_rate: "",
    item_group_id: "",
    item_process_id: "",
    status: "Active"
  });

  useEffect(() => {
    fetchItems();
    fetchDropdowns();
  }, []);

  const fetchItems = async () => {
    const res = await axios.get("http://localhost:5000/items");
    setItems(res.data);
  };

  const fetchDropdowns = async () => {
    const g = await axios.get("http://localhost:5000/item-groups");
    const p = await axios.get("http://localhost:5000/item-processes");
    setGroups(g.data);
    setProcesses(p.data);
  };

  const handleSave = async () => {
    if (editData) {
      await axios.put(
        `http://localhost:5000/update-item/${editData.item_id}`,
        form
      );
    } else {
      await axios.post("http://localhost:5000/add-item", form);
    }
    setShowModal(false);
    setEditData(null);
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this item?")) {
      await axios.delete(`http://localhost:5000/delete-item/${id}`);
      fetchItems();
    }
  };

  const handleEdit = (item) => {
    setEditData(item);
    setForm({
      item_code: item.item_code,
      item_name: item.item_name,
      item_rate: item.item_rate,
      item_group_id: item.item_group_id,
      item_process_id: item.item_process_id,
      status: item.status === 1 ? "Active" : "Inactive"
    });
    setShowModal(true);
  };

  /* ================== ANALYTICS ================== */

  const activeCount = items.filter(i => i.status === 1).length;
  const inactiveCount = items.filter(i => i.status === 0).length;

  const statusData = [
    { name: "Active", value: activeCount },
    { name: "Inactive", value: inactiveCount }
  ];

  const groupDistribution = groups.map(group => ({
    name: group.item_group_name,
    value: items.filter(i => i.item_group_id === group.item_group_id).length
  }));

  const COLORS = ["#4F46E5", "#EF4444", "#10B981", "#F59E0B"];

  const filteredItems = items.filter(item =>
    item.item_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Item Master</h1>
          <p className="text-gray-500">Manage and analyze inventory items</p>
        </div>

        {canAdd && (
          <button
            onClick={() => {
              setEditData(null);
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 
                       text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition"
          >
            + Add Item
          </button>
        )}
      </div>

      {/* ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

        {/* STATUS PIE */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="font-semibold mb-4">Item Status Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                innerRadius={60}
                outerRadius={100}
                label
              >
                {statusData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* GROUP DISTRIBUTION */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="font-semibold mb-4">Group Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={groupDistribution}
                dataKey="value"
                outerRadius={100}
                label
              >
                {groupDistribution.map((_, index) => (
                  <Cell
                    key={index}
                    fill={`hsl(${index * 60}, 70%, 60%)`}
                  />
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
          placeholder="Search item..."
          value={search}
          onChange={e => setSearch(e.target.value)}
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
              <th>Rate</th>
              <th>Group</th>
              <th>Process</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.item_id} className="border-b hover:bg-gray-50">
                <td className="p-3">{item.item_code}</td>
                <td>{item.item_name}</td>
                <td>₹ {item.item_rate}</td>
                <td>{item.item_group_name}</td>
                <td>{item.item_process_name}</td>
                <td>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${item.status === 1
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"}`}>
                    {item.status === 1 ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="space-x-2">
                  {canEdit && (
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                    >
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(item.item_id)}
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
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-2xl w-[500px] shadow-2xl"
          >
            <h2 className="text-xl font-bold mb-4">
              {editData ? "Edit Item" : "Add Item"}
            </h2>

            <input
              placeholder="Item Code"
              value={form.item_code}
              onChange={e => setForm({ ...form, item_code: e.target.value })}
              className="border w-full mb-3 px-3 py-2 rounded-xl"
            />

            <input
              placeholder="Item Name"
              value={form.item_name}
              onChange={e => setForm({ ...form, item_name: e.target.value })}
              className="border w-full mb-3 px-3 py-2 rounded-xl"
            />

            <input
              placeholder="Rate"
              type="number"
              value={form.item_rate}
              onChange={e => setForm({ ...form, item_rate: e.target.value })}
              className="border w-full mb-3 px-3 py-2 rounded-xl"
            />

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
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