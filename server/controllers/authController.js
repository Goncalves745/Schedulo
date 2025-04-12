const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const saltRounds = 10;

const generateSlug = async (name) => {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/\s+/g, "-") // espaços por hífens
    .replace(/[^a-z0-9-]/g, ""); // remove símbolos

  let slug = base;
  let count = 1;

  while (await prisma.business.findUnique({ where: { slug } })) {
    slug = `${base}-${count}`;
    count++;
  }

  return slug;
};

const signup = async (req, res) => {
  const { business_name, email, password, phone, address } = req.body;
  const slug = await generateSlug(business_name);

  const passwordHash = await bcrypt.hash(req.body.password, saltRounds);
  try {
    await prisma.user.create({
      data: {
        name: business_name, // ou pode ser name separado
        email,
        passwordHash,
        business: {
          create: {
            name: business_name,
            location: address,
            phone,
            slug: slug,
          },
        },
      },
    });
    res.status(201).json({ message: "Utilizador criado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar utilizador." });
    console.log(err);
  }
};

const login = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(401).json({ body: err });
  }
};

module.exports = {
  signup,
  login,
};
