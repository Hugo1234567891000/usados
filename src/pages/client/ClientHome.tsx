import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bell, ArrowRight, Building2, MapPin, Calendar } from 'lucide-react';

export default function ClientHome() {
  // Featured properties data
  const featuredProperties = [
    {
      id: 1,
      name: "Edifício Horizonte - Moema",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
      price: "A partir de R$ 750.000",
      location: "Moema, São Paulo",
      deliveryDate: "Dezembro 2025"
    },
    {
      id: 2,
      name: "Residencial Jardins - Pinheiros",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400",
      price: "A partir de R$ 890.000",
      location: "Pinheiros, São Paulo",
      deliveryDate: "Março 2026"
    },
    {
      id: 3,
      name: "Vila Verde - Alto de Pinheiros",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=400",
      price: "A partir de R$ 2.500.000",
      location: "Alto de Pinheiros, São Paulo",
      deliveryDate: "Dezembro 2025"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo, João!</h1>
        <p className="text-gray-600">
          Explore nossos empreendimentos e salve seus imóveis favoritos.
        </p>
      </div>

      {/* Featured Properties */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Empreendimentos em Destaque</h2>
          <Link
            to="/imoveis"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Ver todos
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProperties.map(property => (
            <div key={property.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">{property.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Entrega: {property.deliveryDate}</span>
                  </div>
                </div>
                <p className="text-lg font-semibold text-blue-600 mt-2">{property.price}</p>
                <Link
                  to={`/imoveis/${property.id}`}
                  className="block w-full mt-3 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver Detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold">8</span>
          </div>
          <h3 className="font-medium">Empreendimentos</h3>
          <p className="text-sm text-gray-500">Disponíveis</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Heart className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold">1</span>
          </div>
          <h3 className="font-medium">Imóveis Favoritos</h3>
          <p className="text-sm text-gray-500">Salvos</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <MapPin className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold">5</span>
          </div>
          <h3 className="font-medium">Regiões</h3>
          <p className="text-sm text-gray-500">Disponíveis</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Bell className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold">2</span>
          </div>
          <h3 className="font-medium">Notificações</h3>
          <p className="text-sm text-gray-500">1 não lida</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Atividade Recente</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Ver todas
          </button>
        </div>

        <div className="space-y-4">
          {[
            {
              title: 'Imóvel favoritado',
              description: 'Você adicionou Edifício Horizonte aos favoritos',
              date: '20/03/2024',
              type: 'favorite'
            },
            {
              title: 'Nova busca realizada',
              description: 'Você pesquisou por imóveis em Moema',
              date: '15/03/2024',
              type: 'search'
            },
            {
              title: 'Perfil atualizado',
              description: 'Suas informações de contato foram atualizadas',
              date: '10/03/2024',
              type: 'profile'
            }
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium">{activity.title}</h3>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <span className="text-xs text-gray-500">{activity.date}</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}