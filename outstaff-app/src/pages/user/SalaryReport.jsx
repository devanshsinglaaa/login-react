import { useEffect, useState } from "react";
import axios from "axios";

export default function SalaryReport() {
  const [type, setType] = useState("vendor");
  const [vendors, setVendors] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [vendorId, setVendorId] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [month, setMonth] = useState("2026-01");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchVendors();
    fetchEmployees();
  }, []);

  const fetchVendors = async () => {
    const res = await axios.get("http://localhost:5000/vendors");
    setVendors(res.data);
  };

  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:5000/employees-all");
    setEmployees(res.data);
  };

  const viewReport = async () => {
    const res = await axios.get("http://localhost:5000/report/salary", {
      params: {
        type,
        vendor_id: vendorId,
        employee_code: employeeCode,
        month
      }
    });
    setData(res.data);
  };

  const totalAmount = data.reduce((sum, row) => sum + Number(row.amount), 0);

  const exportExcel = () => {
    const csv = [
      Object.keys(data[0] || {}).join(","),
      ...data.map(row => Object.values(row).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "salary_report.csv";
    a.click();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">💰 Salary Report</h1>

      {/* FILTER SECTION */}
      <div className="bg-white shadow rounded-xl p-6 mb-6 flex gap-4 flex-wrap items-center">

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border px-3 py-2 rounded-md"
        >
          <option value="vendor">Vendor Wise</option>
          <option value="employee">Employee Wise</option>
          <option value="vendor-employee">Vendor Wise Employee Report</option>
        </select>

        {(type === "vendor" || type === "vendor-employee") && (
          <select
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            className="border px-3 py-2 rounded-md"
          >
            <option value="">-- Select Vendor --</option>
            {vendors.map(v => (
              <option key={v.vendor_id} value={v.vendor_id}>
                {v.vendor_name}
              </option>
            ))}
          </select>
        )}

        {type === "employee" && (
          <select
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
            className="border px-3 py-2 rounded-md"
          >
            <option value="">-- Select Employee --</option>
            {employees.map(e => (
              <option key={e.employee_code} value={e.employee_code}>
                {e.employee_name}
              </option>
            ))}
          </select>
        )}

        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border px-3 py-2 rounded-md"
        />

        <button
          onClick={viewReport}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          View
        </button>

        <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Export Excel
        </button>

      </div>

      {/* TABLE */}
      {data.length > 0 && (
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                {Object.keys(data[0]).map((col) => (
                  <th key={col} className="px-4 py-3 text-left">
                    {col.replace("_", " ").toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="px-4 py-2">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}

              <tr className="bg-gray-100 font-bold">
                <td colSpan="100%" className="px-4 py-3 text-right">
                  TOTAL: {totalAmount.toLocaleString()}
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}