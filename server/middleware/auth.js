import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your_jwt_secret_key",
    (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }
      req.user = user;
      next();
    }
  );
};

// Optional authentication - allows guest uploads but tracks user info if authenticated
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret_key",
      (err, user) => {
        if (!err) {
          req.user = user;
          req.authenticated = true;
        }
      }
    );
  }

  req.authenticated = req.authenticated || false;
  next();
};

export const checkStorageQuota = async (req, res, next) => {
  const User = (await import("../models/User.js")).default;
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.storageUsed >= user.storageLimit) {
    return res.status(402).json({
      error: "Storage quota exceeded",
      storageUsed: user.storageUsed,
      storageLimit: user.storageLimit,
    });
  }

  req.userStorageData = {
    used: user.storageUsed,
    limit: user.storageLimit,
    available: user.storageLimit - user.storageUsed,
  };

  next();
};
