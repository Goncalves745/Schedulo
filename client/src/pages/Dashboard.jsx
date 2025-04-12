import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Scissors,
  Bell,
  ChevronDown,
  Menu,
  X,
  Clock,
  PersonStanding,
  Delete,
  ArrowLeft,
  DollarSign,
  Plus,
  Trash2,
  CreditCard,
  TrendingUp,
  CalendarCheck,
  Save,
} from "lucide-react";
import Api from "../api/axios";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [slug, setSlug] = useState("");
  const [deletingID, setDeletingID] = useState(null);
  const [popupId, setPopupId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration_min, setDuration_min] = useState("");

  const [businessHours, setBusinessHours] = useState({});

  const [isSaving, setIsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  const handleBusinessHoursChange = (day, field, value) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const getSlug = async () => {
    try {
      const res = await Api.get("/business/slug", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const url = `/booking/${res.data.slug}`;
      setSlug(url);
    } catch (err) {
      console.log("Erro ao obter slug:", err);
    }
  };
  const saveBusinessHours = async () => {
    setIsSaving(true);
    setSettingsError("");
    try {
      await Api.post(
        "/business/settings/hours",
        { businessHours },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSettingsError("Horário guardado com sucesso!");
    } catch (err) {
      setSettingsError(
        "Erro ao guardar o horário. Por favor, tente novamente."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingID(id);
    try {
      await Api.delete(`/business/services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeletingID(null);
      setServices((prev) => prev.filter((service) => service.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteAppointment = async (id) => {
    setDeletingID(id);
    try {
      await Api.delete(`/business/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeletingID(null);
      setAppointments((prev) => prev.filter((service) => service.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      await Api({
        method: "post",
        url: "/business/services/create",
        data: {
          name,
          price: parseFloat(price),
          duration_min: parseInt(duration_min),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchServices();
      setName("");
      setPrice("");
      setDuration_min("");
      setError("");
    } catch (err) {
      setError("Failed to add service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await Api.get("/business/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(res.data.appointments);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchHorario = async () => {
    try {
      const res = await Api.get("/business/settings/hours", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBusinessHours(res.data.businessHours);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await Api.get("/business/services", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setServices(res.data.services);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navigationItems = [
    { id: "overview", name: "Resumo", icon: LayoutDashboard },
    { id: "appointments", name: "Marcações", icon: Calendar },
    { id: "services", name: "Serviços", icon: Scissors },
    { id: "settings", name: "Definições", icon: Settings },
  ];

  const daysOfWeek = [
    { id: "monday", label: "Segunda-feira" },
    { id: "tuesday", label: "Terça-feira" },
    { id: "wednesday", label: "Quarta-feira" },
    { id: "thursday", label: "Quinta-feira" },
    { id: "friday", label: "Sexta-feira" },
    { id: "saturday", label: "Sábado" },
    { id: "sunday", label: "Domingo" },
  ];

  useEffect(() => {
    fetchAppointments();
    fetchServices();
    fetchHorario();
    getSlug();
  }, []);

  const todayAppointments = appointments.filter(
    (apt) => new Date(apt.date).toDateString() === new Date().toDateString()
  );

  const upcomingAppointments = appointments
    .filter((apt) => new Date(apt.date) > new Date())
    .slice(0, 5);

  const stats = [
    {
      title: "Marcações de Hoje",
      value: todayAppointments.length,
      icon: CalendarCheck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Serviços totais",
      value: services.length,
      icon: Scissors,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Clientes ativos",
      value: appointments.length,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Receita mensal",
      value:
        "€" +
        appointments.reduce((acc, apt) => acc + (apt.service?.price || 0), 0),
      icon: CreditCard,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 right-0 p-4 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-40
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Calendar className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="text-xl font-bold text-gray-900">Schedulo </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150
                  ${
                    activeSection === item.id
                      ? "bg-indigo-50 text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </button>
            ))}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Terminar Sessão
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              {(() => {
                const item = navigationItems.find(
                  (item) => item.id === activeSection
                );
                if (!item) return null;
                const Icon = item.icon;
                return (
                  <>
                    <Icon className="h-6 w-6 text-indigo-600" />
                    {item.name}
                  </>
                );
              })()}
            </h1>
            <div className="flex items-center gap-4"></div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-6">
          {activeSection === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Recent Appointments */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Proximas marcações
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-indigo-50 rounded-lg">
                            <PersonStanding className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {appointment.client_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {appointment.service?.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {new Date(appointment.date).toLocaleString(
                              "pt-PT",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(appointment.date).toLocaleString(
                              "pt-PT",
                              {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "appointments" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Todas as Marcações
                </h2>
                <button
                  onClick={() => navigate(slug)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Nova marcação
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 relative">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <PersonStanding className="h-6 w-6 text-gray-600" />
                        </div>
                        <button
                          onClick={() =>
                            setPopupId(
                              popupId === appointment.id ? null : appointment.id
                            )
                          }
                          className="text-left"
                        >
                          <p className="font-medium text-gray-900">
                            {appointment.client_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.service?.name}
                          </p>
                        </button>

                        {popupId === appointment.id && (
                          <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg border border-gray-100 p-4 z-10 min-w-[250px]">
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Client Details
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {appointment.client_name}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="text-sm text-gray-900">
                                  {appointment.client_email || "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="text-sm text-gray-900">
                                  {appointment.client_phone || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.service?.duration_min} min</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {new Date(appointment.date).toLocaleString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(appointment.date).toLocaleString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleDeleteAppointment(appointment.id)
                          }
                          disabled={deletingID === appointment.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deletingID === appointment.id ? (
                            <span className="text-sm">Deleting...</span>
                          ) : (
                            <Delete className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "services" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <Scissors className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Serviços
                    </h2>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {services.map((service) => (
                    <div key={service.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Scissors className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {service.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {service.duration_min} minutos
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <p className="font-medium text-gray-900">
                            {service.price}€
                          </p>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Service Form */}
              <div
                id="addServiceForm"
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Adicionar novo serviço
                </h3>
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do serviço
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Haircut"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preço (€)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duração (minutos)
                    </label>
                    <input
                      type="number"
                      value={duration_min}
                      onChange={(e) => setDuration_min(e.target.value)}
                      placeholder="30"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      min="1"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>A adicionar serviço...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-5 w-5" />
                          <span>Adicionar serviço</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeSection === "settings" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <Settings className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Definições da Conta
                    </h2>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">
                      Horário de Funcionamento
                    </h3>
                    <div className="space-y-4">
                      {daysOfWeek.map((day) => (
                        <div
                          key={day.id}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="w-40">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={businessHours[day.id]?.isOpen || false}
                                onChange={(e) =>
                                  handleBusinessHoursChange(
                                    day.id,
                                    "isOpen",
                                    e.target.checked
                                  )
                                }
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                {day.label}
                              </span>
                            </label>
                          </div>

                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-gray-600">
                                Abertura:
                              </label>
                              <input
                                type="time"
                                value={businessHours[day.id]?.open || ""}
                                onChange={(e) =>
                                  handleBusinessHoursChange(
                                    day.id,
                                    "open",
                                    e.target.value
                                  )
                                }
                                disabled={!businessHours[day.id]?.isOpen}
                                className="px-2 py-1 border border-gray-300 rounded-md text-sm disabled:bg-gray-100 disabled:text-gray-400"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-gray-600">
                                Fecho:
                              </label>
                              <input
                                type="time"
                                value={businessHours[day.id]?.close || ""}
                                onChange={(e) =>
                                  handleBusinessHoursChange(
                                    day.id,
                                    "close",
                                    e.target.value
                                  )
                                }
                                disabled={!businessHours[day.id]?.isOpen}
                                className="px-2 py-1 border border-gray-300 rounded-md text-sm disabled:bg-gray-100 disabled:text-gray-400"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {settingsError && (
                      <div
                        className={`mt-4 p-4 rounded-lg ${
                          settingsError.includes("sucesso")
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {settingsError}
                      </div>
                    )}

                    <div className="mt-6">
                      <button
                        onClick={saveBusinessHours}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>A guardar...</span>
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5" />
                            <span>Guardar Horário</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
