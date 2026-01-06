import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authenticateToken, optionalAuth } from "../middleware/auth.js";
import {
  uploadFile,
  getFiles,
  deleteFile,
  downloadFileByCode,
  getFileInfoByCode,
} from "../controllers/fileController.js";

const router = express.Router();

// Create uploads directory if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 * 1024 }, // 30GB limit
});

// Upload file (allows both authenticated users and guests)
router.post("/upload", optionalAuth, upload.single("file"), uploadFile);

// Get user's uploaded files (requires authentication)
router.get("/", authenticateToken, getFiles);

// Delete file (requires authentication)
router.delete("/:fileId", authenticateToken, deleteFile);

// Download file by access code (no authentication required)
router.get("/download/:code", downloadFileByCode);

// Get file info by access code (no authentication required)
router.get("/info/:code", getFileInfoByCode);

export default router;
