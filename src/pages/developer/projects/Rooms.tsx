import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Calendar, DollarSign, Save, ArrowLeft, Briefcase, Users, Wifi, Upload, Camera } from 'lucide-react';
import { LocationMap } from '../../../components/project/LocationMap';
import AmenitiesSelection from '../../../components/project/AmenitiesSelection';
import ThreeDCaptureModule from '../../../components/tours/ThreeDCaptureModule';

export default function Rooms() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: {
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      postalCode: '',
      coordinates: {
        latitude: -23.5505,
        longitude: -46.6333
      }
    },
    completionDate: '',
    totalUnits: 0,
    pricing: {
      startingPrice: 0,
      maxPrice: 0,
      pricePerSqft: 0
    },
    paymentOptions: {
      acceptsFinancing: true,
      minDownPayment: 30,
      maxInstallments: 180
    },
    commercialFeatures: {
      minArea: 0,
      maxArea: 0,
      hasReception: true,
      hasMeetingRooms: true,
      hasParking: true,
      hasAirConditioning: true,
      businessHours: '8h às 18h',
      allowedActivities: [] as string[]
    },
    rooms: {
      bedrooms: 0,
      bathrooms: 2,
      suites: 0,
      parkingSpaces: 2
    }
  });
  
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showTourCapture, setShowTourCapture] = useState(false);
  const [tourId, setTourId] = useState<string | null>(null);
  
  // New detailed filter states
  const [roofTypes, setRoofTypes] = useState<string[]>([]);
  const [viewTypes, setViewTypes] = useState<string[]>([]);
  const [parkingTypes, setParkingTypes] = useState<string[]>([]);
  const [architecturalStyle, setArchitecturalStyle] = useState('');
  const [exteriorMaterials, setExteriorMaterials] = useState<string[]>([]);
  const [internalCharacteristics, setInternalCharacteristics] = useState<string[]>([]);
  const [appliances, setAppliances] = useState<string[]>([]);
  const [coolingType, setCoolingType] = useState<string[]>([]);
  const [heatingType, setHeatingType] = useState<string[]>([]);
  const [heatingFuel, setHeatingFuel] = useState<string[]>([]);
  const [flooringTypes, setFlooringTypes] = useState<string[]>([]);
  const [basementType, setBasementType] = useState('');
  const [roomTypes, setRoomTypes] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new commercial project
    const newProject = {
      id: `commercial-${Date.now()}`,
      ...formData,
    };
    console.log('✅ Data de entrega:', newProperty.deliveryDate);

    // Create new property for public display - using REAL form data
    const newProperty: Property = {
      id: Date.now(),
      title: formData.name,
      price: `A partir de R$ ${formData.pricing.startingPrice.toLocaleString('pt-BR')}`,
      image: formData.media.images.length > 0 ? formData.media.images[0] : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
      details: `Salas comerciais de ${formData.commercialSpaces.minArea}m² a ${formData.commercialSpaces.maxArea}m²`,
      description: formData.description,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
      },
      constructorId: 'VHGold-123',
      detailedFilters: {
        roofTypes,
        viewTypes,
        parkingTypes,
        architecturalStyle,
        exteriorMaterials,
        internalCharacteristics,
        appliances,
        coolingType,
        heatingType,
        heatingFuel,
        flooringTypes,
        basementType,
        roomTypes
      },
      virtualTour: formData.media.virtualTour || undefined,
      gallery: formData.media.images.map((imageUrl, index) => ({
        url: imageUrl,
        title: `Imagem ${index + 1}`,
        type: "render" as const,
        category: index === 0 ? "exterior" as const : "interior" as const
      }))
    };
    console.log('✅ Tour virtual:', newProperty.virtualTour);
    
    // Adicionar à lista global de propriedades
    addProperty(newProperty);
    
    alert('Empreendimento comercial cadastrado com sucesso! Verifique o console para ver como os dados serão publicados. O imóvel agora está visível na listagem pública.');
    navigate('/developer/projects');
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        coordinates: {
          latitude: lat,
          longitude: lng
        }
      }
    }));
  };

  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value.replace(/\D/g, '')) / 100;
    return numValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleAddActivity = (activity: string) => {
    if (activity && !formData.commercialFeatures.allowedActivities.includes(activity)) {
      setFormData(prev => ({
        ...prev,
        commercialFeatures: {
          ...prev.commercialFeatures,
          allowedActivities: [...prev.commercialFeatures.allowedActivities, activity]
        }
      }));
    }
  };

  const handleRemoveActivity = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      commercialFeatures: {
        ...prev.commercialFeatures,
        allowedActivities: prev.commercialFeatures.allowedActivities.filter(a => a !== activity)
      }
    }));
  };

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/developer/projects')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Novo Empreendimento - Empresarial</h1>
            <p className="text-gray-600">Cadastre um novo empreendimento comercial/empresarial</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Empreendimento
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Ex: Centro Empresarial Paulista"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código do Projeto
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Ex: VH011"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de Transação
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="transactionType"
                      value="sale"
                      checked={formData.transactionType === 'sale'}
                      onChange={(e) => setFormData(prev => ({ ...prev, transactionType: e.target.value as 'sale' | 'rent' }))}
                      className="w-4 h-4 text-blue-600"
                    />
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Venda</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="transactionType"
                      value="rent"
                      checked={formData.transactionType === 'rent'}
                      onChange={(e) => setFormData(prev => ({ ...prev, transactionType: e.target.value as 'sale' | 'rent' }))}
                      className="w-4 h-4 text-blue-600"
                    />
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Aluguel</span>
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Descreva o empreendimento comercial..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Commercial Specifications */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Especificações Comerciais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Área Total (m²)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.commercialFeatures.minArea}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    commercialFeatures: { ...prev.commercialFeatures, minArea: parseInt(e.target.value) }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Área Privativa (m²)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.commercialFeatures.maxArea}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    commercialFeatures: { ...prev.commercialFeatures, maxArea: parseInt(e.target.value) }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número do Andar
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.commercialFeatures.floorNumber || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    commercialFeatures: { ...prev.commercialFeatures, floorNumber: parseInt(e.target.value) }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Ex: 5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Salas
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.commercialFeatures.numberOfRooms || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    commercialFeatures: { ...prev.commercialFeatures, numberOfRooms: parseInt(e.target.value) }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Ex: 3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Banheiros
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.commercialFeatures.numberOfBathrooms || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    commercialFeatures: { ...prev.commercialFeatures, numberOfBathrooms: parseInt(e.target.value) }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Ex: 2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Copa
                </label>
                <select
                  value={formData.commercialFeatures.hasCopa ? 'sim' : 'nao'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    commercialFeatures: { ...prev.commercialFeatures, hasCopa: e.target.value === 'sim' }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horário de Funcionamento
                </label>
                <input
                  type="text"
                  value={formData.commercialFeatures.businessHours}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    commercialFeatures: { ...prev.commercialFeatures, businessHours: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Ex: 8h às 18h"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Suítes
              </label>
              <select
                value={formData.rooms.suites}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  rooms: { ...prev.rooms, suites: parseInt(e.target.value) }
                }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4 ou mais</option>
              </select>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="text-md font-medium text-gray-700">Características Padrão</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.commercialFeatures.hasReception}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      commercialFeatures: { ...prev.commercialFeatures, hasReception: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700">Recepção</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.commercialFeatures.hasMeetingRooms}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      commercialFeatures: { ...prev.commercialFeatures, hasMeetingRooms: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Salas de Reunião</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.commercialFeatures.hasAirConditioning}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      commercialFeatures: { ...prev.commercialFeatures, hasAirConditioning: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Ar Condicionado</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.commercialFeatures.hasParking}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      commercialFeatures: { ...prev.commercialFeatures, hasParking: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Estacionamento</span>
                </label>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Endereço</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rua
                </label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, street: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número
                </label>
                <input
                  type="text"
                  value={formData.address.number}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, number: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro
                </label>
                <input
                  type="text"
                  value={formData.address.neighborhood}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, neighborhood: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, city: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, state: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Ex: SP"
                  maxLength={2}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CEP
                </label>
                <input
                  type="text"
                  value={formData.address.postalCode}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, postalCode: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="00000-000"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localização no Mapa
              </label>
              <LocationMap
                latitude={formData.address.coordinates.latitude}
                longitude={formData.address.coordinates.longitude}
                onLocationSelect={handleLocationSelect}
                address={`${formData.address.street}, ${formData.address.number}, ${formData.address.neighborhood}, ${formData.address.city}, ${formData.address.state}, Brazil`}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Preços</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.pricing.maxPrice ? formatCurrency(formData.pricing.maxPrice.toString()) : ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value.replace(/\D/g, '')) / 100;
                      setFormData(prev => ({
                        ...prev,
                        pricing: { ...prev.pricing, maxPrice: value }
                      }));
                    }}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="R$ 0,00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço por m²
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.pricing.pricePerSqft ? formatCurrency(formData.pricing.pricePerSqft.toString()) : ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value.replace(/\D/g, '')) / 100;
                      setFormData(prev => ({
                        ...prev,
                        pricing: { ...prev.pricing, pricePerSqft: value }
                      }));
                    }}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="R$ 0,00"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Infraestrutura do Edifício</h2>
            
            {/* Property Situation */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Situação do Imóvel</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="propertySituation"
                    value="available"
                    defaultChecked
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Disponível, sem qualquer restrição</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="propertySituation"
                    value="bare-ownership"
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-700">Nua-propriedade</span>
                    <div className="relative group">
                      <button
                        type="button"
                        className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold hover:bg-blue-200 transition-colors"
                      >
                        ?
                      </button>
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        <div className="font-semibold mb-1">O que significa nua-propriedade</div>
                        <div>Comprar um imóvel em nua-propriedade significa comprar o direito de propriedade, enquanto outra pessoa (o usufrutuário) continua a utilizá-lo, geralmente de forma vitalícia, sem que o novo proprietário possa usufruir dele.</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="propertySituation"
                    value="rented"
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Arrendado, com inquilinos</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="propertySituation"
                    value="illegally-occupied"
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Ocupado ilegalmente</span>
                </label>
              </div>
            </div>

            {/* Property State */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Estado do Imóvel</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="propertyState"
                    value="new-construction"
                    checked={formData.propertyState === 'new-construction'}
                    onChange={(e) => setFormData(prev => ({ ...prev, propertyState: e.target.value }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Nova construção</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="propertyState"
                    value="good-condition"
                    checked={formData.propertyState === 'good-condition'}
                    onChange={(e) => setFormData(prev => ({ ...prev, propertyState: e.target.value }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Bom estado</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="propertyState"
                    value="needs-renovation"
                    checked={formData.propertyState === 'needs-renovation'}
                    onChange={(e) => setFormData(prev => ({ ...prev, propertyState: e.target.value }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Para recuperar</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="propertyState"
                    value="renovated"
                    checked={formData.propertyState === 'renovated'}
                    onChange={(e) => setFormData(prev => ({ ...prev, propertyState: e.target.value }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Reformado</span>
                </label>
              </div>
              
              {/* Conditional Date Input for Renovated */}
              {formData.propertyState === 'renovated' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data da Reforma
                  </label>
                  <div className="relative max-w-xs">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={formData.renovationDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, renovationDate: e.target.value }))}
                      className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Informe quando a reforma foi concluída
                  </p>
                </div>
              )}
            </div>

            {/* Interior Features */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Características Interiores</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-700">Ar condicionado</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-700">Armários embutidos</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-700">Elevador</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-700">Varanda e terraço</span>
                </label>
              </div>
            </div>

            <AmenitiesSelection
              onChange={setSelectedAmenities}
              initialSelected={selectedAmenities}
            />
          </div>

          {/* Detailed Filters */}
          {/* Teto */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Teto</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Asfalto', 'Construído', 'Composição', 'Metal', 'Shake / Shingle', 'Ardósia', 'Telha', 'Outro'].map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={roofTypes.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setRoofTypes(prev => [...prev, option]);
                      } else {
                        setRoofTypes(prev => prev.filter(type => type !== option));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Vista */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Vista</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Cidade', 'Montanha', 'Parque', 'Territorial', 'Água', 'Nenhum'].map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={viewTypes.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setViewTypes(prev => [...prev, option]);
                      } else {
                        setViewTypes(prev => prev.filter(type => type !== option));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Estacionamento */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Estacionamento</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Garagem coberta', 'Garagem - Anexa', 'Garagem - Separada', 'Fora da rua', 'Na rua', 'Nenhum'].map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={parkingTypes.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setParkingTypes(prev => [...prev, option]);
                      } else {
                        setParkingTypes(prev => prev.filter(type => type !== option));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Estilo Arquitetônico */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Estilo Arquitetônico</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Bungalô', 'Cabo Cod', 'Colonial', 'Contemporâneo', 'Artesão', 'Francês', 'Georgiano', 'Sótão', 'Moderno', 'Rainha Ana / Vitoriana', 'Rancho / Rambler', 'Estilo Santa Fé / Pueblo', 'Espanhol', 'Nível dividido', 'Tudor', 'Outro'].map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="architecturalStyle"
                    value={option}
                    checked={architecturalStyle === option}
                    onChange={(e) => setArchitecturalStyle(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Exterior */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Exterior</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Tijolo', 'Estuque', 'Cimento / Concreto', 'Vinil', 'Composição', 'Madeira', 'Metal', 'Produtos de madeira', 'Telha', 'Pedra', 'Outro'].map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exteriorMaterials.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setExteriorMaterials(prev => [...prev, option]);
                      } else {
                        setExteriorMaterials(prev => prev.filter(type => type !== option));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Características Internas */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Características Internas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Sótão', 'Cabo pronto', 'Ventiladores de teto', 'Janelas de vidro duplo/proteção contra tempestades', 'Lareira', 'Sistema de intercomunicação', 'Banheira de hidromassagem', 'Apartamento para sogra', 'Sistema de segurança', 'Clarabóias', 'Teto abobadado', 'Bar molhado', 'Com fio'].map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={internalCharacteristics.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setInternalCharacteristics(prev => [...prev, option]);
                      } else {
                        setInternalCharacteristics(prev => prev.filter(type => type !== option));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Detalhes do Quarto */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Detalhes do Quarto</h2>
            
            {/* Eletrodomésticos */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Eletrodomésticos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Máquina de lavar louça', 'Secador', 'Freezer', 'Descarte de lixo', 'Micro-ondas', 'Fogão / Forno', 'Frigorífico', 'Compactador de lixo', 'Máquina de lavar'].map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={appliances.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAppliances(prev => [...prev, option]);
                        } else {
                          setAppliances(prev => prev.filter(type => type !== option));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tipo de Resfriamento */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Tipo de Resfriamento</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Central', 'Evaporativo', 'Geotérmica', 'Refrigeração', 'Parede', 'Outro', 'Nenhum'].map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={coolingType.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCoolingType(prev => [...prev, option]);
                        } else {
                          setCoolingType(prev => prev.filter(type => type !== option));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tipo de Aquecimento */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Tipo de Aquecimento</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Rodapé', 'Ar forçado', 'Geotérmica', 'Bomba de calor', 'Radiante', 'Forno', 'Parede', 'Outro', 'Nenhum'].map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={heatingType.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setHeatingType(prev => [...prev, option]);
                        } else {
                          setHeatingType(prev => prev.filter(type => type !== option));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Combustível de Aquecimento */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Combustível de Aquecimento</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Carvão', 'Solar', 'Elétrico', 'Madeira / Pellets', 'Gás', 'Óleo', 'Propano / Butano', 'Nenhum'].map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={heatingFuel.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setHeatingFuel(prev => [...prev, option]);
                        } else {
                          setHeatingFuel(prev => prev.filter(type => type !== option));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Revestimento de Pavimentos */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Revestimento de Pavimentos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Tapete', 'Ardósia', 'Concreto', 'Madeira macia', 'Madeira dura', 'Telha', 'Laminado', 'Linóleo / Vinil', 'Outro'].map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={flooringTypes.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFlooringTypes(prev => [...prev, option]);
                        } else {
                          setFlooringTypes(prev => prev.filter(type => type !== option));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Porão */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Porão</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Finalizado', 'Inacabado', 'Parcialmente concluído', 'Nenhum'].map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="basementType"
                      value={option}
                      checked={basementType === option}
                      onChange={(e) => setBasementType(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quartos */}
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-4">Quartos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Cantinho do café da manhã', 'Escritório', 'Sala de jantar', 'Despensa', 'Sala de família', 'Sala de recreação', 'Lavanderia', 'Oficina', 'Biblioteca', 'Solário / Átrio', 'Banheiro principal', 'Sala de sol', 'Sala de lama', 'Closet'].map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={roomTypes.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRoomTypes(prev => [...prev, option]);
                        } else {
                          setRoomTypes(prev => prev.filter(type => type !== option));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Mídia do Empreendimento</h2>
            
            <div className="space-y-6">
              {/* Images */}
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-4">Imagens das Salas</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 text-center mb-4">
                      Faça upload das imagens das salas modelo
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="commercial-images-upload"
                    />
                    <label
                      htmlFor="commercial-images-upload"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Selecionar Imagens
                    </label>
                  </div>
                </div>
              </div>


              {/* Floor Plans */}
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-4">Plantas das Salas</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 text-center mb-4">
                      Upload das plantas baixas dos diferentes tipos de sala
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      className="hidden"
                      id="commercial-plans-upload"
                    />
                    <label
                      htmlFor="commercial-plans-upload"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                    >
                      Selecionar Plantas
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Tour Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Camera className="w-6 h-6 text-blue-600" />
                <div>
                  <h2 className="text-lg font-semibold">Tour Virtual 3D (Opcional)</h2>
                  <p className="text-sm text-gray-600">
                    Adicione fotos 360° para criar uma experiência imersiva em AR e VR
                  </p>
                </div>
              </div>
              {!showTourCapture && !tourId && (
                <button
                  type="button"
                  onClick={() => setShowTourCapture(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Adicionar Tour 3D
                </button>
              )}
            </div>

            {showTourCapture && !tourId && (
              <ThreeDCaptureModule
                onComplete={(id) => {
                  setTourId(id);
                  setShowTourCapture(false);
                }}
                onSkip={() => setShowTourCapture(false)}
              />
            )}

            {tourId && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Camera className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-900">Tour 3D Adicionado!</p>
                      <p className="text-sm text-green-700">O tour será vinculado ao salvar o projeto</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTourId(null);
                      setShowTourCapture(true);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Refazer
                  </button>
                </div>
              </div>
            )}

            {!showTourCapture && !tourId && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Camera className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">
                  Nenhum tour adicionado
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Clique no botão acima para capturar ou adicionar um tour 3D
                </p>
                <div className="text-xs text-gray-500">
                  <p>✓ Aumenta o engajamento em até 300%</p>
                  <p>✓ Suporta AR (smartphones) e VR (óculos)</p>
                  <p>✓ Pode ser adicionado depois</p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-5 h-5" />
              Salvar Empreendimento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}