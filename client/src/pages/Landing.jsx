import React from "react";
import {
  Scissors,
  Calendar,
  Clock,
  Star,
  ChevronRight,
  Users,
  Shield,
  BarChart,
} from "lucide-react";

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Schedulo</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900">
              Funcionalidades
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Contacto
            </a>
            <a href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </a>
            <a
              href="/register"
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Criar Conta
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Gestão de Agendamentos
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Agenda, gere serviços e clientes de forma simples e eficiente
                com a plataforma feita para empresas.
              </p>
              <div className="flex gap-4">
                <a
                  href="/register"
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Começar Grátis
                  <ChevronRight className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1664575602554-2087b04935a5?auto=format&fit=crop&w=800&q=80"
                alt="Dashboard"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
                <div className="bg-primary-100 p-2 rounded-full">
                  <Star className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Confiado por Profissionais
                  </p>
                  <p className="text-sm text-gray-500">de Norte a Sul</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Funcionalidades
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tudo o que precisas para gerir o teu negócio de detalhe automóvel
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <Calendar className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Agendamento Inteligente
              </h3>
              <p className="text-gray-600">
                Marcações rápidas e eficazes com serviços personalizados
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <Scissors className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Gestão de Serviços
              </h3>
              <p className="text-gray-600">
                Adiciona, edita ou remove serviços e define preços e durações
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <BarChart className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Estatísticas de Negócio
              </h3>
              <p className="text-gray-600">
                Visualiza desempenho, receitas e volume de marcações
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-4">
                Pronto para otimizar o teu negócio?
              </h2>
              <p className="text-indigo-100 text-lg">
                Junta-te às empresas em todo o país que já utilizam o Schedulo
              </p>
            </div>
            <a
              href="/register"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg hover:bg-indigo-50 transition-colors text-lg font-semibold"
            >
              Começar Grátis
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-6 w-6 text-indigo-400" />
                <span className="text-xl font-bold text-white">Schedulo</span>
              </div>
              <p className="text-gray-400">
                Solução moderna para marcação e gestão de serviços
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Produto</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Preços
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Segurança
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sobre Nós
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Parcerias
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Ajuda</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contactos
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Schedulo. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
