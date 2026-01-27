import React, { useState, useEffect } from 'react';
import { Camera, Smartphone, Glasses, Eye, X } from 'lucide-react';
import PanoramaViewer from './PanoramaViewer';
import ARViewer from './ARViewer';
import VRViewer from './VRViewer';
import { getTourWithRooms, trackTourView, TourRoom } from '../../lib/supabase';

interface TourViewerProps {
  tourId: string;
  onClose?: () => void;
}

export default function TourViewer({ tourId, onClose }: TourViewerProps) {
  const [mode, setMode] = useState<'select' | '3d' | 'ar' | 'vr'>('select');
  const [rooms, setRooms] = useState<TourRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    loadTour();
    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      if (mode === 'vr') {
        trackTourView(tourId, 'vr_headset', duration);
      } else if (mode === 'ar') {
        trackTourView(tourId, 'mobile_ar', duration);
      } else if (mode === '3d') {
        trackTourView(tourId, 'web_3d', duration);
      }
    };
  }, [tourId, mode]);

  const loadTour = async () => {
    setIsLoading(true);
    const data = await getTourWithRooms(tourId);
    if (data) {
      setRooms(data.rooms);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Carregando tour virtual...</p>
        </div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center py-12">
        <Camera className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Tour Virtual Não Disponível
        </h3>
        <p className="text-gray-600">
          Este imóvel ainda não possui um tour virtual 3D.
        </p>
      </div>
    );
  }

  if (mode === '3d') {
    return (
      <div className="relative">
        {onClose && (
          <button
            onClick={() => setMode('select')}
            className="absolute top-4 right-4 z-20 p-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <PanoramaViewer rooms={rooms} />
      </div>
    );
  }

  if (mode === 'ar') {
    return <ARViewer tourId={tourId} onClose={() => setMode('select')} />;
  }

  if (mode === 'vr') {
    return <VRViewer rooms={rooms} onClose={() => setMode('select')} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Camera className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Tour Virtual 3D</h2>
        </div>
        <p className="text-gray-600">
          Escolha como você quer explorar este imóvel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setMode('3d')}
          className="group p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
        >
          <Eye className="w-12 h-12 mx-auto mb-3 text-gray-400 group-hover:text-blue-600 transition-colors" />
          <h3 className="font-semibold text-gray-900 mb-1">Tour 3D</h3>
          <p className="text-sm text-gray-600">Navegue pelo navegador</p>
          <div className="mt-3 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full inline-block">
            Disponível Agora
          </div>
        </button>

        <button
          onClick={() => setMode('ar')}
          className="group p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
        >
          <Smartphone className="w-12 h-12 mx-auto mb-3 text-gray-400 group-hover:text-blue-600 transition-colors" />
          <h3 className="font-semibold text-gray-900 mb-1">Realidade Aumentada</h3>
          <p className="text-sm text-gray-600">Veja no espaço real</p>
          <div className="mt-3 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full inline-block">
            Requer Smartphone
          </div>
        </button>

        <button
          onClick={() => setMode('vr')}
          className="group p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
        >
          <Glasses className="w-12 h-12 mx-auto mb-3 text-gray-400 group-hover:text-blue-600 transition-colors" />
          <h3 className="font-semibold text-gray-900 mb-1">Óculos VR</h3>
          <p className="text-sm text-gray-600">Experiência imersiva</p>
          <div className="mt-3 px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full inline-block">
            Quest, Vision Pro
          </div>
        </button>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">
          {rooms.length} {rooms.length === 1 ? 'Cômodo' : 'Cômodos'} Disponíveis
        </h4>
        <div className="flex flex-wrap gap-2">
          {rooms.map((room) => (
            <span
              key={room.id}
              className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700"
            >
              {room.room_name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
