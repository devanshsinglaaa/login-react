import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [loginType, setLoginType] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    try {

      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
        type: loginType,
      });

      if (res.data.status === "success") {

        setError("");

        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem(
          "permissions",
          JSON.stringify(res.data.permissions)
        );

        if (res.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }

      } else {
        setError(res.data.message || "Login failed");
      }

    } catch (error) {
      console.error(error);
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6
    bg-gradient-to-br from-purple-200 via-indigo-200 to-purple-300
    animate-gradient">

      {/* Login Card */}
      <div className="w-full max-w-md bg-white/60 backdrop-blur-2xl rounded-3xl p-10 shadow-xl
      animate-fadeIn">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 tracking-wide">
            Outstaff
          </h1>
          <p className="text-gray-500 mt-2">
            Welcome back! Please login.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex mb-6 bg-gray-200 rounded-full p-1 relative">

          <div
            className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-white shadow transition-all duration-300 ${
              loginType === "admin" ? "translate-x-full" : ""
            }`}
          ></div>

          <button
            type="button"
            onClick={() => {
              setLoginType("user");
              setError("");
            }}
            className="w-1/2 py-2 rounded-full font-medium z-10 transition"
          >
            User
          </button>

          <button
            type="button"
            onClick={() => {
              setLoginType("admin");
              setError("");
            }}
            className="w-1/2 py-2 rounded-full font-medium z-10 transition"
          >
            Admin
          </button>

        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>

            <label className="text-sm text-gray-600">Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-3 rounded-xl border
              focus:ring-2 focus:ring-purple-400 outline-none
              transition duration-300 focus:scale-[1.02]"
              required
            />

          </div>

          {/* Password */}
          <div>

            <label className="text-sm text-gray-600">Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-3 rounded-xl border
              focus:ring-2 focus:ring-purple-400 outline-none
              transition duration-300 focus:scale-[1.02]"
              required
            />

            {/* Error */}
            {error && (
              <div className="text-red-500 text-sm mt-2 animate-shake">
                {error}
              </div>
            )}

          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white
            bg-gradient-to-r from-purple-600 to-indigo-600
            transition duration-300 hover:scale-[1.03]
            hover:shadow-lg active:scale-[0.97]"
          >
            Login as {loginType === "admin" ? "Admin" : "User"}
          </button>

        </form>

      </div>

    </div>
  );
}