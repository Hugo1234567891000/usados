import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Calendar, DollarSign, Plus, Search, Filter, Eye, Edit, Trash2, ArrowUpRight, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RealEstateProject } from '../../types/property';
import projects from '../../data/projects';

interface ProjectFilters {
  status: 'all' | 'preLaunch' | 'underConstruction' | 'completed';
  search: string;
  sortBy: 'name' | 'status' | 'units' | 'date';
  sortOrder: 'asc' | 'desc';
}

export default function ProjectManagement() {
  const [filters, setFilters] = useState<ProjectFilters>({
    status: 'all',
    search: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [projectsList, setProjectsList] = useState<RealEstateProject[]>([]);

  // In a real app, this would come from an authentication context
  const currentConstructorId = 'VHGold-123';

  // Load projects from data
  useEffect(() => {
    // Filter projects by constructor ID
    const filteredProjects = projects.filter(project => 
      project.constructorId === currentConstructorId
    );
    setProjectsList(filteredProjects);
  }, [currentConstructorId]);

  const getStatusColor = (status: RealEstateProject['status']) => {
    switch (status) {
      case 'preLaunch': return 'bg-blue-100 text-blue-800';
      case 'underConstruction': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: RealEstateProject['status']) => {
    switch (status) {
      case 'preLaunch': return 'Lançamento';
      case 'underConstruction': return 'Em Construção';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Filter and sort projects
  const filteredProjects = projectsList.filter(project => {
    const matchesStatus = filters.status === 'all' || project.status === filters.status;
    const matchesSearch = project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      project.code.toLowerCase().includes(filters.search.toLowerCase()) ||
      project.address.city.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesSearch;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (filters.sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'units':
        comparison = a.totalUnits - b.totalUnits;
        break;
      case 'date':
        comparison = new Date(a.completionDate).getTime() - new Date(b.completionDate).getTime();
        break;
    }
    
    return filters.sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Empreendimentos</h1>
            <p className="text-gray-600">Gerencie seus empreendimentos e unidades</p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/developer/projects/map"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Map className="w-5 h-5" />
              <span>Ver no Mapa</span>
            </Link>
            <Link
              to="/developer/projects/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Novo Empreendimento</span>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar por nome, código ou endereço..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filtros</span>
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    status: e.target.value as ProjectFilters['status']
                  }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="all">Todos</option>
                  <option value="preLaunch">Lançamento</option>
                  <option value="underConstruction">Em Construção</option>
                  <option value="completed">Concluído</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordenar por
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    sortBy: e.target.value as ProjectFilters['sortBy']
                  }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="name">Nome</option>
                  <option value="status">Status</option>
                  <option value="units">Unidades</option>
                  <option value="date">Data</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordem
                </label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    sortOrder: e.target.value as ProjectFilters['sortOrder']
                  }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="asc">Crescente</option>
                  <option value="desc">Decrescente</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-3 bg-white p-8 rounded-lg shadow-lg text-center">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum empreendimento encontrado
              </h2>
              <p className="text-gray-600 mb-6">
                Não encontramos empreendimentos com os filtros selecionados.
              </p>
              <Link
                to="/developer/projects/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Criar Novo Empreendimento</span>
              </Link>
            </div>
          ) : (
            filteredProjects.map(project => (
              <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Project Image */}
                <div className="relative h-48 bg-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <Building2 className="w-16 h-16" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-500">Código: {project.code}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/developer/projects/${project.id}`} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link to={`/developer/projects/${project.id}/edit`} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {project.address.city}, {project.address.state}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        Entrega em {new Date(project.completionDate).toLocaleDateString('pt-BR', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm">
                        {project.totalUnits} unidades
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">
                        A partir de {formatCurrency(project.pricing.startingPrice)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      {project.transactionType === 'sale' ? (
                        <DollarSign className="w-4 h-4 text-green-600" />
                      ) : (
                        <Calendar className="w-4 h-4 text-blue-600" />
                      )}
                      <span className="text-sm">
                        {project.transactionType === 'sale' ? 'Venda' : 'Aluguel'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <Link
                      to={`/developer/projects/${project.id}/edit`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
                    >
                      <span>Ver Detalhes</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}