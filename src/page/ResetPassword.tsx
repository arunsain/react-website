import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import MainLayout from "../layout/MainLayout";

interface ValidationErrors {
    email?: string[];
    password?: string[];
    password_confirmation?: string[];
    token?: string[];
}

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

const ResetPassword: React.FC = () => {
    const query = useQuery();
    const [email, setEmail] = useState(decodeURIComponent(query.get("email") || ""));
    const [token] = useState(query.get("token") || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError("");
        setValidationErrors({});

        try {
            await axiosInstance.post("/reset-password", {
                token,
                email,
                password,
                password_confirmation: confirmPassword,
            });
            setSuccess(true);
            setPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            const { message, errors } = err?.response?.data || {};
            setError(message || "Password reset failed");
            setValidationErrors(errors || {});
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-900 via-blue-900 to-black">
                <div className="w-full max-w-md">
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-white text-center mb-2">
                            Reset Password
                        </h2>
                        <p className="text-cyan-400 text-sm text-center mb-8">
                            Enter a new password to secure your account
                        </p>

                        {success && (
                            <div className="mb-6 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm text-center backdrop-blur-sm">
                                Password has been reset successfully!
                            </div>
                        )}

                        {/* Email */}
                        <div className="mb-5 group">
                            <label className="block text-gray-200 text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500
                                ${validationErrors.email ? "border-red-500 ring-2 ring-red-500/50" : "border-white/20"}
                                `}
                            />
                            {validationErrors.email && (
                                <p className="text-red-400 text-xs mt-1.5">{validationErrors.email[0]}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="mb-5 group">
                            <label className="block text-gray-200 text-sm font-medium mb-2">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500
                                ${validationErrors.password ? "border-red-500 ring-2 ring-red-500/50" : "border-white/20"}
                                `}
                            />
                            {validationErrors.password && (
                                <p className="text-red-400 text-xs mt-1.5">{validationErrors.password[0]}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-6 group">
                            <label className="block text-gray-200 text-sm font-medium mb-2">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500
                                ${validationErrors.password_confirmation ? "border-red-500 ring-2 ring-red-500/50" : "border-white/20"}
                                `}
                            />
                            {validationErrors.password_confirmation && (
                                <p className="text-red-400 text-xs mt-1.5">{validationErrors.password_confirmation[0]}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl text-white font-semibold shadow-lg
                            transform transition-all duration-200 active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    <span>Resetting...</span>
                                </>
                            ) : (
                                <>
                                    <span>Reset Password</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </>
                            )}
                        </button>

                        {/* General Error */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm text-center backdrop-blur-sm">
                                {error}
                            </div>
                        )}

                        <p className="text-center text-gray-400 text-xs mt-6">
                            Secured with end-to-end encryption
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ResetPassword;
