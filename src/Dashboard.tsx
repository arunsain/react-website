import React from "react";
import MainLayout from "./layout/MainLayout";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";

const Dashboard: React.FC = () => {
  const { name } = useSelector((state: RootState) => state.user);

  return (
    <MainLayout>
      {/* Full-screen gradient background */}
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-900 via-blue-900 to-black">

        {/* Glassmorphic Dashboard Card */}
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl text-center">

            {/* App Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl mb-6 shadow-lg">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>

            {/* Welcome Title */}
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome Back
            </h1>

            {/* Subtitle */}
            <p className="text-cyan-400 text-sm mb-1">
              {name ? `Hey ${name}, ready to continue?` : "Log in to continue your journey"}
            </p>

            {/* Optional: Small status */}
            <p className="text-gray-400 text-xs mt-6">
              Secured with end-to-end encryption
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;