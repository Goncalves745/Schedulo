const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getAvailability = async (req, res) => {
  const { daysOfWeek, startTime, endTime } = req.body;

  if (!Number.isInteger(daysOfWeek) || daysOfWeek < 0 || daysOfWeek > 6) {
    return res.status(400).json({ error: "Dia da semana não encontrado." });
  }

  try {
    const existingBusiness = await prisma.business.findUnique({
      where: { user_id: req.userId },
    });

    if (!existingBusiness) {
      return res.status(404).json({ error: "Negócio não encontrado." });
    }

    const availability = await prisma.availability.findMany({
      where: { businessId: existingBusiness.id },
    });

    res.status(200).json(availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar disponibilidade." });
  }
};

const postAvailability = async (req, res) => {
  const { dayOfWeek, startTime, endTime } = req.body;
  const newStart = startTime;
  const newEnd = endTime;

  try {
    const existingBusiness = await prisma.business.findUnique({
      where: { user_id: req.userId },
    });

    if (!existingBusiness) {
      return res.status(404).json({ error: "Negócio não encontrado." });
    }

    const existingAppointment = await prisma.availability.findMany({
      where: {
        businessId: existingBusiness.id,
        dayOfWeek: dayOfWeek,
      },
    });

    const hasConflict = existingAppointment.find((slot) => {
      return newStart < slot.endTime && newEnd > slot.startTime;
    });

    if (hasConflict) {
      return res.status(409).json({
        error: `Conflito com horário já existente: ${hasConflict.startTime} - ${hasConflict.endTime}}`,
      });
    }

    const newAvailability = await prisma.availability.create({
      data: {
        businessId: existingBusiness.id,
        dayOfWeek,
        startTime,
        endTime,
      },
    });

    res.status(201).json(newAvailability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar disponibilidade." });
  }
};

const getPublicAvailability = async (req, res) => {
  const { slug } = req.params;

  try {
    const existingBusiness = await prisma.business.findUnique({
      where: { slug },
    });

    if (!existingBusiness) {
      return res.status(404).json({ error: "Negócio não encontrado." });
    }

    const availability = await prisma.businessHours.findMany({
      where: {
        businessId: existingBusiness.id,
        isOpen: true,
      },
      orderBy: {
        dayOfWeek: "asc",
      },
    });

    res.status(200).json(availability);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao buscar disponibilidade." });
  }
};

module.exports = {
  getAvailability,
  postAvailability,
  getPublicAvailability,
};
