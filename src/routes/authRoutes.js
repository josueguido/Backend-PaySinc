import { Router } from "express";
const router = Router();
import authController from "../controllers/users/authController.js";
const { login, register, refreshToken, logout } = authController;
import validateRequest from "../middleware/validateRequest.js";
import loginSchema from "../schemas/loginSchemas.js";
import registerSchema from "../schemas/registerSchema.js";
import authenticateToken from "../middleware/authMiddleware.js";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 minLength: 5
 *                 maxLength: 255
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 128
 *                 pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).*$"
 *                 example: Passw0rd!
 *                 description: Must be 6–128 characters long and include an uppercase, lowercase, number, and special character.
 *     responses:
 *       200:
 *         description: Login successful, returns access and refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 username:
 *                   type: string
 *             example:
 *                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                username: "josue123"
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validateRequest(loginSchema), login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 example: josue123
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 128
 *                 example: Password123!
 *                 description: Must be 6–128 characters and include uppercase, lowercase, number, and special character.
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 username:
 *                   type: string
 *       400:
 *         description: Email already registered
 */
router.post("/register", validateRequest(registerSchema), register);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh an access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: your_refresh_token
 *     responses:
 *       200:
 *         description: Returns a new access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Invalid or revoked refresh token
 *       403:
 *         description: Expired or invalid token
 */
router.post("/refresh", authenticateToken, refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user and revoke refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: your_refresh_token
 *     responses:
 *       200:
 *         description: Logout successful
 *       400:
 *         description: Token is required
 */
router.post("/logout", logout);

export default router;
