import File from "../models/File.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000";

const GUEST_MAX_BYTES = 1 * 1024 * 1024 * 1024; // 1GB
const USER_MAX_BYTES = 30 * 1024 * 1024 * 1024; // 30GB

// Generate a unique 6-digit code
const generateAccessCode = async () => {
  let code;
  let exists = true;

  while (exists) {
    code = Math.floor(100000 + Math.random() * 900000).toString();
    exists = await File.findOne({ accessCode: code });
  }

  return code;
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Check single file size limit: guests 1GB, logged-in 30GB
    if (!req.user?.id && req.file.size > GUEST_MAX_BYTES) {
      fs.unlinkSync(req.file.path);
      return res.status(413).json({
        error: "Guests can upload up to 1GB. Login to upload up to 30GB.",
        maxSize: 1,
        unit: "GB",
      });
    }

    const effectiveMax = req.user?.id ? USER_MAX_BYTES : GUEST_MAX_BYTES;
    if (req.file.size > effectiveMax) {
      fs.unlinkSync(req.file.path);

      if (!req.user?.id) {
        return res.status(413).json({
          error: "Guests can upload up to 1GB. Login to upload up to 30GB.",
          maxSize: 1,
          unit: "GB",
        });
      }

      const user = await User.findById(req.user.id);
      if (user.subscription === "free") {
        return res.status(413).json({
          error:
            "Files larger than 30GB require a Pro or Unlimited subscription. Please upgrade your account.",
          maxSize: 30,
          unit: "GB",
          subscription: user.subscription,
        });
      }
    }

    // Check transfer limit if user is logged in
    if (req.user?.id) {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const newTotal = user.transferredTotal + req.file.size;
      if (newTotal > user.transferLimit) {
        fs.unlinkSync(req.file.path);
        const limitGB = (user.transferLimit / (1024 * 1024 * 1024)).toFixed(2);
        return res.status(402).json({
          error: `Transfer limit exceeded. Free tier limit: ${limitGB}GB. Please upgrade.`,
          currentTransferred: (
            user.transferredTotal /
            (1024 * 1024 * 1024)
          ).toFixed(2),
          limit: limitGB,
        });
      }
    }

    // Generate unique 6-digit access code
    const accessCode = await generateAccessCode();

    const newFile = new File({
      userId: req.user?.id || null,
      isGuestFile: !req.user?.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      accessCode: accessCode,
      uploadedAt: new Date(),
    });

    await newFile.save();

    // Update user's transferred total if logged in
    if (req.user?.id) {
      const user = await User.findById(req.user.id);
      user.transferredTotal += req.file.size;
      await user.save();
    }

    res.status(201).json({
      message: "File uploaded successfully",
      accessCode: accessCode,
      file: {
        id: newFile._id,
        originalName: newFile.originalName,
        size: newFile.size,
        uploadedAt: newFile.uploadedAt,
      },
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
};

export const getFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.id }).sort({
      uploadedAt: -1,
    });

    const filesData = files.map((f) => ({
      id: f._id,
      originalName: f.originalName,
      size: f.size,
      uploadedAt: f.uploadedAt,
      downloads: f.downloads,
      accessCode: f.accessCode,
      expiresAt: f.expiresAt,
      mimetype: f.mimetype,
    }));

    res.json({
      files: filesData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    if (file.userId && file.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Delete local file
    const filePath = path.join("uploads", file.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await File.deleteOne({ _id: fileId });

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const downloadFileByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const file = await File.findOne({ accessCode: code });

    if (!file) {
      return res.status(404).json({ error: "Invalid access code" });
    }

    // Check if file has expired
    if (file.expiresAt && new Date() > file.expiresAt) {
      return res.status(410).json({ error: "File has expired" });
    }

    const filePath = path.join("uploads", file.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on disk" });
    }

    // Check download quota for the file owner
    if (file.userId) {
      const user = await User.findById(file.userId);
      if (user) {
        const newDownloadTotal = user.transferredTotal + file.size;
        if (newDownloadTotal > user.transferLimit) {
          const limitGB = (user.transferLimit / (1024 * 1024 * 1024)).toFixed(
            2
          );
          return res.status(402).json({
            error: `File owner's transfer limit exceeded. Please contact them.`,
            limitGB,
          });
        }
      }
    }

    file.downloads += 1;
    file.totalDownloaded += file.size;

    // Update owner's transferred total
    if (file.userId) {
      const user = await User.findById(file.userId);
      if (user) {
        user.transferredTotal += file.size;
        await user.save();
      }
    }

    await file.save();

    res.download(filePath, file.originalName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFileInfoByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const file = await File.findOne({ accessCode: code });

    if (!file) {
      return res.status(404).json({ error: "Invalid access code" });
    }

    // Check if file has expired
    if (file.expiresAt && new Date() > file.expiresAt) {
      return res.status(410).json({ error: "File has expired" });
    }

    res.json({
      originalName: file.originalName,
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: file.uploadedAt,
      expiresAt: file.expiresAt,
      downloads: file.downloads,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
