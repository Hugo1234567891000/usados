import React, { useState } from 'react';
import { DollarSign, Calendar, Clock, CheckCircle, XCircle, Filter, Search, Download, ArrowUpRight, Percent, CreditCard, Building2, User, Home, FileText } from 'lucide-react';

interface FinancingSimulation {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  propertyType: 'apartment' | 'house' | 'commercial' | 'land';
  propertyValue: number;
  financingAmount: number;
  downPayment: number;
  term: number;
  interestRate: number;
  monthlyPayment: number;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  createdAt: string;
  updatedAt: string;
  location?: string;
  notes?: string;
}

export default function FinancingSimulations() {
  const [filter, setFilter] = useState({
    status: 'all',
    propertyType: 'all',
    search: '',
    dateRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showSimulationModal, setShowSimulationModal] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<FinancingSimulation | null>(null);

  // Example simulations data
  const simulations: FinancingSimulation[] = [
    {
      id: '1',
      clientName: 'João Silva',
      clientEmail: 'joao.silva@email.com',
      clientPhone: '(11) 99999-9999',
      propertyType: 'apartment',
      propertyValue: 750000,
      financingAmount: 600000,
      downPayment: 150000,
      term: 30,
      interestRate: 7.5,
      monthlyPayment: 4200.75,
      status: 'new',
      createdAt: '2024-03-20T14:30:00',
      updatedAt: '2024-03-20T14:30:00',
      location: 'São Paulo, SP',
      notes: 'Cliente interessado em apartamento na planta'
    },
    {
      id: '2',
      clientName: 'Maria Santos',
      clientEmail: 'maria.santos@email.com',
      propertyType: 'house',
      propertyValue: 950000,
      financingAmount: 665000,
      downPayment: 285000,
      term: 25,
      interestRate: 7.2,
      monthlyPayment: 4850.32,
      status: 'contacted',
      createdAt: '2024-03-15T10:15:00',
      updatedAt: '2024-03-18T09:30:00',
      location: 'São Paulo, SP'
    },
    {
      id: '3',
      clientName: 'Pedro Almeida',
      clientEmail: 'pedro.almeida@email.com',
      propertyType: 'commercial',
      propertyValue: 1200000,
      financingAmount: 840000,
      downPayment: 360000,
      term: 20,
      interestRate: 7.8,
      monthlyPayment: 6850.32,
      status: 'converted',
      createdAt: '2024-03-10T16:45:00',
      updatedAt: '2024-03-12T11:20:00'
    },
    {
      id: '4',
      clientName: 'Ana Pereira',
      clientEmail: 'ana.pereira@email.com',
      propertyType: 'land',
      propertyValue: 500000,
      financingAmount: 300000,
      downPayment: 200000,
      term: 15,
      interestRate: 9.5,
      monthlyPayment: 3150.45,
      status: 'lost',
      createdAt: '2024-03-05T09:20:00',
      updatedAt: '2024-03-08T14:15:00',
      notes: 'Cliente optou por outra instituição financeira'
    }
  ];

  // Filter simulations based on filters
  const filteredSimulations = simulations.filter(simulation => {
    const matchesStatus = filter.status === 'all' || simulation.status === filter.status;
    const matchesPropertyType = filter.propertyType === 'all' || simulation.propertyType === filter.propertyType;
    const matchesSearch = filter.search === '' || 
      simulation.clientName.toLowerCase().includes(filter.search.toLowerCase()) ||
      simulation.clientEmail.toLowerCase().includes(filter.search.toLowerCase()) ||
      (simulation.location && simulation.location.toLowerCase().includes(filter.search.toLowerCase()));
    
    // Date range filtering
    const simulationDate = new Date(simulation.createdAt);
    const now = new Date();
    let matchesDateRange = true;
    
    if (filter.dateRange === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      matchesDateRange = simulationDate >= today && simulationDate < tomorrow;
    } else if (filter.dateRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      matchesDateRange = simulationDate >= weekAgo;
    } else if (filter.dateRange === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      matchesDateRange = simulationDate >= monthAgo;
    }
    
    return matchesStatus && matchesPropertyType && matchesSearch && (filter.dateRange === 'all' || matchesDateRange);
  });

  const getStatusColor = (status: FinancingSimulation['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'converted':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusIcon = (status: FinancingSimulation['status']) => {
    switch (status) {
      case 'new':
        return FileText;
      case 'contacted':
        return Clock;
      case 'converted':
        return CheckCircle;
      case 'lost':
        return XCircle;
    }
  };

  const getStatusText = (status: FinancingSimulation['status']) => {
    switch (status) {
      case 'new':
        return 'Nova';
      case 'contacted':
        return 'Contatado';
      case 'converted':
        return 'Convertida';
      case 'lost':
        return 'Perdida';
    }
  };

  const getPropertyTypeIcon = (type: FinancingSimulation['propertyType']) => {
    switch (type) {
      case 'apartment':
        return Building2;
      case 'house':
        return Home;
      case 'commercial':
        return Building2;
      case 'land':
        return MapPin;
    }
  };

  const getPropertyTypeText = (type: FinancingSimulation['propertyType']) => {
    switch (type) {
      case 'apartment':
        return 'Apartamento';
      case 'house':
        return 'Casa';
      case 'commercial':
        return 'Comercial';
      case 'land':
        return 'Terreno';
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleViewSimulation = (simulation: FinancingSimulation) => {
    setSelectedSimulation(simulation);
    setShowSimulationModal(true);
  };

  const handleUpdateStatus = (status: FinancingSimulation['status']) => {
    if (!selectedSimulation) return;
    
    // In a real app, you would update the simulation status in the database
    console.log('Updating simulation status:', selectedSimulation.id, status);
    
    setShowSimulationModal(false);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Simulações de Financiamento</h1>
            <p className="text-gray-600">Gerencie as simulações realizadas pelos clientes</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filtros</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-5 h-5" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h3 className="font-medium">Total de Simulações</h3>
            </div>
            <p className="text-3xl font-bold">{simulations.length}</p>
            <p className="text-sm text-gray-500 mt-2">
              {simulations.filter(s => new Date(s.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length} este mês
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="font-medium">Taxa de Conversão</h3>
            </div>
            <p className="text-3xl font-bold">
              {Math.round((simulations.filter(s => s.status === 'converted').length / simulations.length) * 100)}%
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {simulations.filter(s => s.status === 'converted').length} convertidas
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h3 className="font-medium">Valor Médio</h3>
            </div>
            <p className="text-3xl font-bold">
              {formatCurrency(simulations.reduce((sum, s) => sum + s.financingAmount, 0) / simulations.length)}
            </p>
            <p className="text-sm text-gray-500 mt-2">Por simulação</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-yellow-600" />
              <h3 className="font-medium">Novas Simulações</h3>
            </div>
            <p className="text-3xl font-bold">{simulations.filter(s => s.status === 'new').length}</p>
            <p className="text-sm text-gray-500 mt-2">Aguardando contato</p>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filter.status}
                  onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="all">Todos os Status</option>
                  <option value="new">Novas</option>
                  <option value="contacted">Contatadas</option>
                  <option value="converted">Convertidas</option>
                  <option value="lost">Perdidas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Imóvel
                </label>
                <select
                  value={filter.propertyType}
                  onChange={(e) => setFilter(prev => ({ ...prev, propertyType: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="apartment">Apartamento</option>
                  <option value="house">Casa</option>
                  <option value="commercial">Comercial</option>
                  <option value="land">Terreno</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Período
                </label>
                <select
                  value={filter.dateRange}
                  onChange={(e) => setFilter(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="all">Todas as Datas</option>
                  <option value="today">Hoje</option>
                  <option value="week">Esta Semana</option>
                  <option value="month">Este Mês</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={filter.search}
                    onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                    placeholder="Buscar por cliente ou localização..."
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Simulations List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente/Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condições
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
              {filteredSimulations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nenhuma simulação encontrada
                  </td>
                </tr>
              ) : (
                filteredSimulations.map((simulation) => {
                  const StatusIcon = getStatusIcon(simulation.status);
                  const PropertyTypeIcon = getPropertyTypeIcon(simulation.propertyType);
                  return (
                    <tr key={simulation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            <User className="w-6 h-6 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{simulation.clientName}</p>
                            <p className="text-sm text-gray-500">{simulation.clientEmail}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <PropertyTypeIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-500">{getPropertyTypeText(simulation.propertyType)}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">
                            {formatCurrency(simulation.financingAmount)}
                          </p>
                          <p className="text-gray-500">
                            Entrada: {formatCurrency(simulation.downPayment)} ({Math.round((simulation.downPayment / simulation.propertyValue) * 100)}%)
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <p className="text-gray-900">
                            {simulation.term} anos · {simulation.interestRate}% a.a.
                          </p>
                          <p className="text-gray-500">
                            Parcela: {formatCurrency(simulation.monthlyPayment)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getStatusColor(simulation.status)
                        }`}>
                          <StatusIcon className="w-4 h-4" />
                          {getStatusText(simulation.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(simulation.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleViewSimulation(simulation)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <ArrowUpRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Simulation Details Modal */}
        {showSimulationModal && selectedSimulation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Detalhes da Simulação</h3>
                <button
                  onClick={() => setShowSimulationModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Informações do Cliente</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><span className="font-medium">Nome:</span> {selectedSimulation.clientName}</p>
                      <p><span className="font-medium">E-mail:</span> {selectedSimulation.clientEmail}</p>
                      {selectedSimulation.clientPhone && (
                        <p><span className="font-medium">Telefone:</span> {selectedSimulation.clientPhone}</p>
                      )}
                      {selectedSimulation.location && (
                        <p><span className="font-medium">Localização:</span> {selectedSimulation.location}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Informações do Imóvel</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><span className="font-medium">Tipo:</span> {getPropertyTypeText(selectedSimulation.propertyType)}</p>
                      <p><span className="font-medium">Valor:</span> {formatCurrency(selectedSimulation.propertyValue)}</p>
                      <p><span className="font-medium">Entrada:</span> {formatCurrency(selectedSimulation.downPayment)} ({Math.round((selectedSimulation.downPayment / selectedSimulation.propertyValue) * 100)}%)</p>
                      <p><span className="font-medium">Valor Financiado:</span> {formatCurrency(selectedSimulation.financingAmount)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Condições de Financiamento</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p><span className="font-medium">Taxa de Juros:</span> {selectedSimulation.interestRate}% a.a.</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Prazo:</span> {selectedSimulation.term} anos</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Parcela Mensal:</span> {formatCurrency(selectedSimulation.monthlyPayment)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedSimulation.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Observações</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p>{selectedSimulation.notes}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleUpdateStatus('new')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedSimulation.status === 'new'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Nova
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('contacted')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedSimulation.status === 'contacted'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Contatado
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('converted')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedSimulation.status === 'converted'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Convertida
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('lost')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedSimulation.status === 'lost'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Perdida
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowSimulationModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Entrar em Contato
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// MapPin component for land icon
function MapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

// X component for modal close button
function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}