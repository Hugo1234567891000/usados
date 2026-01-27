import React from 'react';
import { BarChart2, DollarSign, FileText, ArrowUp, ArrowDown, Calendar, CheckCircle, Clock, Users, Percent, CreditCard } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function FinancialDashboard() {
  // Simulation Chart Data
  const simulationChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Simulações',
        data: [120, 150, 180, 210, 250, 280],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const simulationChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Proposals Chart Data
  const proposalsChartData = {
    labels: ['Aprovadas', 'Pendentes', 'Rejeitadas'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 1
      }
    ]
  };

  const proposalsChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const
      }
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Bem-vindo de volta, Banco Nacional!</p>
          </div>
          <div className="flex items-center gap-4">
            <select className="px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
              <option value="month">Este Mês</option>
              <option value="quarter">Este Trimestre</option>
              <option value="year">Este Ano</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <h3 className="font-medium">Simulações</h3>
              </div>
              <span className="flex items-center gap-1 text-green-600">
                <ArrowUp className="w-4 h-4" />
                <span>12%</span>
              </span>
            </div>
            <p className="text-3xl font-bold">280</p>
            <p className="text-sm text-gray-500 mt-2">+30 em relação ao mês anterior</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-green-600" />
                <h3 className="font-medium">Propostas</h3>
              </div>
              <span className="flex items-center gap-1 text-green-600">
                <ArrowUp className="w-4 h-4" />
                <span>8%</span>
              </span>
            </div>
            <p className="text-3xl font-bold">42</p>
            <p className="text-sm text-gray-500 mt-2">+3 em relação ao mês anterior</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-yellow-600" />
                <h3 className="font-medium">Valor Financiado</h3>
              </div>
              <span className="flex items-center gap-1 text-red-600">
                <ArrowDown className="w-4 h-4" />
                <span>5%</span>
              </span>
            </div>
            <p className="text-3xl font-bold">R$ 12.5M</p>
            <p className="text-sm text-gray-500 mt-2">-0.6M em relação ao mês anterior</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Simulations Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-6">Simulações de Financiamento</h3>
            <div className="h-80">
              <Line data={simulationChartData} options={simulationChartOptions} />
            </div>
          </div>

          {/* Proposals Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-6">Status das Propostas</h3>
            <div className="h-80">
              <Bar data={proposalsChartData} options={proposalsChartOptions} />
            </div>
          </div>
        </div>

        {/* Recent Activity and Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-6">Atividade Recente</h3>
            <div className="space-y-4">
              {[
                { 
                  icon: FileText,
                  title: 'Nova proposta recebida',
                  description: 'Proposta para financiamento de apartamento no Edifício Horizonte',
                  time: '5 minutos atrás',
                  status: 'pending'
                },
                {
                  icon: CheckCircle,
                  title: 'Proposta aprovada',
                  description: 'Financiamento aprovado para cliente João Silva',
                  time: '2 horas atrás',
                  status: 'success'
                },
                {
                  icon: Percent,
                  title: 'Taxa de juros atualizada',
                  description: 'Taxa mínima reduzida para 6.5% a.a.',
                  time: '4 horas atrás',
                  status: 'info'
                }
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${
                    activity.status === 'success' ? 'bg-green-100 text-green-600' :
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-6">Próximos Eventos</h3>
            <div className="space-y-4">
              {[
                {
                  icon: Calendar,
                  title: 'Reunião com construtora VHGold',
                  date: '25/03/2024',
                  type: 'meeting'
                },
                {
                  icon: Users,
                  title: 'Treinamento de corretores parceiros',
                  date: '28/03/2024',
                  type: 'training'
                },
                {
                  icon: Clock,
                  title: 'Atualização de taxas de financiamento',
                  date: '30/03/2024',
                  type: 'update'
                }
              ].map((event, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${
                    event.type === 'meeting' ? 'bg-purple-100 text-purple-600' :
                    event.type === 'training' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <event.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    Ver detalhes
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}