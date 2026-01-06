import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
    enum: ["free", "pro", "unlimited", "basic", "premium"],
    default: "free",
  },
  transferredTotal: {
    type: Number,
    default: 0, // in bytes
  },
  transferLimit: {
    type: Number,
    default: 30 * 1024 * 1024 * 1024, // 30GB for free tier
  },
  storageUsed: {
    type: Number,
    default: 0, // in bytes
  },
  storageLimit: {
    type: Number,
    default: 30 * 1024 * 1024 * 1024, // 30GB for free tier
  },
  subscriptionExpiry: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
