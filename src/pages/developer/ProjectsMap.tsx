import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Building2, MapPin, Calendar, DollarSign, ArrowUpRight, Search, Filter, Plus, Layers, Map as MapIcon, Satellite } from 'lucide-react';
import { RealEstateProject } from '../../types/property';
import projects from '../../data/projects';

// Fix default marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';

// Set up default marker icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Map view control component
function MapViewController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

// Custom marker icon
const createMarkerIcon = (status: RealEstateProject['status']) => {
  const getColor = () => {
    switch (status) {
      case 'preLaunch': return '#3b82f6'; // blue-500
      case 'underConstruction': return '#f59e0b'; // amber-500
      case 'completed': return '#10b981'; // emerald-500
      default: return '#6b7280'; // gray-500
    }
  };

  const markerHtml = `
    <div class="relative">
      <div class="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center border-2" style="border-color: ${getColor()}">
        <div class="w-4 h-4 rounded-full" style="background-color: ${getColor()}"></div>
      </div>
    </div>
  `;

  return new DivIcon({
    html: markerHtml,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

type MapType = 'street' | 'satellite';

export default function ProjectsMap() {
  // In a real app, this would come from an authentication context
  const currentConstructorId = 'VHGold-123';
  
  // Filter projects to only show those belonging to the current constructor
  const [projectsList, setProjectsList] = useState<RealEstateProject[]>([]);
  
  useEffect(() => {
    // Filter projects by constructor ID
    const filteredProjects = projects.filter(project => 
      project.constructorId === currentConstructorId
    );
    setProjectsList(filteredProjects);
  }, [currentConstructorId]);
  
  const [selectedProject, setSelectedProject] = useState<RealEstateProject | null>(null);
  const [mapType, setMapType] = useState<MapType>('street');
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.5505, -46.6333]); // São Paulo
  const [mapZoom, setMapZoom] = useState(12);
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Calculate map bounds based on project locations
  useEffect(() => {
    if (projectsList.length > 0) {
      // Find projects with coordinates
      const projectsWithCoordinates = projectsList.filter(p => p.address.coordinates);
      
      if (projectsWithCoordinates.length > 0) {
        // If there's only one project, center on it
        if (projectsWithCoordinates.length === 1) {
          const project = projectsWithCoordinates[0];
          setMapCenter([
            project.address.coordinates!.latitude,
            project.address.coordinates!.longitude
          ]);
          setMapZoom(14);
        } else {
          // For multiple projects, we would calculate bounds
          // But for simplicity, we'll just use a fixed center and zoom
          // In a real app, you would calculate the bounds that contain all projects
          setMapCenter([-23.5505, -46.6333]); // São Paulo center
          setMapZoom(11);
        }
      }
    }
  }, [projectsList]);

  // Filter projects based on filters
  const filteredProjects = projectsList.filter(project => {
    const matchesStatus = filters.status === 'all' || project.status === filters.status;
    const matchesSearch = project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         project.code.toLowerCase().includes(filters.search.toLowerCase()) ||
                         project.address.city.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handle project selection
  const handleProjectSelect = (project: RealEstateProject) => {
    setSelectedProject(project);
    if (project.address.coordinates) {
      setMapCenter([project.address.coordinates.latitude, project.address.coordinates.longitude]);
      setMapZoom(15);
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Get status text
  const getStatusText = (status: RealEstateProject['status']) => {
    switch (status) {
      case 'preLaunch': return 'Lançamento';
      case 'underConstruction': return 'Em Construção';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  // Get status color
  const getStatusColor = (status: RealEstateProject['status']) => {
    switch (status) {
      case 'preLaunch': return 'bg-blue-100 text-blue-800';
      case 'underConstruction': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Toggle map type
  const toggleMapType = () => {
    setMapType(current => current === 'street' ? 'satellite' : 'street');
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mapa de Empreendimentos</h1>
            <p className="text-gray-600">Visualize seus empreendimentos no mapa</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg shadow-sm transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filtros</span>
            </button>
            <button
              onClick={() => window.location.href = '/developer/projects/new'}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Novo Empreendimento</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Buscar por nome, código ou cidade..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="all">Todos os Status</option>
                <option value="preLaunch">Lançamento</option>
                <option value="underConstruction">Em Construção</option>
                <option value="completed">Concluídos</option>
              </select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Seus Empreendimentos ({filteredProjects.length})</h2>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-16rem)]">
              {filteredProjects.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">Nenhum empreendimento encontrado</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredProjects.map(project => (
                    <div
                      key={project.id}
                      onClick={() => handleProjectSelect(project)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedProject?.id === project.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                          <p className="text-sm text-gray-500">Código: {project.code}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {project.address.city}, {project.address.state}
                            </span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="text-sm">
                          <span className="text-gray-600">Unidades:</span> {project.totalUnits}
                        </div>
                        <div className="text-sm font-medium">
                          {formatCurrency(project.pricing.startingPrice)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-[calc(100vh-16rem)]">
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url={mapType === 'street' 
                    ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                  }
                />
                
                <MapViewController center={mapCenter} zoom={mapZoom} />
                
                {filteredProjects.map(project => {
                  if (!project.address.coordinates) return null;
                  
                  return (
                    <Marker
                      key={project.id}
                      position={[project.address.coordinates.latitude, project.address.coordinates.longitude]}
                      icon={createMarkerIcon(project.status)}
                      eventHandlers={{
                        click: () => handleProjectSelect(project)
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-medium text-lg">{project.name}</h3>
                          <p className="text-sm text-gray-600">{project.address.street}, {project.address.number}</p>
                          <p className="text-sm text-gray-600">{project.address.neighborhood}, {project.address.city} - {project.address.state}</p>
                          
                          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Status:</span> {getStatusText(project.status)}
                            </div>
                            <div>
                              <span className="text-gray-600">Unidades:</span> {project.totalUnits}
                            </div>
                            <div>
                              <span className="text-gray-600">Entrega:</span> {new Date(project.completionDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                            </div>
                            <div>
                              <span className="text-gray-600">Preço:</span> {formatCurrency(project.pricing.startingPrice)}
                            </div>
                          </div>
                          
                          <div className="mt-3 flex justify-end">
                            <a
                              href={`/developer/projects/${project.id}/edit`}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <span>Detalhes</span>
                              <ArrowUpRight className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
              
              {/* Map Controls */}
              <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
                <button
                  onClick={toggleMapType}
                  className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                  title={mapType === 'street' ? 'Mudar para vista de satélite' : 'Mudar para vista de mapa'}
                >
                  {mapType === 'street' ? (
                    <Satellite className="w-6 h-6 text-gray-700" />
                  ) : (
                    <MapIcon className="w-6 h-6 text-gray-700" />
                  )}
                </button>
                <button
                  onClick={() => {
                    // Reset view to fit all projects
                    if (projectsList.length > 0) {
                      setMapCenter([-23.5505, -46.6333]);
                      setMapZoom(11);
                    }
                  }}
                  className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                  title="Centralizar mapa"
                >
                  <Layers className="w-6 h-6 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Project Details */}
        {selectedProject && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{selectedProject.name}</h2>
                <p className="text-gray-600">Código: {selectedProject.code}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProject.status)}`}>
                {getStatusText(selectedProject.status)}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Informações Básicas</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm">{selectedProject.address.street}, {selectedProject.address.number}</p>
                      <p className="text-sm">{selectedProject.address.neighborhood}, {selectedProject.address.city} - {selectedProject.address.state}</p>
                      <p className="text-sm">CEP: {selectedProject.address.postalCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm">Entrega prevista: {new Date(selectedProject.completionDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm">Total de unidades: {selectedProject.totalUnits}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Preços</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm">A partir de: {formatCurrency(selectedProject.pricing.startingPrice)}</p>
                      <p className="text-sm">Até: {formatCurrency(selectedProject.pricing.maxPrice)}</p>
                      <p className="text-sm">Preço por m²: {formatCurrency(selectedProject.pricing.pricePerSqft)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Ações</h3>
                <div className="space-y-2">
                  <a
                    href={`/developer/projects/${selectedProject.id}/edit`}
                    className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                  >
                    Editar Empreendimento
                  </a>
                  <a
                    href={`/developer/projects/${selectedProject.id}/units`}
                    className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center"
                  >
                    Gerenciar Unidades
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Descrição</h3>
              <p className="text-sm text-gray-600">{selectedProject.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}