const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createBusiness = async (req, res) => {
  const { name, description, location, phone, slug } = req.body;
  const userId = req.userId;
  const existingBusiness = await prisma.business.findUnique({
    where: { user_id: req.userId },
  });

  if (existingBusiness) {
    return res
      .status(400)
      .json({ error: "Este utilizador já tem um negócio." });
  }

  try {
    await prisma.business.create({
      data: {
        name,
        description,
        location,
        phone,
        slug,
        user_id: userId,
      },
    });
    res.status(201).json({ message: "Empresa criada com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar empresa." });
    console.log(err);
  }
};

const getBusinessServices = async (req, res) => {
  try {
    const business = await prisma.business.findUnique({
      where: { user_id: req.userId },
    });
    if (!business) {
      return res.status(404).json({ error: "Empresa não encontrada." });
    }
    const services = await prisma.service.findMany({
      where: { business_id: business.id },
    });

    res.status(200).json({ services });
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: "Empresa não encontrada." });
  }
};

module.exports = {
  createBusiness,
  getBusinessServices,
};
