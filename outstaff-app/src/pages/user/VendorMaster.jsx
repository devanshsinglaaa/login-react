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

export default function VendorMaster() {
  /* ================= PERMISSIONS ================= */
  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];

  const vendorPerm =
    permissions.find((p) => p.menu_key === "CONTRACTOR_VENDOR_MASTERS") || {};

  const canAdd = vendorPerm.can_add === 1;
  const canEdit = vendorPerm.can_edit === 1;
  const canDelete = vendorPerm.can_delete === 1;

  /* ================= STATES ================= */
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    vendor_code: "",
    vendor_name: "",
    gst_number: "",
    address: "",
    mobile: "",
    email: "",
    status: "Active",
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    const res = await axios.get("http://localhost:5000/vendors");
    setVendors(res.data);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!form.vendor_code || !form.vendor_name) {
      alert("Vendor Code and Name required");
      return;
    }

    if (editData) {
      await axios.put(
        `http://localhost:5000/update-vendor/${editData.vendor_id}`,
        form,
      );
    } else {
      await axios.post("http://localhost:5000/add-vendor", form);
    }

    resetForm();
    fetchVendors();
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (window.confirm("Delete this vendor?")) {
      await axios.delete(`http://localhost:5000/delete-vendor/${id}`);
      fetchVendors();
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (vendor) => {
    setEditData(vendor);
    setForm({
      vendor_code: vendor.vendor_code,
      vendor_name: vendor.vendor_name,
      gst_number: vendor.gst_number,
      address: vendor.address,
      mobile: vendor.mobile,
      email: vendor.email,
      status: vendor.status === 1 ? "Active" : "Inactive",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({
      vendor_code: "",
      vendor_name: "",
      gst_number: "",
      address: "",
      mobile: "",
      email: "",
      status: "Active",
    });
    setEditData(null);
    setShowModal(false);
  };

  /* ================= ANALYTICS ================= */

  const activeCount = vendors.filter(
    (v) => v.status === 1 || v.status === "Active",
  ).length;
  const inactiveCount = vendors.length - activeCount;

  const statusData = [
    { name: "Active", value: activeCount },
    { name: "Inactive", value: inactiveCount },
  ];

  const COLORS = ["#10B981", "#EF4444"];

  const filteredVendors = vendors.filter((v) =>
    v.vendor_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Vendor Master</h1>
          <p className="text-gray-500">
            Manage contractors & vendor distribution
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
            + Add Vendor
          </button>
        )}
      </div>

      {/* ANALYTICS + STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        {/* STATUS COMPARISON BAR */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="font-semibold mb-4 text-center">
            Active vs Inactive Vendors
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

        {/* STATUS DONUT */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="font-semibold mb-4 text-center">
            Vendor Status Overview
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
          placeholder="Search vendor..."
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
              <th>Mobile</th>
              <th>Email</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map((vendor) => (
              <tr key={vendor.vendor_id} className="border-b hover:bg-gray-50">
                <td className="p-3">{vendor.vendor_code}</td>
                <td>{vendor.vendor_name}</td>
                <td>{vendor.mobile}</td>
                <td>{vendor.email}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      vendor.status === 1 || vendor.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {vendor.status === 1 || vendor.status === "Active"
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>
                <td className="text-center space-x-2">
                  {canEdit && (
                    <button
                      onClick={() => handleEdit(vendor)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                    >
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(vendor.vendor_id)}
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
              {editData ? "Edit Vendor" : "Add Vendor"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Vendor Code"
                value={form.vendor_code}
                onChange={(e) =>
                  setForm({ ...form, vendor_code: e.target.value })
                }
                className="border px-3 py-2 rounded-xl"
              />

              <input
                placeholder="Vendor Name"
                value={form.vendor_name}
                onChange={(e) =>
                  setForm({ ...form, vendor_name: e.target.value })
                }
                className="border px-3 py-2 rounded-xl"
              />

              <input
                placeholder="GST Number"
                value={form.gst_number}
                onChange={(e) =>
                  setForm({ ...form, gst_number: e.target.value })
                }
                className="border px-3 py-2 rounded-xl col-span-2"
              />

              <input
                placeholder="Mobile"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="border px-3 py-2 rounded-xl"
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border px-3 py-2 rounded-xl"
              />

              <input
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="border px-3 py-2 rounded-xl col-span-2"
              />

              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
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
