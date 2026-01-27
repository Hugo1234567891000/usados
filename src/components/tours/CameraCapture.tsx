import React, { useRef, useState, useEffect } from 'react';
import { X, Check, Camera, Square, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
  roomName: string;
  capturedCount: number;
  targetCount?: number;
}

export default function CameraCapture({
  onCapture,
  onClose,
  roomName,
  capturedCount,
  targetCount = 12
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastOrientationRef = useRef<number | null>(null);
  const checkIntervalRef = useRef<number | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastPhotoUrl, setLastPhotoUrl] = useState<string | null>(null);
  const [currentOrientation, setCurrentOrientation] = useState<number>(0);
  const [hasOrientationPermission, setHasOrientationPermission] = useState(false);
  const [error, setError] = useState<string>('');

  const DEGREE_THRESHOLD = 15;

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      stopCapturing();
      if (lastPhotoUrl) {
        URL.revokeObjectURL(lastPhotoUrl);
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraReady(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Não foi possível acessar a câmera');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    window.removeEventListener('deviceorientation', handleOrientation);
  };

  const requestOrientationPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
          setHasOrientationPermission(true);
          return true;
        } else {
          setError('Permissão do sensor negada');
          return false;
        }
      } catch (error) {
        console.error('Error requesting permission:', error);
        setError('Erro ao solicitar permissão do sensor');
        return false;
      }
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
      setHasOrientationPermission(true);
      return true;
    }
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (event.alpha !== null) {
      setCurrentOrientation(event.alpha);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        if (lastPhotoUrl) {
          URL.revokeObjectURL(lastPhotoUrl);
        }
        setLastPhotoUrl(url);
        onCapture(blob);

        lastOrientationRef.current = currentOrientation;

        if (navigator.vibrate) {
          navigator.vibrate(30);
        }
      }
    }, 'image/jpeg', 0.92);
  };

  const calculateRotationDiff = (current: number, last: number): number => {
    let diff = current - last;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return Math.abs(diff);
  };

  const checkForCapture = () => {
    if (!isCapturing) return;

    if (lastOrientationRef.current === null) {
      capturePhoto();
      return;
    }

    const diff = calculateRotationDiff(currentOrientation, lastOrientationRef.current);

    if (diff >= DEGREE_THRESHOLD) {
      capturePhoto();
    }
  };

  const startCapturing = async () => {
    if (isCapturing) return;

    if (!hasOrientationPermission) {
      const granted = await requestOrientationPermission();
      if (!granted) {
        return;
      }
    }

    setIsCapturing(true);
    lastOrientationRef.current = null;

    checkIntervalRef.current = window.setInterval(() => {
      checkForCapture();
    }, 100);
  };

  const stopCapturing = () => {
    setIsCapturing(false);
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
    lastOrientationRef.current = null;
  };

  const toggleCapture = () => {
    if (isCapturing) {
      stopCapturing();
    } else {
      startCapturing();
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-20">
        <div className="flex items-center justify-between text-white">
          <div>
            <h2 className="text-xl font-bold">{roomName}</h2>
            <p className="text-sm text-gray-300">{capturedCount} fotos • {DEGREE_THRESHOLD}° por foto</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {error && (
        <div className="absolute top-20 left-4 right-4 bg-red-500/90 backdrop-blur text-white p-4 rounded-xl flex items-center gap-2 z-30">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-bold">Erro</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      {lastPhotoUrl && isCapturing && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <img
            src={lastPhotoUrl}
            alt="Última foto"
            className="absolute right-0 top-0 h-full object-cover"
            style={{
              width: '35%',
              opacity: 0.5,
              maskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 80%, transparent 100%)'
            }}
          />

          <div
            className="absolute top-0 bottom-0 bg-white shadow-[0_0_15px_rgba(255,255,255,0.9)]"
            style={{ right: '35%', width: '3px' }}
          />

          <div className="absolute top-1/2 -translate-y-1/2" style={{ right: '35%', transform: 'translate(50%, -50%)' }}>
            <div className="bg-yellow-400 text-black px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap shadow-2xl border-2 border-yellow-500">
              ALINHE AQUI
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
        <svg width="80" height="80" className="drop-shadow-lg">
          <line x1="40" y1="0" x2="40" y2="30" stroke="white" strokeWidth="2" opacity="0.6" />
          <line x1="40" y1="50" x2="40" y2="80" stroke="white" strokeWidth="2" opacity="0.6" />
          <line x1="0" y1="40" x2="30" y2="40" stroke="white" strokeWidth="2" opacity="0.6" />
          <line x1="50" y1="40" x2="80" y2="40" stroke="white" strokeWidth="2" opacity="0.6" />
          <circle cx="40" cy="40" r="4" fill="white" />
        </svg>
      </div>

      {isCapturing && (
        <div className="absolute top-28 left-0 right-0 text-center z-10 pointer-events-none px-4">
          <div className="inline-flex items-center gap-3 bg-green-500/95 text-white px-6 py-3 rounded-full font-bold text-base shadow-2xl backdrop-blur-sm">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span>Gire devagar {DEGREE_THRESHOLD}° por vez</span>
            <span className="text-2xl">→</span>
          </div>
        </div>
      )}

      {!isCapturing && capturedCount === 0 && (
        <div className="absolute top-24 left-4 right-4 text-center z-10">
          <div className="bg-blue-600/95 backdrop-blur-sm text-white p-5 rounded-2xl shadow-2xl border-2 border-blue-400">
            <p className="font-bold text-lg mb-3">📱 Modo Panorama</p>
            <div className="text-sm space-y-2 text-left">
              <p>✓ Toque no botão para iniciar</p>
              <p>✓ Gire DEVAGAR para a direita</p>
              <p>✓ Foto automática a cada {DEGREE_THRESHOLD}° de rotação</p>
              <p>✓ Alinhe a imagem fantasma</p>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-6 pb-8 z-20">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-16 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">{capturedCount}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Fotos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{Math.round((capturedCount / targetCount) * 100)}%</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Completo</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={toggleCapture}
              disabled={!isCameraReady}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all disabled:opacity-50 shadow-2xl ${
                isCapturing
                  ? 'bg-red-500 scale-95'
                  : 'bg-white scale-100'
              }`}
              style={{
                border: isCapturing ? '4px solid rgba(239, 68, 68, 0.5)' : '4px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              {isCapturing ? (
                <Square className="w-8 h-8 text-white fill-white" />
              ) : (
                <Camera className="w-10 h-10 text-gray-900" />
              )}
            </button>

            <p className="text-white text-sm font-medium">
              {isCapturing ? 'Toque para parar' : 'Toque para iniciar'}
            </p>
          </div>

          {capturedCount >= Math.ceil(targetCount / 2) && (
            <button
              onClick={onClose}
              className="w-full max-w-md bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Check className="w-6 h-6" />
              Concluir Tour ({capturedCount} fotos)
            </button>
          )}

          {capturedCount > 0 && capturedCount < Math.ceil(targetCount / 2) && (
            <p className="text-gray-400 text-xs text-center">
              Capture pelo menos {Math.ceil(targetCount / 2)} fotos para continuar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
