import React, { useState } from "react";
import axiosInstance from "../services/axiosInstance";
import MainLayout from "../layout/MainLayout";

interface ValidationErrors {
    current_password?: string[];
    password?: string[];
    password_confirmation?: string[];
}

const ChangePassword: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState<string>("");
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setValidationErrors({});
        setSuccess(false);

        try {
            await axiosInstance.post("/change-password", {
                current_password: currentPassword,
                password: newPassword,
                password_confirmation: confirmPassword,
            });

            setSuccess(true);
            // optionally reset fields
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            const { message, errors } = err?.response?.data || {};
            setError(message || "Password change failed");
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
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-white text-center mb-2">
                            Change Password
                        </h2>
                        <p className="text-cyan-400 text-sm text-center mb-8">
                            Keep your account secure
                        </p>

                        {/* Success Message */}
                        {success && (
                            <div className="mb-6 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm text-center backdrop-blur-sm">
                                Password updated successfully!
                            </div>
                        )}

                        {/* Current Password */}
                        <div className="mb-5 group">
                            <label className="block text-gray-200 text-sm font-medium mb-2 transition-all group-focus-within:text-green-400">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className={`w-full px-4 py-3 pl-11 rounded-xl bg-white/10 border backdrop-blur-md text-white placeholder-gray-400
                  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                  ${validationErrors.current_password ? "border-red-500 ring-2 ring-red-500/50" : "border-white/20"}
                `}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-green-400 transition-colors"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                            {validationErrors.current_password && (
                                <p className="text-red-400 text-xs mt-1.5 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd" />
                                    </svg>
                                    {validationErrors.current_password[0]}
                                </p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="mb-5 group">
                            <label className="block text-gray-200 text-sm font-medium mb-2 transition-all group-focus-within:text-green-400">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className={`w-full px-4 py-3 pl-11 rounded-xl bg-white/10 border backdrop-blur-md text-white placeholder-gray-400
                  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                  ${validationErrors.password ? "border-red-500 ring-2 ring-red-500/50" : "border-white/20"}
                `}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-green-400 transition-colors"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                            {validationErrors.password && (
                                <p className="text-red-400 text-xs mt-1.5 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd" />
                                    </svg>
                                    {validationErrors.password[0]}
                                </p>
                            )}
                        </div>

                        {/* Confirm New Password */}
                        <div className="mb-6 group">
                            <label className="block text-gray-200 text-sm font-medium mb-2 transition-all group-focus-within:text-green-400">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full px-4 py-3 pl-11 rounded-xl bg-white/10 border backdrop-blur-md text-white placeholder-gray-400
                  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                  ${validationErrors.password_confirmation ? "border-red-500 ring-2 ring-red-500/50" : "border-white/20"}
                `}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-green-400 transition-colors"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                            {validationErrors.password_confirmation && (
                                <p className="text-red-400 text-xs mt-1.5 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd" />
                                    </svg>
                                    {validationErrors.password_confirmation[0]}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl text-white font-semibold shadow-lg
              transform transition-all duration-200 active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed
              flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <>
                                    <span>Update Password</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </>
                            )}
                        </button>

                        {/* General Error */}
                        {error && !validationErrors.current_password && !validationErrors.password && !validationErrors.password_confirmation && (
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

export default ChangePassword;