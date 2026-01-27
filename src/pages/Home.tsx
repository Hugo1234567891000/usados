import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Phone, Mail, MapPin } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import properties from '../data/properties';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const featuredProperties = properties.slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/imoveis?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[600px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1800" 
            alt="Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="w-full max-w-3xl">
            <h1 className="text-5xl font-bold text-white mb-6">Encontre o Imóvel dos Seus Sonhos</h1>
            <p className="text-xl text-white/90 mb-8">Especialistas em imóveis</p>
            
            {/* Enhanced Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Busque por endereço, bairro, cidade ou CEP..."
                  className="w-full pl-6 pr-24 py-4 bg-white rounded-lg text-lg shadow-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Buscar</span>
                </button>
              </div>
              <div className="absolute mt-2 text-white/80 text-sm">
                Ex: Moema, São Paulo, 04524-001
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Imóveis em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Sobre Nós</h2>
              <p className="text-gray-600 mb-6">
                Com mais de 15 anos de experiência no mercado imobiliário, nos especializamos em encontrar 
                o imóvel perfeito para nossos clientes. Nossa equipe de profissionais altamente qualificados 
                está pronta para ajudá-lo em cada etapa do processo.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="text-blue-600" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-600" />
                  <span>contato@imobiliaria.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-blue-600" />
                  <span>Av. Paulista, 1000 - São Paulo, SP</span>
                </div>
              </div>
            </div>
            <div className="relative h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800" 
                alt="Office" 
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}