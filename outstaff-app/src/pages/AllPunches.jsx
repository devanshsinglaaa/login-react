import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function AllPunches() {

  const { id } = useParams();

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const res = await axios.get(
      `http://localhost:5000/admin/all-logs/${id}`
    );
    setLogs(res.data);
  };

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
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-4">
        All Punch History
      </h2>

      <table className="w-full text-sm">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Login Time</th>
            <th className="p-2">Logout Time</th>
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
  );
}