import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, Search, BarChart3, DollarSign, Building2, Users, Clock, Settings, Mail, ArrowUpRight } from 'lucide-react';
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

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'financial' | 'sales' | 'performance';
  lastGenerated?: string;
  scheduled?: boolean;
  format: 'pdf' | 'xlsx' | 'csv';
  icon: React.ElementType;
}

interface ReportSchedule {
  id: string;
  reportId: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  nextRun: string;
  format: 'pdf' | 'xlsx' | 'csv';
}

export default function ReportsHome() {
  const [filter, setFilter] = useState({
    type: 'all',
    search: '',
    dateRange: 'month'
  });

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Example reports data
  const reports: Report[] = [
    {
      id: '1',
      title: 'Relatório Financeiro',
      description: 'Resumo completo de receitas, comissões e fluxo de caixa',
      type: 'financial',
      lastGenerated: '2024-03-20T10:30:00',
      scheduled: true,
      format: 'xlsx',
      icon: DollarSign
    },
    {
      id: '2',
      title: 'Desempenho de Vendas',
      description: 'Análise detalhada das vendas por empreendimento',
      type: 'sales',
      lastGenerated: '2024-03-19T15:45:00',
      scheduled: false,
      format: 'pdf',
      icon: BarChart3
    },
    {
      id: '3',
      title: 'Status dos Empreendimentos',
      description: 'Progresso e métricas dos empreendimentos ativos',
      type: 'performance',
      lastGenerated: '2024-03-18T09:15:00',
      scheduled: true,
      format: 'pdf',
      icon: Building2
    }
  ];

  // Example schedules data
  const schedules: ReportSchedule[] = [
    {
      id: '1',
      reportId: '1',
      frequency: 'monthly',
      recipients: ['financeiro@vhgold.com.br'],
      nextRun: '2024-04-01T08:00:00',
      format: 'xlsx'
    }
  ];

  // Chart data
  const salesChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Vendas',
        data: [12, 19, 15, 25, 22, 30],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const performanceChartData = {
    labels: ['Vista Verde', 'Horizonte', 'Parque das Flores', 'Vila Nova'],
    datasets: [
      {
        label: 'Unidades Vendidas',
        data: [65, 45, 35, 28],
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      }
    ]
  };

  const handleGenerateReport = (report: Report) => {
    // Implement report generation logic
    console.log('Generating report:', report.title);
  };

  const handleScheduleReport = (report: Report) => {
    setSelectedReport(report);
    setShowScheduleModal(true);
  };

  const handleDownloadReport = (report: Report) => {
    // Implement report download logic
    console.log('Downloading report:', report.title);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600">Gere e gerencie seus relatórios</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowScheduleModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Configurar Agendamentos</span>
            </button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-6">Evolução de Vendas</h3>
            <div className="h-80">
              <Line
                data={salesChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-6">Desempenho por Empreendimento</h3>
            <div className="h-80">
              <Bar
                data={performanceChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar relatórios..."
                value={filter.search}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            <select
              value={filter.type}
              onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="all">Todos os Tipos</option>
              <option value="financial">Financeiros</option>
              <option value="sales">Vendas</option>
              <option value="performance">Desempenho</option>
            </select>

            <select
              value={filter.dateRange}
              onChange={(e) => setFilter(prev => ({ ...prev, dateRange: e.target.value }))}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="month">Este Mês</option>
              <option value="quarter">Este Trimestre</option>
              <option value="year">Este Ano</option>
            </select>

            <button
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Mais Filtros</span>
            </button>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map(report => (
            <div key={report.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    report.type === 'financial' ? 'bg-green-100 text-green-600' :
                    report.type === 'sales' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <report.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-sm text-gray-500">{report.description}</p>
                  </div>
                </div>
              </div>

              {report.lastGenerated && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>
                    Última geração: {new Date(report.lastGenerated).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                {report.scheduled && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>Agendado</span>
                  </div>
                )}
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs uppercase">
                  <FileText className="w-3 h-3" />
                  <span>{report.format}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => handleScheduleReport(report)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Agendar"
                >
                  <Calendar className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDownloadReport(report)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleGenerateReport(report)}
                  className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-colors"
                  title="Gerar"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Schedule Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {selectedReport ? `Agendar ${selectedReport.title}` : 'Configurar Agendamentos'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequência
                  </label>
                  <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                    <option value="daily">Diário</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Formato
                  </label>
                  <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                    <option value="pdf">PDF</option>
                    <option value="xlsx">Excel</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destinatários
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      placeholder="Adicione e-mails separados por vírgula"
                      className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">
                      Incluir análise comparativa com período anterior
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Salvar Agendamento
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}