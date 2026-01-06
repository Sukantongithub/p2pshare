import React, { useState, useEffect, useContext } from "react";
import { userAPI } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Edit, Save, X, HardDrive, Crown, Calendar, Mail } from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const { user, updateUser } = useContext(AuthContext);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await userAPI.getProfile();
      setProfile(res.data.user);
      setUsername(res.data.user.username);
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");

    try {
      await userAPI.updateProfile(username);
      updateUser({ username });
      setProfile((prev) => ({ ...prev, username }));
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 GB";
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(2) + " GB";
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case "pro":
        return "text-purple-400";
      case "unlimited":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const getTierLabel = (tier) => {
    return tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : "Free";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black/40 backdrop-blur-sm">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/40 backdrop-blur-sm text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-start gap-3">
            <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {profile && (
          <>
            {/* Main Profile Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-8 mb-8">
              <div className="mb-8">
                <label className="block text-gray-300 font-semibold mb-3">
                  Username
                </label>
                {editMode ? (
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition"
                    />
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={updating}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {updating ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          setUsername(profile.username);
                        }}
                        className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-white text-lg font-medium">
                      {profile.username}
                    </p>
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Account Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Email</p>
                    <p className="text-white text-lg">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Calendar className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      Member Since
                    </p>
                    <p className="text-white text-lg">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription & Storage Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subscription Tier */}
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Crown
                    className={`w-6 h-6 ${getTierColor(profile.subscription)}`}
                  />
                  <h3 className="text-lg font-semibold text-white">
                    Subscription
                  </h3>
                </div>
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-1">Current Tier</p>
                  <p
                    className={`text-2xl font-bold ${getTierColor(
                      profile.subscription
                    )}`}
                  >
                    {getTierLabel(profile.subscription)}
                  </p>
                </div>
                <div className="text-sm text-gray-400 mb-6 space-y-1">
                  <p>
                    {profile.subscription === "free" &&
                      "Upload and share up to 30GB per month"}
                    {profile.subscription === "pro" &&
                      "Upload and share up to 500GB per month"}
                    {profile.subscription === "unlimited" &&
                      "Unlimited upload and sharing"}
                  </p>
                </div>
                {profile.subscription === "free" && (
                  <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition">
                    Upgrade to Pro
                  </button>
                )}
              </div>

              {/* Storage Usage */}
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <HardDrive className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Storage Usage
                  </h3>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-gray-400 text-sm">
                      {formatBytes(profile.transferredTotal || 0)} used
                    </p>
                    <p className="text-gray-400 text-sm font-medium">
                      {formatBytes(
                        profile.transferLimit || 30 * 1024 * 1024 * 1024
                      )}{" "}
                      limit
                    </p>
                  </div>

                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden border border-white/20">
                    <div
                      className="bg-linear-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          ((profile.transferredTotal || 0) /
                            (profile.transferLimit ||
                              30 * 1024 * 1024 * 1024)) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-400">
                  Usage resets monthly. Contact support to increase limits.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
