// productImagesRouter.js
const express = require('express');
const router = express.Router();
const {
  getSingleProductImages,
  createImage,
  updateImage,
  deleteImage
} = require('../controllers/productImages');
const { validateUpload } = require('../middleware/validation');

router.route('/:id').get(getSingleProductImages);
router.route('/').post(validateUpload, createImage);
router.route('/:id').put(validateUpload, updateImage);
router.route('/:id').delete(deleteImage);

module.exports = router;