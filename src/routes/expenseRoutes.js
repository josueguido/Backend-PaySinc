import { Router } from "express";
const router = Router();
import authenticateToken from "../middleware/authMiddleware.js";
import { getAllExpenses, getExpenseById, getStatsByCategory, getStatsByMonth, createExpense, updateExpense, deleteExpense } from "../controllers/expenses/expensesController.js";

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense management endpoints
 */

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Get all expenses with optional filters
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (pagination)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: group_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of expenses
 *       500:
 *         description: Error fetching expenses
 */
router.get("/", authenticateToken, getAllExpenses);

/**
 * @swagger
 * /api/expenses/{id}:
 *   get:
 *     summary: Get an expense by ID
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Expense data
 *       404:
 *         description: Not found
 *       500:
 *         description: Error fetching expense
 */
router.get("/:id", authenticateToken, getExpenseById);

router.get('/stats/categories',authenticateToken, getStatsByCategory);

router.get('/stats/monthly',authenticateToken, getStatsByMonth);

router.get('/stats/friend',authenticateToken, getStatsByMonth);

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - amount
 *               - date
 *             properties:
 *               group_id:
 *                 type: integer
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               paid_by_friend_id:
 *                 type: integer
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Expense created
 *       500:
 *         description: Error creating expense
 */
router.post("/", authenticateToken, createExpense);

/**
 * @swagger
 * /api/expenses/{id}:
 *   put:
 *     summary: Update an existing expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - amount
 *               - date
 *             properties:
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               paid_by_friend_id:
 *                 type: integer
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Expense updated
 *       404:
 *         description: Not found or unauthorized
 *       500:
 *         description: Error updating expense
 */
router.put("/:id", authenticateToken, updateExpense);

/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Soft delete an expense by ID
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Expense deleted
 *       404:
 *         description: Expense not found or unauthorized
 *       500:
 *         description: Error deleting expense
 */
router.delete("/:id", authenticateToken, deleteExpense);

export default router;
