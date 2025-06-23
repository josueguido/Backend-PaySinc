import { query } from "../../db/index.js";
import BadRequestError from "../../errors/BadRequestError.js";
import UnauthorizedError from "../../errors/UnauthorizedError.js";

export async function getProfile(req, res) {
  try {
    const { rows } = await query(
      "SELECT id, email, username, id_number, phone, birthdate, gender FROM users WHERE id = $1",
      [req.user.id]
    );

    if (rows.length === 0) {
      throw new UnauthorizedError("User not found");
    }

    res.json(rows[0]);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({ error: error.message });
    } else {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Error fetching profile" });
    }
  }
}

export async function updateProfile(req, res) {
  const { email, username, phone, birthdate, gender, id_number } = req.body;

  if (!email && !username && !phone && !birthdate && !gender && !id_number) {
    return res.status(400).json({ error: "At least one field is required" });
  }

  try {
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (email) {
      updates.push(`email = $${paramIndex++}`);
      values.push(email);
    }
    if (username) {
      updates.push(`username = $${paramIndex++}`);
      values.push(username);
    }
    if (phone) {
      updates.push(`phone = $${paramIndex++}`);
      values.push(phone);
    }
    if (birthdate) {
      updates.push(`birthdate = $${paramIndex++}`);
      values.push(birthdate);
    }
    if (gender) {
      updates.push(`gender = $${paramIndex++}`);
      values.push(gender);
    }
    if (id_number) {
      updates.push(`id_number = $${paramIndex++}`);
      values.push(id_number);
    }

    values.push(req.user.id);
    const userIdParam = `$${paramIndex}`;

    const queryText = `UPDATE users SET ${updates.join(
      ", "
    )} WHERE id = ${userIdParam} RETURNING id, email, username`;
    const { rows } = await query(queryText, values);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Error updating profile" });
  }
}
