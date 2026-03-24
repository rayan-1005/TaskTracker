import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Hit your /auth/login endpoint
      const { data } = await API.post("/auth/login", formData);

      // 2. Save Access Token (Refresh Token is handled automatically via cookies)
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      // 3. Update Global State & Redirect
      setUser(data.user);
      navigate("/chat");
    } catch (err) {
      // Handle specific backend errors (e.g., 401 Invalid Credentials)
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tighter text-white">
          Chatterbox
        </h1>
        <p className="text-zinc-500 mt-2">Welcome back, sign in to continue</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400 ml-1">
            Email
          </label>
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
              size={18}
            />
            <input
              required
              type="email"
              placeholder="name@example.com"
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 outline-none focus:ring-2 focus:ring-white/10 transition-all"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400 ml-1">
            Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
              size={18}
            />
            <input
              required
              type="password"
              placeholder="••••••••"
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 outline-none focus:ring-2 focus:ring-white/10 transition-all"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
        </div>

        {/* Error Message Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20"
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Sign In
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <p className="text-center text-zinc-500 mt-8 text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="text-white font-medium hover:underline">
          Create one for free
        </Link>
      </p>
    </div>
  );
};

export default Login;
