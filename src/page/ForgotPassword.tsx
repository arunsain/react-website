import React, { useState } from "react";
import axiosInstance from "../services/axiosInstance";
import MainLayout from "../layout/MainLayout";

interface ValidationErrors {
    email?: string[];
}

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
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
            await axiosInstance.post("/forgot-password", { email });
            setSuccess(true);
            setEmail("");
        } catch (err: any) {
            const { message, errors } = err?.response?.data || {};
            setError(message || "Failed to send reset link");
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
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M16 12H8m8 0l-4-4m4 4l-4 4M4 16V8a4 4 0 014-4h8a4 4 0 014 4v8a4 4 0 01-4 4H8a4 4 0 01-4-4z" />
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-white text-center mb-2">
                            Forgot Password
                        </h2>
                        <p className="text-cyan-400 text-sm text-center mb-8">
                            We’ll send a reset link to your email
                        </p>

                        {/* Success Message */}
                        {success && (
                            <div className="mb-6 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm text-center backdrop-blur-sm">
                                Reset link sent! Please check your inbox.
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="mb-6 group">
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
                                        ${validationErrors.email ? "border-red-500 ring-2 ring-red-500/50" : "border-white/20"}
                                    `}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-green-400 transition-colors"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M16 12H8m8 0l-4-4m4 4l-4 4M4 16V8a4 4 0 014-4h8a4 4 0 014 4v8a4 4 0 01-4 4H8a4 4 0 01-4-4z" />
                                    </svg>
                                </div>
                            </div>
                            {validationErrors.email && (
                                <p className="text-red-400 text-xs mt-1.5">{validationErrors.email[0]}</p>
                            )}
                        </div>

                        {/* Submit Button */}
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
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <span>Send Reset Link</span>
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
                            You’ll receive an email shortly
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ForgotPassword;
