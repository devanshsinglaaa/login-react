import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DailyProduction() {
  const navigate = useNavigate();

  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];

  const perm = permissions.find((p) => p.menu_key === "DAILY_PRODUCTION") || {};

  const canAdd = perm.can_add === 1;
  const canEdit = perm.can_edit === 1;
  const canDelete = perm.can_delete === 1;

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000/production-list");
    setData(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this entry?")) {
      await axios.delete(`http://localhost:5000/delete-production/${id}`);
      fetchData();
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Daily Production
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage daily production entries
          </p>
        </div>

        <div className="flex gap-3">

          {canAdd && (
            <button
              onClick={() => navigate("/user/daily-production/add")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition shadow-sm"
            >
              + Add Production
            </button>
          )}

          {canEdit && (
            <button
              onClick={() => navigate("/user/daily-production/edit")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
            >
              ✏ Edit Production
            </button>
          )}

        </div>

      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-600 sticky top-0">

              <tr>
                <th className="py-3 px-4 text-left font-semibold">Date</th>
                <th className="py-3 px-4 text-left font-semibold">Emp Code</th>
                <th className="py-3 px-4 text-left font-semibold">Emp Name</th>
                <th className="py-3 px-4 text-left font-semibold">Item Code</th>
                <th className="py-3 px-4 text-left font-semibold">Item Name</th>
                <th className="py-3 px-4 text-left font-semibold">Rate</th>
                <th className="py-3 px-4 text-left font-semibold">Qty</th>
                <th className="py-3 px-4 text-left font-semibold">Total</th>

                {(canEdit || canDelete) && (
                  <th className="py-3 px-4 text-center font-semibold">
                    Action
                  </th>
                )}

              </tr>

            </thead>

            <tbody>

              {data.length === 0 && (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center py-10 text-gray-400"
                  >
                    No production data available
                  </td>
                </tr>
              )}

              {data.map((row) => (
                <tr
                  key={row.production_id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  <td className="py-3 px-4">
                    {new Date(row.production_date).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4">{row.employee_code}</td>

                  <td className="py-3 px-4 font-medium text-gray-700">
                    {row.employee_name}
                  </td>

                  <td className="py-3 px-4">{row.item_code}</td>

                  <td className="py-3 px-4">{row.item_name}</td>

                  <td className="py-3 px-4">
                    ₹{row.item_rate}
                  </td>

                  <td className="py-3 px-4">{row.qty}</td>

                  <td className="py-3 px-4 font-semibold text-gray-800">
                    ₹{row.total}
                  </td>

                  {(canEdit || canDelete) && (
                    <td className="py-3 px-4 text-center">

                      {canDelete && (
                        <button
                          onClick={() => handleDelete(row.production_id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      )}

                    </td>
                  )}

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}