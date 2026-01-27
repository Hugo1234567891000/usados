import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, Bed, Bath, Car, Ruler } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import PropertyMap from '../components/PropertyMap';
import properties from '../data/properties';

export default function Properties() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    type: 'all',
    priceRange: 'all',
    bedrooms: 'all',
    location: 'all'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const filteredProperties = properties.filter(property => {
    const matchesSearch = searchQuery === '' || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filters.type === 'all' || property.type === filters.type;
    
    const matchesBedrooms = filters.bedrooms === 'all' || 
      property.rooms.bedrooms.toString() === filters.bedrooms;
    
    return matchesSearch && matchesType && matchesBedrooms;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filter above
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Imóveis Disponíveis</h1>
          <p className="text-gray-600">{filteredProperties.length} imóveis encontrados</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Grade
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'map'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Mapa
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Busque por endereço, bairro, cidade..."
              className="w-full pl-12 pr-4 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Imóvel
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="apartment">Apartamento</option>
              <option value="house">Casa</option>
              <option value="commercial">Comercial</option>
              <option value="building">Edifício</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Faixa de Preço
            </label>
            <select
              value={filters.priceRange}
              onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="all">Todas</option>
              <option value="0-500000">Até R$ 500.000</option>
              <option value="500000-1000000">R$ 500.000 - R$ 1.000.000</option>
              <option value="1000000-2000000">R$ 1.000.000 - R$ 2.000.000</option>
              <option value="2000000+">Acima de R$ 2.000.000</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dormitórios
            </label>
            <select
              value={filters.bedrooms}
              onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="1">1 dormitório</option>
              <option value="2">2 dormitórios</option>
              <option value="3">3 dormitórios</option>
              <option value="4">4+ dormitórios</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Localização
            </label>
            <select
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="all">Todas</option>
              <option value="moema">Moema</option>
              <option value="pinheiros">Pinheiros</option>
              <option value="jardins">Jardins</option>
              <option value="morumbi">Morumbi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="h-[600px]">
          <PropertyMap properties={filteredProperties} />
        </div>
      )}

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum imóvel encontrado com os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
}