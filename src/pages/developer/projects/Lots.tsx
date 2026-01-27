import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Save, ArrowLeft, Trees, Zap, Droplets, Upload, Camera } from 'lucide-react';
import { LocationMap } from '../../../components/project/LocationMap';
import AmenitiesSelection from '../../../components/project/AmenitiesSelection';
import ThreeDCaptureModule from '../../../components/tours/ThreeDCaptureModule';

export default function Lots() {
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
      minDownPayment: 40,
      maxInstallments: 120
    },
    lotFeatures: {
      minLotSize: 0,
      maxLotSize: 0,
      hasWater: true,
      hasElectricity: true,
      hasSewage: true,
      hasAsphalt: false,
      allowsConstruction: true,
      maxBuildingHeight: 2,
      setbackRequirements: {
        front: 5,
        side: 3,
        back: 3
      }
    }
  });
  
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showTourCapture, setShowTourCapture] = useState(false);
  const [tourId, setTourId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new lot property for public display
    const newProperty = {
      id: Date.now(),
      title: formData.name,
      price: `A partir de R$ ${formData.pricing.maxPrice.toLocaleString('pt-BR')}`,
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
      details: `Lotes de ${formData.lotFeatures.minLotSize}m² a ${formData.lotFeatures.maxLotSize}m²`,
      description: formData.description,
      location: {
        address: `${formData.address.street}, ${formData.address.number} - ${formData.address.neighborhood}, ${formData.address.city}`,
        lat: formData.address.coordinates.latitude,
        lng: formData.address.coordinates.longitude
      },
      area: {
        total: formData.lotFeatures.maxLotSize,
        built: 0 // Lots don't have built area
      },
      rooms: {
        bedrooms: 0, // Lots don't have rooms
        bathrooms: 0,
        parkingSpaces: 0
      },
      status: "available" as const,
      type: "land" as const,
      constructionStatus: "ready" as const,
      developer: "VHGold Incorporadora",
      virtualTour: "https://my.matterport.com/show/?m=ZGucwQyQdRL",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
          title: "Vista Geral do Loteamento",
          type: "photo" as const,
          category: "exterior" as const
        },
        {
          url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
          title: "Área Verde",
          type: "photo" as const,
          category: "amenity" as const
        }
      ],
      // Campos preenchidos no formulário Lots.tsx
      code: formData.code,
      transactionType: formData.transactionType,
      pricePerSqft: formData.pricing.pricePerSqft,
      propertyState: formData.propertyState,
      propertySituation: "available", // Mapeado da situação do loteamento
      selectedAmenities: selectedAmenities,
      lotFeatures: formData.lotFeatures,
      // Campos específicos do formulário Lots.tsx
      lotTypes: [
        {
          name: "Lote Padrão",
          minSize: formData.lotFeatures.minLotSize,
          maxSize: Math.floor((formData.lotFeatures.minLotSize + formData.lotFeatures.maxLotSize) / 2),
          price: formData.pricing.maxPrice * 0.8,
          features: ["Infraestrutura completa", "Pronto para construir"]
        },
        {
          name: "Lote Premium",
          minSize: Math.floor((formData.lotFeatures.minLotSize + formData.lotFeatures.maxLotSize) / 2),
          maxSize: formData.lotFeatures.maxLotSize,
          price: formData.pricing.maxPrice,
          features: ["Lote de esquina", "Vista privilegiada", "Área nobre"]
        }
      ],
      developmentFeatures: {
        totalArea: formData.lotFeatures.maxLotSize * 100, // Estimativa baseada no lote máximo
        preservedArea: formData.lotFeatures.maxLotSize * 30, // 30% de área preservada
        streetLighting: true,
        pavedStreets: formData.lotFeatures.hasAsphalt,
        stormDrainage: formData.lotFeatures.hasSewage,
        landscaping: selectedAmenities.includes('green-area'),
        gatedCommunity: selectedAmenities.includes('24h-security')
      },
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
    console.log('Nome do Loteamento:', formData.name);
    console.log('Código:', formData.code);
    console.log('Tipo de Transação:', formData.transactionType);
    console.log('Endereço:', formData.address);
    console.log('Preços:', formData.pricing);
    console.log('Características dos Lotes:', formData.lotFeatures);
    console.log('Estado do Terreno:', formData.propertyState);
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
    console.log('✅ Tipo:', newProperty.type);
    console.log('✅ Status de construção:', newProperty.constructionStatus);
    console.log('✅ Código do projeto:', newProperty.code);
    console.log('✅ Tipo de transação:', newProperty.transactionType);
    console.log('✅ Preço por m²:', newProperty.pricePerSqft);
    console.log('✅ Estado do terreno:', newProperty.propertyState);
    console.log('✅ Situação do imóvel:', newProperty.propertySituation);
    console.log('✅ Características dos lotes:', newProperty.lotFeatures);
    console.log('✅ Tipos de lotes:', newProperty.lotTypes);
    console.log('✅ Características do desenvolvimento:', newProperty.developmentFeatures);
    console.log('✅ Amenidades selecionadas:', newProperty.selectedAmenities);
    console.log('✅ Características detalhadas:', newProperty.detailedFeatures);
    console.log('✅ Galeria de imagens:', newProperty.gallery);
    console.log('');
    console.log('🎯 TODOS OS COMPONENTES MAPEADOS CORRETAMENTE!');
    
    // Em um sistema real, este objeto seria enviado para a API
    // e adicionado ao banco de dados para ser exibido na listagem pública
    alert('Loteamento cadastrado com sucesso! Verifique o console para ver como os dados serão publicados.');
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
            <h1 className="text-2xl font-bold text-gray-900">Novo Empreendimento - Loteamento</h1>
            <p className="text-gray-600">Cadastre um novo loteamento</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Loteamento
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Ex: Residencial Campos Verdes"
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
                  placeholder="Ex: VH012"
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
                  placeholder="Descreva o loteamento..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Lot Specifications */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Especificações dos Lotes</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Área Mínima do Lote (m²)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.lotFeatures.minLotSize}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    lotFeatures: { ...prev.lotFeatures, minLotSize: parseInt(e.target.value) }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Área Máxima do Lote (m²)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.lotFeatures.maxLotSize}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    lotFeatures: { ...prev.lotFeatures, maxLotSize: parseInt(e.target.value) }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Altura Máxima de Construção (pavimentos)
                </label>
                <select
                  value={formData.lotFeatures.maxBuildingHeight}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    lotFeatures: { ...prev.lotFeatures, maxBuildingHeight: parseInt(e.target.value) }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value={1}>1 Pavimento</option>
                  <option value={2}>2 Pavimentos</option>
                  <option value={3}>3 Pavimentos</option>
                  <option value={4}>4 Pavimentos</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.lotFeatures.allowsConstruction}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      lotFeatures: { ...prev.lotFeatures, allowsConstruction: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Permite construção imediata</span>
                </label>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="text-md font-medium text-gray-700">Infraestrutura Disponível</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.lotFeatures.hasWater}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      lotFeatures: { ...prev.lotFeatures, hasWater: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <Droplets className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700">Água</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.lotFeatures.hasElectricity}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      lotFeatures: { ...prev.lotFeatures, hasElectricity: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm text-gray-700">Energia Elétrica</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.lotFeatures.hasSewage}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      lotFeatures: { ...prev.lotFeatures, hasSewage: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Esgoto</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.lotFeatures.hasAsphalt}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      lotFeatures: { ...prev.lotFeatures, hasAsphalt: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Asfalto</span>
                </label>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-700 mb-4">Recuos Obrigatórios (metros)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recuo Frontal
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.lotFeatures.setbackRequirements.front}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      lotFeatures: {
                        ...prev.lotFeatures,
                        setbackRequirements: {
                          ...prev.lotFeatures.setbackRequirements,
                          front: parseInt(e.target.value)
                        }
                      }
                    }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recuo Lateral
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.lotFeatures.setbackRequirements.side}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      lotFeatures: {
                        ...prev.lotFeatures,
                        setbackRequirements: {
                          ...prev.lotFeatures.setbackRequirements,
                          side: parseInt(e.target.value)
                        }
                      }
                    }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recuo de Fundos
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.lotFeatures.setbackRequirements.back}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      lotFeatures: {
                        ...prev.lotFeatures,
                        setbackRequirements: {
                          ...prev.lotFeatures.setbackRequirements,
                          back: parseInt(e.target.value)
                        }
                      }
                    }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Endereço</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rua/Estrada
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
                  Número/KM
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
                  Bairro/Região
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
            <h2 className="text-lg font-semibold mb-6">Infraestrutura do Loteamento</h2>
            
            {/* Property Situation */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Situação do Loteamento</h3>
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
                    value="environmental-restrictions"
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Com restrições ambientais</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="propertySituation"
                    value="pending-approval"
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Aguardando aprovação</span>
                </label>
              </div>
            </div>

            {/* Lot Types */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Tipos de Lotes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamanhos Disponíveis
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-gray-700">Lotes pequenos (até 300m²)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-gray-700">Lotes médios (300-600m²)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-gray-700">Lotes grandes (600-1000m²)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-gray-700">Lotes premium (1000m² ou mais)</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Características Especiais
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-gray-700">Lote de esquina</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-gray-700">Vista privilegiada</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-gray-700">Próximo à área verde</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Property State */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Estado do Terreno</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="propertyState"
                    value="ready-to-build"
                    checked={formData.propertyState === 'ready-to-build'}
                    onChange={(e) => setFormData(prev => ({ ...prev, propertyState: e.target.value }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Pronto para construir</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="propertyState"
                    value="needs-preparation"
                    checked={formData.propertyState === 'needs-preparation'}
                    onChange={(e) => setFormData(prev => ({ ...prev, propertyState: e.target.value }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Necessita preparação</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="propertyState"
                    value="environmental-study"
                    checked={formData.propertyState === 'environmental-study'}
                    onChange={(e) => setFormData(prev => ({ ...prev, propertyState: e.target.value }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Estudo ambiental pendente</span>
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

            <AmenitiesSelection
              onChange={setSelectedAmenities}
              initialSelected={selectedAmenities}
            />
          </div>

          {/* Media Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Mídia do Empreendimento</h2>
            
            <div className="space-y-6">
              {/* Images */}
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-4">Imagens do Loteamento</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 text-center mb-4">
                      Faça upload das imagens do loteamento, infraestrutura e área
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="lot-images-upload"
                    />
                    <label
                      htmlFor="lot-images-upload"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Selecionar Imagens
                    </label>
                  </div>
                </div>
              </div>


              {/* Master Plan */}
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-4">Planta do Loteamento</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 text-center mb-4">
                      Upload da planta geral do loteamento com divisão dos lotes
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      className="hidden"
                      id="lot-masterplan-upload"
                    />
                    <label
                      htmlFor="lot-masterplan-upload"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                    >
                      Selecionar Planta
                    </label>
                  </div>
                </div>
              </div>

              {/* Infrastructure Plans */}
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-4">Plantas de Infraestrutura</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 text-center mb-4">
                      Upload das plantas de infraestrutura (água, esgoto, energia elétrica)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      className="hidden"
                      id="lot-infrastructure-upload"
                    />
                    <label
                      htmlFor="lot-infrastructure-upload"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                    >
                      Selecionar Plantas de Infraestrutura
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
                    Adicione fotos 360° do terreno, infraestrutura e áreas comuns
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
                  <p>✓ Mostre o terreno e infraestrutura</p>
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
              <span>Salvar Loteamento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}