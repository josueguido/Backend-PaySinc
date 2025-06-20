import { Router } from "express";
const router = Router();
import authenticateToken from "../middleware/authMiddleware.js";
import { getProfile, updateProfile  } from "../controllers/users/profileController.js";

router.get("/", authenticateToken, getProfile);


router.put("/", authenticateToken, updateProfile);

export default router;