const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const resend = require("../utils/email");

const createPublicAppointment = async (req, res) => {
  const { client_name, client_email, date, service_id, client_phone } =
    req.body;

  const service = await prisma.service.findUnique({
    where: { id: service_id },
  });
  if (!service) {
    return res.status(404).json({ error: "Serviço não encontrado." });
  }
  const business_id = service.business_id;

  try {
    const newAppointment = await prisma.appointment.create({
      data: {
        client_name,
        client_email,
        date: new Date(date),
        service_id,
        business_id,
        client_phone,
      },
    });
    const dateFormatted = new Date(date).toLocaleString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    try {
      await resend.emails.send({
        from: "Schedulo <onboarding@resend.dev>",
        to: "diogo.soares.g2003@icloud.com",
        // to: `${req.body.client_email}`,
        subject: "Hello World",
        html: `<!DOCTYPE html>
        <html lang="pt">
        <head><meta charset="UTF-8"></head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <h2 style="color: #4f46e5;">Olá ${client_name},</h2>
            <p>Obrigado por agendar um serviço connosco! Aqui estão os detalhes do seu agendamento:</p>
            <ul style="line-height: 1.8;">
              <li><strong>Serviço:</strong> ${service.name}</li>
              <li><strong>Data:</strong> ${dateFormatted}</li>
              <li><strong>Duração:</strong> ${service.duration_min} minutos</li>
              <li><strong>Preço:</strong> €${service.price}</li>
            </ul>
            <p>Se precisar de alterar ou cancelar o seu agendamento, por favor entre em contacto connosco com pelo menos 24 horas de antecedência.</p>
            <p style="margin-top: 30px;">Com os melhores cumprimentos,<br /><strong>A equipa da Schedulo</strong></p>
            <hr style="margin-top: 40px;" />
            <small style="color: #888;">Este é um email automático. Por favor, não responda a esta mensagem.</small>
          </div>
        </body>
        </html>`,
      });
      console.log("EMAIL ENVIADO:");
    } catch (err) {
      console.error("ERRO AO ENVIAR EMAIL:", err);
    }
    res.status(201).json({ appointmentId: newAppointment.id });
  } catch (err) {
    console.error("Erro ao criar marcação:", err);
    res.status(500).json({ error: "Erro ao criar marcação." });
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

const getAppointmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { service: true },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Agendamento não encontrado." });
    }

    res.status(200).json({ appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar agendamento." });
  }
};

module.exports = {
  createPublicAppointment,
  getAppointments,
  deleteAppointment,
  getAppointmentById,
};
