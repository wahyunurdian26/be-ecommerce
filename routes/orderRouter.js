import express from "express";
import {
  protectedMiddleware,
  adminMiddleware,
} from "../middleware/authMiddleware.js";
import {
  CreateOrder,
  AllOrder,
  DetailOrder,
  CurrentUserOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// post /api/v1/order
// cuma di akses user auth
router.post("/", protectedMiddleware, CreateOrder);

// get /api/v1/order
// cuma di akses oleh user role admin
router.get("/", protectedMiddleware, adminMiddleware, AllOrder);

// get / api/v1/order/:id
router.get("/:id", protectedMiddleware, adminMiddleware, DetailOrder);

// get /api/v1/order/current/user
//bisa di akses oleh user yang auth
router.get(
  "/current/user",
  protectedMiddleware,
  //adminMiddleware,
  CurrentUserOrder
);
export default router;
