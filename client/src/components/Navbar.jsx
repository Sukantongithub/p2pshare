import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LogOut, FileText, User, Share2, Crown, Info } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg border-b border-blue-500/50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-2 text-2xl font-bold cursor-pointer hover:text-blue-100 transition"
          onClick={() => navigate("/")}
        >
          <Share2 className="w-7 h-7" />
          <span>P2P Share</span>
        </div>
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <span className="text-sm">
                Welcome, <span className="font-semibold">{user.username}</span>
              </span>
              <button
                onClick={() => navigate("/files")}
                className="px-3 py-2 hover:bg-blue-700 rounded transition flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Files
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-3 py-2 hover:bg-blue-700 rounded transition flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                Services
              </button>
              <button
                onClick={() => navigate("/plans")}
                className="px-3 py-2 hover:bg-blue-700 rounded transition flex items-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Plans
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="px-3 py-2 hover:bg-blue-700 rounded transition flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 hover:bg-blue-700 rounded transition"
              >
                Services
              </button>
              <button
                onClick={() => navigate("/plans")}
                className="px-4 py-2 hover:bg-blue-700 rounded transition flex items-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Plans
              </button>
              <button
                onClick={() => navigate("/files")}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition flex items-center gap-2 font-semibold"
              >
                <Share2 className="w-4 h-4" />
                Try Free
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 hover:bg-blue-700 rounded transition"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
