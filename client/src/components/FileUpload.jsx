import React, { useState } from "react";
import { Upload, Loader } from "lucide-react";

const FileUpload = ({ onFileUpload, isLoading, user }) => {
  const [dragActive, setDragActive] = useState(false);
  const MAX_GUEST_GB = 1;
  const MAX_AUTH_GB = 30;
  const maxFileSizeBytes = (user ? MAX_AUTH_GB : MAX_GUEST_GB) * 1024 * 1024 * 1024;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > maxFileSizeBytes) {
        const limitText = user ? `${MAX_AUTH_GB}GB` : `${MAX_GUEST_GB}GB`;
        alert(
          `File size exceeds ${limitText} limit. ${
            !user
              ? "Login to upload up to 30GB per file."
              : "Consider upgrading your subscription."
          }`
        );
        e.target.value = "";
        return;
      }
      onFileUpload(file);
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-12 text-center transition ${
        dragActive
          ? "border-blue-400 bg-blue-500/20"
          : "border-white/20 bg-white/5 hover:border-white/40"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-input"
        onChange={handleChange}
        disabled={isLoading}
        className="hidden"
      />
      <label htmlFor="file-input" className="block cursor-pointer">
        <div className="flex justify-center mb-4">
          {isLoading ? (
            <Loader className="w-12 h-12 text-blue-400 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-blue-400" />
          )}
        </div>
        <p className="text-white font-medium text-lg">
          {isLoading ? "Uploading..." : "Drag and drop your file here"}
        </p>
        <p className="text-gray-400 text-sm mt-2">
          or click to browse (max {user ? "30GB" : "1GB"})
        </p>
        {!user && (
          <p className="text-yellow-400 text-xs mt-2">
            Guest limit: 1GB per file. Login to upload up to 30GB.
          </p>
        )}
      </label>
    </div>
  );
};

export default FileUpload;
