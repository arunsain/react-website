import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { setUser } from "../features/userSlice";
import axiosInstance from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";

interface ValidationErrors {
  email?: string[];
  password?: string[];
}

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setValidationErrors({});

    try {
      const res = await axiosInstance.post("/login", { email, password });
      const { token, user } = res.data.data;

      // ✅ Save token locally
      localStorage.setItem("token", token);

      // ✅ Fetch user and update Redux store
      dispatch(setUser({ name: user.name, email: user.email, token }));
      //await dispatch(fetchUserAsync());

      // ✅ Redirect to dashboard or home
      navigate("/dashboard");
    } catch (err: any) {
      // Laravel-like error format handling
      if (err) {
        const { message, errors } = err;
        setError(message || "Login failed");
        setValidationErrors(errors || {});
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        {error && (
          <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
        )}

        {/* Email Field */}
        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.email
              ? "border-red-500 focus:ring-red-400"
              : "focus:ring-blue-400"
              }`}
          />
          {validationErrors.email && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.email[0]}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.password
              ? "border-red-500 focus:ring-red-400"
              : "focus:ring-blue-400"
              }`}
          />
          {validationErrors.password && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.password[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all disabled:bg-gray-500"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
