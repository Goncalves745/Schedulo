import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Calendar as CalendarIcon,
  User,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
import Api from "../api/axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import pt from "date-fns/locale/pt";

registerLocale("pt", pt);

function generateTimeSlotsFromAvailability(
  availability,
  selectedDate,
  duration
) {
  const slots = [];

  if (!selectedDate) return [];

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const day = selectedDate.getDate();

  availability.forEach((slot) => {
    const [startHour, startMinute = 0] = slot.openTime.split(":").map(Number);
    const [endHour, endMinute = 0] = slot.closeTime.split(":").map(Number);

    const start = new Date(year, month, day, startHour, startMinute);
    const end = new Date(year, month, day, endHour, endMinute);

    const currentTime = new Date(start);

    while (currentTime.getTime() + duration * 60000 <= end.getTime()) {
      const hours = currentTime.getHours().toString().padStart(2, "0");
      const minutes = currentTime.getMinutes().toString().padStart(2, "0");
      slots.push(`${hours}:${minutes}`);
      currentTime.setMinutes(currentTime.getMinutes() + duration);
    }
  });

  return slots;
}

function Booking() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const fullDateTime = selectedDate
    ? new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        ...selectedTime.split(":").map(Number)
      )
    : null;

  const token = localStorage.getItem("token");
  const { slug } = useParams();
  const navigate = useNavigate();

  const selectedServiceDetails = services.find(
    (service) => service.id === selectedService
  );

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await Api.get(`/public/${slug}/services`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setServices(response.data.services);
        setError("");
      } catch (err) {
        setError(
          "Falha ao carregar os serviços. Por favor tente novamente mais tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAvailability = async () => {
      try {
        const response = await Api.get(`/public/${slug}/availability`, {});
        setAvailability(response.data);
        console.log(
          "Dias disponíveis (dayOfWeek):",
          response.data.map((a) => a.dayOfWeek)
        );

        setError("");
      } catch (err) {
        setError(
          "Falha ao carregar disponibilidade. Por favor tente novamente mais tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
    fetchServices();
  }, []);

  useEffect(() => {
    if (!selectedDate || availability.length === 0 || !selectedServiceDetails)
      return;

    const jsDay = (new Date(selectedDate).getDay() + 6) % 7;

    const filteredAvailability = availability.filter(
      (slot) => slot.dayOfWeek === jsDay
    );

    const duration = selectedServiceDetails?.duration_min;
    const timeSlots = generateTimeSlotsFromAvailability(
      filteredAvailability,
      selectedDate,
      duration
    );
    setAvailableTimeSlots(timeSlots);
  }, [selectedDate, availability, selectedServiceDetails]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await Api.post("/business/appointments/create", {
        service_id: selectedService,
        date: fullDateTime.toISOString(),
        client_name: name,
        client_email: email,
        client_phone: phone,
        notes: notes,
      });

      navigate(`/appointments/${response.data.appointmentId}`);

      setSelectedService("");
      setSelectedDate(null);
      setSelectedTime("");
      setName("");
      setEmail("");
      setPhone("");
      setNotes("");
    } catch (err) {
      setError("Falha ao criar a marcação. Por favor tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Fazer Marcação
              </h1>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Serviço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleciona o serviço
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Escolhe um serviço</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - €{service.price} ({service.duration_min}{" "}
                      min)
                    </option>
                  ))}
                </select>
              </div>

              {/* Data */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleciona a data
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="pl-10">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      locale="pt"
                      dateFormat="dd/MM/yyyy"
                      minDate={minDate}
                      placeholderText="Escolhe a data"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      filterDate={(date) => {
                        const jsDay = (date.getDay() + 6) % 7;
                        return availability.some(
                          (slot) => slot.dayOfWeek === jsDay
                        );
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Hora */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleciona a hora
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                    className="pl-10 w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Escolhe uma hora</option>
                    {availableTimeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Informações Pessoais */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    O teu nome
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="pl-10 w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="João Silva"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="joao@exemplo.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de telemóvel
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="pl-10 w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="+351 912 345 678"
                    />
                  </div>
                </div>
              </div>

              {/* Resumo */}
              {selectedServiceDetails && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Resumo da Marcação
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Serviço: {selectedServiceDetails.name}</p>
                    <p>
                      Duração: {selectedServiceDetails.duration_min} minutos
                    </p>
                    <p>Preço: €{selectedServiceDetails.price}</p>
                    {selectedDate && (
                      <p>
                        Data:{" "}
                        {new Date(selectedDate).toLocaleDateString("pt-PT")}
                      </p>
                    )}
                    {selectedTime && <p>Hora: {selectedTime}</p>}
                  </div>
                </div>
              )}

              {/* Botão Submeter */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "A processar..." : "Confirmar Marcação"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;
