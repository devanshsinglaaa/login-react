import { useEffect, useState } from "react";
import axios from "axios";

export default function EmployeeWiseReport() {
  const today = new Date().toISOString().split("T")[0];

  const [employees, setEmployees] = useState([]);
  const [employeeCode, setEmployeeCode] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const res = await axios.get("http://localhost:5000/employees-all");
    setEmployees(res.data);
  };

  // ================= VIEW REPORT =================
  const viewReport = async () => {
    if (!employeeCode) {
      alert("Select employee");
      return;
    }

    setLoading(true);

    const res = await axios.get(
      "http://localhost:5000/report/employee-wise",
      {
        params: {
          employee_code: employeeCode,
          from_date: fromDate,
          to_date: toDate,
        },
      }
    );

    setData(res.data);
    setLoading(false);
  };

  // ================= EXPORT TO EXCEL =================
  const exportToExcel = () => {
    if (data.length === 0) return;

    const headers = [
      "Date",
      "Employee",
      "Item",
      "Qty",
      "Price",
      "Amount",
    ];

    const rows = data.map((r) => [
      new Date(r.production_date).toLocaleDateString(),
      r.employee_name,
      r.item_name,
      r.qty,
      r.price,
      r.amount,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "employee_report.csv";
    link.click();
  };

  const totalAmount = data.reduce(
    (sum, row) => sum + Number(row.amount),
    0
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          📊 Employee Wise Report
        </h1>
        <p className="text-gray-500 mt-1">
          View production details by employee
        </p>
      </div>

      {/* FILTER CARD */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">

          {/* EMPLOYEE FIELD WITH F2 */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">
              Employee Code (Press F2)
            </label>

            <input
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "F2") {
                  e.preventDefault();
                  setShowModal(true);
                }
              }}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">
              Employee Name
            </label>
            <input
              value={employeeName}
              readOnly
              className="border rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border rounded-lg px-3 py-2"
            />
          </div>

          <button
            onClick={viewReport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            {loading ? "Loading..." : "View Report"}
          </button>

          <button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Export Excel
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        {data.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No report data found
          </div>
        ) : (
          <table className="w-full text-sm">

            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Employee</th>
                <th className="px-6 py-3 text-left">Item</th>
                <th className="px-6 py-3 text-right">Qty</th>
                <th className="px-6 py-3 text-right">Price</th>
                <th className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">
                    {new Date(row.production_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">{row.employee_name}</td>
                  <td className="px-6 py-3">{row.item_name}</td>
                  <td className="px-6 py-3 text-right">{row.qty}</td>
                  <td className="px-6 py-3 text-right">
                    ₹ {Number(row.price).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-right font-medium">
                    ₹ {Number(row.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot className="bg-gray-100 font-semibold">
              <tr>
                <td colSpan="5" className="px-6 py-4 text-right">
                  Grand Total
                </td>
                <td className="px-6 py-4 text-right text-lg text-blue-700">
                  ₹ {totalAmount.toLocaleString()}
                </td>
              </tr>
            </tfoot>

          </table>
        )}
      </div>

      {/* ================= F2 MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-xl w-[500px] p-4">

            <h2 className="text-lg font-semibold mb-3">
              Select Employee
            </h2>

            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-3 py-2 rounded w-full mb-3"
              autoFocus
            />

            <div className="max-h-60 overflow-y-auto border rounded">
              {employees
                .filter((e) =>
                  e.employee_code
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  e.employee_name
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map((e) => (
                  <div
                    key={e.employee_code}
                    onClick={() => {
                      setEmployeeCode(e.employee_code);
                      setEmployeeName(e.employee_name);
                      setShowModal(false);
                    }}
                    className="p-2 border-b hover:bg-gray-100 cursor-pointer flex justify-between"
                  >
                    <span>{e.employee_code}</span>
                    <span>{e.employee_name}</span>
                  </div>
                ))}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-3 bg-gray-500 text-white px-4 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}