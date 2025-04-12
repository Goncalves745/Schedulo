const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createService = async (req, res) => {
  const { name, price, duration_min } = req.body;

  try {
    const business = await prisma.business.findUnique({
      where: { user_id: req.userId },
    });

    const newService = await prisma.service.create({
      data: {
        name,
        price,
        duration_min,
        business_id: business.id,
      },
    });

    res.status(201).json(newService); // ← devolve o serviço criado
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao criar serviço." });
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

const getServices = async (req, res) => {
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
    res.status(404).json({ error: "Serviço não encontrado." });
  }
};

module.exports = {
  createService,
  deleteService,
  getServices,
};
