import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Phone, Mail, MapPin, Shield, AlertTriangle, Camera } from 'lucide-react';
import PropertyDetails from '../components/PropertyDetails';
import TourViewer from '../components/tours/TourViewer';
import properties from '../data/properties';
import { supabase } from '../lib/supabase';

export default function PropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [has3DTour, setHas3DTour] = useState(false);
  const [tourId, setTourId] = useState<string | null>(null);
  const [showTourSection, setShowTourSection] = useState(false);

  const property = properties.find(p => p.id === Number(id));

  useEffect(() => {
    if (id) {
      checkFor3DTour(id);
    }
  }, [id]);

  const checkFor3DTour = async (propertyId: string) => {
    try {
      const property = properties.find(p => p.id === Number(propertyId));
      console.log('Checking tour for property:', property?.code);

      if (!property?.code) {
        console.log('No property code found');
        return;
      }

      const { data, error } = await supabase
        .from('property_3d_tours')
        .select('id, status')
        .eq('property_id', property.code)
        .eq('status', 'ready')
        .maybeSingle();

      console.log('Tour query result:', { data, error });

      if (data && !error) {
        console.log('Tour found! ID:', data.id);
        setHas3DTour(true);
        setTourId(data.id);
      } else {
        console.log('No tour found or error occurred');
      }
    } catch (error) {
      console.error('Error checking for 3D tour:', error);
    }
  };

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Imóvel não encontrado</h1>
          <p className="text-gray-600 mb-8">O imóvel que você está procurando não existe ou foi removido.</p>
          <button
            onClick={() => navigate('/imoveis')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar para Imóveis
          </button>
        </div>
      </div>
    );
  }

  const handleContactBroker = () => {
    // Contact broker logic here
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <PropertyDetails
        property={property}
        has3DTour={has3DTour}
        onOpen3DTour={() => {
          setShowTourSection(true);
          setTimeout(() => {
            document.getElementById('tour-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      {has3DTour && tourId && (
        <div id="tour-section" className="mt-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Camera className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Tour Virtual 3D Disponível</h3>
                  <p className="text-sm text-blue-100">Explore este imóvel em 360°, AR e VR</p>
                </div>
              </div>
              <button
                onClick={() => setShowTourSection(!showTourSection)}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                {showTourSection ? 'Fechar Tour' : 'Abrir Tour 3D'}
              </button>
            </div>
          </div>
          {showTourSection && (
            <div className="border-x border-b border-gray-200 rounded-b-lg p-6">
              <TourViewer tourId={tourId} onClose={() => setShowTourSection(false)} />
            </div>
          )}
        </div>
      )}

      {/* Estado e Situação do Imóvel - Para todos os tipos */}
      {((property.type === 'commercial' && (property.commercialPropertyState || property.commercialPropertySituation)) ||
        (property.type !== 'commercial' && (property.propertyState || property.propertySituation))) && (
        <div className="mt-8 bg-white border border-gray-200 rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-900">Estado e Situação do Imóvel</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Estado do Imóvel */}
            {(property.type === 'commercial' ? property.commercialPropertyState : property.propertyState) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <p className="font-semibold text-gray-900">Estado do Imóvel</p>
                </div>
                <p className="text-gray-700 ml-8">
                  {property.type === 'commercial' ? (
                    property.commercialPropertyState === 'new-construction' ? 'Nova construção' :
                    property.commercialPropertyState === 'renovated' ? 'Reformado' :
                    property.commercialPropertyState
                  ) : (
                    property.propertyState === 'new-construction' ? 'Nova construção' :
                    property.propertyState === 'renovated' ? 'Reformado' :
                    property.propertyState === 'ready-to-build' ? 'Pronto para construir' :
                    property.propertyState === 'needs-preparation' ? 'Necessita preparação' :
                    property.propertyState === 'environmental-study' ? 'Estudo ambiental pendente' :
                    property.propertyState
                  )}
                </p>
              </div>
            )}
            
            {/* Situação do Imóvel */}
            {(property.type === 'commercial' ? property.commercialPropertySituation : property.propertySituation) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-5 h-5 text-green-600" />
                  <p className="font-semibold text-gray-900">Situação do Imóvel</p>
                </div>
                <p className="text-gray-700 ml-8">
                  {(property.type === 'commercial' ? property.commercialPropertySituation : property.propertySituation) === 'available' ? 'Disponível, sem qualquer restrição' :
                   (property.type === 'commercial' ? property.commercialPropertySituation : property.propertySituation) === 'bare-ownership' ? 'Nua-propriedade' :
                   (property.type === 'commercial' ? property.commercialPropertySituation : property.propertySituation) === 'environmental-restrictions' ? 'Com restrições ambientais' :
                   (property.type === 'commercial' ? property.commercialPropertySituation : property.propertySituation) === 'pending-approval' ? 'Aguardando aprovação' :
                   (property.type === 'commercial' ? property.commercialPropertySituation : property.propertySituation)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Property Specific Information */}
      {property.type === 'land' && property.lotFeatures && (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Características dos Lotes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Tamanhos Disponíveis</h3>
              <p className="text-gray-600">De {property.lotFeatures.minLotSize}m² a {property.lotFeatures.maxLotSize}m²</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Infraestrutura</h3>
              <div className="space-y-1 text-sm">
                {property.lotFeatures.hasWater && <p className="text-green-600">✓ Água</p>}
                {property.lotFeatures.hasElectricity && <p className="text-green-600">✓ Energia Elétrica</p>}
                {property.lotFeatures.hasSewage && <p className="text-green-600">✓ Esgoto</p>}
                {property.lotFeatures.hasAsphalt && <p className="text-green-600">✓ Asfalto</p>}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Construção</h3>
              <p className="text-gray-600">
                {property.lotFeatures.allowsConstruction ? 'Construção permitida' : 'Construção não permitida'}
              </p>
              {property.lotFeatures.maxBuildingHeight && (
                <p className="text-gray-600">Máx. {property.lotFeatures.maxBuildingHeight} pavimentos</p>
              )}
            </div>
          </div>
          
          {property.lotTypes && (
            <div className="mt-6">
              <h3 className="font-semibold mb-4">Tipos de Lotes Disponíveis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.lotTypes.map((lotType, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{lotType.name}</h4>
                    <p className="text-gray-600 mb-2">
                      {lotType.minSize}m² a {lotType.maxSize}m² - {lotType.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <div className="space-y-1">
                      {lotType.features.map((feature, idx) => (
                        <p key={idx} className="text-sm text-green-600">✓ {feature}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {property.type === 'commercial' && (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Características Comerciais</h2>
          
          {/* Especificações Comerciais */}
          {property.commercialSpecifications && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Especificações do Edifício</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Classe do Edifício</h4>
                  <p className="text-gray-600">{property.commercialSpecifications.buildingClass}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Total de Andares</h4>
                  <p className="text-gray-600">{property.commercialSpecifications.totalFloors}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Pé Direito</h4>
                  <p className="text-gray-600">{property.commercialSpecifications.ceilingHeight}m</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Total de Unidades</h4>
                  <p className="text-gray-600">{property.commercialSpecifications.totalUnits}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Situação e Estado do Imóvel */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Status do Imóvel</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.commercialPropertySituation && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Situação</h4>
                  <p className="text-gray-600">
                    {property.commercialPropertySituation === 'available' ? 'Disponível, sem qualquer restrição' :
                     property.commercialPropertySituation === 'bare-ownership' ? 'Nua-propriedade' :
                     property.commercialPropertySituation}
                  </p>
                </div>
              )}
              {property.commercialPropertyState && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Estado</h4>
                  <p className="text-gray-600">
                    {property.commercialPropertyState === 'new-construction' ? 'Nova construção' :
                     property.commercialPropertyState === 'renovated' ? 'Reformado' :
                     property.commercialPropertyState}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Configuração dos Espaços */}
          {property.commercialSpaceConfiguration && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Configuração dos Espaços</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(property.commercialSpaceConfiguration).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm">
                        {key === 'openFloorPlan' ? 'Planta aberta' :
                         key === 'privateOffices' ? 'Escritórios privativos' :
                         key === 'meetingRooms' ? 'Salas de reunião' :
                         key === 'receptionArea' ? 'Área de recepção' :
                         key === 'kitchenette' ? 'Copa' :
                         key === 'storageRoom' ? 'Depósito' :
                         key === 'serverRoom' ? 'Sala de servidor' :
                         key === 'breakRoom' ? 'Sala de descanso' : key}
                      </span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
          
          {/* Características Interiores Comerciais */}
          {property.commercialInteriorFeatures && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Características Interiores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Piso</h4>
                  <p className="text-gray-600">{property.commercialInteriorFeatures.flooring}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Copa</h4>
                  <p className="text-gray-600">{property.commercialInteriorFeatures.kitchen}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Apartment Details */}
      {property.type === 'apartment' && (
        <>
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Características do Apartamento</h2>
          
          {/* Amenidades do Condomínio */}
          {property.condominiumAmenities && property.condominiumAmenities.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Amenidades do Condomínio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.condominiumAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Vistas */}
          {property.views && property.views.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Vistas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.views.map((view, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-sm">{view}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Estacionamento */}
          {property.parking && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Estacionamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Vagas Cobertas</h4>
                  <p className="text-gray-600">{property.parking.coveredSpaces}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Vagas para Visitantes</h4>
                  <p className="text-gray-600">{property.parking.visitorSpaces}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Carregador Elétrico</h4>
                  <p className="text-gray-600">{property.parking.electricCarCharging ? 'Sim' : 'Não'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Bicicletário</h4>
                  <p className="text-gray-600">{property.parking.bikeRack ? 'Sim' : 'Não'}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Características Interiores */}
          {property.interiorFeatures && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Características Interiores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Piso</h4>
                  <p className="text-gray-600">{property.interiorFeatures.flooring}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Cozinha</h4>
                  <p className="text-gray-600">{property.interiorFeatures.kitchen}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Banheiros</h4>
                  <p className="text-gray-600">{property.interiorFeatures.bathrooms}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Ar Condicionado</h4>
                  <p className="text-gray-600">{property.interiorFeatures.airConditioning}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Detalhes dos Quartos */}
          {property.roomDetails && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Detalhes dos Ambientes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.roomDetails.masterBedroom && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium">Suíte Master ({property.roomDetails.masterBedroom.size})</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      {property.roomDetails.masterBedroom.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {property.roomDetails.livingRoom && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium">Sala de Estar ({property.roomDetails.livingRoom.size})</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      {property.roomDetails.livingRoom.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {property.roomDetails.kitchen && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium">Cozinha ({property.roomDetails.kitchen.size})</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      {property.roomDetails.kitchen.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        </>
      )}

      {/* House Details */}
      {property.type === 'house' && (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Características da Casa</h2>
          
          {/* Características da Casa */}
          {property.houseFeatures && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Características da Casa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Tamanho do Lote</h4>
                  <p className="text-gray-600">{property.houseFeatures.lotSize}m²</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Área Construída</h4>
                  <p className="text-gray-600">{property.houseFeatures.builtArea}m²</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Pavimentos</h4>
                  <p className="text-gray-600">{property.houseFeatures.floors}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Suítes</h4>
                  <p className="text-gray-600">{property.houseFeatures.suites}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${property.houseFeatures.privateGarden ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-sm">Jardim Privativo</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${property.houseFeatures.privatePool ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-sm">Piscina Privativa</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${property.houseFeatures.gourmetArea ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-sm">Área Gourmet</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${property.houseFeatures.serviceArea ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-sm">Área de Serviço</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Características do Condomínio */}
          {property.condominiumFeatures && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Características do Condomínio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Total de Casas</h4>
                  <p className="text-gray-600">{property.condominiumFeatures.totalHouses}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Área Preservada</h4>
                  <p className="text-gray-600">{property.condominiumFeatures.preservedArea}m²</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Clube</h4>
                  <p className="text-gray-600">{property.condominiumFeatures.clubhouse ? 'Sim' : 'Não'}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Vistas */}
          {property.views && property.views.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Vistas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.views.map((view, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-sm">{view}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Características Interiores */}
          {property.interiorFeatures && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Características Interiores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Piso</h4>
                  <p className="text-gray-600">{property.interiorFeatures.flooring}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Cozinha</h4>
                  <p className="text-gray-600">{property.interiorFeatures.kitchen}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Banheiros</h4>
                  <p className="text-gray-600">{property.interiorFeatures.bathrooms}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Ar Condicionado</h4>
                  <p className="text-gray-600">{property.interiorFeatures.airConditioning}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Detalhes dos Quartos */}
          {property.roomDetails && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Detalhes dos Ambientes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.roomDetails.masterBedroom && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium">Suíte Master ({property.roomDetails.masterBedroom.size})</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      {property.roomDetails.masterBedroom.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {property.roomDetails.livingRoom && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium">Sala de Estar ({property.roomDetails.livingRoom.size})</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      {property.roomDetails.livingRoom.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contact Section */}
      <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interessado neste imóvel?</h2>
          <p className="text-gray-600 mb-8">
            Entre em contato conosco para mais informações ou para agendar uma visita
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
              <Phone className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Telefone</h3>
              <p className="text-gray-600">(11) 99999-9999</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
              <Mail className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">E-mail</h3>
              <p className="text-gray-600">contato@vhgold.com.br</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
              <MapPin className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Endereço</h3>
              <p className="text-gray-600">Av. Paulista, 1000 - São Paulo, SP</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}