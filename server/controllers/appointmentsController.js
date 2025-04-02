const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createPublicAppointment = async (req, res) => {
  const { client_name, client_email, date, service_id } = req.body;

  const service = await prisma.service.findUnique({
    where: { id: service_id },
  });
  if (!service) {
    return res.status(404).json({ error: "Serviço não encontrado." });
  }
  const business_id = service.business_id;

  try {
    await prisma.appointment.create({
      data: {
        client_name,
        client_email,
        date: new Date(date),
        service_id,
        business_id,
      },
    });
    res.status(201).json({ message: "Agendamento criado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar agendamento." });
    console.log(err);
  }
};

const getAppointments = async (req, res) => {
  try {
    const business = await prisma.business.findUnique({
      where: { user_id: req.userId },
    });
    if (!business) {
      return res.status(404).json({ error: "Empresa não encontrada." });
    }

    const appointments = await prisma.appointment.findMany({
      where: { business_id: business.id },
      include: { service: true },
    });

    res.status(200).json({ appointments });
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: "Serviço não encontrado." });
  }
};

const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Obter o negócio associado ao utilizador autenticado
    const business = await prisma.business.findUnique({
      where: { user_id: req.userId },
    });

    if (!business) {
      return res.status(404).json({ error: "Negócio não encontrado." });
    }

    // 2. Obter o agendamento pelo ID
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Agendamento não encontrado." });
    }

    // 3. Verificar se o agendamento pertence ao negócio do user
    if (appointment.business_id !== business.id) {
      return res
        .status(403)
        .json({ error: "Não autorizado a apagar este agendamento." });
    }

    // 4. Apagar o agendamento
    await prisma.appointment.delete({
      where: { id },
    });

    res.status(200).json({ message: "Agendamento apagado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao apagar agendamento." });
  }
};

module.exports = {
  createPublicAppointment,
  getAppointments,
  deleteAppointment,
};
