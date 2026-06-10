import { useEffect, useState } from "react";
import axios from "axios";

export default function ItemWiseReport() {
  const today = new Date().toISOString().split("T")[0];

  const [items, setItems] = useState([]);
  const [itemCode, setItemCode] = useState("");
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const res = await axios.get("http://localhost:5000/items-all");
    setItems(res.data);
  };

  const viewReport = async () => {
    if (!itemCode) {
      alert("Please select item");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(
        "http://localhost:5000/report/item-wise",
        {
          params: {
            item_code: itemCode,
            from_date: fromDate,
            to_date: toDate,
          },
        }
      );

      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Error loading report");
    }

    setLoading(false);
  };

  const totalAmount = data.reduce(
    (sum, row) => sum + Number(row.amount),
    0
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          📊 Item Wise Report
        </h1>
        <p className="text-gray-500 mt-1">
          View item production details by date range
        </p>
      </div>

      {/* FILTER CARD */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">

          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">Select Item</label>
            <select
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Item</option>
              {items.map((item) => (
                <option key={item.item_code} value={item.item_code}>
                  {item.item_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            onClick={viewReport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition shadow-sm"
          >
            {loading ? "Loading..." : "View Report"}
          </button>

        </div>
      </div>

      {/* REPORT TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        {data.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No report data found
          </div>
        ) : (
          <table className="w-full text-sm">

            <thead className="bg-gray-900 text-white sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Item</th>
                <th className="px-6 py-3 text-left">Employee</th>
                <th className="px-6 py-3 text-right">Qty</th>
                <th className="px-6 py-3 text-right">Price</th>
                <th className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-3">
                    {new Date(row.production_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">{row.item_name}</td>
                  <td className="px-6 py-3">{row.employee_name}</td>
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
    </div>
  );
}