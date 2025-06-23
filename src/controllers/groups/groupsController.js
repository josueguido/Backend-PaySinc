import { query } from "../../db/index.js";

export async function getAllGroups(req, res) {
  try {
    const result = await query(
      `SELECT * FROM paysinc_groups WHERE user_id = $1 ORDER BY name ASC`,
      [req.user.id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error retrieving groups:", err.message);
    res.status(500).json({ error: "Error retrieving groups" });
  }
}

export async function getGroupById(req, res) {
  const { id } = req.params;

  try {
    const result = await query(
      `SELECT * FROM paysinc_groups WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error retrieving group:", err.message);
    res.status(500).json({ error: "Error retrieving group" });
  }
}

export async function createGroup(req, res) {
  const { name, description } = req.body;

  try {
    const result = await query(
      `INSERT INTO paysinc_groups (name, description, user_id) VALUES ($1, $2, $3) RETURNING *`,
      [name, description, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating group:", err.message);
    res.status(500).json({ error: "Error creating group" });
  }
}

export async function updateGroup(req, res) {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const result = await query(
      `UPDATE paysinc_groups SET name = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *`,
      [name, description, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Group not found or not authorized" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating group:", err.message);
    res.status(500).json({ error: "Error updating group" });
  }
}

export async function deleteGroup(req, res) {
  const { id } = req.params;

  try {
    const result = await query(
      `DELETE FROM paysinc_groups WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Group not found or not authorized" });
    }

    res.status(200).json({ message: "Group deleted", group: result.rows[0] });
  } catch (err) {
    console.error("Error deleting group:", err.message);
    res.status(500).json({ error: "Error deleting group" });
  }
}
