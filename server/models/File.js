import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Allow anonymous uploads
  },
  isGuestFile: {
    type: Boolean,
    default: false, // Track if uploaded in guest mode
  },
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  mimetype: String,
  size: Number,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  downloads: {
    type: Number,
    default: 0,
  },
  totalDownloaded: {
    type: Number,
    default: 0, // Total bytes downloaded
  },
  accessCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  },
});

export default mongoose.model("File", fileSchema);
