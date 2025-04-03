import React, { useState } from "react";
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
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const handleLogout = async (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navigationItems = [
    { id: "overview", name: "Overview", icon: LayoutDashboard },
    { id: "appointments", name: "Appointments", icon: Calendar },
    { id: "services", name: "Services", icon: Scissors },
    { id: "clients", name: "Clients", icon: Users },
    { id: "settings", name: "Settings", icon: Settings },
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
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Schedulo</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${
                    activeSection === item.id
                      ? "bg-indigo-50 text-indigo-600"
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
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              {navigationItems.find((item) => item.id === activeSection)?.name}
            </h1>
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              {/* Profile dropdown */}
              <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
                <span>John Doe</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-6">
          {activeSection === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Stats cards */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Today's Appointments
                  </h3>
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">8</p>
                <p className="text-sm text-gray-500 mt-1">
                  3 completed, 5 upcoming
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Active Clients
                  </h3>
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">124</p>
                <p className="text-sm text-gray-500 mt-1">+12 this month</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Services Offered
                  </h3>
                  <Scissors className="h-6 w-6 text-indigo-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">15</p>
                <p className="text-sm text-gray-500 mt-1">
                  Most popular: Haircut
                </p>
              </div>

              {/* Recent appointments */}
              <div className="md:col-span-2 lg:col-span-3">
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">
                      Recent Appointments
                    </h3>
                  </div>
                  <div className="divide-y">
                    {[1, 2, 3].map((_, index) => (
                      <div key={index} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={`https://images.unsplash.com/photo-${
                                1500000000000 + index
                              }?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                              alt="Client"
                              className="h-10 w-10 rounded-full"
                            />
                            <div>
                              <p className="font-medium text-gray-900">
                                Sarah Thompson
                              </p>
                              <p className="text-sm text-gray-500">
                                Haircut & Styling
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">2:30 PM</p>
                            <p className="text-sm text-gray-500">Today</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder content for other sections */}
          {activeSection === "appointments" &&
            navigate("/dashboard/appointments")}

          {activeSection === "services" && navigate("/business/services")}

          {activeSection === "clients" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Client Directory</h2>
              <p className="text-gray-600">
                Client management view coming soon...
              </p>
            </div>
          )}

          {activeSection === "settings" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
