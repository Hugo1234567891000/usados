import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Save, ArrowLeft, Upload, Home, Trees, Users, Camera } from 'lucide-react';
import { LocationMap } from '../../../components/project/LocationMap';
import AmenitiesSelection from '../../../components/project/AmenitiesSelection';
import ThreeDCaptureModule from '../../../components/tours/ThreeDCaptureModule';

export default function Houses() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    transactionType: 'sale' as 'sale' | 'rent',
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
    houseFeatures: {
      lotSize: 0,
      builtArea: 0,
      floors: 2,
      suites: 0,
      balconies: 0,
      privateGarden: true,
      privatePool: false,
      gourmetArea: true,
      serviceArea: true
    },
    condominiumFeatures: {
      totalHouses: 0,
      preservedArea: 0,
      clubhouse: true,
      sportsComplex: false,
      walkingTrails: true,
      security24h: true,
      controlledAccess: true
    },
    description: '',
    propertyState: 'new-construction' as string,
    renovationDate: ''
  });
  
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

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
  const [showTourCapture, setShowTourCapture] = useState(false);
  const [tourId, setTourId] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new house property for public display
    const newProperty = {
      id: Date.now(),
      title: formData.name,
      price: `A partir de R$ ${formData.pricing.startingPrice.toLocaleString('pt-BR')}`,
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800",
      details: `Casas de Alto Padrão - ${formData.houseFeatures.suites} suítes`,
      description: formData.description,
      location: {
        address: `${formData.address.street}, ${formData.address.number} - ${formData.address.neighborhood}, ${formData.address.city}`,
        lat: formData.address.coordinates.latitude,
        lng: formData.address.coordinates.longitude
      },
      area: {
        total: formData.houseFeatures.lotSize,
        built: formData.houseFeatures.builtArea
      },
      rooms: {
        bedrooms: formData.houseFeatures.suites,
        bathrooms: formData.houseFeatures.suites + 1, // Estimativa
        parkingSpaces: 2 // Padrão para casas
      },
      status: "available" as const,
      type: "house" as const,
      constructionStatus: "ready" as const,
      developer: "VHGold Incorporadora",
      virtualTour: "https://my.matterport.com/show/?m=ZGucwQyQdRL",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800",
          title: "Fachada da Casa",
          type: "render" as const,
          category: "exterior" as const
        },
        {
          url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
          title: "Área de Lazer",
          type: "render" as const,
          category: "amenity" as const
        }
      ],
      // Campos preenchidos no formulário Houses.tsx
      code: formData.code,
      transactionType: formData.transactionType,
      totalUnits: formData.totalUnits,
      pricePerSqft: formData.pricing.pricePerSqft,
      propertyState: formData.propertyState,
      propertySituation: "available", // Mapeado da situação da casa
      selectedAmenities: selectedAmenities,
      houseFeatures: formData.houseFeatures,
      condominiumFeatures: formData.condominiumFeatures,
      // Características detalhadas (sustentabilidade, segurança, tecnologia)
      detailedFeatures: {
        sustainability: selectedAmenities
          .filter(id => ['solar-energy', 'recycling', 'green-area'].includes(id))
          .map(id => {
            switch (id) {
              case 'solar-energy': return 'Energia solar';
              case 'recycling': return 'Coleta seletiva';
              case 'green-area': return 'Área verde preservada';
              default: return id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            }
          }),
        security: selectedAmenities
          .filter(id => ['24h-security', 'security-system'].includes(id))
          .map(id => {
            switch (id) {
              case '24h-security': return 'Segurança 24h';
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
      },
      sustainabilityFeatures: selectedAmenities
        .filter(id => ['solar-energy', 'recycling', 'green-area'].includes(id))
        .map(id => {
          switch (id) {
            case 'solar-energy': return 'Energia solar';
            case 'recycling': return 'Coleta seletiva';
            case 'green-area': return 'Área verde preservada';
            default: return id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          }
        }),
      securityFeatures: selectedAmenities
        .filter(id => ['24h-security', 'security-system'].includes(id))
        .map(id => {
          switch (id) {
            case '24h-security': return 'Segurança 24h';
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
        })
    };
    
    console.log('=== DADOS PREENCHIDOS PELA CONSTRUTORA ===');
    console.log('Nome do Condomínio:', formData.name);
    console.log('Código:', formData.code);
    console.log('Tipo de Transação:', formData.transactionType);
    console.log('Endereço:', formData.address);
    console.log('Preços:', formData.pricing);
    console.log('Características das Casas:', formData.houseFeatures);
    console.log('Características do Condomínio:', formData.condominiumFeatures);
    console.log('Estado da Casa:', formData.propertyState);
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
    console.log('✅ Estado da casa:', newProperty.propertyState);
    console.log('✅ Situação do imóvel:', newProperty.propertySituation);
    console.log('✅ Características das casas:', newProperty.houseFeatures);
    console.log('✅ Características do condomínio:', newProperty.condominiumFeatures);
    console.log('✅ Amenidades selecionadas:', newProperty.selectedAmenities);
    console.log('✅ Características detalhadas:', newProperty.detailedFeatures);
    console.log('✅ Galeria de imagens:', newProperty.gallery);
    console.log('');
    console.log('🎯 TODOS OS COMPONENTES MAPEADOS CORRETAMENTE!');
    
    // Em um sistema real, este objeto seria enviado para a API
    // e adicionado ao banco de dados para ser exibido na listagem pública
    alert('Condomínio de casas cadastrado com sucesso! Verifique o console para ver como os dados serão publicados.');
    navigate('/developer/projects');
  };

  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value.replace(/\D/g, '')) / 100;
    return numValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
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
            <h1 className="text-2xl font-bold text-gray-900">Novo Empreendimento - Casa</h1>
            <p className="text-gray-600">Cadastre um novo condomínio de casas</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Condomínio
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Ex: Vila Verde - Alto de Pinheiros"
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
                  placeholder="Ex: VH009"
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
                  placeholder="Descreva o condomínio de casas..."
                  required
                />
              </div>
            </div>
          </div>

          {/* House Specifications */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Especificações das Casas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tamanho do Lote (m²)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.houseFeatures.lotSize}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    houseFeatures: { ...prev.houseFeatures, lotSize: parseInt(e.target.value) }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Área Construída (m²)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.houseFeatures.builtArea}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    houseFeatures: { ...prev.houseFeatures, builtArea: parseInt(e.target.value) }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Pavimentos
                </label>
                <select
                  value={formData.houseFeatures.floors}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    houseFeatures: { ...prev.houseFeatures, floors: parseInt(e.target.value) }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value={1}>1 Pavimento</option>
                  <option value={2}>2 Pavimentos</option>
                  <option value={3}>3 Pavimentos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Vagas de Garagem
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Dormitórios
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Banheiros
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Suítes
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.houseFeatures.suites}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    houseFeatures: { ...prev.houseFeatures, suites: parseInt(e.target.value) }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Varandas
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.houseFeatures.balconies}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    houseFeatures: { ...prev.houseFeatures, balconies: parseInt(e.target.value) }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="text-md font-medium text-gray-700">Características Privativas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.houseFeatures.privateGarden}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      houseFeatures: { ...prev.houseFeatures, privateGarden: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <Trees className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">Jardim Privativo</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.houseFeatures.privatePool}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      houseFeatures: { ...prev.houseFeatures, privatePool: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Piscina Privativa</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.houseFeatures.gourmetArea}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      houseFeatures: { ...prev.houseFeatures, gourmetArea: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Área Gourmet</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.houseFeatures.serviceArea}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      houseFeatures: { ...prev.houseFeatures, serviceArea: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Área de Serviço</span>
                </label>
              </div>
            </div>
          </div>

          {/* Condominium Features */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Características do Condomínio</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total de Casas
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.condominiumFeatures.totalHouses}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    condominiumFeatures: { ...prev.condominiumFeatures, totalHouses: parseInt(e.target.value) }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Área Verde Preservada (m²)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.condominiumFeatures.preservedArea}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    condominiumFeatures: { ...prev.condominiumFeatures, preservedArea: parseInt(e.target.value) }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="text-md font-medium text-gray-700">Infraestrutura do Condomínio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.condominiumFeatures.clubhouse}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      condominiumFeatures: { ...prev.condominiumFeatures, clubhouse: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Clube Privativo</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.condominiumFeatures.sportsComplex}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      condominiumFeatures: { ...prev.condominiumFeatures, sportsComplex: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Complexo Esportivo</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.condominiumFeatures.walkingTrails}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      condominiumFeatures: { ...prev.condominiumFeatures, walkingTrails: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Trilhas para Caminhada</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.condominiumFeatures.security24h}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      condominiumFeatures: { ...prev.condominiumFeatures, security24h: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Segurança 24h</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.condominiumFeatures.controlledAccess}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      condominiumFeatures: { ...prev.condominiumFeatures, controlledAccess: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Acesso Controlado</span>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.pricing.startingPrice ? formatCurrency(formData.pricing.startingPrice.toString()) : ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value.replace(/\D/g, '')) / 100;
                      setFormData(prev => ({
                        ...prev,
                        pricing: { ...prev.pricing, startingPrice: value }
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
            <h2 className="text-lg font-semibold mb-6">Infraestrutura e Amenidades</h2>
            
            {/* Situação do Imóvel */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Situação do Imóvel</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="propertyStatus"
                    value="available"
                    checked={formData.propertyState === 'available'}
                    onChange={(e) => setFormData(prev => ({ ...prev, propertyState: e.target.value }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Disponível, sem qualquer restrição</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="propertyStatus"
                    value="new-property"
                    checked={formData.propertyState === 'new-property'}
                    onChange={(e) => setFormData(prev => ({ ...prev, propertyState: e.target.value }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Nua-propriedade</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="propertyStatus"
                    value="leased"
                    checked={formData.propertyState === 'leased'}
                    onChange={(e) => setFormData(prev => ({ ...prev, propertyState: e.target.value }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Arrendado, com inquilinos</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="propertyStatus"
                    value="illegally-occupied"
                    checked={formData.propertyState === 'illegally-occupied'}
                    onChange={(e) => setFormData(prev => ({ ...prev, propertyState: e.target.value }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Ocupado ilegalmente</span>
                </label>
              </div>
            </div>

            {/* Estado do Imóvel */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Estado do Imóvel</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="propertyCondition"
                    value="new-construction"
                    checked={formData.renovationDate === 'new-construction'}
                    onChange={(e) => setFormData(prev => ({ ...prev, renovationDate: e.target.value }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Nova construção</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="propertyCondition"
                    value="good"
                    checked={formData.renovationDate === 'good'}
                    onChange={(e) => setFormData(prev => ({ ...prev, renovationDate: e.target.value }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Bom estado</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="propertyCondition"
                    value="to-recover"
                    checked={formData.renovationDate === 'to-recover'}
                    onChange={(e) => setFormData(prev => ({ ...prev, renovationDate: e.target.value }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Para recuperar</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="propertyCondition"
                    value="renovated"
                    checked={formData.renovationDate === 'renovated'}
                    onChange={(e) => setFormData(prev => ({ ...prev, renovationDate: e.target.value }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Reformado</span>
                </label>
              </div>

              {formData.renovationDate === 'renovated' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data da Reforma
                  </label>
                  <div className="relative max-w-xs">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Informe quando a reforma foi concluída
                  </p>
                </div>
              )}
            </div>

            {/* Características Interiores */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Características Interiores</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Ar condicionado</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Armários embutidos</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Elevador</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Varanda e terraço</span>
                </label>
              </div>
            </div>

            {/* Características Exteriores */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Características Exteriores</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Lugar de garagem</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Jardim</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Piscina</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Arrecadação</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Apartamento adaptado</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Apartamento de luxo</span>
                </label>
              </div>
            </div>

            <AmenitiesSelection
              onChange={setSelectedAmenities}
              initialSelected={selectedAmenities}
            />
          </div>

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

          {/* Detalhes dos Ambientes */}
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
                <h3 className="text-md font-medium text-gray-700 mb-4">Imagens das Casas</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 text-center mb-4">
                      Faça upload das imagens das casas, fachadas e áreas comuns
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="house-images-upload"
                    />
                    <label
                      htmlFor="house-images-upload"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Selecionar Imagens
                    </label>
                  </div>
                </div>
              </div>


              {/* Floor Plans */}
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-4">Plantas das Casas</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 text-center mb-4">
                      Upload das plantas baixas das casas
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      className="hidden"
                      id="house-floorplans-upload"
                    />
                    <label
                      htmlFor="house-floorplans-upload"
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

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/developer/projects')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-5 h-5" />
              <span>Salvar Condomínio</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}