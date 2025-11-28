import React, { useState } from "react";

interface UploadedImage {
  id: number;
  url: string;
  file: File;
}

const uploadedImage: React.FC = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Simulate image upload (replace with real API call)
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // In real app: upload to server and get URL
      const newImage: UploadedImage = {
        id: Date.now(),
        url: URL.createObjectURL(selectedFile),
        file: selectedFile,
      };

      setImages((prev) => [...prev, newImage]);
      setSelectedFile(null);
      setPreview(null);
      // Reset input
      const input = document.getElementById("imageUpload") as HTMLInputElement;
      if (input) input.value = "";
    } catch (error) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Delete image
  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setImages((prev) => prev.filter((img) => img.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">

          {/* Upload Form */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Upload New Image
            </h2>

            <div className="flex flex-col items-center space-y-6">
              {/* Image Preview */}
              {preview && (
                <div className="relative w-48 h-48 rounded-xl overflow-hidden border-4 border-white/30 shadow-xl">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* File Input */}
              <label
                htmlFor="imageUpload"
                className="cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transform transition-all duration-200 active:scale-98 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <span>Choose Image</span>
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Upload Button */}
              {selectedFile && (
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-10 rounded-xl shadow-lg transform transition-all duration-200 active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                      <span>Upload Image</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="h-px bg-white/20 mb-8"></div>

          {/* Images Table */}
          <h3 className="text-xl font-bold text-white mb-4">Uploaded Images</h3>

          {images.length === 0 ? (
            <p className="text-center text-gray-400 py-10 bg-white/5 rounded-xl">
              No images uploaded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="py-3 px-4 text-gray-300 font-medium">Preview</th>
                    <th className="py-3 px-4 text-gray-300 font-medium">File Name</th>
                    <th className="py-3 px-4 text-gray-300 font-medium">Size</th>
                    <th className="py-3 px-4 text-gray-300 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map((img) => (
                    <tr key={img.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/20">
                          <img src={img.url} alt="Uploaded" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-200 text-sm">
                        {img.file.name}
                      </td>
                      <td className="py-4 px-4 text-gray-400 text-sm">
                        {(img.file.size / 1024).toFixed(1)} KB
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleDelete(img.id)}
                          disabled={deleting === img.id}
                          className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-1.5 px-4 rounded-lg shadow transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-1 mx-auto"
                        >
                          {deleting === img.id ? (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>Delete</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-center text-gray-400 text-xs mt-8">
            Secured with client-side preview • No server storage in demo
          </p>
        </div>
      </div>
    </div>
  );
};

export default uploadedImage;