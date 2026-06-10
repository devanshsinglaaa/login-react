import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const increment = value / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(counter);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [value]);

  return <>{Number(display).toLocaleString()}</>;
}

function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/dashboard-summary");
      setData(res.data);
    } catch (err) {
      console.error("Dashboard Error:", err);
    }
  };

  if (!data) {
    return (
      <div className="p-10 text-lg text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  /* ================== CLEAN NUMBERS ================== */

  const totalQty = Number(data?.totalProduction?.[0]?.totalQty || 0);
  const totalRevenue = Number(data?.totalRevenue?.[0]?.totalRevenue || 0);
  const totalEmployees = Number(data?.totalEmployees?.[0]?.totalEmployees || 0);
  const totalVendors = Number(data?.totalVendors?.[0]?.totalVendors || 0);

  const monthlyData =
    data?.monthlyProduction?.map((item) => ({
      month: new Date(2026, item.month - 1).toLocaleString("default", {
        month: "short",
      }),
      qty: Number(item.qty),
    })) || [];

  const topItems =
    data?.topItems?.map((item) => ({
      ...item,
      qty: Number(item.qty),
    })) || [];

  const employeeContribution =
    data?.employeeContribution?.map((emp) => ({
      ...emp,
      qty: Number(emp.qty),
    })) || [];

  const pieData = [
    { name: "Revenue", value: totalRevenue },
    { name: "Production", value: totalQty },
  ];

  const masterCounts = data?.masterCounts?.[0] || {};

  const GRADIENTS = [
    "from-indigo-500 to-purple-600",
    "from-purple-500 to-pink-500",
    "from-blue-500 to-indigo-500",
    "from-emerald-500 to-teal-500",
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">

      {/* ================= HEADER ================= */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-gray-500">
          Executive production analytics overview
        </p>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">

        {[
          { title: "Total Production", value: totalQty },
          { title: "Total Revenue", value: totalRevenue },
          { title: "Employees", value: totalEmployees },
          { title: "Vendors", value: totalVendors },
        ].map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className={`bg-gradient-to-r ${GRADIENTS[index]} 
                        text-white p-6 rounded-2xl shadow-lg 
                        flex flex-col items-center justify-center
                        hover:scale-105 transition-transform`}
          >
            <p className="opacity-80 text-sm tracking-wide">
              {card.title}
            </p>
            <h2 className="text-3xl font-bold mt-2">
              <AnimatedNumber value={card.value} />
            </h2>
          </motion.div>
        ))}
      </div>

      {/* ================= MAIN CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

        {/* Monthly Production */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="mb-4 font-semibold text-gray-700">
            Monthly Production
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="qty"
                fill="#4F46E5"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue vs Production */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="mb-4 font-semibold text-gray-700">
            Revenue vs Production
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={70}
                outerRadius={110}
                dataKey="value"
                animationDuration={1000}
              >
                <Cell fill="#4F46E5" />
                <Cell fill="#10B981" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= REPORT VISUALS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

        {/* Top Items */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="mb-4 font-semibold text-gray-700">
            Top 5 Items
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={topItems}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="item_name" type="category" />
              <Tooltip />
              <Bar dataKey="qty" fill="#7C3AED" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Employee Contribution */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="mb-4 font-semibold text-gray-700">
            Employee Contribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={employeeContribution}
                dataKey="qty"
                nameKey="employee_name"
                outerRadius={110}
                animationDuration={1000}
              >
                {employeeContribution.map((_, i) => (
                  <Cell
                    key={i}
                    fill={`hsl(${i * 70}, 70%, 60%)`}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= MASTER COUNTS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">

        {[
          { label: "Employees", value: masterCounts.employees },
          { label: "Items", value: masterCounts.items },
          { label: "Vendors", value: masterCounts.vendors },
          { label: "Processes", value: masterCounts.processes },
          { label: "Groups", value: masterCounts.groups },
        ].map((m, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600
                       text-white p-6 rounded-xl shadow-lg
                       flex flex-col items-center justify-center"
          >
            <p className="text-sm opacity-80">{m.label}</p>
            <h2 className="text-2xl font-bold mt-2">
              {m.value || 0}
            </h2>
          </motion.div>
        ))}
      </div>

    </div>
  );
}

export default UserDashboard;