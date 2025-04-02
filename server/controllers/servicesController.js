const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createService = async (req, res) => {
  const { name, price, duration_min } = req.body;

  const business = await prisma.business.findUnique({
    where: { user_id: req.userId },
  });

  try {
    await prisma.service.create({
      data: {
        name,
        price,
        duration_min,
        business_id: business.id,
      },
    });
    res.status(201).json({ message: "Serviço criado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar serviço." });
    console.log(err);
  }
};

const deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    const existingAppointments = await prisma.appointment.findMany({
      where: { service_id: id },
    });

    if (existingAppointments.length > 0) {
      return res.status(400).json({
        error:
          "Não podes apagar este serviço porque tem agendamentos associados.",
      });
    }

    await prisma.service.delete({
      where: { id },
    });

    res.status(200).json({ message: "Serviço apagado com sucesso!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao apagar serviço." });
  }
};

module.exports = {
  createService,
  deleteService,
};
