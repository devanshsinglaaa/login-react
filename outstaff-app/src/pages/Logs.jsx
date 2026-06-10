import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Logs() {

  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/admin/users");
    setUsers(res.data);
  };

  const fetchLogs = async (user) => {

    setSelectedUser(user);

    const res = await axios.get(
      `http://localhost:5000/admin/user-logs/${user.id}`
    );

    setLogs(res.data);
  };

  /* ===== FORMAT TIME FUNCTION ===== */

  const formatTime = (time) => {

    if (!time) return "-";

    const date = new Date(time);

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

  };

  return (
    <div className="grid grid-cols-2 gap-6">

      {/* USERS PANEL */}

      <div className="bg-white rounded-xl shadow">

        <div className="p-4 border-b font-semibold">
          Users
        </div>

        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-center">Logs</th>
            </tr>
          </thead>

          <tbody>

            {users.map((u, index) => (

              <tr key={u.id} className="border-b">

                <td className="p-2">{index + 1}</td>
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>

                <td className="p-2 text-center">

                  <button
                    onClick={() => fetchLogs(u)}
                    className="bg-purple-600 text-white px-3 py-1 rounded"
                  >
                    👁
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* LOGIN HISTORY */}

      <div className="bg-white rounded-xl shadow">

        <div className="flex justify-between items-center p-4 border-b">

          <span className="font-semibold">
            Login History
          </span>

          {selectedUser && (

            <Link
              to={`/admin/all-punches/${selectedUser.id}`}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm"
            >
              See all punches
            </Link>

          )}

        </div>

        {selectedUser && (

          <div className="p-4 text-sm text-gray-700">
            {selectedUser.name} ({selectedUser.email})
          </div>

        )}

        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Login</th>
              <th className="p-2">Logout</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>

          <tbody>

            {logs.map((log, index) => (

              <tr key={log.id} className="border-b">

                <td className="p-2">{index + 1}</td>

                <td className="p-2">
                  {formatTime(log.in_time)}
                </td>

                <td className="p-2">
                  {formatTime(log.out_time)}
                </td>

                <td className="p-2">

                  {log.flag === "O" ? (

                    <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs">
                      Logged Out
                    </span>

                  ) : (

                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                      Logged In
                    </span>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}