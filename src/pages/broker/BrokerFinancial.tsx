import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Clock, CheckCircle, XCircle, Filter, Search, Download, ArrowUpRight, FileText, Receipt, AlertTriangle, Eye, Percent, BarChart2, CreditCard, Building2, ChevronDown, ChevronUp, Wallet, PieChart, TrendingUp, FileCheck, Upload, Plus, ExternalLink, HelpCircle, FileUp, Check, Edit, Save, Trash2, Bell } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import sales from '../../data/sales';
import constructors from '../../data/constructors';
import invoices from '../../data/invoices';
import pendingInvoices from '../../data/pendingInvoices';
import { PendingInvoice } from '../../data/pendingInvoices';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function BrokerFinancial() {
  const [activeTab, setActiveTab] = useState<'overview' | 'commissions' | 'rates' | 'invoices' | 'pending-invoices'>('overview');
  const [filter, setFilter] = useState({
    status: 'all',
    project: 'all',
    constructor: 'all',
    dateRange: 'month',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any | null>(null);
  const [showSaleDetails, setShowSaleDetails] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [showInvoiceUpload, setShowInvoiceUpload] = useState(false);
  const [showInvoiceGuide, setShowInvoiceGuide] = useState(false);
  const [salesList, setSalesList] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [invoiceValue, setInvoiceValue] = useState('');
  const [invoiceDescription, setInvoiceDescription] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedPendingInvoice, setSelectedPendingInvoice] = useState<PendingInvoice | null>(null);
  const [showPendingInvoiceDetails, setShowPendingInvoiceDetails] = useState(false);
  const [showInvoiceEditor, setShowInvoiceEditor] = useState(false);
  const [editedInvoice, setEditedInvoice] = useState<PendingInvoice | null>(null);
  const [showInvoiceSuccess, setShowInvoiceSuccess] = useState(false);

  // In a real app, this would come from an authentication context
  const currentBrokerId = 'broker-1';

  // Load sales data filtered by broker ID
  useEffect(() => {
    const filteredSales = sales.filter(sale => 
      sale.brokerId === currentBrokerId
    );
    setSalesList(filteredSales);
  }, [currentBrokerId]);

  // Filter sales based on filters
  const filteredSales = salesList.filter(sale => {
    const matchesStatus = filter.status === 'all' || sale.brokerCommissionStatus === filter.status;
    const matchesProject = filter.project === 'all' || sale.projectId === filter.project;
    const matchesConstructor = filter.constructor === 'all' || sale.constructorId === filter.constructor;
    const matchesSearch = filter.search === '' || 
      sale.projectName.toLowerCase().includes(filter.search.toLowerCase()) ||
      sale.clientName.toLowerCase().includes(filter.search.toLowerCase()) ||
      sale.unitNumber.toLowerCase().includes(filter.search.toLowerCase());
    
    // Date range filtering
    const saleDate = new Date(sale.saleDate);
    const now = new Date();
    let matchesDateRange = true;
    
    if (filter.dateRange === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      matchesDateRange = saleDate >= monthAgo;
    } else if (filter.dateRange === 'quarter') {
      const quarterAgo = new Date();
      quarterAgo.setMonth(now.getMonth() - 3);
      matchesDateRange = saleDate >= quarterAgo;
    } else if (filter.dateRange === 'year') {
      const yearAgo = new Date();
      yearAgo.setFullYear(now.getFullYear() - 1);
      matchesDateRange = saleDate >= yearAgo;
    }
    
    return matchesStatus && matchesProject && matchesConstructor && matchesSearch && matchesDateRange;
  });

  // Filter pending invoices based on filters
  const filteredPendingInvoices = pendingInvoices.filter(invoice => {
    const matchesConstructor = filter.constructor === 'all' || invoice.constructorId === filter.constructor;
    const matchesSearch = filter.search === '' || 
      invoice.projectName.toLowerCase().includes(filter.search.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(filter.search.toLowerCase()) ||
      invoice.unitNumber.toLowerCase().includes(filter.search.toLowerCase()) ||
      invoice.constructorName.toLowerCase().includes(filter.search.toLowerCase());
    
    // Date range filtering
    const saleDate = new Date(invoice.saleDate);
    const now = new Date();
    let matchesDateRange = true;
    
    if (filter.dateRange === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      matchesDateRange = saleDate >= monthAgo;
    } else if (filter.dateRange === 'quarter') {
      const quarterAgo = new Date();
      quarterAgo.setMonth(now.getMonth() - 3);
      matchesDateRange = saleDate >= quarterAgo;
    } else if (filter.dateRange === 'year') {
      const yearAgo = new Date();
      yearAgo.setFullYear(now.getFullYear() - 1);
      matchesDateRange = saleDate >= yearAgo;
    }
    
    return matchesConstructor && matchesSearch && matchesDateRange;
  });

  // Calculate summary data
  const summary = {
    totalCommissions: filteredSales.reduce((sum, s) => sum + s.brokerCommission, 0),
    paidCommissions: filteredSales.filter(s => s.brokerCommissionStatus === 'paid').reduce((sum, s) => sum + s.brokerCommission, 0),
    pendingCommissions: filteredSales.filter(s => s.brokerCommissionStatus !== 'paid').reduce((sum, s) => sum + s.brokerCommission, 0),
    totalSales: filteredSales.reduce((sum, s) => sum + s.value, 0),
    totalSalesCount: filteredSales.length,
    pendingInvoices: filteredSales.filter(s => s.brokerInvoiceStatus === 'pending').length,
    averageCommissionRate: filteredSales.length > 0 
      ? filteredSales.reduce((sum, s) => sum + s.brokerCommissionRate, 0) / filteredSales.length 
      : 0,
    pendingInvoicesValue: pendingInvoices.reduce((sum, invoice) => sum + invoice.commissionValue, 0),
    pendingInvoicesCount: pendingInvoices.length,
    overdueInvoicesCount: pendingInvoices.filter(invoice => invoice.status === 'overdue').length
  };

  // Get unique projects for filter
  const projects = Array.from(new Set(salesList
    .map(s => s.projectId)))
    .map(id => {
      const sale = salesList.find(s => s.projectId === id);
      return {
        id,
        name: sale?.projectName || ''
      };
    });

  // Get unique constructors for filter
  const constructorsList = Array.from(new Set(salesList
    .map(s => s.constructorId)))
    .map(id => {
      const constructor = constructors.find(c => c.id === id);
      return {
        id,
        name: constructor?.name || sales.find(s => s.constructorId === id)?.projectName || ''
      };
    });

  // Prepare chart data
  const prepareMonthlyData = () => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentMonth = new Date().getMonth();
    
    // Get last 6 months
    const labels = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - i + 12) % 12;
      return months[monthIndex];
    }).reverse();

    // Calculate paid and pending commissions per month
    const paidData = Array(6).fill(0);
    const pendingData = Array(6).fill(0);
    const now = new Date();
    
    filteredSales.forEach(sale => {
      const saleDate = new Date(sale.saleDate);
      
      const monthDiff = (now.getMonth() - saleDate.getMonth() + 12) % 12;
      const yearDiff = now.getFullYear() - saleDate.getFullYear();
      
      // Only consider last 6 months
      if (yearDiff === 0 && monthDiff < 6) {
        if (sale.brokerCommissionStatus === 'paid') {
          paidData[5 - monthDiff] += sale.brokerCommission;
        } else {
          pendingData[5 - monthDiff] += sale.brokerCommission;
        }
      } else if (yearDiff === 1 && monthDiff + 12 < 6) {
        if (sale.brokerCommissionStatus === 'paid') {
          paidData[5 - (monthDiff + 12)] += sale.brokerCommission;
        } else {
          pendingData[5 - (monthDiff + 12)] += sale.brokerCommission;
        }
      }
    });

    return {
      labels,
      datasets: [
        {
          label: 'Comissões Pagas',
          data: paidData,
          borderColor: 'rgb(34, 197, 94)', // green
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Comissões Pendentes',
          data: pendingData,
          borderColor: 'rgb(234, 179, 8)', // yellow
          backgroundColor: 'rgba(234, 179, 8, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  // Prepare constructor data
  const prepareConstructorData = () => {
    // Group commissions by constructor
    const constructorCommissions = Array.from(
      new Set(filteredSales.map(s => s.constructorId))
    ).map(constructorId => {
      const constructorSales = filteredSales.filter(s => s.constructorId === constructorId);
      const constructorName = constructorSales[0]?.projectName || 'Unknown';
      const total = constructorSales.reduce((sum, s) => sum + s.brokerCommission, 0);
      
      return {
        constructor: constructorName,
        total
      };
    }).sort((a, b) => b.total - a.total);

    return {
      labels: constructorCommissions.map(item => item.constructor),
      datasets: [
        {
          label: 'Comissões por Construtora',
          data: constructorCommissions.map(item => item.total),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)', // blue
            'rgba(16, 185, 129, 0.8)', // green
            'rgba(249, 115, 22, 0.8)', // orange
            'rgba(139, 92, 246, 0.8)', // purple
            'rgba(107, 114, 128, 0.8)'  // gray
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(249, 115, 22)',
            'rgb(139, 92, 246)',
            'rgb(107, 114, 128)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  // Prepare status distribution data
  const prepareStatusData = () => {
    const pending = filteredSales.filter(s => s.brokerCommissionStatus === 'pending').length;
    const approved = filteredSales.filter(s => s.brokerCommissionStatus === 'approved').length;
    const paid = filteredSales.filter(s => s.brokerCommissionStatus === 'paid').length;
    
    return {
      labels: ['Pendentes', 'Aprovadas', 'Pagas'],
      datasets: [
        {
          data: [pending, approved, paid],
          backgroundColor: [
            'rgba(234, 179, 8, 0.8)',  // yellow
            'rgba(59, 130, 246, 0.8)',  // blue
            'rgba(34, 197, 94, 0.8)'   // green
          ],
          borderColor: [
            'rgb(234, 179, 8)',
            'rgb(59, 130, 246)',
            'rgb(34, 197, 94)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  // Prepare project performance data
  const prepareProjectPerformanceData = () => {
    // Group sales by project
    const projectPerformance = Array.from(
      new Set(filteredSales.map(s => s.projectId))
    ).map(projectId => {
      const projectSales = filteredSales.filter(s => s.projectId === projectId);
      const projectName = projectSales[0]?.projectName || 'Unknown';
      const totalSales = projectSales.length;
      const totalValue = projectSales.reduce((sum, s) => sum + s.value, 0);
      const totalCommission = projectSales.reduce((sum, s) => sum + s.brokerCommission, 0);
      const avgCommissionRate = totalCommission / totalValue * 100;
      
      return {
        project: projectName,
        sales: totalSales,
        value: totalValue,
        commission: totalCommission,
        rate: avgCommissionRate
      };
    }).sort((a, b) => b.commission - a.commission);

    return {
      labels: projectPerformance.map(item => item.project),
      datasets: [
        {
          label: 'Valor Total de Vendas (R$)',
          data: projectPerformance.map(item => item.value),
          backgroundColor: 'rgba(59, 130, 246, 0.8)', // blue
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'Comissão Total (R$)',
          data: projectPerformance.map(item => item.commission),
          backgroundColor: 'rgba(16, 185, 129, 0.8)', // green
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'Número de Vendas',
          data: projectPerformance.map(item => item.sales),
          backgroundColor: 'rgba(249, 115, 22, 0.8)', // orange
          borderColor: 'rgb(249, 115, 22)',
          borderWidth: 1,
          yAxisID: 'y1',
          type: 'line'
        }
      ]
    };
  };

  // Prepare pending invoices data
  const preparePendingInvoicesData = () => {
    const pending = pendingInvoices.filter(invoice => invoice.status === 'pending').length;
    const overdue = pendingInvoices.filter(invoice => invoice.status === 'overdue').length;
    const draft = pendingInvoices.filter(invoice => invoice.status === 'draft').length;
    
    return {
      labels: ['Pendentes', 'Atrasadas', 'Rascunhos'],
      datasets: [
        {
          data: [pending, overdue, draft],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',  // blue
            'rgba(239, 68, 68, 0.8)',   // red
            'rgba(107, 114, 128, 0.8)'  // gray
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(239, 68, 68)',
            'rgb(107, 114, 128)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const chartData = prepareMonthlyData();
  const constructorChartData = prepareConstructorData();
  const statusChartData = prepareStatusData();
  const projectPerformanceData = prepareProjectPerformanceData();
  const pendingInvoicesData = preparePendingInvoicesData();

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
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

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      }
    },
    cutout: '70%'
  };

  const projectPerformanceOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        ticks: {
          callback: (value: number) => formatCurrency(value)
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          precision: 0
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'not_required':
        return 'bg-gray-100 text-gray-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paga';
      case 'approved':
        return 'Aprovada';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  const getInvoiceStatusText = (status: string) => {
    switch (status) {
      case 'received':
        return 'Recebida';
      case 'pending':
        return 'Pendente';
      case 'rejected':
        return 'Rejeitada';
      case 'not_required':
        return 'Não Necessária';
      case 'overdue':
        return 'Atrasada';
      case 'draft':
        return 'Rascunho';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'approved':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getInvoiceStatusIcon = (status: string) => {
    switch (status) {
      case 'received':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'not_required':
        return <XCircle className="w-4 h-4" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4" />;
      case 'draft':
        return <Edit className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleInvoiceUpload = () => {
    if (!selectedSale) return;
    
    // In a real app, this would upload the invoice to the server
    console.log('Uploading invoice:', {
      file: invoiceFile,
      number: invoiceNumber,
      date: invoiceDate,
      value: invoiceValue,
      description: invoiceDescription,
      sale: selectedSale.id
    });
    
    // Show success message
    setUploadSuccess(true);
    
    // Reset form after 2 seconds and close modal
    setTimeout(() => {
      setUploadSuccess(false);
      setShowInvoiceUpload(false);
      setInvoiceFile(null);
      setInvoiceNumber('');
      setInvoiceDate('');
      setInvoiceValue('');
      setInvoiceDescription('');
      
      // Update sale status (in a real app, this would be done by the server)
      const updatedSales = salesList.map(sale => {
        if (sale.id === selectedSale.id) {
          return {
            ...sale,
            brokerInvoiceStatus: 'received',
            brokerInvoiceNumber: invoiceNumber,
            brokerInvoiceDate: invoiceDate,
            brokerInvoiceUrl: invoiceFile ? URL.createObjectURL(invoiceFile) : undefined
          };
        }
        return sale;
      });
      
      setSalesList(updatedSales);
    }, 2000);
  };

  const handleEditInvoice = (invoice: PendingInvoice) => {
    setEditedInvoice({...invoice});
    setShowInvoiceEditor(true);
  };

  const handleSaveInvoice = () => {
    if (!editedInvoice) return;
    
    // In a real app, this would save the invoice to the server
    console.log('Saving invoice:', editedInvoice);
    
    // Show success message
    setShowInvoiceSuccess(true);
    
    // Reset form after 2 seconds and close modal
    setTimeout(() => {
      setShowInvoiceSuccess(false);
      setShowInvoiceEditor(false);
      setEditedInvoice(null);
    }, 2000);
  };

  const handleSubmitInvoice = (invoice: PendingInvoice) => {
    // In a real app, this would submit the invoice to the server
    console.log('Submitting invoice:', invoice);
    
    // Show success message
    setShowInvoiceSuccess(true);
    
    // Reset form after 2 seconds and close modal
    setTimeout(() => {
      setShowInvoiceSuccess(false);
      setShowPendingInvoiceDetails(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Financeiro</h2>
          <p className="text-gray-600">Acompanhe suas comissões e pagamentos</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Filtros</span>
          </button>
          <button
            onClick={() => {/* Handle export */}}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5" />
                <span>Visão Geral</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('commissions')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'commissions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                <span>Comissões</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('rates')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'rates'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Percent className="w-5 h-5" />
                <span>Taxas</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'invoices'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                <span>Notas Fiscais</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('pending-invoices')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'pending-invoices'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 relative">
                <FileUp className="w-5 h-5" />
                <span>Notas Pendentes</span>
                {pendingInvoices.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
                    {pendingInvoices.length}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="p-6 border-b">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status da Comissão
                </label>
                <select
                  value={filter.status}
                  onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="all">Todos os Status</option>
                  <option value="pending">Pendentes</option>
                  <option value="approved">Aprovadas</option>
                  <option value="paid">Pagas</option>
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
                  <option value="month">Último Mês</option>
                  <option value="quarter">Último Trimestre</option>
                  <option value="year">Último Ano</option>
                  <option value="all">Todo o Período</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Empreendimento
                </label>
                <select
                  value={filter.project}
                  onChange={(e) => setFilter(prev => ({ ...prev, project: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="all">Todos os Empreendimentos</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Construtora
                </label>
                <select
                  value={filter.constructor}
                  onChange={(e) => setFilter(prev => ({ ...prev, constructor: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="all">Todas as Construtoras</option>
                  {constructorsList.map(constructor => (
                    <option key={constructor.id} value={constructor.id}>{constructor.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={filter.search}
                    onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Buscar por cliente, projeto ou unidade..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Wallet className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium">Total em Comissões</h3>
                  </div>
                  <p className="text-3xl font-bold">{formatCurrency(summary.totalCommissions)}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {((summary.totalCommissions / summary.totalSales) * 100).toFixed(1)}% das vendas
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-medium">Comissões Pagas</h3>
                  </div>
                  <p className="text-3xl font-bold">{formatCurrency(summary.paidCommissions)}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {summary.totalCommissions > 0 
                      ? ((summary.paidCommissions / summary.totalCommissions) * 100).toFixed(1) 
                      : '0'}% do total
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h3 className="font-medium">A Receber</h3>
                  </div>
                  <p className="text-3xl font-bold">{formatCurrency(summary.pendingCommissions)}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {summary.totalCommissions > 0 
                      ? ((summary.pendingCommissions / summary.totalCommissions) * 100).toFixed(1) 
                      : '0'}% do total
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Building2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-medium">Vendas Realizadas</h3>
                  </div>
                  <p className="text-3xl font-bold">{summary.totalSalesCount}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {summary.pendingInvoices} com NF pendente
                  </p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Commissions Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Evolução de Comissões</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>Pagas</span>
                      </div>
                      <div className="flex items-center gap-1 ml-3">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span>Pendentes</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-80">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>

                {/* Status Distribution Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-lg font-semibold mb-6">Status das Comissões</h3>
                  <div className="h-80 flex items-center justify-center">
                    <Doughnut data={statusChartData} options={doughnutOptions} />
                  </div>
                </div>

                {/* Constructor Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-lg font-semibold mb-6">Comissões por Construtora</h3>
                  <div className="h-80">
                    <Bar 
                      data={constructorChartData} 
                      options={{
                        ...chartOptions,
                        indexAxis: 'y' as const,
                        plugins: {
                          legend: {
                            display: false
                          }
                        }
                      }} 
                    />
                  </div>
                </div>

                {/* Project Performance */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-lg font-semibold mb-6">Desempenho por Projeto</h3>
                  <div className="space-y-4">
                    {Array.from(
                      new Set(filteredSales.map(s => s.projectId))
                    ).map(projectId => {
                      const projectSales = filteredSales.filter(s => s.projectId === projectId);
                      const projectName = projectSales[0]?.projectName || 'Unknown';
                      const totalSales = projectSales.length;
                      const totalCommission = projectSales.reduce((sum, s) => sum + s.brokerCommission, 0);
                      const avgCommissionRate = projectSales.reduce((sum, s) => sum + s.brokerCommissionRate, 0) / totalSales;
                      
                      return (
                        <div key={projectId} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{projectName}</h4>
                            <span className="text-sm text-gray-500">{totalSales} vendas</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Comissão Total:</span>
                            <span className="font-medium">{formatCurrency(totalCommission)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Taxa Média:</span>
                            <span className="font-medium">{avgCommissionRate.toFixed(1)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Pending Invoices Alert */}
              {pendingInvoices.length > 0 && (
                <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Notas Fiscais Pendentes</h3>
                    <button
                      onClick={() => setActiveTab('pending-invoices')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FileUp className="w-5 h-5" />
                      <span>Ver Todas</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <FileUp className="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 className="font-medium">Total Pendente</h4>
                      </div>
                      <p className="text-xl font-bold">{pendingInvoices.length}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatCurrency(summary.pendingInvoicesValue)}
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100 rounded-full">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <h4 className="font-medium">Atrasadas</h4>
                      </div>
                      <p className="text-xl font-bold">{summary.overdueInvoicesCount}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Requer atenção imediata
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gray-100 rounded-full">
                          <Edit className="w-5 h-5 text-gray-600" />
                        </div>
                        <h4 className="font-medium">Rascunhos</h4>
                      </div>
                      <p className="text-xl font-bold">{pendingInvoices.filter(i => i.status === 'draft').length}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Aguardando finalização
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {pendingInvoices
                      .filter(invoice => invoice.status === 'overdue')
                      .slice(0, 2)
                      .map(invoice => (
                        <div key={invoice.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 mt-1" />
                            <div>
                              <p className="font-medium">Nota Fiscal Atrasada</p>
                              <p className="text-sm text-gray-700">
                                {invoice.projectName} - Unidade {invoice.unitNumber}
                              </p>
                              <p className="text-sm text-gray-700">
                                Comissão: {formatCurrency(invoice.commissionValue)}
                              </p>
                              <p className="text-sm text-red-600">
                                Atrasada há {invoice.daysOverdue} dias
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setSelectedPendingInvoice(invoice);
                                setShowPendingInvoiceDetails(true);
                              }}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
                            >
                              <FileUp className="w-4 h-4" />
                              <span>Emitir Agora</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    
                    {pendingInvoices
                      .filter(invoice => invoice.status === 'pending')
                      .slice(0, 1)
                      .map(invoice => (
                        <div key={invoice.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-yellow-600 mt-1" />
                            <div>
                              <p className="font-medium">Nota Fiscal Pendente</p>
                              <p className="text-sm text-gray-700">
                                {invoice.projectName} - Unidade {invoice.unitNumber}
                              </p>
                              <p className="text-sm text-gray-700">
                                Comissão: {formatCurrency(invoice.commissionValue)}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setSelectedPendingInvoice(invoice);
                                setShowPendingInvoiceDetails(true);
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                            >
                              <FileUp className="w-4 h-4" />
                              <span>Emitir Nota</span>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Invoice Actions */}
              <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-6">Ações Pendentes</h3>
                
                {summary.pendingInvoices > 0 ? (
                  <div className="space-y-4">
                    {filteredSales
                      .filter(sale => sale.brokerInvoiceStatus === 'pending')
                      .map(sale => (
                        <div key={sale.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1" />
                            <div>
                              <p className="font-medium">Nota Fiscal Pendente</p>
                              <p className="text-sm text-gray-700">
                                {sale.projectName} - Unidade {sale.unitNumber}
                              </p>
                              <p className="text-sm text-gray-700">
                                Comissão: {formatCurrency(sale.brokerCommission)}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setSelectedSale(sale);
                                setShowInvoiceGuide(true);
                              }}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-2"
                            >
                              <HelpCircle className="w-4 h-4" />
                              <span>Como Emitir</span>
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedSale(sale);
                                setShowInvoiceUpload(true);
                                setInvoiceDescription(`Comissão de corretagem referente à venda da unidade ${sale.unitNumber} do empreendimento ${sale.projectName}`);
                                setInvoiceValue(sale.brokerCommission.toString());
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                            >
                              <Upload className="w-4 h-4" />
                              <span>Enviar Nota Fiscal</span>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Não há ações pendentes no momento</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Commissions Tab */}
          {activeTab === 'commissions' && (
            <div className="space-y-8">
              {/* Project Performance Chart */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-lg font-semibold mb-6">Desempenho por Projeto</h3>
                <div className="h-80">
                  <Bar 
                    data={projectPerformanceData} 
                    options={projectPerformanceOptions}
                  />
                </div>
              </div>

              {/* Commissions List */}
              <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold">Minhas Comissões</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Empreendimento/Unidade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
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
                      {filteredSales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="font-medium">{sale.projectName}</p>
                              <p className="text-sm text-gray-500">Unidade {sale.unitNumber}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm">{sale.clientName}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium">
                              {formatCurrency(sale.value)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <span className="text-sm font-medium">
                                {formatCurrency(sale.brokerCommission)}
                              </span>
                              <p className="text-xs text-gray-500">
                                {sale.brokerCommissionRate}% de comissão
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              getStatusColor(sale.brokerCommissionStatus)
                            }`}>
                              {getStatusIcon(sale.brokerCommissionStatus)}
                              {getStatusText(sale.brokerCommissionStatus)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <p>Venda: {new Date(sale.saleDate).toLocaleDateString('pt-BR')}</p>
                              {sale.brokerPaymentDate && (
                                <p className="text-xs text-gray-500">
                                  Pagamento: {new Date(sale.brokerPaymentDate).toLocaleDateString('pt-BR')}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              {sale.brokerInvoiceStatus === 'received' && (
                                <button 
                                  onClick={() => {
                                    setSelectedSale(sale);
                                    setShowInvoicePreview(true);
                                  }}
                                  className="p-1 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
                                  title="Ver Nota Fiscal"
                                >
                                  <FileText className="w-5 h-5" />
                                </button>
                              )}
                              <button 
                                onClick={() => {
                                  setSelectedSale(sale);
                                  setShowSaleDetails(true);
                                }}
                                className="p-1 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
                                title="Ver Detalhes"
                              >
                                <ArrowUpRight className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Rates Tab */}
          {activeTab === 'rates' && (
            <div className="space-y-8">
              {/* Commission Rates */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-lg font-semibold mb-6">Taxas de Comissão por Construtora</h3>
                <div className="space-y-4">
                  {constructorsList.map(constructor => {
                    // Find the special rate for this constructor if any
                    const constructorObj = constructors.find(c => c.id === constructor.id);
                    const specialRate = constructorObj?.commissionRates.special?.find(
                      sr => sr.brokerId === currentBrokerId
                    );
                    
                    const rate = specialRate?.rate || constructorObj?.commissionRates.default || 3.0;
                    
                    return (
                      <div key={constructor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{constructor.name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Percent className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{rate}% de comissão</span>
                          </div>
                        </div>
                        {specialRate && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            Taxa Especial
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Project Specific Rates */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-lg font-semibold mb-6">Taxas de Comissão por Projeto</h3>
                <div className="space-y-4">
                  {projects.map(project => {
                    // Find the constructor for this project
                    const sale = salesList.find(s => s.projectId === project.id);
                    const constructorId = sale?.constructorId;
                    const constructorObj = constructors.find(c => c.id === constructorId);
                    
                    // Find special rate for this project
                    const specialRate = constructorObj?.commissionRates.special?.find(
                      sr => sr.projectId === project.id
                    );
                    
                    // Find special rate for this broker on this project
                    const specialBrokerRate = constructorObj?.commissionRates.special?.find(
                      sr => sr.projectId === project.id && sr.brokerId === currentBrokerId
                    );
                    
                    // Find special rate for this broker (general)
                    const specialBrokerGeneralRate = constructorObj?.commissionRates.special?.find(
                      sr => sr.brokerId === currentBrokerId && !sr.projectId
                    );
                    
                    // Determine the effective rate
                    let rate = constructorObj?.commissionRates.default || 3.0;
                    let rateType = 'Padrão';
                    
                    if (specialBrokerRate) {
                      rate = specialBrokerRate.rate;
                      rateType = 'Especial para você neste projeto';
                    } else if (specialRate) {
                      rate = specialRate.rate;
                      rateType = 'Especial para este projeto';
                    } else if (specialBrokerGeneralRate) {
                      rate = specialBrokerGeneralRate.rate;
                      rateType = 'Especial para você';
                    }
                    
                    // Get actual commission rate from sales
                    const projectSales = salesList.filter(s => s.projectId === project.id);
                    const actualRate = projectSales.length > 0 
                      ? projectSales.reduce((sum, s) => sum + s.brokerCommissionRate, 0) / projectSales.length
                      : rate;
                    
                    return (
                      <div key={project.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{project.name}</h4>
                          <span className="text-sm text-gray-500">{projectSales.length} vendas</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Taxa de Comissão:</span>
                          <span className="font-medium">{actualRate.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tipo de Taxa:</span>
                          <span className="font-medium">{rateType}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Commission Rate Trends */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-lg font-semibold mb-6">Tendências de Taxas de Comissão</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Taxa Média de Comissão</p>
                      <p className="text-sm text-gray-600">Baseada em todas as suas vendas</p>
                    </div>
                    <span className="text-xl font-bold">{summary.averageCommissionRate.toFixed(1)}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Taxa Mais Alta</p>
                      <p className="text-sm text-gray-600">Sua maior taxa de comissão</p>
                    </div>
                    <span className="text-xl font-bold">{Math.max(...filteredSales.map(s => s.brokerCommissionRate)).toFixed(1)}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Taxa Mais Baixa</p>
                      <p className="text-sm text-gray-600">Sua menor taxa de comissão</p>
                    </div>
                    <span className="text-xl font-bold">{Math.min(...filteredSales.map(s => s.brokerCommissionRate)).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <div className="space-y-8">
              {/* Invoice Status Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <FileCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-medium">Notas Emitidas</h3>
                  </div>
                  <p className="text-3xl font-bold">{filteredSales.filter(s => s.brokerInvoiceStatus === 'received').length}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {formatCurrency(filteredSales.filter(s => s.brokerInvoiceStatus === 'received').reduce((sum, s) => sum + s.brokerCommission, 0))}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h3 className="font-medium">Pendentes de Emissão</h3>
                  </div>
                  <p className="text-3xl font-bold">{filteredSales.filter(s => s.brokerInvoiceStatus === 'pending').length}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {formatCurrency(filteredSales.filter(s => s.brokerInvoiceStatus === 'pending').reduce((sum, s) => sum + s.brokerCommission, 0))}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-red-100 rounded-full">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="font-medium">Rejeitadas</h3>
                  </div>
                  <p className="text-3xl font-bold">{filteredSales.filter(s => s.brokerInvoiceStatus === 'rejected').length}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {formatCurrency(filteredSales.filter(s => s.brokerInvoiceStatus === 'rejected').reduce((sum, s) => sum + s.brokerCommission, 0))}
                  </p>
                </div>
              </div>

              {/* NFSe Integration Guide Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-full flex-shrink-0">
                    <HelpCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Emissão de Notas Fiscais</h3>
                    <p className="text-blue-700 mb-4">
                      Você pode emitir suas notas fiscais diretamente pelo portal da NFSe do seu município ou através do portal nacional.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => setShowInvoiceGuide(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <HelpCircle className="w-5 h-5" />
                        <span>Ver Guia de Emissão</span>
                      </button>
                      <a
                        href="https://www.nfse.gov.br/EmissorNacional"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                        <span>Acessar NFSe Nacional</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoices List */}
              <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold">Notas Fiscais</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Empreendimento/Unidade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Número da NF
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data de Emissão
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="font-medium">{sale.projectName}</p>
                              <p className="text-sm text-gray-500">Unidade {sale.unitNumber}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm">
                              {sale.brokerInvoiceNumber || '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm">
                              {sale.brokerInvoiceDate 
                                ? new Date(sale.brokerInvoiceDate).toLocaleDateString('pt-BR') 
                                : '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              getInvoiceStatusColor(sale.brokerInvoiceStatus)
                            }`}>
                              {getInvoiceStatusIcon(sale.brokerInvoiceStatus)}
                              {getInvoiceStatusText(sale.brokerInvoiceStatus)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-sm font-medium">
                              {formatCurrency(sale.brokerCommission)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              {sale.brokerInvoiceStatus === 'received' && (
                                <button 
                                  onClick={() => {
                                    setSelectedSale(sale);
                                    setShowInvoicePreview(true);
                                  }}
                                  className="p-1 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
                                  title="Ver Nota Fiscal"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                              )}
                              {sale.brokerInvoiceStatus === 'pending' && (
                                <button 
                                  onClick={() => {
                                    setSelectedSale(sale);
                                    setShowInvoiceUpload(true);
                                    setInvoiceDescription(`Comissão de corretagem referente à venda da unidade ${sale.unitNumber} do empreendimento ${sale.projectName}`);
                                    setInvoiceValue(sale.brokerCommission.toString());
                                  }}
                                  className="p-1 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
                                  title="Enviar Nota Fiscal"
                                >
                                  <Upload className="w-5 h-5" />
                                </button>
                              )}
                              {sale.brokerInvoiceStatus === 'rejected' && (
                                <button 
                                  onClick={() => {
                                    setSelectedSale(sale);
                                    setShowInvoiceUpload(true);
                                    setInvoiceDescription(`Comissão de corretagem referente à venda da unidade ${sale.unitNumber} do empreendimento ${sale.projectName}`);
                                    setInvoiceValue(sale.brokerCommission.toString());
                                  }}
                                  className="p-1 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
                                  title="Reenviar Nota Fiscal"
                                >
                                  <Upload className="w-5 h-5" />
                                </button>
                              )}
                              <button 
                                onClick={() => {
                                  setSelectedSale(sale);
                                  setShowSaleDetails(true);
                                }}
                                className="p-1 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
                                title="Ver Detalhes"
                              >
                                <ArrowUpRight className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tax Information */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-lg font-semibold mb-6">Informações Fiscais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-4">Dados para Emissão de NF</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">CPF/CNPJ:</span>
                        <span className="text-sm font-medium">123.456.789-00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Regime Tributário:</span>
                        <span className="text-sm font-medium">Simples Nacional</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Inscrição Municipal:</span>
                        <span className="text-sm font-medium">1234567</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Isento:</span>
                        <span className="text-sm font-medium">Não</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-4">Impostos Retidos</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">ISS:</span>
                        <span className="text-sm font-medium">5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">PIS:</span>
                        <span className="text-sm font-medium">0.65%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">COFINS:</span>
                        <span className="text-sm font-medium">3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">IR:</span>
                        <span className="text-sm font-medium">1.5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pending Invoices Tab */}
          {activeTab === 'pending-invoices' && (
            <div className="space-y-8">
              {/* Pending Invoices Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <FileUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium">Total Pendente</h3>
                  </div>
                  <p className="text-3xl font-bold">{pendingInvoices.length}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {formatCurrency(pendingInvoices.reduce((sum, invoice) => sum + invoice.commissionValue, 0))}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-red-100 rounded-full">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="font-medium">Atrasadas</h3>
                  </div>
                  <p className="text-3xl font-bold">{pendingInvoices.filter(invoice => invoice.status === 'overdue').length}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {formatCurrency(pendingInvoices.filter(invoice => invoice.status === 'overdue').reduce((sum, invoice) => sum + invoice.commissionValue, 0))}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Edit className="w-6 h-6 text-gray-600" />
                    </div>
                    <h3 className="font-medium">Rascunhos</h3>
                  </div>
                  <p className="text-3xl font-bold">{pendingInvoices.filter(invoice => invoice.status === 'draft').length}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {formatCurrency(pendingInvoices.filter(invoice => invoice.status === 'draft').reduce((sum, invoice) => sum + invoice.commissionValue, 0))}
                  </p>
                </div>
              </div>

              {/* Pending Invoices Chart */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-lg font-semibold mb-6">Status das Notas Pendentes</h3>
                  <div className="h-64 flex items-center justify-center">
                    <Doughnut data={pendingInvoicesData} options={doughnutOptions} />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-lg font-semibold mb-6">Próximos Passos</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <FileUp className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">Emitir Notas Fiscais</p>
                        <p className="text-sm text-blue-700">
                          Emita as notas fiscais para receber suas comissões. Notas atrasadas podem atrasar o pagamento.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-900">Receba suas Comissões</p>
                        <p className="text-sm text-green-700">
                          Após a emissão da nota fiscal, o pagamento será processado em até 30 dias.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                      <div className="p-2 bg-yellow-100 rounded-full">
                        <Bell className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-yellow-900">Fique Atento</p>
                        <p className="text-sm text-yellow-700">
                          Você receberá notificações quando novas comissões forem aprovadas e estiverem prontas para emissão de nota fiscal.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* NFSe Integration Guide Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-full flex-shrink-0">
                    <HelpCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Emissão de Notas Fiscais</h3>
                    <p className="text-blue-700 mb-4">
                      Você pode emitir suas notas fiscais diretamente pelo portal da NFSe do seu município ou através do portal nacional.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => setShowInvoiceGuide(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <HelpCircle className="w-5 h-5" />
                        <span>Ver Guia de Emissão</span>
                      </button>
                      <a
                        href="https://www.nfse.gov.br/EmissorNacional"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                        <span>Acessar NFSe Nacional</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Invoices List */}
              <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold">Notas Fiscais Pendentes</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Empreendimento/Unidade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Construtora
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vencimento
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPendingInvoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="font-medium">{invoice.projectName}</p>
                              <p className="text-sm text-gray-500">Unidade {invoice.unitNumber}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm">{invoice.clientName}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm">{invoice.constructorName}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              getInvoiceStatusColor(invoice.status)
                            }`}>
                              {getInvoiceStatusIcon(invoice.status)}
                              {getInvoiceStatusText(invoice.status)}
                              {invoice.status === 'overdue' && invoice.daysOverdue && (
                                <span className="ml-1">({invoice.daysOverdue}d)</span>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm">
                              {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-sm font-medium">
                              {formatCurrency(invoice.commissionValue)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              {invoice.status === 'draft' && (
                                <button 
                                  onClick={() => handleEditInvoice(invoice)}
                                  className="p-1 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
                                  title="Editar Rascunho"
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                              )}
                              <button 
                                onClick={() => {
                                  setSelectedPendingInvoice(invoice);
                                  setShowPendingInvoiceDetails(true);
                                }}
                                className="p-1 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
                                title="Emitir Nota Fiscal"
                              >
                                <FileUp className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Methods */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-6">Métodos de Pagamento</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium">Dados Bancários</p>
                  <p className="text-sm text-gray-600">Para recebimento de comissões</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Banco:</span>
                  <span className="text-sm">Banco do Brasil</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Agência:</span>
                  <span className="text-sm">1234-5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Conta:</span>
                  <span className="text-sm">12345-6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tipo:</span>
                  <span className="text-sm">Corrente</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Titular:</span>
                  <span className="text-sm">Ana Santos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">CPF:</span>
                  <span className="text-sm">123.456.789-00</span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                Editar Dados Bancários
              </button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Receipt className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-medium">Dados Fiscais</p>
                  <p className="text-sm text-gray-600">Para emissão de notas fiscais</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">CPF/CNPJ:</span>
                  <span className="text-sm">123.456.789-00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Regime Tributário:</span>
                  <span className="text-sm">Simples Nacional</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Inscrição Municipal:</span>
                  <span className="text-sm">1234567</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Isento:</span>
                  <span className="text-sm">Não</span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                Editar Dados Fiscais
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sale Details Modal */}
      {showSaleDetails && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Detalhes da Comissão</h2>
              <button
                onClick={() => setShowSaleDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Sale Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Informações da Venda</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Empreendimento</p>
                        <p className="font-medium">{selectedSale.projectName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Unidade</p>
                        <p className="font-medium">{selectedSale.unitNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Cliente</p>
                        <p className="font-medium">{selectedSale.clientName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Data da Venda</p>
                        <p className="font-medium">{new Date(selectedSale.saleDate).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Valor da Venda</p>
                        <p className="font-medium">{formatCurrency(selectedSale.value)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status da Venda</p>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedSale.status === 'completed' ? 'bg-green-100 text-green-800' :
                          selectedSale.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                          selectedSale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedSale.status === 'completed' ? 'Concluída' :
                           selectedSale.status === 'approved' ? 'Aprovada' :
                           selectedSale.status === 'pending' ? 'Pendente' :
                           'Rejeitada'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Detalhes da Comissão</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Taxa de Comissão</p>
                        <p className="font-medium">{selectedSale.brokerCommissionRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Valor da Comissão</p>
                        <p className="font-medium">{formatCurrency(selectedSale.brokerCommission)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getStatusColor(selectedSale.brokerCommissionStatus)
                        }`}>
                          {getStatusIcon(selectedSale.brokerCommissionStatus)}
                          {getStatusText(selectedSale.brokerCommissionStatus)}
                        </span>
                      </div>
                      {selectedSale.brokerPaymentDate && (
                        <div>
                          <p className="text-sm text-gray-600">Data de Pagamento</p>
                          <p className="font-medium">{new Date(selectedSale.brokerPaymentDate).toLocaleDateString('pt-BR')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Nota Fiscal</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getInvoiceStatusColor(selectedSale.brokerInvoiceStatus)
                        }`}>
                          {getInvoiceStatusIcon(selectedSale.brokerInvoiceStatus)}
                          {getInvoiceStatusText(selectedSale.brokerInvoiceStatus)}
                        </span>
                      </div>
                      
                      {selectedSale.brokerInvoiceNumber && (
                        <div>
                          <p className="text-sm text-gray-600">Número da NF</p>
                          <p className="font-medium">{selectedSale.brokerInvoiceNumber}</p>
                        </div>
                      )}
                      
                      {selectedSale.brokerInvoiceDate && (
                        <div>
                          <p className="text-sm text-gray-600">Data de Emissão</p>
                          <p className="font-medium">{new Date(selectedSale.brokerInvoiceDate).toLocaleDateString('pt-BR')}</p>
                        </div>
                      )}

                      {selectedSale.brokerInvoiceStatus === 'received' && (
                        <div className="mt-4">
                          <button 
                            onClick={() => {
                              setShowSaleDetails(false);
                              setShowInvoicePreview(true);
                            }}
                            className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Visualizar Nota Fiscal</span>
                          </button>
                        </div>
                      )}

                      {selectedSale.brokerInvoiceStatus === 'pending' && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 p-3 bg-yellow-50 text-yellow-800 rounded-lg">
                            <AlertTriangle className="w-5 h-5" />
                            <p className="text-sm">Nota fiscal pendente de emissão</p>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button 
                              onClick={() => {
                                setShowSaleDetails(false);
                                setShowInvoiceGuide(true);
                              }}
                              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center gap-2"
                            >
                              <HelpCircle className="w-4 h-4" />
                              <span>Como Emitir</span>
                            </button>
                            <button 
                              onClick={() => {
                                setShowSaleDetails(false);
                                setShowInvoiceUpload(true);
                                setInvoiceDescription(`Comissão de corretagem referente à venda da unidade ${selectedSale.unitNumber} do empreendimento ${selectedSale.projectName}`);
                                setInvoiceValue(selectedSale.brokerCommission.toString());
                              }}
                              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2"
                            >
                              <Upload className="w-4 h-4" />
                              <span>Enviar Nota Fiscal</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedSale.brokerInvoiceStatus === 'rejected' && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg">
                            <AlertTriangle className="w-5 h-5" />
                            <div>
                              <p className="font-medium">Nota fiscal rejeitada</p>
                              <p className="text-sm">{selectedSale.notes || 'Motivo não especificado'}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              setShowSaleDetails(false);
                              setShowInvoiceUpload(true);
                              setInvoiceDescription(`Comissão de corretagem referente à venda da unidade ${selectedSale.unitNumber} do empreendimento ${selectedSale.projectName}`);
                              setInvoiceValue(selectedSale.brokerCommission.toString());
                            }}
                            className="w-full mt-3 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Reenviar Nota Fiscal</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Dados do Tomador</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Construtora</p>
                        <p className="font-medium">{selectedSale.projectName} Construtora</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">CNPJ</p>
                        <p className="font-medium">12.345.678/0001-90</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Endereço</p>
                        <p className="font-medium">Rua das Flores, 123 - São Paulo/SP</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
              <button 
                onClick={() => setShowSaleDetails(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {showInvoicePreview && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Nota Fiscal</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    // Handle download
                    if (selectedSale.brokerInvoiceUrl) {
                      window.open(selectedSale.brokerInvoiceUrl, '_blank');
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setShowInvoicePreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="bg-gray-100 p-8 rounded-lg">
              <div className="bg-white p-8 rounded-lg shadow-md">
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">NOTA FISCAL DE SERVIÇOS ELETRÔNICA - NFSe</h3>
                    <p className="text-sm text-gray-600">Número: {selectedSale.brokerInvoiceNumber || 'NF-12345'}</p>
                    <p className="text-sm text-gray-600">Data de Emissão: {selectedSale.brokerInvoiceDate ? new Date(selectedSale.brokerInvoiceDate).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Código de Verificação</p>
                    <p className="text-sm">ABCD-1234-EFGH-5678</p>
                  </div>
                </div>

                {/* Prestador e Tomador */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium mb-2">PRESTADOR DE SERVIÇOS</h4>
                    <p className="text-sm">Nome/Razão Social: {selectedSale.brokerName}</p>
                    <p className="text-sm">CPF/CNPJ: 123.456.789-00</p>
                    <p className="text-sm">Inscrição Municipal: 1234567</p>
                    <p className="text-sm">Endereço: Av. Paulista, 1000 - São Paulo/SP</p>
                    <p className="text-sm">E-mail: {selectedSale.clientEmail}</p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium mb-2">TOMADOR DE SERVIÇOS</h4>
                    <p className="text-sm">Nome/Razão Social: {selectedSale.projectName} Construtora</p>
                    <p className="text-sm">CPF/CNPJ: 12.345.678/0001-90</p>
                    <p className="text-sm">Inscrição Municipal: 7654321</p>
                    <p className="text-sm">Endereço: Rua das Flores, 123 - São Paulo/SP</p>
                    <p className="text-sm">E-mail: financeiro@construtora.com.br</p>
                  </div>
                </div>

                {/* Discriminação dos Serviços */}
                <div className="mb-8">
                  <h4 className="font-medium mb-2">DISCRIMINAÇÃO DOS SERVIÇOS</h4>
                  <div className="border p-4 rounded-lg">
                    <p className="text-sm">
                      Comissão de corretagem referente à intermediação na venda da unidade {selectedSale.unitNumber} do empreendimento {selectedSale.projectName}.
                    </p>
                  </div>
                </div>

                {/* Valores */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="font-medium mb-2">VALOR TOTAL DA NOTA</h4>
                    <div className="border p-4 rounded-lg">
                      <p className="text-xl font-bold">{formatCurrency(selectedSale.brokerCommission)}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">INFORMAÇÕES FISCAIS</h4>
                    <div className="border p-4 rounded-lg space-y-1">
                      <p className="text-sm">Base de Cálculo: {formatCurrency(selectedSale.brokerCommission)}</p>
                      <p className="text-sm">Alíquota: 5%</p>
                      <p className="text-sm">ISS: {formatCurrency(selectedSale.brokerCommission * 0.05)}</p>
                      <p className="text-sm">PIS: {formatCurrency(selectedSale.brokerCommission * 0.0065)}</p>
                      <p className="text-sm">COFINS: {formatCurrency(selectedSale.brokerCommission * 0.03)}</p>
                      <p className="text-sm">IR: {formatCurrency(selectedSale.brokerCommission * 0.015)}</p>
                    </div>
                  </div>
                </div>

                {/* Outras Informações */}
                <div>
                  <h4 className="font-medium mb-2">OUTRAS INFORMAÇÕES</h4>
                  <div className="border p-4 rounded-lg">
                    <p className="text-sm">
                      Esta NFS-e foi emitida com respaldo na Lei nº 14.097/2005 e no Decreto nº 53.151/2012.
                    </p>
                    <p className="text-sm mt-2">
                      Documento emitido por ME ou EPP optante pelo Simples Nacional.
                    </p>
                    <p className="text-sm mt-2">
                      Data de Vencimento: {new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Upload Modal */}
      {showInvoiceUpload && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl m-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Enviar Nota Fiscal</h2>
              <button
                onClick={() => {
                  setShowInvoiceUpload(false);
                  setInvoiceFile(null);
                  setInvoiceNumber('');
                  setInvoiceDate('');
                  setInvoiceValue('');
                  setInvoiceDescription('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {uploadSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Nota Fiscal Enviada com Sucesso!</h3>
                <p className="text-gray-600 text-center mb-6">
                  Sua nota fiscal foi enviada e está sendo processada pela construtora.
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleInvoiceUpload();
              }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arquivo da Nota Fiscal (PDF)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="flex flex-col items-center">
                      {invoiceFile ? (
                        <div className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-blue-600" />
                            <div>
                              <p className="font-medium">{invoiceFile.name}</p>
                              <p className="text-sm text-gray-500">
                                {(invoiceFile.size / 1024 / 1024).toFixed(2)}MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setInvoiceFile(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <FileUp className="w-12 h-12 text-gray-400 mb-4" />
                          <p className="text-sm text-gray-600 text-center mb-4">
                            Arraste e solte o arquivo PDF da nota fiscal aqui, ou clique para selecionar
                          </p>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setInvoiceFile(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                            id="invoice-file"
                          />
                          <label
                            htmlFor="invoice-file"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                          >
                            Selecionar Arquivo
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número da Nota Fiscal
                    </label>
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Ex: NF-12345"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Emissão
                    </label>
                    <input
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor da Nota Fiscal
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formatCurrency(parseFloat(invoiceValue) || 0)}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setInvoiceValue(value ? (parseInt(value) / 100).toString() : '');
                      }}
                      className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="R$ 0,00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição dos Serviços
                  </label>
                  <textarea
                    value={invoiceDescription}
                    onChange={(e) => setInvoiceDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Descreva os serviços prestados..."
                    required
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800">
                      <strong>Importante:</strong> Certifique-se de que a nota fiscal foi emitida corretamente 
                      com todos os dados do tomador (construtora) e com o valor exato da comissão.
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      Notas fiscais com informações incorretas serão rejeitadas e atrasarão o pagamento da comissão.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowInvoiceUpload(false);
                      setInvoiceFile(null);
                      setInvoiceNumber('');
                      setInvoiceDate('');
                      setInvoiceValue('');
                      setInvoiceDescription('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!invoiceFile || !invoiceNumber || !invoiceDate || !invoiceValue}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Enviar Nota Fiscal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Invoice Guide Modal */}
      {showInvoiceGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Guia de Emissão de Nota Fiscal</h2>
              <button
                onClick={() => setShowInvoiceGuide(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Emissão de Nota Fiscal de Serviços Eletrônica (NFSe)</h3>
                <p className="text-blue-700">
                  Este guia explica como emitir sua nota fiscal de serviços eletrônica (NFSe) para receber suas comissões de corretagem.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Opções para Emissão de NFSe</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                      Portal Nacional da NFSe
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      O Portal Nacional da NFSe permite a emissão de notas fiscais para qualquer município do Brasil.
                    </p>
                    <a
                      href="https://www.nfse.gov.br/EmissorNacional"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full justify-center"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Acessar Portal Nacional</span>
                    </a>
                  </div>

                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                      Portal do Seu Município
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Muitos municípios possuem seus próprios portais para emissão de NFSe. Consulte a prefeitura do seu município.
                    </p>
                    <div className="flex gap-2">
                      <a
                        href="https://nfe.prefeitura.sp.gov.br/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex-1 justify-center text-sm"
                      >
                        <span>São Paulo</span>
                      </a>
                      <a
                        href="https://notacarioca.rio.gov.br/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex-1 justify-center text-sm"
                      >
                        <span>Rio de Janeiro</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Passo a Passo para Emissão no Portal Nacional</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Acesse o Portal Nacional da NFSe</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Acesse o site <a href="https://www.nfse.gov.br/EmissorNacional" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.nfse.gov.br/EmissorNacional</a> e faça login com seu certificado digital ou conta gov.br.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Selecione "Emitir NFSe"</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        No menu principal, clique na opção "Emitir NFSe" para iniciar o processo de emissão.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Preencha os Dados do Tomador</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Informe os dados da construtora (tomador do serviço):
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                        <li>CNPJ da construtora</li>
                        <li>Razão Social</li>
                        <li>Endereço completo</li>
                        <li>E-mail para recebimento da nota</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">Preencha os Dados do Serviço</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Informe os detalhes do serviço prestado:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                        <li>Selecione o código de serviço: <strong>10.05 - Agenciamento, corretagem ou intermediação de bens móveis ou imóveis</strong></li>
                        <li>Valor da comissão (sem impostos)</li>
                        <li>Descrição detalhada: "Comissão de corretagem referente à venda da unidade [NÚMERO] do empreendimento [NOME]"</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      5
                    </div>
                    <div>
                      <h4 className="font-medium">Verifique as Informações Fiscais</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Confira se os dados de retenção de impostos estão corretos:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                        <li>ISS (geralmente 5% para serviços de corretagem)</li>
                        <li>PIS (0,65%)</li>
                        <li>COFINS (3%)</li>
                        <li>IR (1,5%)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      6
                    </div>
                    <div>
                      <h4 className="font-medium">Emita a Nota Fiscal</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Revise todas as informações e clique em "Emitir NFSe". Após a emissão, você poderá baixar o PDF da nota fiscal.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      7
                    </div>
                    <div>
                      <h4 className="font-medium">Envie a Nota Fiscal para a Construtora</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Após emitir a nota fiscal, faça o upload do PDF no portal da VHGold Imóveis para receber sua comissão.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800">
                    <strong>Atenção:</strong> A emissão correta da nota fiscal é essencial para o recebimento da sua comissão.
                  </p>
                  <p className="text-sm text-yellow-800 mt-1">
                    Certifique-se de que todos os dados estão corretos, especialmente o CNPJ da construtora e o valor da comissão.
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <a
                  href="https://www.gov.br/nfse/pt-br/emissor-nacional/manual-do-emissor-nacional"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <span>Manual Completo</span>
                </a>

                {selectedSale && selectedSale.brokerInvoiceStatus === 'pending' && (
                  <button
                    onClick={() => {
                      setShowInvoiceGuide(false);
                      setShowInvoiceUpload(true);
                      setInvoiceDescription(`Comissão de corretagem referente à venda da unidade ${selectedSale.unitNumber} do empreendimento ${selectedSale.projectName}`);
                      setInvoiceValue(selectedSale.brokerCommission.toString());
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Enviar Nota Fiscal</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pending Invoice Details Modal */}
      {showPendingInvoiceDetails && selectedPendingInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Emitir Nota Fiscal</h2>
              <button
                onClick={() => setShowPendingInvoiceDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {showInvoiceSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Nota Fiscal Emitida com Sucesso!</h3>
                <p className="text-gray-600 text-center mb-6">
                  Sua nota fiscal foi enviada e está sendo processada pela construtora.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Invoice Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Informações da Comissão</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Empreendimento</p>
                            <p className="font-medium">{selectedPendingInvoice.projectName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Unidade</p>
                            <p className="font-medium">{selectedPendingInvoice.unitNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Cliente</p>
                            <p className="font-medium">{selectedPendingInvoice.clientName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Data da Venda</p>
                            <p className="font-medium">{new Date(selectedPendingInvoice.saleDate).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Valor da Comissão</p>
                            <p className="font-medium">{formatCurrency(selectedPendingInvoice.commissionValue)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Taxa de Comissão</p>
                            <p className="font-medium">{selectedPendingInvoice.commissionRate}%</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-3">Dados do Tomador</h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-gray-600">Construtora</p>
                            <p className="font-medium">{selectedPendingInvoice.constructorName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">CNPJ</p>
                            <p className="font-medium">{selectedPendingInvoice.constructorDocument}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Endereço</p>
                            <p className="font-medium">{selectedPendingInvoice.constructorAddress}, {selectedPendingInvoice.constructorCity}/{selectedPendingInvoice.constructorState}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">E-mail</p>
                            <p className="font-medium">{selectedPendingInvoice.constructorEmail}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-3">Informações Fiscais</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">ISS ({selectedPendingInvoice.taxInfo.issRate}%):</span>
                            <span className="text-sm font-medium">{formatCurrency(selectedPendingInvoice.taxInfo.iss)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">PIS ({selectedPendingInvoice.taxInfo.pisRate}%):</span>
                            <span className="text-sm font-medium">{formatCurrency(selectedPendingInvoice.taxInfo.pis)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">COFINS ({selectedPendingInvoice.taxInfo.cofinsRate}%):</span>
                            <span className="text-sm font-medium">{formatCurrency(selectedPendingInvoice.taxInfo.cofins)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">IR ({selectedPendingInvoice.taxInfo.irRate}%):</span>
                            <span className="text-sm font-medium">{formatCurrency(selectedPendingInvoice.taxInfo.ir)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">CSLL ({selectedPendingInvoice.taxInfo.csllRate}%):</span>
                            <span className="text-sm font-medium">{formatCurrency(selectedPendingInvoice.taxInfo.csll)}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t">
                            <span className="text-sm font-medium">Total de Impostos:</span>
                            <span className="text-sm font-medium">{formatCurrency(selectedPendingInvoice.taxInfo.total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Emission */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Emissão da Nota Fiscal</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-3">Descrição do Serviço</h4>
                        <p className="text-sm">{selectedPendingInvoice.serviceDescription}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-3">Código do Serviço</h4>
                        <p className="text-sm">{selectedPendingInvoice.serviceCode}</p>
                      </div>

                      {selectedPendingInvoice.status === 'overdue' && (
                        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-800 rounded-lg">
                          <AlertTriangle className="w-5 h-5" />
                          <div>
                            <p className="font-medium">Nota Fiscal Atrasada</p>
                            <p className="text-sm">Esta nota fiscal está atrasada há {selectedPendingInvoice.daysOverdue} dias. Emita o quanto antes para não atrasar o recebimento da comissão.</p>
                          </div>
                        </div>
                      )}

                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-3">Próximos Passos</h4>
                        <ol className="list-decimal list-inside text-sm text-blue-700 space-y-2">
                          <li>Acesse o portal da NFSe do seu município ou o portal nacional</li>
                          <li>Preencha os dados do tomador (construtora) conforme informado acima</li>
                          <li>Informe o valor da comissão e a descrição do serviço</li>
                          <li>Verifique as informações fiscais e emita a nota</li>
                          <li>Faça o upload do PDF da nota fiscal no portal da VHGold</li>
                        </ol>
                      </div>

                      <div className="flex flex-col gap-3">
                        <a
                          href="https://www.nfse.gov.br/EmissorNacional"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                          <span>Acessar Portal Nacional da NFSe</span>
                        </a>
                        
                        <button
                          onClick={() => setShowInvoiceGuide(true)}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <HelpCircle className="w-5 h-5" />
                          <span>Ver Guia Detalhado de Emissão</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Upload da Nota Fiscal</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowInvoiceUpload(true);
                        setShowPendingInvoiceDetails(false);
                        setInvoiceDescription(selectedPendingInvoice.serviceDescription);
                        setInvoiceValue(selectedPendingInvoice.commissionValue.toString());
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Enviar Nota Fiscal
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invoice Editor Modal */}
      {showInvoiceEditor && editedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Editar Nota Fiscal</h2>
              <button
                onClick={() => {
                  setShowInvoiceEditor(false);
                  setEditedInvoice(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {showInvoiceSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Nota Fiscal Salva com Sucesso!</h3>
                <p className="text-gray-600 text-center mb-6">
                  As alterações na nota fiscal foram salvas com sucesso.
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSaveInvoice();
              }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Empreendimento
                    </label>
                    <input
                      type="text"
                      value={editedInvoice.projectName}
                      readOnly
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unidade
                    </label>
                    <input
                      type="text"
                      value={editedInvoice.unitNumber}
                      readOnly
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Construtora
                    </label>
                    <input
                      type="text"
                      value={editedInvoice.constructorName}
                      readOnly
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      value={editedInvoice.constructorDocument}
                      readOnly
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor da Comissão
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={formatCurrency(editedInvoice.commissionValue)}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          const numValue = value ? parseInt(value) / 100 : 0;
                          setEditedInvoice({
                            ...editedInvoice,
                            commissionValue: numValue
                          });
                        }}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Taxa de Comissão
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={editedInvoice.commissionRate}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          setEditedInvoice({
                            ...editedInvoice,
                            commissionRate: isNaN(value) ? 0 : value
                          });
                        }}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição do Serviço
                    </label>
                    <textarea
                      value={editedInvoice.serviceDescription}
                      onChange={(e) => setEditedInvoice({
                        ...editedInvoice,
                        serviceDescription: e.target.value
                      })}
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código do Serviço
                    </label>
                    <input
                      type="text"
                      value={editedInvoice.serviceCode}
                      onChange={(e) => setEditedInvoice({
                        ...editedInvoice,
                        serviceCode: e.target.value
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Vencimento
                    </label>
                    <input
                      type="date"
                      value={editedInvoice.dueDate.split('T')[0]}
                      onChange={(e) => setEditedInvoice({
                        ...editedInvoice,
                        dueDate: new Date(e.target.value).toISOString()
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800">
                      <strong>Importante:</strong> Certifique-se de que todas as informações estão corretas antes de emitir a nota fiscal.
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      O código de serviço para corretagem imobiliária é 10.05 - Agenciamento, corretagem ou intermediação de bens móveis ou imóveis.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowInvoiceEditor(false);
                      setEditedInvoice(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}