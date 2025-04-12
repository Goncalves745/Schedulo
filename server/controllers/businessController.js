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

const getBusiness = async (req, res) => {
  const userId = req.userId;

  try {
    const existingBusiness = await prisma.business.findUnique({
      where: { user_id: userId },
    });

    if (!existingBusiness) {
      return res.status(404).json({ error: "Não existe empresa com esse id." });
    }

    const slug = existingBusiness.slug;
    res.status(200).json({ slug });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao obter a empresa." });
  }
};

const createHorario = async (req, res) => {
  const businessHours = req.body.businessHours;
  const userId = req.userId;

  try {
    const existingBusiness = await prisma.business.findUnique({
      where: { user_id: userId },
    });

    if (!existingBusiness) {
      return res.status(404).json({ error: "Empresa não encontrada." });
    }

    const dayMap = {
      monday: 0,
      tuesday: 1,
      wednesday: 2,
      thursday: 3,
      friday: 4,
      saturday: 5,
      sunday: 6,
    };

    const dataToInsert = Object.entries(businessHours)
      .filter(([, config]) => config?.isOpen && config?.open && config?.close)
      .map(([day, config]) => {
        return {
          dayOfWeek: dayMap[day],
          openTime: config.open.includes(":")
            ? config.open
            : `${config.open}:00`,
          closeTime: config.close.includes(":")
            ? config.close
            : `${config.close}:00`,
          isOpen: config.isOpen,
          businessId: existingBusiness.id,
        };
      });
    await prisma.businessHours.deleteMany({
      where: { businessId: existingBusiness.id },
    });

    await prisma.businessHours.createMany({
      data: dataToInsert,
    });

    const horariosCriados = await prisma.businessHours.findMany({
      where: { businessId: existingBusiness.id },
    });

    res.status(200).json({ data: horariosCriados });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar os horários." });
  }
};

const getHorario = async (req, res) => {
  const userId = req.userId;

  try {
    const existingBusiness = await prisma.business.findUnique({
      where: { user_id: userId },
    });

    if (!existingBusiness) {
      return res.status(404).json({ error: "Empresa não encontrada." });
    }

    const businessHours = await prisma.businessHours.findMany({
      where: { businessId: existingBusiness.id },
    });

    const dayMap = {
      0: "monday",
      1: "tuesday",
      2: "wednesday",
      3: "thursday",
      4: "friday",
      5: "saturday",
      6: "sunday",
    };

    const dadosFormatados = businessHours.reduce((acc, item) => {
      const nomeDia = dayMap[item.dayOfWeek];
      acc[nomeDia] = {
        isOpen: item.isOpen,
        open: item.openTime,
        close: item.closeTime,
      };
      return acc;
    }, {});
    res.status(200).json({ businessHours: dadosFormatados });
  } catch (err) {
    res.status(500).json({ error: "Erro ao receber horario." });
    console.log(err);
  }
};

const getBusinessServices = async (req, res) => {
  const { slug } = req.params;
  try {
    const business = await prisma.business.findUnique({
      where: { slug },
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
  createHorario,
  getHorario,
  getBusiness,
};
