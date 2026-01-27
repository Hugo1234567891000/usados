import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../types/property';
import { Bed, Bath, Car, HardHat, Ruler, Building2 } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link to={`/imoveis/${property.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
        <div className="relative h-40">
          <img 
            src={property.image} 
            alt={property.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
            {property.price}
          </div>
          {property.constructionStatus === 'underConstruction' && property.deliveryDate && (
            <div className="absolute bottom-2 right-2 bg-white/90 text-gray-900 px-3 py-1 rounded-full text-xs flex items-center gap-1">
              <HardHat className="w-3 h-3 text-blue-600" />
              <span>Entrega em {property.deliveryDate}</span>
            </div>
          )}
          {property.type === 'land' && property.propertyState && (
            <div className="absolute bottom-2 left-2 bg-white/90 text-gray-900 px-3 py-1 rounded-full text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>{property.propertyState === 'ready-to-build' ? 'Pronto para construir' : 
                     property.propertyState === 'needs-preparation' ? 'Necessita preparação' : 
                     'Em análise'}</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-1">{property.title}</h3>
          {property.type === 'land' ? (
            <div className="grid grid-cols-2 gap-2 text-xs mb-2">
              <div className="flex items-center gap-1">
                <Ruler className="h-3 w-3 text-blue-600" />
                <span>{property.area.total}m²</span>
              </div>
              <div className="flex items-center gap-1">
                <Building2 className="h-3 w-3 text-blue-600" />
                <span>{property.lotFeatures?.allowsConstruction ? 'Construção permitida' : 'Sem construção'}</span>
              </div>
              {property.lotFeatures?.hasWater && (
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  <span>Água</span>
                </div>
              )}
              {property.lotFeatures?.hasElectricity && (
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                  <span>Energia</span>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 text-xs mb-2">
              <div className="flex items-center gap-1">
                <Bed className="h-3 w-3 text-blue-600" />
                <span>{property.rooms.bedrooms} dorm</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-3 w-3 text-blue-600" />
                <span>{property.rooms.bathrooms} wc</span>
              </div>
              <div className="flex items-center gap-1">
                <Car className="h-3 w-3 text-blue-600" />
                <span>{property.rooms.parkingSpaces} vg</span>
              </div>
              <div className="flex items-center gap-1">
                <Ruler className="h-3 w-3 text-blue-600" />
                <span>{property.area.total}m²</span>
              </div>
            </div>
          )}
          <p className="text-xs text-gray-600 line-clamp-1">{property.location.address}</p>
          {property.code && (
            <p className="text-xs text-gray-500 mt-1">Código: {property.code}</p>
          )}
        </div>
      </div>
    </Link>
  );
}