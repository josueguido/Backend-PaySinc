import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };

    next();
  });
};

export default authenticateToken;
