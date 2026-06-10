import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function UploadProduction() {

  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: "error", text: "Please select a file" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("production_date", date);

    try {
      setLoading(true);
      setMessage(null);

      await axios.post(
        "http://localhost:5000/upload-production",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage({ type: "success", text: "Upload successful!" });
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Upload failed. Please check file format." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-gradient-to-br from-blue-50 to-violet-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upload Production</h1>
        <p className="text-gray-600">
          Import daily production data via Excel or CSV
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* UPLOAD CARD */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">

          {/* DATE */}
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-700">
              Production Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border px-4 py-2 rounded-xl w-full focus:ring-2 focus:ring-violet-400 outline-none"
            />
          </div>

          {/* FILE DROP AREA */}
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-700">
              Select Excel / CSV File
            </label>

            <div className="border-2 border-dashed border-violet-400 
                            rounded-xl p-6 text-center 
                            hover:bg-violet-50 transition">

              <input
                type="file"
                accept=".xlsx,.csv"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="fileUpload"
              />

              <label htmlFor="fileUpload" className="cursor-pointer">
                {file ? (
                  <p className="text-violet-600 font-medium">
                    📄 {file.name}
                  </p>
                ) : (
                  <p className="text-gray-500">
                    Drag & Drop file here or <span className="text-violet-600 font-semibold">Browse</span>
                  </p>
                )}
              </label>
            </div>
          </div>

          {/* MESSAGE */}
          {message && (
            <div className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium
              ${message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"}`}>
              {message.text}
            </div>
          )}

          {/* BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-violet-600 
                       text-white py-3 rounded-xl shadow-lg font-semibold
                       disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Production"}
          </motion.button>

        </div>

        {/* FORMAT GUIDE CARD */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">

          <h2 className="text-xl font-bold mb-4 text-gray-800">
            File Format Guide
          </h2>

          <div className="bg-gray-100 rounded-xl p-4 mb-4">
            <pre className="text-sm text-gray-700">
employee_code,item_code,qty
EMP001,1001,25
EMP002,1002,30
            </pre>
          </div>

          <ul className="text-sm text-gray-600 space-y-2">
            <li>• First row must contain column headers</li>
            <li>• File type: .xlsx or .csv only</li>
            <li>• employee_code must exist in system</li>
            <li>• item_code must exist in system</li>
            <li>• qty must be numeric</li>
          </ul>

          <div className="mt-6 bg-blue-50 p-4 rounded-xl text-sm text-blue-700">
            💡 Tip: Ensure no empty rows or extra columns exist.
          </div>

        </div>

      </div>

    </div>
  );
}