import { Router } from "express";
const router = Router();
import authenticateToken from "../middleware/authMiddleware.js";
import { createFriend, getAllFriends, getFriendById, updateFriend, deleteFriend } from "../controllers/friends/friendsController.js";

router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Friends
 *   description: Friend management endpoints
 */

/**
 * @swagger
 * /api/friends:
 *   get:
 *     summary: Get all friends
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of friends
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   user_id:
 *                     type: integer
 *       500:
 *         description: Error retrieving friends
 */
router.get("/", authenticateToken, getAllFriends);

/**
 * @swagger
 * /api/friends/{id}:
 *   get:
 *     summary: Get a friend by ID
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Friend found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 user_id:
 *                   type: integer
 *       404:
 *         description: Friend not found
 *       500:
 *         description: Error retrieving friend
 */
router.get("/:id", authenticateToken, getFriendById);

/**
 * @swagger
 * /api/friends:
 *   post:
 *     summary: Create a new friend
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: Friend created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 user_id:
 *                   type: integer
 *       500:
 *         description: Error creating friend
 */
router.post("/", authenticateToken, createFriend);

/**
 * @swagger
 * /api/friends/{id}:
 *   put:
 *     summary: Update a friend by ID
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Friend ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       200:
 *         description: Friend updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 user_id:
 *                   type: integer
 *       404:
 *         description: Friend not found or not authorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Friend not found or not authorized
 *       500:
 *         description: Server error while updating friend
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error updating friend
 */
router.put("/:id", authenticateToken, updateFriend);

/**
 * @swagger
 * /api/friends/{id}:
 *   delete:
 *     summary: Delete a friend by ID
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Friend deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 friend:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     user_id:
 *                       type: integer
 *       404:
 *         description: Friend not found or not authorized
 *       500:
 *         description: Error deleting friend
 */
router.delete("/:id", authenticateToken, deleteFriend);

export default router;
