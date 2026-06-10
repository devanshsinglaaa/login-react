import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    yesterday: 0,
    last7Days: 0,
    last30Days: 0,
  });

  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin-stats");

      if (res.data?.stats) setStats(res.data.stats);
      if (res.data?.users) setUsers(res.data.users);

      if (res.data?.weekly) {
        setWeeklyData(
          res.data.weekly.map((item) => ({
            name: item.day,
            users: item.users,
          }))
        );
      }

      if (res.data?.monthly) {
        setMonthlyData(
          res.data.monthly.map((item) => ({
            name: item.month,
            users: item.users,
          }))
        );
      }

    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const pieData = [
    { name: "Total Users", value: stats.totalUsers || 0 },
    { name: "Last 30 Days", value: stats.last30Days || 0 },
  ];

  const COLORS = ["#7c3aed", "#c4b5fd"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-semibold text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-10 text-purple-700">
        Admin Dashboard
      </h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Yesterday" value={stats.yesterday} />
        <StatCard title="Last 7 Days" value={stats.last7Days} />
        <StatCard title="Last 30 Days" value={stats.last30Days} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-2 gap-8">

        {/* Monthly Growth (Area) */}
        <Card title="Monthly Growth">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="purpleArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.7}/>
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#555" />
              <YAxis stroke="#555" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#7c3aed"
                fill="url(#purpleArea)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Weekly Registrations */}
        <Card title="Weekly Registrations">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="name" stroke="#555" />
              <YAxis stroke="#555" />
              <Tooltip />
              <Bar dataKey="users" fill="#7c3aed" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* User Activity Pie */}
        <Card title="User Activity">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                outerRadius={90}
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Monthly Line */}
        <Card title="Monthly Trend">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="name" stroke="#555" />
              <YAxis stroke="#555" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#7c3aed"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

      </div>

      {/* RECENT USERS */}
      <div className="mt-10">
        <Card title="Recent Users">
          {users.length === 0 ? (
            <p className="text-gray-500">No users found</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-600">
                  <th className="py-2">Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b">
                    <td className="py-2">{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.contact}</td>
                    <td>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
}

/* COMPONENTS */

function StatCard({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl p-6 shadow-lg"
    >
      <h3 className="text-sm opacity-80">{title}</h3>
      <p className="text-3xl font-bold mt-2">
        {Number(value) || 0}
      </p>
    </motion.div>
  );
}

function Card({ title, children }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-6 shadow-md border border-gray-200"
    >
      <h2 className="text-lg font-semibold mb-4 text-purple-700">
        {title}
      </h2>
      {children}
    </motion.div>
  );
}