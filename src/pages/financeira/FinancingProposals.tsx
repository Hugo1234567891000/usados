import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, XCircle, MessageSquare, DollarSign, Building2, User, Calendar, ArrowRight, Filter, Search, Eye, Download } from 'lucide-react';

interface FinancingProposal {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  propertyName: string;
  propertyUnit: string;
  propertyValue: number;
  financingAmount: number;
  downPayment: number;
  term: number;
  interestRate: number;
  monthlyPayment: number;
  status: 'pending' | 'approved' | 'rejected' | 'countered';
  createdAt: string;
  updatedAt: string;
  brokerName?: string;
  constructorName: string;
}

export default function FinancingProposals() {
  const [filter, setFilter] = useState({
    status: 'all',
    search: '',
    dateRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<FinancingProposal | null>(null);

  // Example proposals data
  const proposals: FinancingProposal[] = [
    {
      id: '1',
      clientName: 'João Silva',
      clientEmail: 'joao.silva@email.com',
      clientPhone: '(11) 99999-9999',
      propertyName: 'Edifício Horizonte - Moema',
      propertyUnit: '101',
      propertyValue: 750000,
      financingAmount: 600000,
      downPayment: 150000,
      term: 30,
      interestRate: 7.5,
      monthlyPayment: 4200.75,
      status: 'pending',
      createdAt: '2024-03-20T14:30:00',
      updatedAt: '2024-03-20T14:30:00',
      brokerName: 'Ana Santos',
      constructorName: 'VHGold Construtora'
    },
    {
      id: '2',
      clientName: 'Maria Santos',
      clientEmail: 'maria.santos@email.com',
      clientPhone: '(11) 98888-8888',
      propertyName: 'Residencial Jardins - Pinheiros',
      propertyUnit: '203',
      propertyValue: 950000,
      financingAmount: 665000,
      downPayment: 285000,
      term: 25,
      interestRate: 7.2,
      monthlyPayment: 4850.32,
      status: 'approved',
      createdAt: '2024-03-15T10:15:00',
      updatedAt: '2024-03-18T09:30:00',
      constructorName: 'VHGold Construtora'
    },
    {
      id: '3',
      clientName: 'Pedro Almeida',
      clientEmail: 'pedro.almeida@email.com',
      clientPhone: '(11) 97777-7777',
      propertyName: 'Vila Verde - Alto de Pinheiros',
      propertyUnit: '301',
      propertyValue: 1200000,
      financingAmount: 840000,
      downPayment: 360000,
      term: 20,
      interestRate: 7.8,
      monthlyPayment: 6850.32,
      status: 'rejected',
      createdAt: '2024-03-10T16:45:00',
      updatedAt: '2024-03-12T11:20:00',
      brokerName: 'Carlos Oliveira',
      constructorName: 'Construtora Horizonte'
    }
  ];

  // Filter proposals based on filters
  const filteredProposals = proposals.filter(proposal => {
    const matchesStatus = filter.status === 'all' || proposal.status === filter.status;
    const matchesSearch = filter.search === '' || 
      proposal.clientName.toLowerCase().includes(filter.search.toLowerCase()) ||
      proposal.propertyName.toLowerCase().includes(filter.search.toLowerCase()) ||
      proposal.propertyUnit.toLowerCase().includes(filter.search.toLowerCase());
    
    // Date range filtering
    const proposalDate = new Date(proposal.createdAt);
    const now = new Date();
    let matchesDateRange = true;
    
    if (filter.dateRange === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      matchesDateRange = proposalDate >= today && proposalDate < tomorrow;
    } else if (filter.dateRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      matchesDateRange = proposalDate >= weekAgo;
    } else if (filter.dateRange === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      matchesDateRange = proposalDate >= monthAgo;
    }
    
    return matchesStatus && matchesSearch && (filter.dateRange === 'all' || matchesDateRange);
  });

  const getStatusColor = (status: FinancingProposal['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'countered':
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: FinancingProposal['status']) => {
    switch (status) {
      case 'approved':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'rejected':
        return XCircle;
      case 'countered':
        return MessageSquare;
    }
  };

  const getStatusText = (status: FinancingProposal['status']) => {
    switch (status) {
      case 'approved':
        return 'Aprovada';
      case 'pending':
        return 'Pendente';
      case 'rejected':
        return 'Rejeitada';
      case 'countered':
        return 'Contraproposta';
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleViewProposal = (proposal: FinancingProposal) => {
    setSelectedProposal(proposal);
    setShowProposalModal(true);
  };

  const handleApproveProposal = () => {
    if (!selectedProposal) return;
    
    // In a real app, you would update the proposal status in the database
    console.log('Approving proposal:', selectedProposal.id);
    
    setShowProposalModal(false);
  };

  const handleRejectProposal = () => {
    if (!selectedProposal) return;
    
    // In a real app, you would update the proposal status in the database
    console.log('Rejecting proposal:', selectedProposal.id);
    
    setShowProposalModal(false);
  };

  const handleCounterProposal = () => {
    if (!selectedProposal) return;
    
    // In a real app, you would update the proposal status in the database
    console.log('Counter proposal:', selectedProposal.id);
    
    setShowProposalModal(false);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Propostas de Financiamento</h1>
            <p className="text-gray-600">Gerencie as propostas de financiamento recebidas</p>
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
              <h3 className="font-medium">Total de Propostas</h3>
            </div>
            <p className="text-3xl font-bold">{proposals.length}</p>
            <p className="text-sm text-gray-500 mt-2">
              {proposals.filter(p => new Date(p.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length} este mês
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-yellow-600" />
              <h3 className="font-medium">Pendentes</h3>
            </div>
            <p className="text-3xl font-bold">{proposals.filter(p => p.status === 'pending').length}</p>
            <p className="text-sm text-gray-500 mt-2">Aguardando análise</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="font-medium">Aprovadas</h3>
            </div>
            <p className="text-3xl font-bold">{proposals.filter(p => p.status === 'approved').length}</p>
            <p className="text-sm text-gray-500 mt-2">
              {proposals.filter(p => p.status === 'approved').length > 0 
                ? `${Math.round((proposals.filter(p => p.status === 'approved').length / proposals.length) * 100)}% de aprovação` 
                : 'Nenhuma aprovada'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h3 className="font-medium">Valor Total</h3>
            </div>
            <p className="text-3xl font-bold">
              {formatCurrency(proposals.reduce((sum, p) => sum + p.financingAmount, 0))}
            </p>
            <p className="text-sm text-gray-500 mt-2">Em propostas</p>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <option value="pending">Pendentes</option>
                  <option value="approved">Aprovadas</option>
                  <option value="countered">Contrapropostas</option>
                  <option value="rejected">Rejeitadas</option>
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
                    placeholder="Buscar por cliente, imóvel ou unidade..."
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Proposals List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente/Imóvel
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
              {filteredProposals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nenhuma proposta encontrada
                  </td>
                </tr>
              ) : (
                filteredProposals.map((proposal) => {
                  const StatusIcon = getStatusIcon(proposal.status);
                  return (
                    <tr key={proposal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            <User className="w-6 h-6 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{proposal.clientName}</p>
                            <p className="text-sm text-gray-500">
                              {proposal.propertyName} · Unidade {proposal.propertyUnit}
                            </p>
                            {proposal.brokerName && (
                              <p className="text-sm text-gray-500">
                                Corretor: {proposal.brokerName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">
                            {formatCurrency(proposal.financingAmount)}
                          </p>
                          <p className="text-gray-500">
                            Entrada: {formatCurrency(proposal.downPayment)} ({Math.round((proposal.downPayment / proposal.propertyValue) * 100)}%)
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <p className="text-gray-900">
                            {proposal.term} anos · {proposal.interestRate}% a.a.
                          </p>
                          <p className="text-gray-500">
                            Parcela: {formatCurrency(proposal.monthlyPayment)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getStatusColor(proposal.status)
                        }`}>
                          <StatusIcon className="w-4 h-4" />
                          {getStatusText(proposal.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleViewProposal(proposal)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Visualizar"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleViewProposal(proposal)}
                            className="p-1 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Detalhes"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Proposal Details Modal */}
        {showProposalModal && selectedProposal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Detalhes da Proposta</h3>
                <button
                  onClick={() => setShowProposalModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Client and Property Details */}
                <div>
                  <h4 className="text-md font-semibold mb-4">Informações do Cliente</h4>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Nome</p>
                          <p className="font-medium">{selectedProposal.clientName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">E-mail</p>
                          <p className="font-medium">{selectedProposal.clientEmail}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Telefone</p>
                          <p className="font-medium">{selectedProposal.clientPhone}</p>
                        </div>
                        {selectedProposal.brokerName && (
                          <div>
                            <p className="text-sm text-gray-600">Corretor</p>
                            <p className="font-medium">{selectedProposal.brokerName}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Imóvel</h5>
                      <p className="text-sm">{selectedProposal.propertyName}</p>
                      <p className="text-sm">Unidade {selectedProposal.propertyUnit}</p>
                      <p className="text-sm">Construtora: {selectedProposal.constructorName}</p>
                      <p className="text-sm font-medium mt-2">Valor: {formatCurrency(selectedProposal.propertyValue)}</p>
                    </div>
                  </div>
                </div>

                {/* Financing Details */}
                <div>
                  <h4 className="text-md font-semibold mb-4">Detalhes do Financiamento</h4>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Valor Financiado</p>
                          <p className="font-medium">{formatCurrency(selectedProposal.financingAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Entrada</p>
                          <p className="font-medium">{formatCurrency(selectedProposal.downPayment)} ({Math.round((selectedProposal.downPayment / selectedProposal.propertyValue) * 100)}%)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Taxa de Juros</p>
                          <p className="font-medium">{selectedProposal.interestRate}% a.a.</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Prazo</p>
                          <p className="font-medium">{selectedProposal.term} anos</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Parcela Mensal</p>
                          <p className="font-medium">{formatCurrency(selectedProposal.monthlyPayment)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            getStatusColor(selectedProposal.status)
                          }`}>
                            <StatusIcon className="w-4 h-4" />
                            {getStatusText(selectedProposal.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Datas</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Criada em</p>
                          <p className="font-medium">{new Date(selectedProposal.createdAt).toLocaleDateString('pt-BR', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Atualizada em</p>
                          <p className="font-medium">{new Date(selectedProposal.updatedAt).toLocaleDateString('pt-BR', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
                {selectedProposal.status === 'pending' && (
                  <>
                    <button
                      onClick={handleRejectProposal}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Rejeitar
                    </button>
                    <button
                      onClick={handleCounterProposal}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Contraproposta
                    </button>
                    <button
                      onClick={handleApproveProposal}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Aprovar
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowProposalModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
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