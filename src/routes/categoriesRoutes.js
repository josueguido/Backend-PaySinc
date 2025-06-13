import { Router } from "express";
const router = Router();
import authenticateToken from "../middleware/authMiddleware.js";
import {
  getCategory,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categories/categoriesController.js";

router.get("/:id", authenticateToken, getCategory);
router.get("/", authenticateToken, getAllCategories);
router.post("/", authenticateToken, createCategory);  
router.put("/:id", authenticateToken, updateCategory);
router.delete("/:id", authenticateToken, deleteCategory);

export default router;