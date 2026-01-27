import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, MapPin } from 'lucide-react';
import { TourRoom } from '../../lib/supabase';

interface PanoramaViewerProps {
  rooms: TourRoom[];
  currentRoomIndex?: number;
  onRoomChange?: (index: number) => void;
}

function PanoramaSphere({ imageUrl }: { imageUrl: string }) {
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
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 0.1);
    camera.fov = 75;
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

export default function PanoramaViewer({
  rooms,
  currentRoomIndex = 0,
  onRoomChange
}: PanoramaViewerProps) {
  const [roomIndex, setRoomIndex] = useState(currentRoomIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentRoom = rooms[roomIndex];
  const currentImageUrl = currentRoom?.image_urls?.[0];

  const handlePreviousRoom = () => {
    const newIndex = roomIndex > 0 ? roomIndex - 1 : rooms.length - 1;
    setRoomIndex(newIndex);
    onRoomChange?.(newIndex);
  };

  const handleNextRoom = () => {
    const newIndex = roomIndex < rooms.length - 1 ? roomIndex + 1 : 0;
    setRoomIndex(newIndex);
    onRoomChange?.(newIndex);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!currentRoom || !currentImageUrl) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Nenhum tour disponível</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[600px] bg-black rounded-lg overflow-hidden"
    >
      <Canvas>
        <CameraController />
        <PanoramaSphere imageUrl={currentImageUrl} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={-0.5}
          minDistance={0.1}
          maxDistance={10}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(3 * Math.PI) / 4}
        />
      </Canvas>

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
          <h3 className="font-semibold">{currentRoom.room_name}</h3>
          <p className="text-sm text-gray-300">
            {roomIndex + 1} de {rooms.length} cômodos
          </p>
        </div>

        <button
          onClick={toggleFullscreen}
          className="p-2 bg-black/70 backdrop-blur-sm text-white rounded-lg hover:bg-black/90 transition-colors"
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5" />
          ) : (
            <Maximize2 className="w-5 h-5" />
          )}
        </button>
      </div>

      {rooms.length > 1 && (
        <>
          <button
            onClick={handlePreviousRoom}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/70 backdrop-blur-sm text-white rounded-full hover:bg-black/90 transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNextRoom}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/70 backdrop-blur-sm text-white rounded-full hover:bg-black/90 transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {rooms.map((room, index) => (
              <button
                key={room.id}
                onClick={() => {
                  setRoomIndex(index);
                  onRoomChange?.(index);
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  index === roomIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {room.room_name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-8 h-8 border-2 border-white/50 rounded-full" />
      </div>
    </div>
  );
}
