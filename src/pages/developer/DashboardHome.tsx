import React from 'react';
import { Building2, DollarSign, FileText, ArrowUp, ArrowDown, Calendar, CheckCircle, Clock, AlertTriangle, Users, TrendingUp, Home, Briefcase, MapPin, Eye, Edit, Plus } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Link } from 'react-router-dom';
import projects from '../../data/projects';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardHome() {
  // In a real app, this would come from an authentication context
  const currentConstructorId = 'VHGold-123';
  
  // Filter projects by constructor ID
  const constructorProjects = projects.filter(project => 
    project.constructorId === currentConstructorId
  );
  
  // Calculate statistics
  const totalProjects = constructorProjects.length;
  const activeProjects = constructorProjects.filter(p => p.status === 'underConstruction').length;
  const completedProjects = constructorProjects.filter(p => p.status === 'completed').length;
  const totalUnits = constructorProjects.reduce((sum, p) => sum + p.totalUnits, 0);
  const totalValue = constructorProjects.reduce((sum, p) => sum + (p.pricing.startingPrice * p.totalUnits), 0);
  
  // Sales Chart Data
  const salesChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Vendas',
        data: [12, 18, 25, 32, 28, 35],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const salesChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Unidades Vendidas'
        }
      }
    },
  };

  // Projects Status Chart Data
  const projectsStatusData = {
    labels: ['Lançamento', 'Em Construção', 'Concluídos'],
    datasets: [
      {
        data: [
          constructorProjects.filter(p => p.status === 'preLaunch').length,
          constructorProjects.filter(p => p.status === 'underConstruction').length,
          constructorProjects.filter(p => p.status === 'completed').length
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
          'rgb(34, 197, 94)'
        ],
        borderWidth: 1
      }
    ]
  };

  const projectsStatusOptions = {
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
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preLaunch': return 'bg-blue-100 text-blue-800';
      case 'underConstruction': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'preLaunch': return 'Lançamento';
      case 'underConstruction': return 'Em Construção';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Bem-vindo de volta! Aqui está um resumo dos seus empreendimentos.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/developer/projects/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Novo Empreendimento</span>
            </Link>
            <select className="px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
              <option value="month">Este Mês</option>
              <option value="quarter">Este Trimestre</option>
              <option value="year">Este Ano</option>
            </select>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-blue-600" />
                <h3 className="font-medium">Empreendimentos</h3>
              </div>
              <Link to="/developer/projects" className="text-blue-600 hover:text-blue-800">
                <Eye className="w-5 h-5" />
              </Link>
            </div>
            <p className="text-3xl font-bold">{totalProjects}</p>
            <p className="text-sm text-gray-500 mt-2">{activeProjects} em construção</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Home className="w-6 h-6 text-green-600" />
                <h3 className="font-medium">Total de Unidades</h3>
              </div>
              <span className="flex items-center gap-1 text-green-600">
                <ArrowUp className="w-4 h-4" />
                <span>15%</span>
              </span>
            </div>
            <p className="text-3xl font-bold">{totalUnits}</p>
            <p className="text-sm text-gray-500 mt-2">Distribuídas em {totalProjects} projetos</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-green-600" />
                <h3 className="font-medium">Valor Total</h3>
              </div>
              <span className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>22%</span>
              </span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(totalValue)}</p>
            <p className="text-sm text-gray-500 mt-2">Valor total dos empreendimentos</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-purple-600" />
                <h3 className="font-medium">Vendas Este Mês</h3>
              </div>
              <span className="flex items-center gap-1 text-green-600">
                <ArrowUp className="w-4 h-4" />
                <span>18%</span>
              </span>
            </div>
            <p className="text-3xl font-bold">35</p>
            <p className="text-sm text-gray-500 mt-2">+5 em relação ao mês anterior</p>
          </div>
        </div>

        {/* Projects Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Projects */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Seus Empreendimentos</h3>
              <Link to="/developer/projects" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Ver todos
              </Link>
            </div>
            <div className="space-y-4">
              {constructorProjects.slice(0, 4).map(project => (
                <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{project.totalUnits} unidades</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/developer/projects/${project.id}`} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link to={`/developer/projects/${project.id}/edit`} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Types Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-6">Status dos Empreendimentos</h3>
            <div className="h-80">
              <Doughnut data={projectsStatusData} options={projectsStatusOptions} />
            </div>
          </div>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Evolution */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-6">Evolução de Vendas (Unidades)</h3>
            <div className="h-80">
              <Line data={salesChartData} options={salesChartOptions} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-6">Ações Rápidas</h3>
            <div className="grid grid-cols-1 gap-4">
              <Link
                to="/developer/projects/new"
                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Novo Apartamento</h4>
                  <p className="text-sm text-gray-500">Cadastrar empreendimento residencial</p>
                </div>
              </Link>
              
              <Link
                to="/developer/projects/houses"
                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Nova Casa</h4>
                  <p className="text-sm text-gray-500">Cadastrar casa ou condomínio</p>
                </div>
              </Link>
              
              <Link
                to="/developer/projects/rooms"
                className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Novo Empresarial</h4>
                  <p className="text-sm text-gray-500">Cadastrar empreendimento comercial</p>
                </div>
              </Link>
              
              <Link
                to="/developer/projects/lots"
                className="flex items-center gap-3 p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Novo Loteamento</h4>
                  <p className="text-sm text-gray-500">Cadastrar loteamento ou terreno</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Activity and Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-6">Atividade Recente</h3>
            <div className="space-y-4">
              {[
                { 
                  icon: Building2,
                  title: 'Novo empreendimento criado',
                  description: 'Edifício Lumina foi adicionado ao portfólio',
                  time: '2 horas atrás',
                  status: 'success'
                },
                {
                  icon: DollarSign,
                  title: '5 unidades vendidas',
                  description: 'Palazzo Verona - Jardim Europa',
                  time: '4 horas atrás',
                  status: 'success'
                },
                {
                  icon: CheckCircle,
                  title: 'Documentação aprovada',
                  description: 'Infinity Tower - Brooklin',
                  time: '1 dia atrás',
                  status: 'success'
                },
                {
                  icon: Calendar,
                  title: 'Entrega programada',
                  description: 'Parque das Flores - Dezembro 2024',
                  time: '2 dias atrás',
                  status: 'info'
                }
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${
                    activity.status === 'success' ? 'bg-green-100 text-green-600' :
                    activity.status === 'info' ? 'bg-blue-100 text-blue-600' :
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
                  icon: Building2,
                  title: 'Lançamento Edifício Lumina',
                  date: '28/03/2024',
                  type: 'launch'
                },
                {
                  icon: CheckCircle,
                  title: 'Entrega de Chaves - Parque das Flores',
                  date: '15/04/2024',
                  type: 'delivery'
                },
                {
                  icon: Calendar,
                  title: 'Reunião com Corretores Parceiros',
                  date: '02/04/2024',
                  type: 'meeting'
                },
                {
                  icon: FileText,
                  title: 'Relatório Mensal de Vendas',
                  date: '05/04/2024',
                  type: 'report'
                }
              ].map((event, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${
                    event.type === 'launch' ? 'bg-purple-100 text-purple-600' :
                    event.type === 'delivery' ? 'bg-green-100 text-green-600' :
                    event.type === 'meeting' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <event.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    Detalhes
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-6">Resumo de Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-sm text-gray-600">Taxa de Vendas</div>
              <div className="text-xs text-gray-500 mt-1">Média dos últimos 6 meses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">45</div>
              <div className="text-sm text-gray-600">Dias para Venda</div>
              <div className="text-xs text-gray-500 mt-1">Tempo médio no mercado</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">R$ 1.2M</div>
              <div className="text-sm text-gray-600">Preço Médio</div>
              <div className="text-xs text-gray-500 mt-1">Por unidade vendida</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}