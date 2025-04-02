const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido ou inválido." });
  }
  const tokenLimpo = token.split(" ")[1];

  try {
    const decoded = jwt.verify(tokenLimpo, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Erro ao verificar token." });
  }
};

module.exports = authMiddleware;
