import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { fileAPI } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import FileUpload from "../components/FileUpload";
import Navbar from "../components/Navbar";
import {
  Upload,
  Download,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

const Files = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [downloadCode, setDownloadCode] = useState("");
  const [fileInfo, setFileInfo] = useState(null);
  const [guestMode, setGuestMode] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      setGuestMode(false);
      fetchFiles();
    } else {
      setGuestMode(true);
      setLoading(false);
    }
  }, [user]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await fileAPI.getFiles();
      setFiles(res.data.files);
      setError("");
    } catch (err) {
      setError("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    // Client-side validation
    const GUEST_LIMIT_GB = 1;
    const AUTH_LIMIT_GB = 30;
    const limitBytes = (user ? AUTH_LIMIT_GB : GUEST_LIMIT_GB) * 1024 * 1024 * 1024;

    if (file.size > limitBytes) {
      setError(
        user
          ? `File exceeds ${AUTH_LIMIT_GB}GB limit.`
          : `Guests can upload up to ${GUEST_LIMIT_GB}GB. Login to upload up to ${AUTH_LIMIT_GB}GB.`
      );
      if (!user) {
        // Trigger login prompt via existing error helper in UI
        window.alert("Login to upload up to 30GB per file.");
      }
      return;
    }

    setUploadLoading(true);
    setError("");
    try {
      const res = await fileAPI.uploadFile(file);
      setAccessCode(res.data.accessCode);
      if (user) {
        await fetchFiles();
      }
      setError("");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Upload failed";
      setError(errorMsg);
      setAccessCode("");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await fileAPI.deleteFile(fileId);
      await fetchFiles();
    } catch (err) {
      setError("Failed to delete file");
    }
  };

  const handleCheckCode = async () => {
    if (!downloadCode || downloadCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    try {
      const res = await fileAPI.getFileInfoByCode(downloadCode);
      setFileInfo(res.data);
      setError("");
    } catch (err) {
      setFileInfo(null);
      setError(err.response?.data?.error || "Invalid code");
    }
  };

  const handleDownloadByCode = async () => {
    if (!downloadCode) {
      setError("Please enter a 6-digit code");
      return;
    }

    try {
      const res = await fileAPI.downloadFileByCode(downloadCode);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileInfo?.originalName || "file");
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Download failed");
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    if (bytes < 1024 * 1024 * 1024)
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-black/40 backdrop-blur-sm">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                File Transfer
              </h1>
              <p className="text-gray-300 flex items-center gap-2">
                {guestMode ? (
                  <>
                    <Upload className="w-5 h-5 text-blue-400" />
                    <span>Guest Mode - Upload & Share (30GB free)</span>
                    <span className="text-xs bg-blue-600/50 px-2 py-1 rounded">
                      NO LOGIN REQUIRED
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Welcome, {user?.username}</span>
                  </>
                )}
              </p>
            </div>
            {guestMode && (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition"
              >
                Login to Account
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-200">{error}</p>
              {guestMode && error.includes("login") && (
                <button
                  onClick={() => navigate("/login")}
                  className="mt-2 text-sm underline text-red-300 hover:text-red-100"
                >
                  Click here to login
                </button>
              )}
            </div>
          </div>
        )}

        {/* Guest Mode Info Banner */}
        {guestMode && (
          <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-200 text-sm">
                  <strong>Guest Mode:</strong> You can upload and share files
                  instantly without an account. Files uploaded in guest mode
                  expire after 24 hours and cannot be managed after upload.
                  <button
                    onClick={() => navigate("/register")}
                    className="underline hover:text-blue-100 ml-1"
                  >
                    Create an account
                  </button>{" "}
                  to track your uploads and access additional features.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Upload Section */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Upload className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-semibold text-white">
                Upload Files
              </h2>
              {guestMode && (
                <span className="text-xs bg-blue-600/50 px-3 py-1 rounded-full text-blue-200">
                  GUEST MODE ACTIVE
                </span>
              )}
            </div>

            <FileUpload
              onFileUpload={handleFileUpload}
              isLoading={uploadLoading}
              user={user}
            />

            <div className="text-sm text-gray-400 mt-4">
              <p className="flex items-center gap-2 mb-2">
                <span className="text-green-400">✓</span> Maximum {guestMode ? "1GB" : "30GB"} per file
              </p>
              <p className="flex items-center gap-2 mb-2">
                <span className="text-green-400">✓</span> Files expire after 24
                hours
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-400">✓</span>{" "}
                {guestMode ? "No account required" : "Secure & Private"}
              </p>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Quick Tips</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex gap-2">
                <span className="text-blue-400 font-bold">1.</span>
                <span>Upload your file and receive a code</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400 font-bold">2.</span>
                <span>Share the code with recipients</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400 font-bold">3.</span>
                <span>They download using the code</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400 font-bold">4.</span>
                <span>Works from any location</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Upload Success Card */}
        {accessCode && (
          <div className="mb-8 bg-linear-to-br from-green-500/20 to-green-600/20 border border-green-500/50 rounded-xl p-8">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-green-400 shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-green-300 mb-1">
                  ✓ Upload Successful!
                </h3>
                {guestMode && (
                  <p className="text-sm text-green-300/80 mb-3">
                    🎉 Your file is ready to share. No account needed - just
                    share the code below!
                  </p>
                )}
                <p className="text-gray-300 mb-4">
                  Share this 6-digit code with anyone to let them download your
                  file:
                </p>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={accessCode}
                      readOnly
                      className="w-full bg-white/10 text-white text-center text-4xl font-mono font-bold tracking-widest py-4 px-6 rounded-lg border border-green-500/50 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => copyToClipboard(accessCode)}
                    className="px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center justify-center gap-2 shrink-0 font-semibold"
                  >
                    <Copy className="w-5 h-5" />
                    Copy
                  </button>
                </div>
                <p className="text-sm text-gray-400 mt-3">
                  ⏰ Code expires in 24 hours. Recipients can download from
                  anywhere in the world.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Download Section */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Download className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-semibold text-white">
              Download Files
            </h2>
          </div>

          <p className="text-gray-300 mb-6">
            Enter a 6-digit code to retrieve and download a file:
          </p>

          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={downloadCode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                setDownloadCode(val);
              }}
              placeholder="000000"
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 text-center text-3xl font-mono font-bold tracking-widest focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition"
              maxLength="6"
            />
            <button
              onClick={handleCheckCode}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Check Code
            </button>
          </div>

          {fileInfo && (
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-4">
                File Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-sm">File Name</p>
                  <p className="text-white font-medium break-all">
                    {fileInfo.originalName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">File Size</p>
                  <p className="text-white font-medium">
                    {formatFileSize(fileInfo.size)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Uploaded</p>
                  <p className="text-white font-medium">
                    {new Date(fileInfo.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Downloads</p>
                  <p className="text-white font-medium">{fileInfo.downloads}</p>
                </div>
              </div>
              <button
                onClick={handleDownloadByCode}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download File
              </button>
            </div>
          )}
        </div>

        {/* My Files Section */}
        {!guestMode && user && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-semibold text-white">My Uploads</h2>
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
                {files.length} files
              </span>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Loading files...</p>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-12 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
                <p className="text-gray-400">No files uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 p-4 hover:border-white/40 transition"
                  >
                    <div className="mb-3">
                      <p className="text-white font-medium truncate">
                        {file.originalName}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {formatFileSize(file.size)}
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-3 mb-4">
                      <p className="text-gray-400 text-xs mb-1">Access Code</p>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono font-bold text-lg">
                          {file.accessCode}
                        </span>
                        <button
                          onClick={() => copyToClipboard(file.accessCode)}
                          className="p-1.5 hover:bg-white/20 rounded transition"
                        >
                          <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 text-xs text-gray-400 mb-4">
                      <span>
                        Expires: {new Date(file.expiresAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>Downloads: {file.downloads}</span>
                    </div>

                    <button
                      onClick={() => handleDelete(file.id)}
                      className="w-full px-3 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Files;
