import { query } from "../../db/index.js";

export async function getCategory(req, res) {
  try {
    const result = await query(
      "SELECT * FROM categories WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching category:", err);
    res.status(500).json({ error: "Error fetching category" });
  }
}

export async function getAllCategories(req, res) {
  try {
    const result = await query("SELECT * FROM categories WHERE user_id = $1", [
      req.user.id,
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Error fetching categories" });
  }
}

export async function createCategory(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const result = await query(
      "INSERT INTO categories (name, description, user_id) VALUES ($1, $2, $3) RETURNING *",
      [name, description, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ error: "Error creating category" });
  }
}

export async function updateCategory(req, res) {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const result = await query(
      "UPDATE categories SET name = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [name, description || null, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ error: "Error updating category" });
  }
}

export async function deleteCategory(req, res) {
  const { id } = req.params;
  try {
    const result = await query(
      "DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ error: "Error deleting category" });
  }
}
