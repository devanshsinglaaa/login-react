import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function DailyProductionEntry({ mode }) {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [rows, setRows] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [search, setSearch] = useState("");
  const [modalData, setModalData] = useState([]);
  const [activeRow, setActiveRow] = useState(null);

  const inputRefs = useRef({});

  // ===============================
  // INITIAL LOAD
  // ===============================
  useEffect(() => {
    if (mode === "add") {
      setRows([createEmptyRow()]);
    }
  }, []);

  useEffect(() => {
    if (mode === "edit" && date) {
      loadByDate();
    }
  }, [date]);

  // ===============================
  // CREATE EMPTY ROW
  // ===============================
  const createEmptyRow = () => ({
    production_id: null, // important
    employee_code: "",
    employee_name: "",
    item_code: "",
    item_name: "",
    item_rate: "",
    qty: "",
    total: "",
  });

  // ===============================
  // LOAD DATA (EDIT MODE)
  // ===============================
  const loadByDate = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/production-by-date/${date}`,
      );

      if (!res.data || res.data.length === 0) {
        setRows([]);
        return;
      }

      const formatted = res.data.map((r) => ({
        ...r,
        total: Number(r.item_rate || 0) * Number(r.qty || 0),
      }));

      setRows(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // ADD ROW
  // ===============================
  const addEmptyRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
  };

  // ===============================
  // HANDLE FIELD CHANGE
  // ===============================
  const handleChange = async (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;

    try {
      // 🔹 AUTO FETCH EMPLOYEE
      if (field === "employee_code" && value) {
        const res = await axios.get(
          `http://localhost:5000/employee-by-code/${value}`,
        );

        if (res.data) {
          updated[index].employee_name = res.data.employee_name;
        } else {
          updated[index].employee_name = "";
        }
      }

      // 🔹 AUTO FETCH ITEM
      if (field === "item_code" && value) {
        const res = await axios.get(
          `http://localhost:5000/item-by-code/${value}`,
        );

        if (res.data) {
          updated[index].item_name = res.data.item_name;
          updated[index].item_rate = res.data.item_rate;
        } else {
          updated[index].item_name = "";
          updated[index].item_rate = "";
        }
      }

      // 🔹 AUTO CALCULATE TOTAL
      if (field === "qty") {
        updated[index].total =
          Number(updated[index].item_rate || 0) * Number(value);
      }
    } catch (err) {
      console.log("Auto fetch error:", err);
    }

    setRows(updated);
  };

  // ===============================
  // SAVE (ADD MODE ONLY)
  // ===============================
  const handleSave = async () => {
    if (mode !== "add") return;

    const filteredRows = rows.filter(
      (r) => r.employee_code && r.item_code && r.qty,
    );

    if (filteredRows.length === 0) {
      alert("No valid rows to save");
      return;
    }

    await axios.post("http://localhost:5000/save-production", {
      production_date: date,
      rows: filteredRows,
    });

    alert("Saved Successfully");
    setRows([createEmptyRow()]);
  };

  // ===============================
  // UPDATE (EDIT MODE ONLY)
  // ===============================
  const handleUpdate = async () => {
    if (mode !== "edit") return;

    const updatedRows = rows.filter((r) => r.production_id !== null);

    if (updatedRows.length === 0) {
      alert("Nothing to update");
      return;
    }

    await axios.put("http://localhost:5000/update-production", {
      rows: updatedRows,
    });

    alert("Updated Successfully");
  };

  // ===============================
  // MODAL FUNCTIONS (unchanged)
  // ===============================
  const openModal = async (index, type) => {
    setActiveRow(index);
    setModalType(type);
    setSearch("");

    if (type === "employee") {
      const res = await axios.get("http://localhost:5000/employees-all");
      setModalData(res.data);
    }

    if (type === "item") {
      const res = await axios.get("http://localhost:5000/items-all");
      setModalData(res.data);
    }

    setShowModal(true);
  };

  const selectFromModal = (selected) => {
    const updated = [...rows];

    if (modalType === "employee") {
      updated[activeRow].employee_code = selected.employee_code;
      updated[activeRow].employee_name = selected.employee_name;

      setRows(updated);
      setShowModal(false);

      setTimeout(() => {
        inputRefs.current[`item-${activeRow}`]?.focus();
      }, 100);
    }

    if (modalType === "item") {
      updated[activeRow].item_code = selected.item_code;
      updated[activeRow].item_name = selected.item_name;
      updated[activeRow].item_rate = selected.item_rate;

      setRows(updated);
      setShowModal(false);

      setTimeout(() => {
        inputRefs.current[`qty-${activeRow}`]?.focus();
      }, 100);
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {mode === "edit" ? "Edit Production" : "Add Production"}
      </h1>

      <div className="mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Emp Code</th>
              <th className="p-2 text-left">Emp Name</th>
              <th className="p-2 text-left">Item Code</th>
              <th className="p-2 text-left">Item Name</th>
              <th className="p-2 text-left">Rate</th>
              <th className="p-2 text-left">Qty</th>
              <th className="p-2 text-left">Total</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">
                  <input
                    value={row.employee_code}
                    onChange={(e) =>
                      handleChange(i, "employee_code", e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "F2") {
                        e.preventDefault();
                        openModal(i, "employee");
                      }
                    }}
                    className="border px-2 py-1 rounded w-full"
                  />
                </td>

                <td className="p-2">{row.employee_name}</td>

                <td className="p-2">
                  <input
                    ref={(el) => (inputRefs.current[`item-${i}`] = el)}
                    value={row.item_code}
                    onChange={(e) =>
                      handleChange(i, "item_code", e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "F2") {
                        e.preventDefault();
                        openModal(i, "item");
                      }
                    }}
                    className="border px-2 py-1 rounded w-full"
                  />
                </td>

                <td className="p-2">{row.item_name}</td>
                <td className="p-2">{row.item_rate}</td>

                <td className="p-2">
                  <input
                    ref={(el) => (inputRefs.current[`qty-${i}`] = el)}
                    type="number"
                    value={row.qty}
                    onChange={(e) => handleChange(i, "qty", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addEmptyRow();
                      }
                    }}
                    className="border px-2 py-1 rounded w-full"
                  />
                </td>

                <td className="p-2 font-semibold">{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={addEmptyRow}
          className="mt-3 bg-gray-600 text-white px-3 py-1 rounded text-sm"
        >
          + Add Row
        </button>

        <div className="mt-4">
          {mode === "add" ? (
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          ) : (
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          )}
        </div>
      </div>

      {/* Modal remains same */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[500px] max-h-[500px] p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-2">
              {modalType === "employee" ? "Select Employee" : "Select Item"}
            </h2>

            <input
              type="text"
              placeholder="Search by code or name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-3 py-2 rounded mb-3"
              autoFocus
            />

            <div className="overflow-y-auto flex-1 border rounded">
              {modalData
                .filter((d) =>
                  Object.values(d)
                    .join(" ")
                    .toLowerCase()
                    .includes(search.toLowerCase()),
                )
                .map((d, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectFromModal(d)}
                    className="p-2 border-b hover:bg-gray-100 cursor-pointer flex justify-between"
                  >
                    {modalType === "employee" ? (
                      <>
                        <span>{d.employee_code}</span>
                        <span>{d.employee_name}</span>
                      </>
                    ) : (
                      <>
                        <span>{d.item_code}</span>
                        <span>{d.item_name}</span>
                        <span>{d.item_rate}</span>
                      </>
                    )}
                  </div>
                ))}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-3 bg-gray-500 text-white px-3 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
