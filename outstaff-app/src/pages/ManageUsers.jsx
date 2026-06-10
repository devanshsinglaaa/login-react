import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/all-users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddUser = async () => {
    await axios.post("http://localhost:5000/add-user", formData);
    resetModal();
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await axios.delete(`http://localhost:5000/delete-user/${id}`);
      fetchUsers();
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      contact: user.contact,
      password: "",
    });
    setShowModal(true);
  };

  const handleUpdate = async () => {
    await axios.put(
      `http://localhost:5000/update-user/${editUser.id}`,
      formData
    );
    resetModal();
    fetchUsers();
  };

  const resetModal = () => {
    setShowModal(false);
    setEditUser(null);
    setFormData({ name: "", email: "", password: "", contact: "" });
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-purple-700">
            User Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage system users and access
          </p>
        </div>

        <button
          onClick={() => {
            setEditUser(null);
            setShowModal(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          + Add User
        </button>
      </div>

      {/* Search + Table Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200">

        {/* Search Bar */}
        <div className="p-6 border-b flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <span className="text-sm text-gray-500">
            Total: {filteredUsers.length}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                <th className="py-4 px-4 text-left">#</th>
                <th className="px-4 text-left">Name</th>
                <th className="px-4 text-left">Email</th>
                <th className="px-4 text-left">Contact</th>
                <th className="px-4 text-left">Registered</th>
                <th className="px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-gray-400"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, index) => (
                  <tr
                    key={u.id}
                    className="border-t hover:bg-purple-50 transition"
                  >
                    <td className="py-3 px-4 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-4 font-medium text-gray-800">
                      {u.name}
                    </td>
                    <td className="px-4 text-gray-600">
                      {u.email}
                    </td>
                    <td className="px-4">{u.contact}</td>
                    <td className="px-4 text-gray-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(u.id)}
                        className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-[420px] rounded-2xl shadow-xl p-8">

            <h2 className="text-xl font-bold text-purple-700 mb-6">
              {editUser ? "Edit User" : "Add New User"}
            </h2>

            <div className="space-y-4">
              <InputField
                label="Full Name"
                value={formData.name}
                onChange={(val) =>
                  setFormData({ ...formData, name: val })
                }
              />

              <InputField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(val) =>
                  setFormData({ ...formData, email: val })
                }
              />

              {!editUser && (
                <InputField
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(val) =>
                    setFormData({ ...formData, password: val })
                  }
                />
              )}

              <InputField
                label="Contact Number"
                value={formData.contact}
                onChange={(val) =>
                  setFormData({ ...formData, contact: val })
                }
              />
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={resetModal}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>

              <button
                onClick={editUser ? handleUpdate : handleAddUser}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                {editUser ? "Update User" : "Create User"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

/* Reusable Input Component */
function InputField({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}