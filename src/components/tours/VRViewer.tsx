import React, { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { VRButton, XR } from '@react-three/xr';
import { Glasses, AlertCircle, X } from 'lucide-react';
import { TourRoom } from '../../lib/supabase';
import * as THREE from 'three';

interface VRViewerProps {
  rooms: TourRoom[];
  onClose: () => void;
}

function VRPanorama({ imageUrl }: { imageUrl: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(imageUrl, (loadedTexture) => {
      loadedTexture.mapping = THREE.EquirectangularReflectionMapping;
      setTexture(loadedTexture);
    });
  }, [imageUrl]);

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

export default function VRViewer({ rooms, onClose }: VRViewerProps) {
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);

  useEffect(() => {
    checkVRSupport();
  }, []);

  const checkVRSupport = async () => {
    setIsLoading(true);

    if ('xr' in navigator) {
      try {
        const supported = await (navigator as any).xr.isSessionSupported('immersive-vr');
        setIsVRSupported(supported);
      } catch (error) {
        console.error('Error checking VR support:', error);
        setIsVRSupported(false);
      }
    } else {
      setIsVRSupported(false);
    }

    setIsLoading(false);
  };

  const currentRoom = rooms[currentRoomIndex];
  const currentImageUrl = currentRoom?.image_urls?.[0];

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4" />
          <p>Verificando suporte VR...</p>
        </div>
      </div>
    );
  }

  if (!isVRSupported) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-semibold">VR Não Disponível</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <p className="text-gray-600 mb-4">
            Nenhum headset VR foi detectado ou seu navegador não suporta WebXR.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-blue-900 mb-2">Headsets Compatíveis:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Meta Quest 2 / 3 / Pro</li>
              <li>• Apple Vision Pro</li>
              <li>• Microsoft HoloLens 2</li>
              <li>• Outros headsets WebXR</li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Como usar:</h4>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Conecte seu headset VR</li>
              <li>Acesse este site pelo navegador do headset</li>
              <li>Clique em "Entrar em VR"</li>
            </ol>
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

      <div className="h-full relative">
        <Canvas>
          <XR>
            <VRPanorama imageUrl={currentImageUrl || ''} />
            <ambientLight intensity={0.5} />
          </XR>
        </Canvas>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <VRButton />
        </div>

        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-3 rounded-lg">
          <h3 className="font-semibold">{currentRoom?.room_name || 'Carregando...'}</h3>
          <p className="text-sm text-gray-300">
            {currentRoomIndex + 1} de {rooms.length} cômodos
          </p>
        </div>

        {!document.fullscreenElement && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/80 backdrop-blur-sm text-white p-8 rounded-lg text-center max-w-md pointer-events-auto">
              <Glasses className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Experiência VR</h2>
              <p className="text-gray-300 mb-6">
                Coloque seu headset VR e clique no botão "Enter VR" abaixo para iniciar
                uma experiência imersiva completa.
              </p>
              <div className="text-sm text-gray-400">
                <p className="mb-2">Controles:</p>
                <ul className="space-y-1">
                  <li>• Use os controllers para navegar</li>
                  <li>• Gire a cabeça para olhar ao redor</li>
                  <li>• Pressione gatilho para teletransporte</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
