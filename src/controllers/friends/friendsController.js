import { query } from "../../db/index.js";

export async function getAllFriends(req, res) {
  try {
    const result = await query(
      `
      SELECT 
        f.id,
        f.name,
        f.email,
        f.gender,
        f.created_at,
        f.is_online,
        COALESCE(SUM(e.amount), 0) AS balance,
        COUNT(e.id) AS expenses_count
      FROM friends f
      LEFT JOIN expenses e 
        ON e.paid_by_friend_id = f.id 
        AND e.user_id = $1
      WHERE f.user_id = $1
      GROUP BY f.id
      ORDER BY f.name ASC
      `,
      [req.user.id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error getting friends:", err.message);
    res.status(500).json({ error: "Error retrieving friends" });
  }
}

export async function getFriendById(req, res) {
  const { id } = req.params;

  try {
    const result = await query(
      `SELECT * FROM friends WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Friend not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error getting friend by ID:", err.message);
    res.status(500).json({ error: "Error retrieving friend" });
  }
}

export async function createFriend(req, res) {
  const { name, email, gender } = req.body;

  try {
    const result = await query(
      `INSERT INTO friends (name, email, gender, user_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, gender, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating friend:", err.message);
    res.status(500).json({ error: "Error creating friend" });
  }
}

export async function updateFriend(req, res) {
  const { id } = req.params;
  const { name, email, gender } = req.body;

  try {
    const result = await query(
      `UPDATE friends
       SET name = $1,
           email = $2,
           gender = $3
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [name, email, gender, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Friend not found or not authorized" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating friend:", err.message);
    res.status(500).json({ error: "Error updating friend" });
  }
}

export async function deleteFriend(req, res) {
  const { id } = req.params;

  try {
    const result = await query(
      `DELETE FROM friends WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Friend not found or not authorized" });
    }

    res.status(200).json({ message: "Friend deleted", friend: result.rows[0] });
  } catch (err) {
    console.error("Error deleting friend:", err.message);
    res.status(500).json({ error: "Error deleting friend" });
  }
}
