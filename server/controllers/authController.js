const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const saltRounds = 10;

const signup = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  try {
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
    });
    res.status(201).json({ message: "Utilizador criado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar utilizador." });
    console.log(err);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  if (!user) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  res.status(200).json({ token });
};

module.exports = {
  signup,
  login,
};
