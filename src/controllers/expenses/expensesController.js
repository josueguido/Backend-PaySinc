import { query } from "../../db/index.js";

export async function getAllExpenses(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    console.time("getAllExpenses");

    const result = await query(
      `SELECT * FROM paysinc_expenses 
       WHERE user_id = $1 AND deleted_at IS NULL 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );
    console.timeEnd("getAllExpenses");

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ error: "Error fetching expenses" });
  }
}

export async function getExpenseById(req, res) {
  try {
    const result = await query(
      "SELECT * FROM paysinc_expenses WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );
    result.rows.length === 0
      ? res.status(404).json({ error: "Not found" })
      : res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error fetching expense" });
  }
}

export async function getStatsByCategory(req, res) {
  try {
    const result = await query(
      `SELECT category, SUM(amount) as total
       FROM paysinc_expenses
       WHERE user_id = $1 AND deleted_at IS NULL
       GROUP BY category
       ORDER BY total DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching category stats:", err);
    res.status(500).json({ error: "Error fetching category stats" });
  }
}

export async function getStatsByMonth(req, res) {
  try {
    const result = await query(
      `SELECT TO_CHAR(date, 'YYYY-MM') AS month, SUM(amount) as total
       FROM paysinc_expenses
       WHERE user_id = $1 AND deleted_at IS NULL
       GROUP BY month
       ORDER BY month ASC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching monthly stats:", err);
    res.status(500).json({ error: "Error fetching monthly stats" });
  }
}

export async function getStatsByFriend(req, res) {
  try {
    const result = await query(
      `SELECT f.id, f.name, COALESCE(SUM(e.amount), 0) AS total
       FROM paysinc_friends f
       LEFT JOIN paysinc_expenses e 
         ON e.paid_by_friend_id = f.id AND e.user_id = $1
       WHERE f.user_id = $1
       GROUP BY f.id, f.name
       ORDER BY total DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching friend stats:", err);
    res.status(500).json({ error: "Error fetching friend stats" });
  }
}

export async function createExpense(req, res) {
  try {
    const {
      group_id,
      description,
      amount,
      paid_by_friend_id,
      category,
      date,
      note,
    } = req.body;

    const result = await query(
      `INSERT INTO paysinc_expenses (group_id, description, amount, paid_by_friend_id, category, date, note, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        group_id,
        description,
        amount,
        paid_by_friend_id,
        category,
        date,
        note,
        req.user.id,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating expense:", err.message);
    res.status(500).json({ error: "Error creating expense" });
  }
}

export async function updateExpense(req, res) {
  const { id } = req.params;
  const { description, amount, paid_by_friend_id, category, date, note } =
    req.body;
  try {
    const result = await query(
      `UPDATE paysinc_expenses 
       SET description = $1, amount = $2, paid_by_friend_id = $3, category = $4, date = $5, note = $6
       WHERE id = $7 AND user_id = $8 
       RETURNING *`,
      [
        description,
        amount,
        paid_by_friend_id,
        category,
        date,
        note,
        id,
        req.user.id,
      ]
    );
    result.rows.length === 0
      ? res.status(404).json({ error: "Not found or unauthorized" })
      : res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error updating expense" });
  }
}

export async function deleteExpense(req, res) {
  try {
    const expenseId = req.params.id;
    const check = await query(
      "SELECT * FROM paysinc_expenses WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL",
      [expenseId, req.user.id]
    );
    if (check.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Expense not found or unauthorized" });
    }

    await query("UPDATE paysinc_expenses SET deleted_at = NOW() WHERE id = $1", [
      expenseId,
    ]);

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ error: "Error deleting expense" });
  }
}
