import React, { useState } from 'react';
import { Camera, Link as LinkIcon, X, Plus, Eye, Trash2 } from 'lucide-react';
import CameraCapture from './CameraCapture';
import { createTour, addRoomToTour, uploadTourImage } from '../../lib/supabase';

interface CapturedRoom {
  name: string;
  photos: Blob[];
  thumbnail?: string;
}

interface ThreeDCaptureModuleProps {
  propertyId?: string;
  onComplete?: (tourId: string) => void;
  onSkip?: () => void;
}

export default function ThreeDCaptureModule({
  propertyId,
  onComplete,
  onSkip
}: ThreeDCaptureModuleProps) {
  const [mode, setMode] = useState<'select' | 'capture' | 'url'>('select');
  const [rooms, setRooms] = useState<CapturedRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string>('');
  const [currentPhotos, setCurrentPhotos] = useState<Blob[]>([]);
  const [externalUrl, setExternalUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const commonRooms = [
    'Sala de Estar',
    'Sala de Jantar',
    'Cozinha',
    'Suíte Master',
    'Quarto 1',
    'Quarto 2',
    'Quarto 3',
    'Banheiro',
    'Área de Serviço',
    'Varanda',
    'Garagem',
    'Hall de Entrada'
  ];

  const handleStartCapture = (roomName: string) => {
    setCurrentRoom(roomName);
    setCurrentPhotos([]);
    setMode('capture');
  };

  const handlePhotoCapture = (blob: Blob) => {
    setCurrentPhotos((prev) => [...prev, blob]);
  };

  const handleCompleteRoom = () => {
    if (currentPhotos.length > 0) {
      const thumbnail = URL.createObjectURL(currentPhotos[0]);
      setRooms((prev) => [
        ...prev,
        { name: currentRoom, photos: currentPhotos, thumbnail }
      ]);
      setCurrentRoom('');
      setCurrentPhotos([]);
    }
    setMode('select');
  };

  const handleRemoveRoom = (index: number) => {
    setRooms((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFinalize = async () => {
    if (rooms.length === 0) {
      alert('Adicione pelo menos um cômodo antes de finalizar');
      return;
    }

    setIsProcessing(true);

    try {
      const tour = await createTour(propertyId);
      if (!tour) throw new Error('Falha ao criar tour');

      for (const room of rooms) {
        const imageUrls: string[] = [];

        for (let i = 0; i < room.photos.length; i++) {
          const file = new File([room.photos[i]], `photo-${i}.jpg`, { type: 'image/jpeg' });
          const url = await uploadTourImage(tour.id, room.name, file, i);
          if (url) imageUrls.push(url);
        }

        const thumbnailFile = new File([room.photos[0]], 'thumbnail.jpg', { type: 'image/jpeg' });
        const thumbnailUrl = await uploadTourImage(tour.id, room.name, thumbnailFile, 999);

        await addRoomToTour(tour.id, room.name, imageUrls, thumbnailUrl);
      }

      if (onComplete) {
        onComplete(tour.id);
      }
    } catch (error) {
      console.error('Error finalizing tour:', error);
      alert('Erro ao processar tour. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExternalUrl = () => {
    if (externalUrl.trim()) {
      if (onComplete) {
        onComplete(externalUrl);
      }
      setMode('select');
    }
  };

  if (mode === 'capture') {
    return (
      <CameraCapture
        roomName={currentRoom}
        capturedCount={currentPhotos.length}
        onCapture={handlePhotoCapture}
        onClose={handleCompleteRoom}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tour Virtual 3D</h2>
          <p className="text-gray-600 mt-1">Adicione fotos 360° para criar uma experiência imersiva</p>
        </div>
        {onSkip && (
          <button
            onClick={onSkip}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Pular esta etapa
          </button>
        )}
      </div>

      {mode === 'select' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setMode('capture')}
              className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <Camera className="w-12 h-12 mx-auto mb-3 text-gray-400 group-hover:text-blue-600" />
              <h3 className="font-semibold text-gray-900 mb-1">Capturar Agora</h3>
              <p className="text-sm text-gray-600">Use a câmera do dispositivo</p>
            </button>

            <button
              onClick={() => setMode('url')}
              className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <LinkIcon className="w-12 h-12 mx-auto mb-3 text-gray-400 group-hover:text-blue-600" />
              <h3 className="font-semibold text-gray-900 mb-1">URL Externa</h3>
              <p className="text-sm text-gray-600">Matterport, Kuula, etc</p>
            </button>

            {onSkip && (
              <button
                onClick={onSkip}
                className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all group"
              >
                <X className="w-12 h-12 mx-auto mb-3 text-gray-400 group-hover:text-gray-600" />
                <h3 className="font-semibold text-gray-900 mb-1">Pular</h3>
                <p className="text-sm text-gray-600">Adicionar depois</p>
              </button>
            )}
          </div>

          {rooms.length > 0 && (
            <>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Cômodos Capturados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rooms.map((room, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                    >
                      {room.thumbnail && (
                        <img
                          src={room.thumbnail}
                          alt={room.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{room.name}</h4>
                        <p className="text-sm text-gray-600">{room.photos.length} fotos</p>
                      </div>
                      <button
                        onClick={() => handleRemoveRoom(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Adicionar Mais Cômodos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {commonRooms
                    .filter((name) => !rooms.find((r) => r.name === name))
                    .map((name) => (
                      <button
                        key={name}
                        onClick={() => handleStartCapture(name)}
                        className="p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-sm"
                      >
                        {name}
                      </button>
                    ))}
                </div>
              </div>

              <button
                onClick={handleFinalize}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>Processando...</>
                ) : (
                  <>
                    <Eye className="w-5 h-5" />
                    Finalizar Tour 3D
                  </>
                )}
              </button>
            </>
          )}

          {rooms.length === 0 && (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Comece Capturando um Cômodo
              </h3>
              <p className="text-gray-600 mb-6">
                Escolha um dos cômodos abaixo para iniciar
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {commonRooms.slice(0, 8).map((name) => (
                  <button
                    key={name}
                    onClick={() => handleStartCapture(name)}
                    className="p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-sm"
                  >
                    <Plus className="w-4 h-4 mx-auto mb-1" />
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {mode === 'url' && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Adicionar URL de Tour Externo</h3>
          <p className="text-gray-600 mb-4">
            Cole o link do seu tour virtual do Matterport, Kuula ou outro serviço
          </p>
          <input
            type="url"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder="https://my.matterport.com/show/?m=..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setMode('select')}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleExternalUrl}
              disabled={!externalUrl.trim()}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Adicionar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
