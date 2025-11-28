import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store/store";
import { setUser } from "./features/userSlice";
import axiosInstance from "./services/axiosInstance";
import { useNavigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

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
      localStorage.setItem("token", token);
      dispatch(setUser({ name: user.name, email: user.email, token }));
      navigate("/dashboard");
    } catch (err: any) {
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
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-900 via-blue-900 to-black relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        {/* Glassmorphic Login Card */}
        <div className="relative w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-[1.01] hover:shadow-green-500/20">
            {/* Logo / Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl mb-4 shadow-lg">
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
               Admin Login
              </h2>
              {/* <p className="text-gray-300 text-sm mt-2">Log in to continue your journey</p> */}
            </div>

            {/* Email Field */}
            <div className="mb-5 group">
              <label className="block text-gray-200 text-sm font-medium mb-2 transition-all group-focus-within:text-green-400">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 pl-11 rounded-xl bg-white/10 border backdrop-blur-md text-white placeholder-gray-400
                    transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                    ${validationErrors.email ? "border-red-500 ring-2 ring-red-500/50" : "border-white/20"
                    }`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
              {validationErrors.email && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  {validationErrors.email[0]}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-6 group">
              <label className="block text-gray-200 text-sm font-medium mb-2 transition-all group-focus-within:text-green-400">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 pl-11 rounded-xl bg-white/10 border backdrop-blur-md text-white placeholder-gray-400
                    transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                    ${validationErrors.password ? "border-red-500 ring-2 ring-red-500/50" : "border-white/20"
                    }`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              {validationErrors.password && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  {validationErrors.password[0]}
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl text-white font-semibold shadow-lg
                transform transition-all duration-200 active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed
                flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Login Securely</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </>
              )}
            </button>

            {/* General Error */}
            {error && !validationErrors.email && !validationErrors.password && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm text-center backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center my-7">
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
              <span className="mx-4 text-gray-400 text-xs font-medium">OR</span>
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            </div>

            {/* Register Link */}
            <p className="text-center text-gray-300 text-sm">
              New here?{" "}
              <span
                onClick={() => navigate("/register")}
                className="font-semibold text-green-400 hover:text-green-300 cursor-pointer transition-colors duration-200 hover:underline"
              >
                Create an account
              </span>
            </p>
          </div>

          {/* Subtle Footer Badge */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">Secured with end-to-end encryption</p>
          </div>
        </div>
      </div>

      {/* Tailwind Animation Delay Helper */}
      {/* <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style> */}
      <style>{`
  @keyframes pulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(1.1); }
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`}</style>

    </MainLayout>
  );
};

export default Login;