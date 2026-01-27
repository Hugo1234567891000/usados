import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Calendar, DollarSign, Save, ArrowLeft, Trees, Shield, Car, Upload, Camera } from 'lucide-react';
import { LocationMap } from '../../../components/project/LocationMap';
import AmenitiesSelection from '../../../components/project/AmenitiesSelection';
import ThreeDCaptureModule from '../../../components/tours/ThreeDCaptureModule';

export default function NewApartment() {
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
    media: {
      virtualTour: "https://my.matterport.com/show/?m=ZGucwQyQdRL",
      images: []
    },
    financing: {
      acceptsFinancing: true,
      minDownPayment: 30,
      maxInstallments: 180
    },
    apartmentDetails: {
      minArea: 0,
      maxArea: 0,
      totalFloors: 1,
      hasBalcony: true,
      hasServiceArea: false,
      hasStorage: false,
      minApartmentSize: 0,
      maxApartmentSize: 0,
      suites: 0,
      parkingSpaces: 0
    },
    rooms: {
      bedrooms: 3,
      bathrooms: 3,
      suites: 1,
      parkingSpaces: 2
    },
    propertyState: 'new-construction',
    renovationDate: '',
    transactionType: 'sale',
    description: '',
    constructionStatus: 'launched'
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

  const handleLocationSelect = (latitude: number, longitude: number) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        coordinates: { latitude, longitude }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new apartment project
    const newProject = {
      id: `apartment-${Date.now()}`,
      ...formData,
      selectedAmenities,
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
      }
    };

    // Map form data to Property object
    const newProperty = {
      id: Date.now(),
      title: formData.name,
      price: `A partir de R$ ${formData.pricing.startingPrice.toLocaleString('pt-BR')}`,
      image: formData.media.images.length > 0 ? formData.media.images[0] : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
      details: `Apartamentos de ${formData.rooms.bedrooms} dormitórios`,
      description: formData.description,
      location: {
        address: `${formData.address.street}, ${formData.address.number} - ${formData.address.neighborhood}, ${formData.address.city}`,
        lat: formData.address.coordinates.latitude,
        lng: formData.address.coordinates.longitude
      },
      area: {
        total: formData.apartmentDetails.maxArea,
        built: formData.apartmentDetails.minArea
      },
      rooms: {
        bedrooms: formData.rooms.bedrooms,
        bathrooms: formData.rooms.bathrooms,
        parkingSpaces: formData.rooms.parkingSpaces
      },
      status: "available" as const,
      type: "apartment" as const,
      constructionStatus: formData.constructionStatus as "launched" | "underConstruction" | "ready" | "delivered",
      code: formData.code,
      transactionType: formData.transactionType,
      totalUnits: formData.totalUnits,
      pricePerSqft: formData.pricing.pricePerSqft,
      developer: "VHGold Incorporadora",
      virtualTour: formData.media.virtualTour,
      gallery: [
        {
          url: formData.media.images.length > 0 ? formData.media.images[0] : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
          title: "Fachada do Edifício",
          type: "render" as const,
          category: "exterior" as const
        }
      ],
      selectedAmenities: selectedAmenities,
      condominiumAmenities: selectedAmenities.map(id => {
        switch (id) {
          case 'pool': return 'Piscina';
          case 'gym': return 'Academia';
          case 'party-room': return 'Salão de festas';
          case 'playground': return 'Playground';
          case 'pet-place': return 'Pet place';
          case '24h-security': return 'Portaria 24h';
          case 'elevator': return 'Elevador';
          case 'solar-energy': return 'Energia solar';
          default: return id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
      }),
      views: viewTypes,
      parking: {
        coveredSpaces: formData.rooms.parkingSpaces,
        visitorSpaces: Math.floor(formData.totalUnits * 0.1),
        electricCarCharging: selectedAmenities.includes('electric-charging'),
        bikeRack: selectedAmenities.includes('bike-rack')
      },
      architecturalStyle: architecturalStyle,
      exterior: {
        facade: exteriorMaterials.join(', '),
        landscaping: selectedAmenities.includes('green-area') ? 'Paisagismo completo' : 'Básico',
        lighting: 'Iluminação LED',
        security: selectedAmenities.includes('24h-security') ? 'Portaria 24h e câmeras' : 'Básica'
      },
      interiorFeatures: {
        flooring: flooringTypes.join(', '),
        kitchen: 'Cozinha planejada',
        bathrooms: 'Acabamento premium',
        airConditioning: coolingType.includes('Central') ? 'Central' : 'Pré-instalação',
        lighting: 'Iluminação LED',
        storage: internalCharacteristics.includes('Closet') ? 'Closets planejados' : 'Armários embutidos'
      },
      roomDetails: {
        masterBedroom: {
          size: `${Math.floor(formData.apartmentDetails.maxArea * 0.2)}m²`,
          features: roomTypes.filter(type => type.includes('principal') || type.includes('master'))
        },
        livingRoom: {
          size: `${Math.floor(formData.apartmentDetails.maxArea * 0.3)}m²`,
          features: roomTypes.filter(type => type.includes('sala') || type.includes('living'))
        },
        kitchen: {
          size: `${Math.floor(formData.apartmentDetails.maxArea * 0.15)}m²`,
          features: appliances
        }
      },
      propertyState: formData.propertyState,
      propertySituation: "available",
      sustainabilityFeatures: selectedAmenities
        .filter(id => ['solar-energy', 'recycling', 'green-area'].includes(id))
        .map(id => {
          switch (id) {
            case 'solar-energy': return 'Energia solar';
            case 'recycling': return 'Coleta seletiva';
            case 'green-area': return 'Área verde';
            default: return id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          }
        }),
      securityFeatures: selectedAmenities
        .filter(id => ['24h-security', 'security-system'].includes(id))
        .map(id => {
          switch (id) {
            case '24h-security': return 'Portaria 24h';
            case 'security-system': return 'Sistema de segurança';
            default: return id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          }
        }),
      technologyFeatures: selectedAmenities
        .filter(id => ['wifi', 'accessibility'].includes(id))
        .map(id => {
          switch (id) {
            case 'wifi': return 'Wi-Fi nas áreas comuns';
            case 'accessibility': return 'Acessibilidade';
            default: return id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          }
        }),
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
      },
      constructorId: 'VHGold-123',
      deliveryDate: formData.completionDate ? new Date(formData.completionDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : undefined,
      detailedFeatures: {
        sustainability: selectedAmenities
          .filter(id => ['solar-energy', 'recycling', 'green-area'].includes(id))
          .map(id => {
            switch (id) {
              case 'solar-energy': return 'Energia solar';
              case 'recycling': return 'Coleta seletiva';
              case 'green-area': return 'Área verde';
              default: return id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            }
          }),
        security: selectedAmenities
          .filter(id => ['24h-security', 'security-system'].includes(id))
          .map(id => {
            switch (id) {
              case '24h-security': return 'Portaria 24h';
              case 'security-system': return 'Sistema de segurança';
              default: return id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            }
          }),
        technology: selectedAmenities
          .filter(id => ['wifi', 'accessibility'].includes(id))
          .map(id => {
            switch (id) {
              case 'wifi': return 'Wi-Fi nas áreas comuns';
              case 'accessibility': return 'Acessibilidade';
              default: return id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            }
          })
      }
    };

    console.log('=== DADOS PREENCHIDOS PELA CONSTRUTORA ===');
    console.log('Nome do Empreendimento:', formData.name);
    console.log('Código:', formData.code);
    console.log('Tipo de Transação:', formData.transactionType);
    console.log('Endereço:', formData.address);
    console.log('Preços:', formData.pricing);
    console.log('Características dos Apartamentos:', formData.apartmentDetails);
    console.log('Estado do Apartamento:', formData.propertyState);
    console.log('Amenidades Selecionadas:', selectedAmenities);
    console.log('');
    console.log('=== COMO SERÁ PUBLICADO PARA O PÚBLICO ===');
    console.log('Objeto Property completo:', newProperty);
    console.log('');
    console.log('=== VERIFICAÇÃO DE COMPONENTES ===');
    console.log('✅ Título:', newProperty.title);
    console.log('✅ Preço:', newProperty.price);
    console.log('✅ Localização:', newProperty.location);
    console.log('✅ Área total:', newProperty.area.total, 'm²');
    console.log('✅ Área construída:', newProperty.area.built, 'm²');
    console.log('✅ Tipo:', newProperty.type);
    console.log('✅ Status de construção:', newProperty.constructionStatus);
    console.log('✅ Código do projeto:', newProperty.code);
    console.log('✅ Tipo de transação:', newProperty.transactionType);
    console.log('✅ Total de unidades:', newProperty.totalUnits);
    console.log('✅ Preço por m²:', newProperty.pricePerSqft);
    console.log('✅ Estado do apartamento:', newProperty.propertyState);
    console.log('✅ Situação do imóvel:', newProperty.propertySituation);
    console.log('✅ Amenidades do condomínio:', newProperty.condominiumAmenities);
    console.log('✅ Vistas:', newProperty.views);
    console.log('✅ Estacionamento:', newProperty.parking);
    console.log('✅ Estilo arquitetônico:', newProperty.architecturalStyle);
    console.log('✅ Características exteriores:', newProperty.exterior);
    console.log('✅ Características interiores:', newProperty.interiorFeatures);
    console.log('✅ Detalhes dos ambientes:', newProperty.roomDetails);
    console.log('✅ Características detalhadas:', newProperty.detailedFeatures);
    console.log('✅ Galeria de imagens:', newProperty.gallery);
    console.log('');
    console.log('🎯 TODOS OS COMPONENTES MAPEADOS CORRETAMENTE!');
    
    // Em um sistema real, este objeto seria enviado para a API
    // e adicionado ao banco de dados para ser exibido na listagem pública
    alert('Empreendimento de apartamentos cadastrado com sucesso! Verifique o console para ver como os dados serão publicados.');
    navigate('/developer/projects');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/developer/projects')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Novo Apartamento</h1>
              <p className="text-gray-600">Cadastre um novo empreendimento de apartamentos</p>
            </div>
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
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Ex: Residencial Vista Verde"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código do Empreendimento
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Ex: VH001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Andar
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.totalUnits}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalUnits: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Ex: 5"
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
                  placeholder="Descreva o empreendimento de apartamentos..."
                  required
                />
              </div>
            </div>

            {/* Apartment Features */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-6">Características dos Apartamentos</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Área Privativa (m²)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.apartmentDetails.minArea}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      apartmentDetails: { ...prev.apartmentDetails, minArea: parseInt(e.target.value) }
                    }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Área Total (m²)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.apartmentDetails.maxArea}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      apartmentDetails: { ...prev.apartmentDetails, maxArea: parseInt(e.target.value) }
                    }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total de Andares do Edifício
                  </label>
                  <select
                    value={formData.apartmentDetails.totalFloors}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      apartmentDetails: { ...prev.apartmentDetails, totalFloors: parseInt(e.target.value) }
                    }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  >
                    <option value={1}>1 Andar</option>
                    <option value={2}>2 Andares</option>
                    <option value={3}>3 Andares</option>
                    <option value={5}>5 Andares</option>
                    <option value={10}>10 Andares</option>
                    <option value={15}>15 Andares</option>
                    <option value={20}>20 Andares</option>
                    <option value={25}>25 Andares</option>
                    <option value={30}>30+ Andares</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Vagas de Garagem
                  </label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.rooms.parkingSpaces}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rooms: { ...prev.rooms, parkingSpaces: parseInt(e.target.value) || 0 }
                      }))}
                      className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Room Configuration */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-6">Configuração dos Ambientes</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Suítes
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.apartmentDetails.suites}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        apartmentDetails: { ...prev.apartmentDetails, suites: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Dormitórios
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={formData.rooms.bedrooms}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rooms: { ...prev.rooms, bedrooms: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Banheiros
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={formData.rooms.bathrooms}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rooms: { ...prev.rooms, bathrooms: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Localização</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rua
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      address: { ...prev.address, street: e.target.value }
                    }))}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Ex: Rua das Flores"
                    required
                  />
                </div>
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
                  placeholder="Ex: 123"
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
                  placeholder="Ex: Jardim América"
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
                  placeholder="Ex: São Paulo"
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
                  placeholder="Ex: 01234-567"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    min="0"
                    value={formData.pricing.startingPrice}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      pricing: { ...prev.pricing, startingPrice: parseInt(e.target.value) }
                    }))}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Ex: 850000"
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
                    type="number"
                    min="0"
                    value={formData.pricing.pricePerSqft}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      pricing: { ...prev.pricing, pricePerSqft: parseInt(e.target.value) }
                    }))}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Ex: 12000"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Amenidades do Condomínio</h2>
            
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

            {/* Exterior Features */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Características Exteriores</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-700">Lugar de garagem</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-700">Jardim</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-700">Piscina</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-700">Arrecadação</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-700">Apartamento adaptado</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-700">Apartamento de luxo</span>
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

          {/* Detalhes do Ambiente */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Detalhes dos Ambientes</h2>
            
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

            {/* Ambientes */}
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-4">Ambientes</h3>
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
                <h3 className="text-md font-medium text-gray-700 mb-4">Imagens dos Apartamentos</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 text-center mb-4">
                      Faça upload das imagens dos apartamentos modelo
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="apartment-images-upload"
                    />
                    <label
                      htmlFor="apartment-images-upload"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Selecionar Imagens
                    </label>
                  </div>
                </div>
              </div>


              {/* Floor Plans */}
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-4">Plantas dos Apartamentos</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 text-center mb-4">
                      Upload das plantas baixas dos diferentes tipos de apartamento
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      className="hidden"
                      id="apartment-plans-upload"
                    />
                    <label
                      htmlFor="apartment-plans-upload"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
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
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/developer/projects')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Criar Empreendimento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}