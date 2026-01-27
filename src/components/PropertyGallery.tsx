import React, { useState } from 'react';
import { GalleryImage } from '../types/property';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Cuboid as Cube, Camera } from 'lucide-react';

interface PropertyGalleryProps {
  images: GalleryImage[];
  has3DTour?: boolean;
  onOpen3DTour?: () => void;
}

export default function PropertyGallery({ images, has3DTour, onOpen3DTour }: PropertyGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | GalleryImage['type']>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredImages = images.filter(
    img => filter === 'all' || img.type === filter
  );

  const visibleImages = filteredImages.slice(currentIndex, currentIndex + 3);
  const hasMore = filteredImages.length > 3;
  const canGoNext = currentIndex + 3 < filteredImages.length;
  const canGoPrevious = currentIndex > 0;

  const handlePreviousGallery = () => {
    if (canGoPrevious) {
      setCurrentIndex(prev => Math.max(0, prev - 1));
    }
  };

  const handleNextGallery = () => {
    if (canGoNext) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePreviousLightbox = () => {
    setSelectedImage(current =>
      current === null ? null :
      current === 0 ? filteredImages.length - 1 : current - 1
    );
  };

  const handleNextLightbox = () => {
    setSelectedImage(current =>
      current === null ? null :
      current === filteredImages.length - 1 ? 0 : current + 1
    );
  };

  const handleFilterChange = (newFilter: 'all' | GalleryImage['type']) => {
    setFilter(newFilter);
    setCurrentIndex(0);
  };

  const getTypeIcon = (type: GalleryImage['type']) => {
    switch (type) {
      case 'photo':
        return <Camera className="w-4 h-4" />;
      case 'render':
        return <ImageIcon className="w-4 h-4" />;
      case '3d':
        return <Cube className="w-4 h-4" />;
    }
  };

  const getGlobalIndex = (localIndex: number) => currentIndex + localIndex;

  return (
    <div className="relative h-full">
      {/* Filter buttons */}
      <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white/90 text-gray-700 hover:bg-white'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => handleFilterChange('photo')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'photo'
              ? 'bg-blue-600 text-white'
              : 'bg-white/90 text-gray-700 hover:bg-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          Fotos
        </button>
        <button
          onClick={() => handleFilterChange('render')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'render'
              ? 'bg-blue-600 text-white'
              : 'bg-white/90 text-gray-700 hover:bg-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Renders
        </button>
        <button
          onClick={() => handleFilterChange('3d')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === '3d'
              ? 'bg-blue-600 text-white'
              : 'bg-white/90 text-gray-700 hover:bg-white'
          }`}
        >
          <Cube className="w-4 h-4" />
          3D
        </button>
        {has3DTour && onOpen3DTour && (
          <button
            onClick={onOpen3DTour}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <Camera className="w-4 h-4" />
            Tour Virtual 360°
          </button>
        )}
      </div>

      {/* Image carousel with 3 images */}
      <div className="relative h-96 flex items-center gap-2 px-2">
        {visibleImages.map((image, index) => (
          <div
            key={getGlobalIndex(index)}
            className="relative flex-1 h-full cursor-pointer group"
            onClick={() => setSelectedImage(getGlobalIndex(index))}
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <div className="text-white text-center p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getTypeIcon(image.type)}
                  <span className="capitalize">{image.type}</span>
                </div>
                <p className="text-sm">{image.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      {hasMore && (
        <>
          {canGoPrevious && (
            <button
              onClick={handlePreviousGallery}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/90 hover:bg-white text-gray-900 rounded-full shadow-lg transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {canGoNext && (
            <button
              onClick={handleNextGallery}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/90 hover:bg-white text-gray-900 rounded-full shadow-lg transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </>
      )}

      {/* Image counter */}
      {filteredImages.length > 0 && (
        <div className="absolute bottom-4 right-4 z-10 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
          {currentIndex + 1}-{Math.min(currentIndex + 3, filteredImages.length)} / {filteredImages.length}
        </div>
      )}

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={handlePreviousLightbox}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={handleNextLightbox}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          <div className="max-w-4xl w-full mx-4">
            <img
              src={filteredImages[selectedImage].url}
              alt={filteredImages[selectedImage].title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="text-white text-center mt-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                {getTypeIcon(filteredImages[selectedImage].type)}
                <span className="capitalize">{filteredImages[selectedImage].type}</span>
              </div>
              <p className="text-lg font-medium">{filteredImages[selectedImage].title}</p>
              <p className="text-sm text-gray-300 mt-1">
                {selectedImage + 1} / {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
