import React, { useState, useCallback } from 'react';
import { 
  Waves as Pool, 
  Dumbbell, 
  PartyPopper, 
  Baby, 
  Utensils, 
  Trophy as Football, 
  ChefHat, 
  Dog, 
  Trees as Tree, 
  Shield, 
  Lock, 
  Building as Elevator, 
  Car, 
  Bike, 
  Sun, 
  Power, 
  Recycle, 
  Wifi, 
  Accessibility, 
  Plus 
} from 'lucide-react';

interface AmenitiesSelectionProps {
  onChange: (selectedAmenities: string[]) => void;
  initialSelected?: string[];
}

export default function AmenitiesSelection({ onChange, initialSelected = [] }: AmenitiesSelectionProps) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialSelected);
  const [customAmenity, setCustomAmenity] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const amenities = [
    // Lazer e Convivência
    { id: 'pool', name: 'Piscina', icon: Pool, category: 'leisure' },
    { id: 'gym', name: 'Academia', icon: Dumbbell, category: 'leisure' },
    { id: 'party-room', name: 'Salão de festas', icon: PartyPopper, category: 'leisure' },
    { id: 'playground', name: 'Playground', icon: Baby, category: 'leisure' },
    { id: 'bbq', name: 'Churrasqueira', icon: Utensils, category: 'leisure' },
    { id: 'sports-court', name: 'Quadra poliesportiva', icon: Football, category: 'leisure' },
    { id: 'gourmet', name: 'Espaço gourmet', icon: ChefHat, category: 'leisure' },
    { id: 'pet-place', name: 'Pet place', icon: Dog, category: 'leisure' },
    { id: 'green-area', name: 'Área verde', icon: Tree, category: 'leisure' },

    // Infraestrutura e Segurança
    { id: '24h-security', name: 'Portaria 24h', icon: Shield, category: 'infrastructure' },
    { id: 'security-system', name: 'Sistema de segurança', icon: Lock, category: 'infrastructure' },
    { id: 'elevator', name: 'Elevador', icon: Elevator, category: 'infrastructure' },
    { id: 'covered-parking', name: 'Vagas de garagem cobertas', icon: Car, category: 'infrastructure' },
    { id: 'visitor-parking', name: 'Vagas para visitantes', icon: Car, category: 'infrastructure' },
    { id: 'bike-rack', name: 'Bicicletário', icon: Bike, category: 'infrastructure' },

    // Sustentabilidade e Tecnologia
    { id: 'solar-energy', name: 'Energia solar', icon: Sun, category: 'sustainability' },
    { id: 'generator', name: 'Gerador de energia', icon: Power, category: 'sustainability' },
    { id: 'recycling', name: 'Coleta seletiva', icon: Recycle, category: 'sustainability' },
    { id: 'wifi', name: 'Wi-Fi nas áreas comuns', icon: Wifi, category: 'sustainability' },
    { id: 'accessibility', name: 'Acessibilidade', icon: Accessibility, category: 'sustainability' }
  ];

  const handleAmenityToggle = useCallback((amenityId: string) => {
    setSelectedAmenities(prev => {
      const newSelection = prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId];
      onChange(newSelection);
      return newSelection;
    });
  }, [onChange]);

  const handleAddCustomAmenity = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (customAmenity.trim()) {
      const newAmenityId = `custom-${customAmenity.toLowerCase().replace(/\s+/g, '-')}`;
      setSelectedAmenities(prev => {
        const newSelection = [...prev, newAmenityId];
        onChange(newSelection);
        return newSelection;
      });
      setCustomAmenity('');
      setShowCustomInput(false);
    }
  }, [customAmenity, onChange]);

  return (
    <div className="space-y-8">
      {/* Lazer e Convivência */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lazer e Convivência</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {amenities
            .filter(amenity => amenity.category === 'leisure')
            .map(amenity => {
              const Icon = amenity.icon;
              return (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAmenityToggle(amenity.id);
                  }}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                    selectedAmenities.includes(amenity.id)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{amenity.name}</span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Infraestrutura e Segurança */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Infraestrutura e Segurança</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {amenities
            .filter(amenity => amenity.category === 'infrastructure')
            .map(amenity => {
              const Icon = amenity.icon;
              return (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAmenityToggle(amenity.id);
                  }}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                    selectedAmenities.includes(amenity.id)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{amenity.name}</span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Sustentabilidade e Tecnologia */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sustentabilidade e Tecnologia</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {amenities
            .filter(amenity => amenity.category === 'sustainability')
            .map(amenity => {
              const Icon = amenity.icon;
              return (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAmenityToggle(amenity.id);
                  }}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                    selectedAmenities.includes(amenity.id)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{amenity.name}</span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Características Adicionais */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Características Adicionais</h3>
        {showCustomInput ? (
          <form onSubmit={handleAddCustomAmenity} className="flex gap-2">
            <input
              type="text"
              value={customAmenity}
              onChange={(e) => setCustomAmenity(e.target.value)}
              placeholder="Digite uma característica adicional"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Adicionar
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowCustomInput(false);
                setCustomAmenity('');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowCustomInput(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Adicionar característica</span>
          </button>
        )}

        {/* Custom Amenities List */}
        {selectedAmenities
          .filter(id => id.startsWith('custom-'))
          .length > 0 && (
          <div className="mt-4 space-y-2">
            {selectedAmenities
              .filter(id => id.startsWith('custom-'))
              .map(id => (
                <div
                  key={id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span>{id.replace('custom-', '').replace(/-/g, ' ')}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAmenityToggle(id);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Selected Count */}
      <div className="pt-4 border-t">
        <p className="text-sm text-gray-600">
          {selectedAmenities.length} {selectedAmenities.length === 1 ? 'item selecionado' : 'itens selecionados'}
        </p>
      </div>
    </div>
  );
}