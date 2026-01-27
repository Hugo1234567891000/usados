import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DivIcon } from 'leaflet';

// Fix default marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';

// Set up default marker icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationMapProps {
  latitude: number;
  longitude: number;
  onLocationSelect: (lat: number, lng: number) => void;
  address?: string;
}

// Component to update map view when coordinates change
function MapUpdater({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap();

  useEffect(() => {
    if (latitude && longitude && latitude !== 0 && longitude !== 0) {
      map.setView([latitude, longitude], 15, { animate: true });
    }
  }, [latitude, longitude, map]);

  return null;
}

// Custom marker icon
const createMarkerIcon = () => {
  const markerHtml = `
    <div class="w-6 h-6 rounded-full bg-blue-600 shadow-lg flex items-center justify-center border-2 border-white">
      <div class="w-3 h-3 rounded-full bg-white"></div>
    </div>
  `;

  return new DivIcon({
    html: markerHtml,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Map click handler component
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export function LocationMap({ latitude, longitude, onLocationSelect, address }: LocationMapProps) {
  const position: [number, number] = [
    latitude || -23.5505, // Default to São Paulo coordinates if no position is set
    longitude || -46.6333
  ];

  const lastAddressRef = useRef('');
  const isGeocodingRef = useRef(false);

  const handleLocationClick = (lat: number, lng: number) => {
    onLocationSelect(lat, lng);
  };

  useEffect(() => {
    if (address && address !== lastAddressRef.current) {
      const addressParts = address.split(',').filter(part => part.trim() !== '' && part.trim() !== 'Brazil');

      if (addressParts.length >= 3 && !isGeocodingRef.current) {
        lastAddressRef.current = address;
        isGeocodingRef.current = true;

        const timer = setTimeout(() => {
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`)
            .then(response => response.json())
            .then(data => {
              if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                onLocationSelect(lat, lon);
              }
              isGeocodingRef.current = false;
            })
            .catch(error => {
              console.error('Geocoding error:', error);
              isGeocodingRef.current = false;
            });
        }, 1500);

        return () => {
          clearTimeout(timer);
          isGeocodingRef.current = false;
        };
      }
    }
  }, [address, onLocationSelect]);

  return (
    <div className="h-[400px] rounded-lg overflow-hidden shadow-inner">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationSelect={handleLocationClick} />
        <MapUpdater latitude={latitude} longitude={longitude} />
        {(latitude && longitude && latitude !== 0 && longitude !== 0) && (
          <Marker
            position={position}
            icon={createMarkerIcon()}
          />
        )}
      </MapContainer>
    </div>
  );
}