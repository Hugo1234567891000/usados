import React, { useState } from 'react';
import { Heart, ArrowRight, Share2, Trash2, AlertTriangle } from 'lucide-react';
import PropertyCard from '../../components/PropertyCard';
import { Property } from '../../types/property';

export default function ClientFavorites() {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);

  // Test property data
  const favorites: Property[] = [
    {
      id: 1,
      title: "Edifício Horizonte - Moema",
      price: "R$ 850.000",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
      location: {
        address: "Rua das Flores, 123 - Moema, São Paulo",
        lat: -23.5936,
        lng: -46.6627
      },
      rooms: {
        bedrooms: 2,
        bathrooms: 2,
        parkingSpaces: 1
      },
      area: {
        total: 65,
        built: 60
      },
      status: "available",
      type: "apartment",
      constructionStatus: "underConstruction",
      deliveryDate: "2025-12",
      developer: "VHGold Incorporadora"
    }
  ];

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleRemove = (propertyId: string) => {
    setSelectedProperties(prev => prev.filter(id => id !== propertyId));
  };

  const handleCompare = () => {
    // Implement comparison logic
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Favoritos</h1>
          <p className="text-gray-600">
            {favorites.length} {favorites.length === 1 ? 'imóvel salvo' : 'imóveis salvos'}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleShare}
            disabled={selectedProperties.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Share2 className="w-5 h-5" />
            <span>Compartilhar</span>
          </button>

          <button
            onClick={handleCompare}
            disabled={selectedProperties.length < 2}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-5 h-5" />
            <span>Comparar</span>
          </button>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum imóvel favorito
          </h2>
          <p className="text-gray-600 mb-6">
            Explore nossos imóveis e salve seus favoritos para acompanhar preços e disponibilidade.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Explorar Imóveis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(property => (
            <div key={property.id} className="relative group">
              <div className="absolute top-2 right-2 z-10 flex gap-2">
                <button
                  onClick={() => handleRemove(property.id.toString())}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors group-hover:opacity-100 opacity-0"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>

              {property.priceChanges && property.priceChanges.length > 0 && (
                <div className="absolute top-2 left-2 z-10">
                  <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Alteração de preço</span>
                  </div>
                </div>
              )}

              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Compartilhar Favoritos</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link de compartilhamento
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="https://vhgold.com/share/favorites/123"
                    readOnly
                    className="flex-1 px-4 py-2 border rounded-lg bg-gray-50"
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Copiar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compartilhar por e-mail
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Digite o e-mail"
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Enviar
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-4">
                  Ou compartilhe nas redes sociais
                </p>
                <div className="flex gap-4">
                  <button className="flex-1 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#1864D9] transition-colors">
                    Facebook
                  </button>
                  <button className="flex-1 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1A8CD8] transition-colors">
                    Twitter
                  </button>
                  <button className="flex-1 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BD5C] transition-colors">
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}