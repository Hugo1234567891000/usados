import React, { useState } from 'react';
import { Building2, MapPin, Home, Calendar, DollarSign, CheckCircle, XCircle, Eye, ArrowRight } from 'lucide-react';

interface PendingProperty {
  id: string;
  title: string;
  developer: string;
  price: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  type: 'house' | 'apartment' | 'commercial';
  constructionStatus: 'launched' | 'underConstruction' | 'ready';
  deliveryDate?: string;
  images: string[];
  floorPlans: {
    title: string;
    bedrooms: number;
    area: number;
    price: string;
  }[];
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Mock data - replace with actual data from your backend
const mockProperties: PendingProperty[] = [
  {
    id: '1',
    title: 'Residencial Vista Verde',
    developer: 'Construtora ABC',
    price: 'A partir de R$ 450.000',
    location: {
      address: 'Rua das Flores, 123 - Jardim América, São Paulo',
      lat: -23.5505,
      lng: -46.6333
    },
    type: 'apartment',
    constructionStatus: 'underConstruction',
    deliveryDate: '2025-12',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
    ],
    floorPlans: [
      {
        title: 'Planta Tipo A',
        bedrooms: 2,
        area: 65,
        price: 'R$ 450.000'
      },
      {
        title: 'Planta Tipo B',
        bedrooms: 3,
        area: 85,
        price: 'R$ 580.000'
      }
    ],
    submittedAt: '2024-03-15T10:30:00',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Edifício Central Park',
    developer: 'Incorporadora XYZ',
    price: 'A partir de R$ 750.000',
    location: {
      address: 'Av. Paulista, 1000 - Bela Vista, São Paulo',
      lat: -23.5505,
      lng: -46.6333
    },
    type: 'apartment',
    constructionStatus: 'launched',
    deliveryDate: '2026-06',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
    ],
    floorPlans: [
      {
        title: 'Planta Tipo A',
        bedrooms: 3,
        area: 95,
        price: 'R$ 750.000'
      },
      {
        title: 'Planta Tipo B',
        bedrooms: 4,
        area: 120,
        price: 'R$ 950.000'
      }
    ],
    submittedAt: '2024-03-14T15:45:00',
    status: 'pending'
  }
];

export default function AdminPropertyApproval() {
  const [properties, setProperties] = useState<PendingProperty[]>(mockProperties);
  const [selectedProperty, setSelectedProperty] = useState<PendingProperty | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleApprove = (propertyId: string) => {
    setProperties(prev => prev.map(prop => 
      prop.id === propertyId ? { ...prop, status: 'approved' } : prop
    ));
    setShowDetails(false);
  };

  const handleReject = (propertyId: string) => {
    setProperties(prev => prev.map(prop => 
      prop.id === propertyId ? { ...prop, status: 'rejected' } : prop
    ));
    setShowDetails(false);
  };

  const filteredProperties = properties.filter(prop => 
    filter === 'all' || prop.status === filter
  );

  const getStatusColor = (status: PendingProperty['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = (status: PendingProperty['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
    }
  };

  const getPropertyTypeIcon = (type: PendingProperty['type']) => {
    switch (type) {
      case 'house':
        return Home;
      case 'apartment':
      case 'commercial':
        return Building2;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Aprovação de Empreendimentos</h1>
          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {status === 'all' ? 'Todos' : 
                 status === 'pending' ? 'Pendentes' :
                 status === 'approved' ? 'Aprovados' : 'Rejeitados'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empreendimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Construtora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProperties.map((property) => {
                const TypeIcon = getPropertyTypeIcon(property.type);
                return (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <TypeIcon className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {property.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {property.price}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.developer}</div>
                      <div className="text-sm text-gray-500">
                        Enviado em {new Date(property.submittedAt).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{property.location.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getStatusColor(property.status)
                      }`}>
                        {getStatusText(property.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowDetails(true);
                            setCurrentImageIndex(0);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        {property.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(property.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleReject(property.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Property Details Modal */}
        {showDetails && selectedProperty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Detalhes do Empreendimento
                  </h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {/* Image Gallery */}
                <div className="relative aspect-video mb-6 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={selectedProperty.images[currentImageIndex]}
                    alt={`Imagem ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {selectedProperty.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {selectedProperty.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{selectedProperty.title}</p>
                          <p className="text-sm text-gray-500">{selectedProperty.developer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Preço</p>
                          <p className="text-sm text-gray-500">{selectedProperty.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Localização</p>
                          <p className="text-sm text-gray-500">{selectedProperty.location.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Previsão de Entrega</p>
                          <p className="text-sm text-gray-500">
                            {selectedProperty.deliveryDate ? 
                              new Date(selectedProperty.deliveryDate).toLocaleDateString('pt-BR', { 
                                month: 'long', 
                                year: 'numeric' 
                              }) : 
                              'Não informado'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Plantas Disponíveis</h3>
                    <div className="space-y-4">
                      {selectedProperty.floorPlans.map((plan, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{plan.title}</p>
                            <p className="text-sm text-gray-500">
                              {plan.bedrooms} dorm · {plan.area}m² · {plan.price}
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedProperty.status === 'pending' && (
                  <div className="mt-8 flex justify-end gap-4">
                    <button
                      onClick={() => handleReject(selectedProperty.id)}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Rejeitar
                    </button>
                    <button
                      onClick={() => handleApprove(selectedProperty.id)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Aprovar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}