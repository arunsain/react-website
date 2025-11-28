import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { fetchUserAsync } from "../features/userSlice";
import axiosInstance from "../services/axiosInstance";

interface ValidationErrors {
  name?: string[];
  email?: string[];
  image?: string[];
}

const ProfileUpdate: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { name: currentName, email: currentEmail, profile_image, status } = useSelector(
    (state: RootState) => state.user
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentName) setName(currentName);
    if (currentEmail) setEmail(currentEmail);
    if (profile_image) setPreview(profile_image);
  }, [currentName, currentEmail, profile_image]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setValidationErrors({});

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (image) formData.append("image", image);

    try {
      await axiosInstance.post("/user-update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(fetchUserAsync());
    } catch (err: any) {
      const { message, errors } = err?.response?.data || {};
      setError(message || "Update failed");
      setValidationErrors(errors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl">

          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white/30 shadow-xl">
              <img
                src={preview || "/test.jpg"}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
              <label
                htmlFor="imageUpload"
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 hover:opacity-100 cursor-pointer transition-all duration-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            {validationErrors.image && (
              <p className="text-red-400 text-xs mt-1.5">
                {validationErrors.image[0]}
              </p>
            )}
          </div>

          <h2 className="text-3xl font-bold text-white text-center mb-2">
            Update Your Profile
          </h2>
          <p className="text-cyan-400 text-sm text-center mb-8">
            Keep your account details up-to-date
          </p>

          {/* Name Field */}
          <div className="mb-5 group">
            <label className="block text-gray-200 text-sm font-medium mb-2 transition-all group-focus-within:text-green-400">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 pl-11 rounded-xl bg-white/10 border backdrop-blur-md text-white placeholder-gray-400
                  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                  ${validationErrors.name ? "border-red-500 ring-2 ring-red-500/50" : "border-white/20"}
                `}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            {validationErrors.name && (
              <p className="text-red-400 text-xs mt-1.5">
                {validationErrors.name[0]}
              </p>
            )}
          </div>

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
                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
            {validationErrors.email && (
              <p className="text-red-400 text-xs mt-1.5">
                {validationErrors.email[0]}
              </p>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleUpdate}
            disabled={loading || status === "loading"}
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
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <span>Save Changes</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </button>

          {/* Error */}
          {error && !validationErrors.name && !validationErrors.email && (
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
  );
};

export default ProfileUpdate;
