import pkg from "jsonwebtoken";
const { sign, verify } = pkg;
import { compare, genSalt, hash } from "bcryptjs";
import { query } from "../../db/index.js";
import BadRequestError from "../../errors/BadRequestError.js";
import UnauthorizedError from "../../errors/UnauthorizedError.js";

const generateAccessToken = (user) => {
  return sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const generateRefreshToken = (user) => {
  return sign(
    { userId: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  try {
    const { rows } = await query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = rows[0];

    if (!user) throw new UnauthorizedError("Invalid credentials");

    const isMatch = await compare(password, user.password);
    if (!isMatch) throw new UnauthorizedError("Invalid credentials");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await query(
      "INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)",
      [user.id, refreshToken]
    );

    res.json({ accessToken, refreshToken, username: user.username });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  const { email, password, username } = req.body;

  try {
    const { rows } = await query("SELECT 1 FROM users WHERE email = $1", [
      email,
    ]);
    if (rows.length > 0) {
      return next(new BadRequestError("Email is already registered"));
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    await query(
      "INSERT INTO users (email, password, username) VALUES ($1, $2, $3)",
      [email, hashedPassword]
    );

    const { rows: userRows } = await query(
      "SELECT id, email, username FROM users WHERE email = $1",
      [email]
    );
    const user = userRows[0];

    const accessToken = generateAccessToken(user);
    const refreshTokenValue = generateRefreshToken(user);

    await query(
      "INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)",
      [user.id, refreshTokenValue]
    );

    res
      .status(201)
      .json({
        accessToken,
        refreshToken: refreshTokenValue,
        username: user.username,
      });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(new BadRequestError("Refresh token is required"));
  }

  try {
    const { rows } = await query(
      "SELECT * FROM refresh_tokens WHERE token = $1",
      [token]
    );
    if (rows.length === 0) {
      return next(new UnauthorizedError("Invalid or revoked refresh token"));
    }

    const decoded = verify(token, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = generateAccessToken({
      id: decoded.userId,
      email: decoded.email,
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

const logout = async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(new BadRequestError("Refresh token is required to log out"));
  }

  try {
    await query("DELETE FROM refresh_tokens WHERE token = $1", [token]);
    res.json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  register,
  refreshToken,
  logout,
};
