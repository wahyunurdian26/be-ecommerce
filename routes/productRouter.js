import express from "express";
import {
  protectedMiddleware,
  adminMiddleware,
} from "../middleware/authMiddleware.js";
import {
  CreateProduct,
  AllProduct,
  detailProduct,
  updateProduct,
  deleteProduct,
  Fileupload,
} from "../controllers/productController.js";
import { upload } from "../utils/uploadFileHandler.js";

const router = express.Router();

// CRUD Product

// Create Data Product
// POST /api/v1/product
// middleware owner
router.post("/", protectedMiddleware, adminMiddleware, CreateProduct);

// Read All Products
// GET /api/v1/product
router.get("/", AllProduct);

// Read Product Details
// GET /api/v1/product/:id
router.get("/:id", detailProduct);

// Update Data Product
// PUT /api/v1/product/:id
// middleware owner
router.put("/:id", adminMiddleware, updateProduct);

// Delete Data Product
// DELETE /api/v1/product/:id
// middleware owner
router.delete("/:id", protectedMiddleware, adminMiddleware, deleteProduct);

// File Upload Data Product
// POST /api/v1/product/file-upload
// middleware owner
router.post(
  "/file-upload",
  protectedMiddleware,
  adminMiddleware,
  upload.single("image"),
  Fileupload
);

export default router;
