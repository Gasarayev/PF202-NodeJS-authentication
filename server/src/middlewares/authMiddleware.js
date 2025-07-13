const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tapılmadı!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // tokenin içindəki məlumatları requestə əlavə et
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token etibarsızdır!" });
  }
};

module.exports = authMiddleware;
