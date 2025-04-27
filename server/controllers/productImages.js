// productImages.js controller
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const fs = require("fs");
let nanoid = (async function generateImageId() {
  const { nanoid } = await import("nanoid");
  return nanoid();
})();



const prisma = new PrismaClient();

async function getSingleProductImages(request, response) {
  try {
    const { id } = request.params;
    const images = await prisma.image.findMany({
      where: { productID: id },
    });
    if (!images || images.length === 0) {
      return response.status(404).json({ error: "Images not found" });
    }
    return response.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return response.status(500).json({ 
      error: "Error fetching images",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

async function createImage(request, response) {
  try {
    const { productID } = request.body;
    
    if (!productID) {
      return response.status(400).json({ error: "Product ID is required" });
    }
    
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productID },
    });
    
    if (!product) {
      return response.status(404).json({ error: "Product not found" });
    }
    
    // Handle file upload if there's a file
    let imagePath = null;
    
    if (request.files && request.files.productImage) {
      const uploadedFile = request.files.productImage;
      
      // Create secure filename with nanoid
      const fileExt = path.extname(uploadedFile.name);
      const uniqueFilename = `product_${productID}_${nanoid(8)}${fileExt}`;
      
      // Create upload directory if it doesn't exist
      const uploadDir = path.resolve(process.env.PRODUCT_IMAGES_DIR || './uploads/products');
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
      
      // Set image path for database
      imagePath = `/uploads/products/${uniqueFilename}`;
    } else if (!request.body.image) {
      return response.status(400).json({ error: "Either a file upload or image URL is required" });
    } else {
      // If no file but image URL provided in body
      imagePath = request.body.image;
    }
    
    // Create image record in database
    const createImage = await prisma.image.create({
      data: {
        productID,
        image: imagePath,
        originalName: request.files?.productImage?.name || null,
        mimetype: request.files?.productImage?.mimetype || null,
        size: request.files?.productImage?.size || null,
      },
    });
    
    return response.status(201).json(createImage);
  } catch (error) {
    console.error("Error creating image:", error);
    return response.status(500).json({ 
      error: "Error creating image",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
}

async function updateImage(request, response) {
  try {
    const { id } = request.params;
    const { productID } = request.body;
    
    // Checking whether image exists for the given product id
    const existingImage = await prisma.image.findFirst({
      where: {
        productID: id,
      },
    });
    
    // If image doesn't exist, return corresponding status code
    if (!existingImage) {
      return response
        .status(404)
        .json({ error: "Image not found for the provided productID" });
    }
    
    // Handle file upload if there's a file
    let imagePath = existingImage.image; // Default to existing path
    
    if (request.files && request.files.productImage) {
      const uploadedFile = request.files.productImage;
      
      // Create secure filename with nanoid
      const fileExt = path.extname(uploadedFile.name);
      const uniqueFilename = `product_${id}_${nanoid(8)}${fileExt}`;
      
      // Create upload directory if it doesn't exist
      const uploadDir = path.resolve(process.env.PRODUCT_IMAGES_DIR || './uploads/products');
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
      
      // Set new image path for database
      imagePath = `/uploads/products/${uniqueFilename}`;
      
      // Delete old file if it exists and is in our uploads directory
      if (existingImage.image && existingImage.image.startsWith('/uploads/')) {
        const oldFilePath = path.join(process.cwd(), existingImage.image);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    } else if (request.body.image) {
      // If no file but image URL provided in body
      imagePath = request.body.image;
    }
    
    // Updating image using corresponding imageID
    const updatedImage = await prisma.image.update({
      where: {
        imageID: existingImage.imageID,
      },
      data: {
        productID: productID || existingImage.productID,
        image: imagePath,
        originalName: request.files?.productImage?.name || existingImage.originalName,
        mimetype: request.files?.productImage?.mimetype || existingImage.mimetype,
        size: request.files?.productImage?.size || existingImage.size,
        updatedAt: new Date(),
      },
    });
    
    return response.json(updatedImage);
  } catch (error) {
    console.error("Error updating image:", error);
    return response.status(500).json({ 
      error: "Error updating image",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
}

async function deleteImage(request, response) {
  try {
    const { id } = request.params;
    
    // Find images before deletion to clean up files
    const images = await prisma.image.findMany({
      where: {
        productID: String(id),
      },
    });
    
    // Delete the database records
    await prisma.image.deleteMany({
      where: {
        productID: String(id),
      },
    });
    
    // Clean up physical files
    for (const image of images) {
      if (image.image && image.image.startsWith('/uploads/')) {
        const filePath = path.join(process.cwd(), image.image);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }
    
    return response.status(204).send();
  } catch (error) {
    console.error("Error deleting image:", error);
    return response.status(500).json({ 
      error: "Error deleting image",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
}

module.exports = {
  getSingleProductImages,
  createImage,
  updateImage,
  deleteImage,
};