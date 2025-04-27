// validation.js (new middleware)
const path = require("path");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

function validateUpload(req, res, next) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const uploadedFile = req.files.uploadedFile;
  
  // Check file size
  if (uploadedFile.size > MAX_FILE_SIZE) {
    return res.status(400).json({ message: "File size exceeds the 5MB limit" });
  }
  
  // Check file type
  if (!ALLOWED_MIME_TYPES.includes(uploadedFile.mimetype)) {
    return res.status(400).json({ message: "Invalid file type" });
  }

  // Check file extension
  const fileExt = path.extname(uploadedFile.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
    return res.status(400).json({ message: "Invalid file extension" });
  }

  next();
}

module.exports = { validateUpload };