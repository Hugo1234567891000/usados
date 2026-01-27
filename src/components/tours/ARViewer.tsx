import React, { useEffect, useState } from 'react';
import { Smartphone, AlertCircle, X } from 'lucide-react';

interface ARViewerProps {
  tourId: string;
  onClose: () => void;
}

export default function ARViewer({ tourId, onClose }: ARViewerProps) {
  const [isARSupported, setIsARSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkARSupport();
  }, []);

  const checkARSupport = async () => {
    setIsLoading(true);

    if ('xr' in navigator) {
      try {
        const supported = await (navigator as any).xr.isSessionSupported('immersive-ar');
        setIsARSupported(supported);
      } catch (error) {
        console.error('Error checking AR support:', error);
        setIsARSupported(false);
      }
    } else {
      setIsARSupported(false);
    }

    setIsLoading(false);
  };

  const startARSession = async () => {
    try {
      const session = await (navigator as any).xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'dom-overlay'],
        domOverlay: { root: document.body }
      });

    } catch (error) {
      console.error('Error starting AR session:', error);
      alert('Não foi possível iniciar sessão AR');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4" />
          <p>Verificando suporte AR...</p>
        </div>
      </div>
    );
  }

  if (!isARSupported) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-semibold">AR Não Disponível</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <p className="text-gray-600 mb-4">
            Seu dispositivo ou navegador não suporta Realidade Aumentada no momento.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-blue-900 mb-2">Para usar AR:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use um smartphone Android com ARCore</li>
              <li>• Use um iPhone/iPad com iOS 12+</li>
              <li>• Acesse através do Chrome ou Safari</li>
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={onClose}
          className="p-2 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center text-white max-w-md">
          <Smartphone className="w-20 h-20 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Experiência AR</h2>
          <p className="text-gray-300 mb-8">
            Toque no botão abaixo para iniciar a visualização em Realidade Aumentada.
            Você poderá posicionar o imóvel no espaço real ao seu redor.
          </p>

          <button
            onClick={startARSession}
            className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Iniciar AR
          </button>

          <div className="mt-6 text-sm text-gray-400">
            <p>Dicas:</p>
            <ul className="mt-2 space-y-1">
              <li>• Aponte para uma superfície plana</li>
              <li>• Use pinch para redimensionar</li>
              <li>• Arraste para rotacionar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
