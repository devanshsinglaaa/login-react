import { useEffect, useState } from "react";
import axios from "axios";
import { menuConfig } from "../config/menuConfig";

export default function ManageRights() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/all-users-basic");
    setUsers(res.data);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const loadPermissions = async (user) => {
    setSelectedUser(user);
    const res = await axios.get(
      `http://localhost:5000/user-permissions/${user.id}`
    );
    setPermissions(res.data);
  };

  const updatePermission = (menuKey, updatedFields) => {
    setPermissions((prev) => {
      const existing = prev.find((p) => p.menu_key === menuKey);

      if (existing) {
        return prev.map((p) =>
          p.menu_key === menuKey ? { ...p, ...updatedFields } : p
        );
      }

      return [
        ...prev,
        {
          menu_key: menuKey,
          can_active: 0,
          can_add: 0,
          can_edit: 0,
          can_delete: 0,
          can_print: 0,
          ...updatedFields,
        },
      ];
    });
  };

  const handleCheckboxChange = (menuKey, field, value) => {
    updatePermission(menuKey, { [field]: value });
  };

  const handleRowSelectAll = (menuKey, value) => {
    updatePermission(menuKey, {
      can_active: value,
      can_add: value,
      can_edit: value,
      can_delete: value,
      can_print: value,
    });
  };

  const handleSectionSelectAll = (section, value) => {
    section.items.forEach((item) => {
      updatePermission(item.key, {
        can_active: value,
        can_add: value,
        can_edit: value,
        can_delete: value,
        can_print: value,
      });
    });
  };

  const savePermissions = async () => {
    await axios.post("http://localhost:5000/save-permissions", {
      userId: selectedUser.id,
      permissions,
    });

    alert("Permissions Updated Successfully");
  };

  const permissionFields = [
    { key: "can_active", label: "Active" },
    { key: "can_add", label: "Add" },
    { key: "can_edit", label: "Edit" },
    { key: "can_delete", label: "Delete" },
    { key: "can_print", label: "Print" },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold text-purple-700 mb-6">
        Access Control Management
      </h1>

      {!selectedUser ? (
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-700">
              Select User
            </h2>

            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-4 py-2 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                onClick={() => loadPermissions(u)}
                className="border rounded-xl p-5 hover:shadow-xl hover:border-purple-400 transition cursor-pointer bg-gradient-to-br from-white to-purple-50"
              >
                <h3 className="font-semibold text-gray-800">
                  {u.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {u.email}
                </p>
              </div>
            ))}
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl p-8">

          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold text-purple-700">
                Editing: {selectedUser.name}
              </h2>
              <p className="text-gray-500 text-sm">
                {selectedUser.email}
              </p>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="text-sm text-gray-500 hover:text-purple-600"
            >
              ← Back
            </button>
          </div>

          <div className="space-y-8">
            {menuConfig.map((section) => (
              <div
                key={section.category}
                className="border rounded-xl overflow-hidden"
              >

                {/* Section Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 flex justify-between items-center">
                  <span className="font-semibold">
                    {section.category.replace("_", " ")}
                  </span>

                  <button
                    onClick={() => handleSectionSelectAll(section, 1)}
                    className="text-xs bg-white/20 px-3 py-1 rounded hover:bg-white/30"
                  >
                    Select All
                  </button>
                </div>

                <div className="divide-y">
                  {section.items.map((item) => {
                    const perm =
                      permissions.find(
                        (p) => p.menu_key === item.key
                      ) || {};

                    const allChecked =
                      perm.can_active === 1 &&
                      perm.can_add === 1 &&
                      perm.can_edit === 1 &&
                      perm.can_delete === 1 &&
                      perm.can_print === 1;

                    return (
                      <div
                        key={item.key}
                        className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 hover:bg-purple-50 transition"
                      >
                        <div className="font-medium text-gray-800 mb-3 md:mb-0">
                          {item.label}
                        </div>

                        <div className="flex flex-wrap gap-5 items-center">

                          <button
                            onClick={() =>
                              handleRowSelectAll(
                                item.key,
                                allChecked ? 0 : 1
                              )
                            }
                            className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200"
                          >
                            {allChecked
                              ? "Uncheck All"
                              : "Check All"}
                          </button>

                          {permissionFields.map((field) => (
                            <label
                              key={field.key}
                              className="flex items-center gap-2 text-sm text-gray-600"
                            >
                              <input
                                type="checkbox"
                                checked={perm[field.key] === 1}
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    item.key,
                                    field.key,
                                    e.target.checked ? 1 : 0
                                  )
                                }
                                className="w-5 h-5 accent-purple-600"
                              />
                              {field.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            ))}
          </div>

          <div className="flex justify-end mt-10">
            <button
              onClick={savePermissions}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg hover:opacity-90 transition"
            >
              Save Changes
            </button>
          </div>

        </div>
      )}
    </div>
  );
}