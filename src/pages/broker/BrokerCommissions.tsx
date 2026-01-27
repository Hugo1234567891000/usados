import React, { useState } from 'react';
import { DollarSign, Building2, Calendar, Download, ArrowUpRight } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Commission {
  id: string;
  propertyName: string;
  unitNumber: string;
  clientName: string;
  saleValue: number;
  commissionValue: number;
  status: 'pending' | 'approved' | 'paid';
  saleDate: string;
  paymentDate?: string;
}

export default function BrokerCommissions() {
  const [filter, setFilter] = useState({
    status: 'all',
    dateRange: 'month'
  });

  // Example commissions data
  const commissions: Commission[] = [
    {
      id: '1',
      propertyName: 'Residencial Vista Verde',
      unitNumber: '101',
      clientName: 'João Silva',
      saleValue: 850000,
      commissionValue: 25500,
      status: 'pending',
      saleDate: '2024-03-15'
    },
    {
      id: '2',
      propertyName: 'Edifício Horizonte',
      unitNumber: '203',
      clientName: 'Maria Santos',
      saleValue: 950000,
      commissionValue: 28500,
      status: 'paid',
      saleDate: '2024-03-01',
      paymentDate: '2024-03-10'
    }
  ];

  // Chart data
  const chartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Comissões',
        data: [25000, 28000, 32000, 35000, 40000, 45000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => formatCurrency(value)
        }
      }
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getStatusColor = (status: Commission['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Comissões</h2>
          <p className="text-gray-600">Acompanhe suas comissões e pagamentos</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-5 h-5" />
          <span>Exportar</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h3 className="font-medium">Total Recebido</h3>
          </div>
          <p className="text-3xl font-bold">R$ 75.5K</p>
          <p className="text-sm text-gray-500 mt-2">Este mês</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h3 className="font-medium">Vendas Realizadas</h3>
          </div>
          <p className="text-3xl font-bold">12</p>
          <p className="text-sm text-gray-500 mt-2">Este mês</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-yellow-600" />
            <h3 className="font-medium">A Receber</h3>
          </div>
          <p className="text-3xl font-bold">R$ 25.2K</p>
          <p className="text-sm text-gray-500 mt-2">Em aprovação</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-purple-600" />
            <h3 className="font-medium">Próximo Pagamento</h3>
          </div>
          <p className="text-3xl font-bold">R$ 12.5K</p>
          <p className="text-sm text-gray-500 mt-2">Em 15/04/2024</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-6">Evolução das Comissões</h3>
        <div className="h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Commissions List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Imóvel/Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor da Venda
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comissão
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {commissions.map((commission) => (
              <tr key={commission.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="font-medium text-gray-900">{commission.propertyName}</p>
                    <p className="text-sm text-gray-500">
                      Unidade {commission.unitNumber} · {commission.clientName}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-gray-900 font-medium">
                    {formatCurrency(commission.saleValue)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-gray-900 font-medium">
                    {formatCurrency(commission.commissionValue)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getStatusColor(commission.status)
                  }`}>
                    {commission.status === 'paid' ? 'Pago' :
                     commission.status === 'approved' ? 'Aprovado' : 'Pendente'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <p>Venda: {new Date(commission.saleDate).toLocaleDateString('pt-BR')}</p>
                    {commission.paymentDate && (
                      <p>Pagamento: {new Date(commission.paymentDate).toLocaleDateString('pt-BR')}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900">
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}