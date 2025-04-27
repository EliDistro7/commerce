// mainImageRouter.js
const express = require("express");
const router = express.Router();
const { uploadMainImage } = require("../controllers/mainImages");
const { validateUpload } = require("../middleware/validation");

// Using middleware for validation only (no auth for now)
router.route("/").post(validateUpload, uploadMainImage);

module.exports = router;