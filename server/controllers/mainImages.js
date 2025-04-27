// mainImages.js controller
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const fs = require("fs");
let nanoid = (async function generateImageId() {
  const { nanoid } = await import("nanoid");
  return nanoid();
})();
const prisma = new PrismaClient();

async function uploadMainImage(req, res) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    
    const uploadedFile = req.files.uploadedFile;
    
    // Create secure filename with nanoid to prevent overwriting
    const fileExt = path.extname(uploadedFile.name);
    const uniqueFilename = `${nanoid(10)}${fileExt}`;
    
    // Create upload directory if it doesn't exist
    const uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, uniqueFilename);
    
    // Move the file with a promise wrapper
    await new Promise((resolve, reject) => {
      uploadedFile.mv(filePath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // Store file metadata in database
    const fileRecord = await prisma.image.create({
      data: {
        filename: uniqueFilename,
        originalName: uploadedFile.name,
        mimetype: uploadedFile.mimetype,
        size: uploadedFile.size,
        path: `/uploads/${uniqueFilename}`,
        // We remove the uploadedBy field since we don't have auth yet
      }
    });
    
    return res.status(201).json({
      message: "File uploaded successfully",
      image: {
        id: fileRecord.id,
        filename: fileRecord.filename,
        path: fileRecord.path
      }
    });
    
  } catch (error) {
    console.error("File upload error:", error);
    return res.status(500).json({
      message: "Failed to upload file",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

module.exports = {
  uploadMainImage
};