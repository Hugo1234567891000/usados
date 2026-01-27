import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import { Property } from '../types/property';
import { MapPin, Map as MapIcon, Satellite, Bed, Bath, Car, School, Train, Sparkle as Park, Store } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';

interface PropertyMapProps {
  properties: Property[];
  selectedProperty?: Property;
  showAmenities?: boolean;
  mapHeight?: string;
}

type MapType = 'street' | 'satellite';

// Helper function to extract numeric price value
const getPriceValue = (price: string): number => {
  const match = price.match(/R\$\s*([\d,.]+)/);
  if (!match) return 0;
  return parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
};

// Helper function to get price range category
const getPriceRange = (price: number): string => {
  if (price < 250000) return '100k-250k';
  if (price < 500000) return '250k-500k';
  if (price < 750000) return '500k-750k';
  if (price < 1000000) return '750k-1M';
  if (price < 2000000) return '1M-2M';
  return '2M+';
};

// Helper function to format price range for display
const formatPriceRange = (range: string): string => {
  switch (range) {
    case '100k-250k': return 'R$ 100-250 mil';
    case '250k-500k': return 'R$ 250-500 mil';
    case '500k-750k': return 'R$ 500-750 mil';
    case '750k-1M': return 'R$ 750 mil-1M';
    case '1M-2M': return 'R$ 1M-2M';
    case '2M+': return 'R$ 2M+';
    default: return '';
  }
};

// Mock amenities data with icon paths
const amenities = [
  {
    type: 'education',
    iconPath: 'M12 3L1 9l11 6 9-4.91V17h2V9M5 14.91v6.43l7 3.66 7-3.66v-6.43L12 19l-7-4.09z',
    color: '#2563eb', // blue-600
    items: [
      { name: 'Escola Municipal', lat: -23.5936, lng: -46.6657 },
      { name: 'Colégio Particular', lat: -23.5926, lng: -46.6617 }
    ]
  },
  {
    type: 'mobility',
    iconPath: 'M4 15.5V7c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v8.5M2 17h20M4 17l2 3h12l2-3',
    color: '#dc2626', // red-600
    items: [
      { name: 'Estação de Metrô', lat: -23.5946, lng: -46.6637 },
      { name: 'Terminal de Ônibus', lat: -23.5916, lng: -46.6627 }
    ]
  },
  {
    type: 'leisure',
    iconPath: 'M12 3c.53 0 1.04.21 1.41.59L15 5.17l2.59-2.59A2 2 0 0 1 20 3v4L8 19l-5-5V4a2 2 0 0 1 2-2h7z',
    color: '#16a34a', // green-600
    items: [
      { name: 'Parque Municipal', lat: -23.5956, lng: -46.6647 },
      { name: 'Academia ao Ar Livre', lat: -23.5906, lng: -46.6637 }
    ]
  },
  {
    type: 'convenience',
    iconPath: 'M3 3h18v18H3V3zm15 12.83V7H6v8.83L9 13l3 3 3-3 3 2.83zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    color: '#9333ea', // purple-600
    items: [
      { name: 'Shopping Center', lat: -23.5926, lng: -46.6647 },
      { name: 'Supermercado', lat: -23.5946, lng: -46.6617 }
    ]
  }
];

// Custom marker icon with price badge
const createMarkerIcon = (property: Property, isSelected: boolean) => {
  const price = getPriceValue(property.price);
  const priceRange = getPriceRange(price);
  
  const markerHtml = `
    <div class="relative">
      <div class="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <div class="px-2 py-1 rounded-full text-xs font-semibold ${
          isSelected 
            ? 'bg-blue-600 text-white' 
            : 'bg-white text-gray-900'
        } shadow-lg">
          ${formatPriceRange(priceRange)}
        </div>
      </div>
      <div class="w-6 h-6 rounded-full ${
        isSelected ? 'bg-blue-600' : 'bg-white'
      } shadow-lg flex items-center justify-center border-2 border-white">
        <div class="w-3 h-3 rounded-full ${
          isSelected ? 'bg-white' : 'bg-blue-600'
        }"></div>
      </div>
    </div>
  `;

  return new DivIcon({
    html: markerHtml,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Create amenity marker icon
const createAmenityIcon = (iconPath: string, color: string) => {
  const markerHtml = `
    <div class="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="${iconPath}"></path>
      </svg>
    </div>
  `;

  return new DivIcon({
    html: markerHtml,
    className: 'amenity-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

export default function PropertyMap({ properties, selectedProperty, showAmenities = false, mapHeight = '400px' }: PropertyMapProps) {
  const [mapType, setMapType] = useState<MapType>('street');

  // Fix default marker icon issue
  useEffect(() => {
    // This is a workaround for the missing marker icon in Leaflet when used with webpack
    // We need to manually set the default icon path
    delete (Icon.Default.prototype as any)._getIconUrl;
    Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  const center = selectedProperty
    ? [selectedProperty.location.lat, selectedProperty.location.lng]
    : [-23.5505, -46.6333]; // São Paulo

  const tileLayer = mapType === 'street' 
    ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

  const attribution = mapType === 'street'
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    : '&copy; <a href="https://www.arcgis.com/">ESRI</a>';

  const toggleMapType = () => {
    setMapType(current => current === 'street' ? 'satellite' : 'street');
  };

  return (
    <div className="relative">
      <MapContainer
        center={center as [number, number]} 
        zoom={showAmenities ? 15 : 12} 
        scrollWheelZoom={true} 
        style={{ height: mapHeight, width: '100%' }}
        className="rounded-lg shadow-lg z-0"
      >
        <TileLayer
          attribution={attribution}
          url={tileLayer}
        />
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.location.lat, property.location.lng]}
            icon={createMarkerIcon(property, property.id === selectedProperty?.id)}
          >
            <Popup className="property-popup" maxWidth={300}>
              <Link to={`/imoveis/${property.id}`} className="block">
                <div className="relative h-40 mb-3">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    {property.price}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{property.location.address}</p>
                <div className="flex justify-between text-gray-600 text-sm">
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    <span>{property.rooms.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    <span>{property.rooms.bathrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Car className="w-4 h-4" />
                    <span>{property.rooms.parkingSpaces}</span>
                  </div>
                </div>
                <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                  Ver Detalhes
                </button>
              </Link>
            </Popup>
          </Marker>
        ))}

        {showAmenities && amenities.map((category) => 
          category.items?.map((item, index) => (
            <Marker
              key={`${category.type}-${index}`}
              position={[item.lat, item.lng]}
              icon={createAmenityIcon(category.iconPath, category.color)}
            >
              <Tooltip direction="top" offset={[0, -20]} permanent>
                <span className="text-sm font-medium">{item.name}</span>
              </Tooltip>
            </Marker>
          ))
        )}
      </MapContainer>
      <button
        onClick={toggleMapType}
        className="absolute top-4 right-4 z-[400] bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        title={mapType === 'street' ? 'Mudar para vista de satélite' : 'Mudar para vista de mapa'}
      >
        {mapType === 'street' ? (
          <Satellite className="w-6 h-6 text-gray-700" />
        ) : (
          <MapIcon className="w-6 h-6 text-gray-700" />
        )}
      </button>
    </div>
  );
}