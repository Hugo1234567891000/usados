import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bed, Bath, Car, Ruler, MapPin, Calendar, Building2, Home, Eye, Heart, Share2, Phone, Mail, ArrowLeft,
  ChevronDown, ChevronUp, Waves as Pool, Dumbbell, PartyPopper, Baby, Utensils, Trophy as Football, 
  ChefHat, Dog, Trees as Tree, Shield, Lock, Calculator as Elevator, Bike, Sun, Power, Recycle, 
  Wifi, Accessibility, ArrowUpRight, ArrowRightCircle, HardHat, Droplets, Zap, CheckCircle, XCircle
} from 'lucide-react';
import VirtualTour from './VirtualTour';
import PropertyGallery from './PropertyGallery';
import PropertyMap from './PropertyMap';
import { Property } from '../types/property';

interface PropertyDetailsProps {
  property: Property;
  has3DTour?: boolean;
  onOpen3DTour?: () => void;
}

export default function PropertyDetails({ property, has3DTour, onOpen3DTour }: PropertyDetailsProps) {
  const navigate = useNavigate();
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  
  const showVirtualTourButton = property.virtualTour != null;

  // Mapeamento dos IDs das amenidades para nomes e ícones
  const amenitiesMap = {
    // Lazer e Convivência
    'pool': { name: 'Piscina', icon: Pool, category: 'leisure' },
    'gym': { name: 'Academia', icon: Dumbbell, category: 'leisure' },
    'party-room': { name: 'Salão de festas', icon: PartyPopper, category: 'leisure' },
    'playground': { name: 'Playground', icon: Baby, category: 'leisure' },
    'bbq': { name: 'Churrasqueira', icon: Utensils, category: 'leisure' },
    'sports-court': { name: 'Quadra poliesportiva', icon: Football, category: 'leisure' },
    'gourmet': { name: 'Espaço gourmet', icon: ChefHat, category: 'leisure' },
    'pet-place': { name: 'Pet place', icon: Dog, category: 'leisure' },
    'green-area': { name: 'Área verde', icon: Tree, category: 'leisure' },

    // Infraestrutura e Segurança
    '24h-security': { name: 'Portaria 24h', icon: Shield, category: 'infrastructure' },
    'security-system': { name: 'Sistema de segurança', icon: Lock, category: 'infrastructure' },
    'elevator': { name: 'Elevador', icon: Elevator, category: 'infrastructure' },
    'covered-parking': { name: 'Vagas de garagem cobertas', icon: Car, category: 'infrastructure' },
    'visitor-parking': { name: 'Vagas para visitantes', icon: Car, category: 'infrastructure' },
    'bike-rack': { name: 'Bicicletário', icon: Bike, category: 'infrastructure' },

    // Sustentabilidade e Tecnologia
    'solar-energy': { name: 'Energia solar', icon: Sun, category: 'sustainability' },
    'generator': { name: 'Gerador de energia', icon: Power, category: 'sustainability' },
    'recycling': { name: 'Coleta seletiva', icon: Recycle, category: 'sustainability' },
    'wifi': { name: 'Wi-Fi nas áreas comuns', icon: Wifi, category: 'sustainability' },
    'accessibility': { name: 'Acessibilidade', icon: Accessibility, category: 'sustainability' }
  };

  // Função para obter amenidades por categoria
  const getAmenitiesByCategory = (category: string) => {
    if (!property.selectedAmenities) return [];
    
    return property.selectedAmenities
      .map(id => amenitiesMap[id as keyof typeof amenitiesMap])
      .filter(amenity => amenity && amenity.category === category);
  };

  const getPropertyTypeName = (type: Property['type']) => {
    switch (type) {
      case 'apartment':
        return 'Apartamento';
      case 'house':
        return 'Casa';
      case 'commercial':
        return 'Empresarial';
      case 'land':
        return 'Lote';
      case 'building':
        return 'Edifício';
      default:
        return 'Imóvel';
    }
  };

  const getPropertyStateName = (state?: string) => {
    switch (state) {
      case 'new-construction':
        return 'Nova construção';
      case 'renovated':
        return 'Reformado';
      case 'ready-to-build':
        return 'Pronto para construir';
      case 'needs-preparation':
        return 'Necessita preparação';
      case 'environmental-study':
        return 'Estudo ambiental pendente';
      default:
        return state;
    }
  };

  const getPropertySituationName = (situation?: string) => {
    switch (situation) {
      case 'available':
        return 'Disponível, sem qualquer restrição';
      case 'bare-ownership':
        return 'Nua-propriedade';
      case 'environmental-restrictions':
        return 'Com restrições ambientais';
      case 'pending-approval':
        return 'Aguardando aprovação';
      default:
        return situation;
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  return (
    <>
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
      </div>

    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="relative h-96">
        {showVirtualTour ? (
          <VirtualTour tourUrl={property.virtualTour} />
        ) : (
          <PropertyGallery
            images={property.gallery || []}
            has3DTour={has3DTour}
            onOpen3DTour={onOpen3DTour}
          />
        )}
        
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full">
          {property.price}
        </div>
        
        {property.deliveryDate && (
          <div className="absolute bottom-4 right-4 bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <HardHat className="w-4 h-4 text-blue-600" />
            <span>Entrega em {property.deliveryDate}</span>
          </div>
        )}
        
        {/* Tour Virtual Button - Left Side */}
        <div className="absolute bottom-4 left-4">
          {showVirtualTourButton && (
            <button
              onClick={() => setShowVirtualTour(!showVirtualTour)}
              className="bg-white/90 hover:bg-white text-gray-900 px-6 py-3 rounded-full transition-colors flex items-center gap-2 shadow-lg"
            >
              <span>{showVirtualTour ? 'Ver Fotos' : 'Tour Virtual 360°'}</span>
            </button>
          )}
        </div>
        
        {/* Property State and Situation Badges - Right Side */}
        <div className="absolute bottom-4 right-4 flex items-center gap-4">
          {/* Estado do Imóvel */}
          {(property.type === 'commercial' ? property.commercialPropertyState : property.propertyState) && (
            <div className="relative group">
              <div className="px-3 py-2 rounded-full text-sm flex items-center gap-2 bg-white/90 text-gray-900 shadow-lg cursor-help hover:bg-green-100 transition-colors">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="font-medium">
                  {property.type === 'commercial' ? 
                    getPropertyStateName(property.commercialPropertyState) : 
                    getPropertyStateName(property.propertyState)
                  }
                </span>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Estado do Imóvel
              </div>
            </div>
          )}
          
          {/* Situação do Imóvel */}
          {(property.type === 'commercial' ? property.commercialPropertySituation : property.propertySituation) && (
            <div className="relative group">
              <div className="px-3 py-2 rounded-full text-sm flex items-center gap-2 bg-white/90 text-gray-900 shadow-lg cursor-help hover:bg-blue-100 transition-colors">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="font-medium">
                  {property.type === 'commercial' ? 
                    getPropertySituationName(property.commercialPropertySituation) : 
                    getPropertySituationName(property.propertySituation)
                  }
                </span>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Situação do Imóvel
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {getPropertyTypeName(property.type)}
          </span>
        </div>


        {/* Basic Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Informações Básicas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {property.code && (
              <div className="flex items-center gap-2">
                <Building2 className="text-blue-600 w-5 h-5" />
                <div>
                  <span className="text-sm text-gray-600">Código:</span>
                  <p className="font-medium">{property.code}</p>
                </div>
              </div>
            )}
            {property.transactionType && (
              <div className="flex items-center gap-2">
                <ArrowRightCircle className="text-blue-600 w-5 h-5" />
                <div>
                  <span className="text-sm text-gray-600">Tipo:</span>
                  <p className="font-medium">{property.transactionType === 'sale' ? 'Venda' : 'Aluguel'}</p>
                </div>
              </div>
            )}
            {property.totalUnits && property.totalUnits > 0 && (
              <div className="flex items-center gap-2">
                <Home className="text-blue-600 w-5 h-5" />
                <div>
                  <span className="text-sm text-gray-600">Total de Unidades:</span>
                  <p className="font-medium">{property.totalUnits}</p>
                </div>
              </div>
            )}
            {property.deliveryDate && (
              <div className="flex items-center gap-2">
                <Calendar className="text-blue-600 w-5 h-5" />
                <div>
                  <span className="text-sm text-gray-600">Entrega:</span>
                  <p className="font-medium">{property.deliveryDate}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Property Specifications - Conditional based on type */}
        {(property.type === 'apartment' || property.type === 'house' || property.type === 'commercial') && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Especificações</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {property.rooms.bedrooms > 0 && (
                <div className="flex items-center gap-2">
                  <Bed className="text-blue-600" />
                  <span>{property.rooms.bedrooms} dormitórios</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Bath className="text-blue-600" />
                <span>{property.rooms.bathrooms} banheiros</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="text-blue-600" />
                <span>{property.rooms.parkingSpaces} vagas</span>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="text-blue-600" />
                <span>{property.area.total}m²</span>
              </div>
              {property.area.built && property.area.built > 0 && (
                <div className="flex items-center gap-2">
                  <Building2 className="text-blue-600" />
                  <span>{property.area.built}m² construídos</span>
                </div>
              )}
              {property.pricePerSqft && (
                <div className="flex items-center gap-2">
                  <ArrowRightCircle className="text-blue-600" />
                  <span>{formatCurrency(property.pricePerSqft)}/m²</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Land Specifications - Only for land type */}
        {property.type === 'land' && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Especificações do Lote</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Ruler className="text-blue-600" />
                <div>
                  <span className="text-sm text-gray-600">Área Total:</span>
                  <p className="font-medium">{property.area.total}m²</p>
                </div>
              </div>
              {property.lotFeatures?.minLotSize && property.lotFeatures?.maxLotSize && (
                <div className="flex items-center gap-2">
                  <MapPin className="text-blue-600" />
                  <div>
                    <span className="text-sm text-gray-600">Tamanho dos Lotes:</span>
                    <p className="font-medium">{property.lotFeatures.minLotSize}m² a {property.lotFeatures.maxLotSize}m²</p>
                  </div>
                </div>
              )}
              {property.pricePerSqft && (
                <div className="flex items-center gap-2">
                  <ArrowRightCircle className="text-blue-600" />
                  <div>
                    <span className="text-sm text-gray-600">Preço por m²:</span>
                    <p className="font-medium">{formatCurrency(property.pricePerSqft)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Commercial Features */}
        {property.type === 'commercial' && property.commercialFeatures && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Especificações Comerciais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Classe do Edifício</h3>
                <p className="text-gray-600">{property.commercialFeatures.buildingClass}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Pavimentos</h3>
                <p className="text-gray-600">{property.commercialFeatures.floors} andares</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Unidades por Andar</h3>
                <p className="text-gray-600">{property.commercialFeatures.unitsPerFloor} unidades</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Pé Direito</h3>
                <p className="text-gray-600">{property.commercialFeatures.ceilingHeight}m</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Ar Condicionado</h3>
                <p className="text-gray-600">{property.commercialFeatures.airConditioning}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Infraestrutura</h3>
                <div className="space-y-1">
                  {property.commercialFeatures.structuredCabling && (
                    <p className="text-sm text-gray-600">✓ Cabeamento estruturado</p>
                  )}
                  {property.commercialFeatures.fiberOptic && (
                    <p className="text-sm text-gray-600">✓ Fibra ótica</p>
                  )}
                  {property.commercialFeatures.generator && (
                    <p className="text-sm text-gray-600">✓ Gerador de emergência</p>
                  )}
                  {property.commercialFeatures.loadingDock && (
                    <p className="text-sm text-gray-600">✓ Doca de carga</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Space Configuration */}
        {property.type === 'commercial' && property.spaceConfiguration && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Configuração dos Espaços
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {property.spaceConfiguration.openFloorPlan && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">✓</span>
                  <span className="text-sm">Planta livre</span>
                </div>
              )}
              {property.spaceConfiguration.privateOffices && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">✓</span>
                  <span className="text-sm">Escritórios privativos</span>
                </div>
              )}
              {property.spaceConfiguration.meetingRooms && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">✓</span>
                  <span className="text-sm">Salas de reunião</span>
                </div>
              )}
              {property.spaceConfiguration.receptionArea && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">✓</span>
                  <span className="text-sm">Área de recepção</span>
                </div>
              )}
              {property.spaceConfiguration.kitchenette && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">✓</span>
                  <span className="text-sm">Copa</span>
                </div>
              )}
              {property.spaceConfiguration.storageRoom && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">✓</span>
                  <span className="text-sm">Depósito</span>
                </div>
              )}
              {property.spaceConfiguration.serverRoom && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">✓</span>
                  <span className="text-sm">Sala de servidor</span>
                </div>
              )}
              {property.spaceConfiguration.breakRoom && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">✓</span>
                  <span className="text-sm">Sala de descanso</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Office Layouts */}
        {property.type === 'commercial' && property.officeLayouts && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Layouts de Escritório
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {property.officeLayouts.map((layout, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{layout.name}</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Área: {layout.area}m²</p>
                    <p className="text-sm text-gray-600">Capacidade: {layout.capacity}</p>
                    <div className="space-y-1">
                      {layout.features.map((feature, idx) => (
                        <p key={idx} className="text-sm text-gray-600">• {feature}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Building Services */}
        {property.type === 'commercial' && property.buildingServices && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Serviços do Edifício
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.buildingServices.reception24h && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">✓</span>
                  <span className="text-sm">Recepção 24h</span>
                </div>
              )}
              {property.buildingServices.concierge && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">✓</span>
                  <span className="text-sm">Concierge</span>
                </div>
              )}
              {property.buildingServices.cleaning && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">✓</span>
                  <span className="text-sm">Limpeza</span>
                </div>
              )}
              {property.buildingServices.maintenance && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">✓</span>
                  <span className="text-sm">Manutenção</span>
                </div>
              )}
              {property.buildingServices.security && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">✓</span>
                  <span className="text-sm">Segurança</span>
                </div>
              )}
              {property.buildingServices.valet && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">✓</span>
                  <span className="text-sm">Valet</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appliances (for commercial - adapted as office equipment) */}
        {property.type === 'commercial' && property.appliances && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Equipamentos Inclusos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.appliances.map((appliance, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm">{appliance}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cooling Type */}
        {property.type === 'commercial' && property.coolingType && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Tipo de Resfriamento
            </h2>
            <p className="text-gray-600">{property.coolingType}</p>
          </div>
        )}

        {/* Heating Type */}
        {property.type === 'commercial' && property.heatingType && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Tipo de Aquecimento
            </h2>
            <p className="text-gray-600">{property.heatingType}</p>
            {property.heatingFuel && (
              <p className="text-sm text-gray-500 mt-2">Combustível: {property.heatingFuel}</p>
            )}
          </div>
        )}

        {/* Floor Covering */}
        {property.type === 'commercial' && property.floorCovering && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Revestimento de Pavimentos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {property.floorCovering.officeAreas && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Áreas de Escritório</h3>
                  <p className="text-gray-600">{property.floorCovering.officeAreas}</p>
                </div>
              )}
              {property.floorCovering.meetingRooms && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Salas de Reunião</h3>
                  <p className="text-gray-600">{property.floorCovering.meetingRooms}</p>
                </div>
              )}
              {property.floorCovering.bathrooms && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Banheiros</h3>
                  <p className="text-gray-600">{property.floorCovering.bathrooms}</p>
                </div>
              )}
              {property.floorCovering.commonAreas && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Áreas Comuns</h3>
                  <p className="text-gray-600">{property.floorCovering.commonAreas}</p>
                </div>
              )}
              {property.floorCovering.serviceAreas && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Áreas de Serviço</h3>
                  <p className="text-gray-600">{property.floorCovering.serviceAreas}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Basement (adapted for commercial as technical areas) */}
        {property.type === 'commercial' && property.basement && property.basement.hasBasement && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Subsolo Técnico
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Tipo</h3>
                <p className="text-gray-600">{property.basement.basementType}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Área</h3>
                <p className="text-gray-600">{property.basement.basementArea}m²</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Uso</h3>
                <p className="text-gray-600">{property.basement.basementUse}</p>
              </div>
            </div>
          </div>
        )}

        {/* Office Details (adapted from bedroom details) */}
        {property.type === 'commercial' && property.officeDetails && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Distribuição de Salas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Total de Salas</h3>
                <p className="text-gray-600">{property.officeDetails.totalOffices} unidades</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Suítes Executivas</h3>
                <p className="text-gray-600">{property.officeDetails.executiveSuites} unidades</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Salas Padrão</h3>
                <p className="text-gray-600">{property.officeDetails.standardOffices} unidades</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Espaços Abertos</h3>
                <p className="text-gray-600">{property.officeDetails.openSpaces} unidades</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Salas de Reunião</h3>
                <p className="text-gray-600">{property.officeDetails.meetingRooms} unidades</p>
              </div>
            </div>
          </div>
        )}

        {/* Project Media (for commercial) */}
        {property.type === 'commercial' && property.projectMedia && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Mídia do Empreendimento
            </h2>
            <div className="space-y-6">
              {property.projectMedia.images && property.projectMedia.images.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Galeria de Imagens</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.projectMedia.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {property.projectMedia.floorPlans && property.projectMedia.floorPlans.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Plantas dos Pavimentos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.projectMedia.floorPlans.map((plan, index) => (
                      <img
                        key={index}
                        src={plan}
                        alt={`Planta ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Características Comerciais - Apenas para comercial */}
        {property.type === 'commercial' && property.commercialFeatures && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">🏢 Características do Edifício</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Classe do Edifício</h3>
                <p className="text-gray-700">{property.commercialFeatures.buildingClass}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Pavimentos</h3>
                <p className="text-gray-700">{property.commercialFeatures.floors}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Unidades por Andar</h3>
                <p className="text-gray-700">{property.commercialFeatures.unitsPerFloor}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Altura do Pé Direito</h3>
                <p className="text-gray-700">{property.commercialFeatures.ceilingHeight}m</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Ar Condicionado</h3>
                <p className="text-gray-700">{property.commercialFeatures.airConditioning}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Infraestrutura Tecnológica</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  {property.commercialFeatures.structuredCabling ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm">Cabeamento Estruturado</span>
                </div>
                <div className="flex items-center gap-2">
                  {property.commercialFeatures.fiberOptic ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm">Fibra Ótica</span>
                </div>
                <div className="flex items-center gap-2">
                  {property.commercialFeatures.generator ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm">Gerador de Emergência</span>
                </div>
                <div className="flex items-center gap-2">
                  {property.commercialFeatures.loadingDock ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm">Doca de Carga</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Layouts de Escritório - Apenas para comercial */}
        {property.type === 'commercial' && property.officeLayouts && property.officeLayouts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">📐 Layouts de Escritório</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {property.officeLayouts.map((layout, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">{layout.name}</h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm"><span className="font-medium">Área:</span> {layout.area}m²</p>
                    <p className="text-sm"><span className="font-medium">Capacidade:</span> {layout.capacity}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">Características:</p>
                    {layout.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Serviços do Edifício - Apenas para comercial */}
        {property.type === 'commercial' && property.buildingServices && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">🏢 Serviços do Edifício</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                {property.buildingServices.reception24h ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm">Recepção 24h</span>
              </div>
              <div className="flex items-center gap-2">
                {property.buildingServices.concierge ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm">Concierge</span>
              </div>
              <div className="flex items-center gap-2">
                {property.buildingServices.cleaning ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm">Limpeza</span>
              </div>
              <div className="flex items-center gap-2">
                {property.buildingServices.maintenance ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm">Manutenção</span>
              </div>
              <div className="flex items-center gap-2">
                {property.buildingServices.security ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm">Segurança</span>
              </div>
              <div className="flex items-center gap-2">
                {property.buildingServices.valet ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm">Valet</span>
              </div>
            </div>
          </div>
        )}

        {/* Características Detalhadas - Sustentabilidade, Segurança, Tecnologia */}
        {(property.type === 'apartment' || property.type === 'house' || property.type === 'commercial') && (property.sustainabilityFeatures || property.securityFeatures || property.technologyFeatures) && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Características Detalhadas</h2>
            
            {property.sustainabilityFeatures && property.sustainabilityFeatures.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-green-900 mb-3">🌱 Sustentabilidade</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.sustainabilityFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.securityFeatures && property.securityFeatures.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-blue-900 mb-3">🔒 Segurança</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.securityFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.technologyFeatures && property.technologyFeatures.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-purple-900 mb-3">💻 Tecnologia</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.technologyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Zap className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Estado e Situação do Imóvel - COM DESTAQUE */}
        {(property.type === 'apartment' || property.type === 'house') && (property.propertyState || property.propertySituation) && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">
              {property.type === 'apartment' ? '🏢' : '🏠'} Estado e Situação do Imóvel
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.propertyState && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Estado do Imóvel</h3>
                  <p className="text-blue-700">{getPropertyStateName(property.propertyState)}</p>
                </div>
              )}
              {property.propertySituation && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">Situação do Imóvel</h3>
                  <p className="text-green-700">{getPropertySituationName(property.propertySituation)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Características da Casa - Apenas para casas */}
        {property.type === 'house' && property.houseFeatures && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Características da Casa</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Área do Terreno</h3>
                <p className="text-gray-700">{property.houseFeatures.lotSize}m²</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Área Construída</h3>
                <p className="text-gray-700">{property.houseFeatures.builtArea}m²</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Pavimentos</h3>
                <p className="text-gray-700">{property.houseFeatures.floors}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Suítes</h3>
                <p className="text-gray-700">{property.houseFeatures.suites}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Varandas</h3>
                <p className="text-gray-700">{property.houseFeatures.balconies}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Características Especiais</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  {property.houseFeatures.privateGarden ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm">Jardim Privativo</span>
                </div>
                <div className="flex items-center gap-2">
                  {property.houseFeatures.privatePool ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm">Piscina Privativa</span>
                </div>
                <div className="flex items-center gap-2">
                  {property.houseFeatures.gourmetArea ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm">Área Gourmet</span>
                </div>
                <div className="flex items-center gap-2">
                  {property.houseFeatures.serviceArea ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm">Área de Serviço</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Características Interiores - Para casas */}
        {property.type === 'house' && property.interiorFeatures && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">🏠 Características Interiores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Pisos</h3>
                <p className="text-gray-700">{property.interiorFeatures.flooring}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Cozinha</h3>
                <p className="text-gray-700">{property.interiorFeatures.kitchen}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Banheiros</h3>
                <p className="text-gray-700">{property.interiorFeatures.bathrooms}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Ar Condicionado</h3>
                <p className="text-gray-700">{property.interiorFeatures.airConditioning}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Iluminação</h3>
                <p className="text-gray-700">{property.interiorFeatures.lighting}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Armazenamento</h3>
                <p className="text-gray-700">{property.interiorFeatures.storage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Características Exteriores - Para casas */}
        {property.type === 'house' && property.exterior && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">🏗️ Características Exteriores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Fachada</h3>
                <p className="text-gray-700">{property.exterior.facade}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Paisagismo</h3>
                <p className="text-gray-700">{property.exterior.landscaping}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Iluminação Externa</h3>
                <p className="text-gray-700">{property.exterior.lighting}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Segurança Externa</h3>
                <p className="text-gray-700">{property.exterior.security}</p>
              </div>
            </div>
          </div>
        )}

        {/* Teto - Para casas */}
        {property.type === 'house' && property.ceilingType && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">🏠 Teto</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{property.ceilingType}</p>
            </div>
          </div>
        )}

        {/* Vista - Para casas */}
        {property.type === 'house' && property.views && property.views.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">👁️ Vista</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {property.views.map((view, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">{view}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estacionamento - Para casas */}
        {property.type === 'house' && property.parking && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">🚗 Estacionamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Vagas Cobertas</h3>
                <p className="text-gray-700">{property.parking.coveredSpaces} vagas</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Vagas para Visitantes</h3>
                <p className="text-gray-700">{property.parking.visitorSpaces} vagas</p>
              </div>
              <div className="flex items-center gap-2">
                {property.parking.electricCarCharging ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm">Carregador para Carros Elétricos</span>
              </div>
              <div className="flex items-center gap-2">
                {property.parking.bikeRack ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm">Bicicletário</span>
              </div>
            </div>
          </div>
        )}

        {/* Estilo Arquitetônico - Para casas */}
        {property.type === 'house' && property.architecturalStyle && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">🏛️ Estilo Arquitetônico</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{property.architecturalStyle}</p>
            </div>
          </div>
        )}

        {/* Detalhes do Quarto - Para casas */}
        {property.type === 'house' && property.roomDetails && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">🛏️ Detalhes dos Quartos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {property.roomDetails.masterBedroom && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Suíte Master ({property.roomDetails.masterBedroom.size})</h3>
                  <ul className="space-y-1">
                    {property.roomDetails.masterBedroom.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {property.roomDetails.secondBedroom && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Segunda Suíte ({property.roomDetails.secondBedroom.size})</h3>
                  <ul className="space-y-1">
                    {property.roomDetails.secondBedroom.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {property.roomDetails.livingRoom && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Sala de Estar ({property.roomDetails.livingRoom.size})</h3>
                  <ul className="space-y-1">
                    {property.roomDetails.livingRoom.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {property.roomDetails.kitchen && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Cozinha ({property.roomDetails.kitchen.size})</h3>
                  <ul className="space-y-1">
                    {property.roomDetails.kitchen.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Eletrodomésticos - Para casas */}
        {property.type === 'house' && property.appliances && property.appliances.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">🔌 Eletrodomésticos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {property.appliances.map((appliance, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">{appliance}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tipo de Resfriamento - Para casas */}
        {property.type === 'house' && property.coolingType && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">❄️ Tipo de Resfriamento</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{property.coolingType}</p>
            </div>
          </div>
        )}

        {/* Tipo de Aquecimento - Para casas */}
        {property.type === 'house' && property.heatingType && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">🔥 Tipo de Aquecimento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Sistema</h3>
                <p className="text-gray-700">{property.heatingType}</p>
              </div>
              {property.heatingFuel && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Combustível</h3>
                  <p className="text-gray-700">{property.heatingFuel}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Revestimento de Pavimentos - Para casas */}
        {property.type === 'house' && property.floorCovering && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">🏠 Revestimento de Pavimentos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Áreas Sociais</h3>
                <p className="text-gray-700">{property.floorCovering.livingAreas}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Quartos</h3>
                <p className="text-gray-700">{property.floorCovering.bedrooms}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Banheiros</h3>
                <p className="text-gray-700">{property.floorCovering.bathrooms}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Cozinha</h3>
                <p className="text-gray-700">{property.floorCovering.kitchen}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Áreas de Serviço</h3>
                <p className="text-gray-700">{property.floorCovering.serviceAreas}</p>
              </div>
            </div>
          </div>
        )}

        {/* Porão - Para casas */}
        {property.type === 'house' && property.basement && property.basement.hasBasement && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">🏠 Porão</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Tipo</h3>
                <p className="text-gray-700">{property.basement.basementType}</p>
              </div>
              {property.basement.basementArea && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Área</h3>
                  <p className="text-gray-700">{property.basement.basementArea}m²</p>
                </div>
              )}
              {property.basement.basementUse && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Uso</h3>
                  <p className="text-gray-700">{property.basement.basementUse}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quartos (detalhamento adicional) - Para casas */}
        {property.type === 'house' && property.bedroomDetails && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">🛏️ Quartos</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Total</h3>
                <p className="text-gray-700">{property.bedroomDetails.totalBedrooms}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Suítes</h3>
                <p className="text-gray-700">{property.bedroomDetails.suites}</p>
              </div>
              <div className="flex items-center gap-2">
                {property.bedroomDetails.masterSuite ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm">Suíte Master</span>
              </div>
              <div className="flex items-center gap-2">
                {property.bedroomDetails.guestRoom ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm">Quarto de Hóspedes</span>
              </div>
              <div className="flex items-center gap-2">
                {property.bedroomDetails.serviceRoom ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm">Quarto de Serviço</span>
              </div>
            </div>
          </div>
        )}

        {/* Mídia do Condomínio - Para casas */}
        {property.type === 'house' && property.condominiumMedia && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">📸 Mídia do Condomínio</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Imagens</h3>
                <p className="text-gray-700">{property.condominiumMedia.images.length} imagens disponíveis</p>
              </div>
              {property.condominiumMedia.virtualTour && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Tour Virtual</h3>
                  <p className="text-gray-700">Disponível</p>
                </div>
              )}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Plantas</h3>
                <p className="text-gray-700">{property.condominiumMedia.floorPlans.length} plantas disponíveis</p>
              </div>
            </div>
          </div>
        )}

        {/* Características do Condomínio - Apenas para casas */}
        {property.type === 'house' && property.condominiumFeatures && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Características do Condomínio</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Total de Casas</h3>
                <p className="text-gray-700">{property.condominiumFeatures.totalHouses}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Área Preservada</h3>
                <p className="text-gray-700">{property.condominiumFeatures.preservedArea}m²</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Infraestrutura do Condomínio</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  {property.condominiumFeatures.clubhouse ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm">Clube Privativo</span>
                </div>
                <div className="flex items-center gap-2">
                  {property.condominiumFeatures.sportsComplex ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm">Complexo Esportivo</span>
                </div>
                <div className="flex items-center gap-2">
                  {property.condominiumFeatures.walkingTrails ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm">Trilhas para Caminhada</span>
                </div>
                <div className="flex items-center gap-2">
                  {property.condominiumFeatures.security24h ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm">Segurança 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  {property.condominiumFeatures.controlledAccess ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm">Acesso Controlado</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detalhes Arquitetônicos - Apenas para casas */}
        {property.type === 'house' && property.architecturalDetails && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Detalhes Arquitetônicos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Estilo Arquitetônico</h3>
                <p className="text-gray-700">{property.architecturalDetails.style}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Fachada</h3>
                <p className="text-gray-700">{property.architecturalDetails.facade}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Cobertura</h3>
                <p className="text-gray-700">{property.architecturalDetails.roofing}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Paisagismo</h3>
                <p className="text-gray-700">{property.architecturalDetails.landscaping}</p>
              </div>
            </div>
            
            {property.architecturalDetails.sustainability && property.architecturalDetails.sustainability.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-green-900 mb-3">🌱 Sustentabilidade Arquitetônica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.architecturalDetails.sustainability.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {property.description && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Descrição</h2>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>
        )}

        {/* Amenities */}
        {property.selectedAmenities && property.selectedAmenities.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Comodidades</h2>
            
            {/* Lazer e Convivência */}
            {getAmenitiesByCategory('leisure').length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-orange-900 mb-3">🎯 Lazer e Convivência</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {getAmenitiesByCategory('leisure').map((amenity, index) => {
                    const IconComponent = amenity.icon;
                    return (
                      <div key={index} className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                        <IconComponent className="w-5 h-5 text-orange-600" />
                        <span className="text-sm font-medium">{amenity.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Infraestrutura e Segurança */}
            {getAmenitiesByCategory('infrastructure').length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-blue-900 mb-3">🏗️ Infraestrutura e Segurança</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {getAmenitiesByCategory('infrastructure').map((amenity, index) => {
                    const IconComponent = amenity.icon;
                    return (
                      <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium">{amenity.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sustentabilidade e Tecnologia */}
            {getAmenitiesByCategory('sustainability').length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-green-900 mb-3">🌱 Sustentabilidade e Tecnologia</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {getAmenitiesByCategory('sustainability').map((amenity, index) => {
                    const IconComponent = amenity.icon;
                    return (
                      <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                        <IconComponent className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium">{amenity.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Location */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Localização</h2>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="text-blue-600" />
            <span className="text-gray-700">{property.address}</span>
          </div>
          <PropertyMap 
            properties={[property]} 
            selectedProperty={property}
            showAmenities={false}
            mapHeight="300px"
          />
        </div>

        {/* Contact */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Contato</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Phone className="text-blue-600" />
              <div>
                <p className="font-medium">Telefone</p>
                <p className="text-gray-600">(11) 99999-9999</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-blue-600" />
              <div>
                <p className="font-medium">E-mail</p>
                <p className="text-gray-600">contato@imobiliaria.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}