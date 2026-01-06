import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Upload, Globe, Clock, User, Users } from "lucide-react";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user) {
    return (
      <div className="min-h-screen text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl font-bold mb-4">📁 P2P File Share</h1>
          <p className="text-2xl mb-8">
            Share Files Instantly with 6-Digit Codes
          </p>
          <p className="text-lg mb-12 opacity-90">
            Welcome back, {user.username}! Start sharing files with anyone,
            anywhere.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/files")}
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Go to Files
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-7xl font-bold mb-4 bg-linear-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
            P2P File Share
          </h1>
          <p className="text-3xl font-semibold mb-6 text-white">
            Share Files Instantly, Securely, Anywhere
          </p>
          <p className="text-lg mb-12 text-gray-300 max-w-2xl mx-auto">
            No accounts, no limits, no complicated setup. Just upload, get a
            6-digit code, and share. Recipients can download from anywhere in
            the world.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button
              onClick={() => navigate("/files")}
              className="px-8 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition transform hover:scale-105 shadow-lg"
            >
              <span className="flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                Try Guest Mode - Free
              </span>
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 transition"
            >
              Login to Account
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 transition"
            >
              Create Account
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-200">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-400" />
              <span>Files auto-delete in 24h</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-green-400" />
              <span>Download from anywhere</span>
            </div>
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-green-400" />
              <span>Guests: 1GB • Login: 30GB</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-8 border border-white/30 shadow-xl">
            <Upload className="w-12 h-12 mb-4 text-blue-300" />
            <h3 className="text-2xl font-bold mb-4 text-white">
              Upload & Get Code
            </h3>
            <p className="text-gray-200 leading-relaxed">
              Upload any file and receive a unique 6-digit access code instantly
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-8 border border-white/30 shadow-xl">
            <Globe className="w-12 h-12 mb-4 text-blue-300" />
            <h3 className="text-2xl font-bold mb-4 text-white">
              Share Anywhere
            </h3>
            <p className="text-gray-200 leading-relaxed">
              Anyone can download from any location with just the 6-digit code
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-8 border border-white/30 shadow-xl">
            <Clock className="w-12 h-12 mb-4 text-blue-300" />
            <h3 className="text-2xl font-bold mb-4 text-white">
              24-Hour Access
            </h3>
            <p className="text-gray-200 leading-relaxed">
              Files expire after 24 hours for security and privacy
            </p>
          </div>
        </div>

        <div className="mt-20 bg-white/20 backdrop-blur-lg rounded-lg p-8 border border-white/30 shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-center text-white">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <User className="w-6 h-6 text-blue-300" />
                <h3 className="text-xl font-bold text-white">As a Sender:</h3>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-gray-200 ml-2">
                <li>Click "Try Guest Mode" or login to your account</li>
                <li>Upload your file (up to 30GB)</li>
                <li>Receive a unique 6-digit access code</li>
                <li>Share the code with your recipient</li>
              </ol>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6 text-blue-300" />
                <h3 className="text-xl font-bold text-white">As a Receiver:</h3>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-gray-200 ml-2">
                <li>Get the 6-digit code from sender</li>
                <li>Visit the download section</li>
                <li>Enter the code</li>
                <li>Download the file instantly</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
