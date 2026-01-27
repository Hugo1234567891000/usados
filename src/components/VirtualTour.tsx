import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

interface VirtualTourProps {
  tourUrl?: string;
}

export default function VirtualTour({ tourUrl }: VirtualTourProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use a demo tour if none is provided
  const demoTour = "https://my.matterport.com/show/?m=ZGucwQyQdRL";
  const actualTourUrl = tourUrl || demoTour;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Reset error state when URL changes
    setError(null);
  }, [actualTourUrl]);

  const handleIframeError = () => {
    setError('Não foi possível carregar o tour virtual. Por favor, tente novamente mais tarde.');
    setIsLoading(false);
  };

  if (error) {
    return (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white">
        <p className="text-center px-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-900">
      <iframe
        src={actualTourUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        allow="xr-spatial-tracking"
        className={`w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}
        onError={handleIframeError}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-8 h-8 animate-spin" />
            <p>Carregando tour virtual...</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-4 rounded-lg">
        <p className="text-sm">
          Use o mouse para navegar pelo ambiente. Clique e arraste para olhar ao redor.
          Use a roda do mouse para dar zoom.
        </p>
      </div>
    </div>
  );
}