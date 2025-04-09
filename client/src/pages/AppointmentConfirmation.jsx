import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  ArrowLeft,
  Loader,
  Scissors,
  Icon,
  Bookmark,
} from "lucide-react";
import Api from "../api/axios";

function AppointmentConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await Api.get(`/public/appointments/${id}`);
        setAppointment(response.data.appointment);
        setError("");
      } catch (err) {
        setError(
          "Erro ao carregar os detalhes do agendamento. Por favor, tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader className="h-6 w-6 text-indigo-600 animate-spin" />
          <span className="text-gray-600">
            A carregar detalhes do agendamento...
          </span>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-6">
            <div className="text-center text-red-600">
              <p>{error || "Agendamento não encontrado"}</p>
              <button
                onClick={() => navigate("/booking")}
                className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar à marcação
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(appointment.date).toLocaleDateString("pt-PT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar à página inicial
        </button>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-green-50 p-6 sm:p-8 border-b border-green-100">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Agendamento Confirmado!
                </h1>
                <p className="text-green-600 mt-1">
                  A sua marcação foi realizada com sucesso
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* Service Details */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Detalhes do Agendamento
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="h-5 w-5 text-indigo-500" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="h-5 w-5 text-indigo-500" />
                    <span>({appointment.service.duration_min} minutos)</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Bookmark className="h-5 w-5 text-indigo-500" />
                    <span>{appointment.service.name}</span>
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Os seus Dados
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <User className="h-5 w-5 text-indigo-500" />
                    <span>{appointment.client_name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="h-5 w-5 text-indigo-500" />
                    <span>{appointment.client_email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="h-5 w-5 text-indigo-500" />
                    <span>{appointment.client_phone}</span>
                  </div>
                </div>
              </div>

              {/* Price Information */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Valor Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    €{appointment.service.price}
                  </span>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-blue-50 rounded-lg p-4 text-blue-800">
                <p className="text-sm">
                  Um email de confirmação foi enviado para{" "}
                  {appointment.client_email} com todos os detalhes. Por favor,
                  chegue 5 minutos antes da sua hora marcada.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Imprimir Detalhes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentConfirmation;
