import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleButton = async (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div>
      <h1>Bem vindo ao painel </h1>
      <button
        type="submit"
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        onClick={handleButton}
      >
        Log out
      </button>
    </div>
  );
}

export default Dashboard;
