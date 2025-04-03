import React, { useEffect, useState } from "react";
import Api from "../api/axios";
import {
  Scissors,
  Plus,
  Trash2,
  Clock,
  DollarSign,
  ArrowLeft,
} from "lucide-react";

function Services() {
  const [services, setServices] = useState([]);
  const token = localStorage.getItem("token");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration_min, setDuration_min] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const res = await Api.get("/business/services", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setServices(res.data.services);
      setError("");
    } catch (err) {
      setError("Failed to load services. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await Api.delete(`/business/services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setServices((prev) => prev.filter((s) => s.id !== id));
      setError("");
    } catch (err) {
      setError("Failed to delete service. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const res = await Api({
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
      await fetchServices();
      setName("");
      setPrice("");
      setDuration_min("");
      setError("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to add service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <a
          href="/dashboard"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </a>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Scissors className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Service Management
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Service name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="relative">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price (€)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="relative">
            <input
              type="number"
              value={duration_min}
              onChange={(e) => setDuration_min(e.target.value)}
              placeholder="Duration (minutes)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              min="1"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5" />
            Add Service
          </button>
        </form>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No services added yet. Add your first service above.
          </div>
        ) : (
          <div className="grid gap-4">
            {services.map((service) => (
              <React.Fragment key={service.id}>
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Scissors className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {service.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration_min} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>{service.price}€</span>
                    </div>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Services;
