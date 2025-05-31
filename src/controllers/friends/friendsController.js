import { query } from "../../db/index.js";

export async function getAllFriends(req, res) {
  try {
    const result = await query(
      `SELECT * FROM friends WHERE user_id = $1 ORDER BY name ASC`,
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
  const { name } = req.body;

  try {
    const result = await query(
      `INSERT INTO friends (name, user_id) VALUES ($1, $2) RETURNING *`,
      [name, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating friend:", err.message);
    res.status(500).json({ error: "Error creating friend" });
  }
}

export async function updateFriend(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const result = await query(
      `UPDATE friends SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *`,
      [name, id, req.user.id]
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
