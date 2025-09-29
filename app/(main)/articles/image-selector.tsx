'use client';

import { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageSelectorProps {
  images: string[];
  selectedImages: string[];
  onSelectionChange: (selectedImages: string[]) => void;
}

export function ImageSelector({
  images,
  selectedImages,
  onSelectionChange,
}: ImageSelectorProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  if (!images || images.length === 0) {
    return null;
  }

  const toggleImage = (imageUrl: string) => {
    const newSelection = selectedImages.includes(imageUrl)
      ? selectedImages.filter((url) => url !== imageUrl)
      : [...selectedImages, imageUrl];
    onSelectionChange(newSelection);
  };

  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages((prev) => new Set([...prev, imageUrl]));
  };

  const handleImageError = (imageUrl: string) => {
    setFailedImages((prev) => new Set([...prev, imageUrl]));
  };

  const validImages = images.filter((url) => !failedImages.has(url));

  if (validImages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ImageIcon className="size-4" />
        <h4 className="text-sm font-medium">Select Images</h4>
        <span className="text-xs text-foreground/60">
          ({selectedImages.length} of {validImages.length} selected)
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
        {validImages.map((imageUrl, index) => {
          const isSelected = selectedImages.includes(imageUrl);
          const isLoaded = loadedImages.has(imageUrl);

          return (
            <div
              key={index}
              className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-border hover:border-border/80'
              }`}
              onClick={() => toggleImage(imageUrl)}
            >
              {/* Loading placeholder */}
              {!isLoaded && (
                <div className="aspect-video bg-secondary-background flex items-center justify-center">
                  <div className="animate-spin w-4 h-4 border-2 border-border border-t-foreground rounded-full" />
                </div>
              )}

              {/* Actual image */}
              <img
                src={imageUrl}
                alt={`Article image ${index + 1}`}
                className={`aspect-video object-cover w-full transition-opacity ${
                  isLoaded ? 'opacity-100' : 'opacity-0 absolute'
                }`}
                onLoad={() => handleImageLoad(imageUrl)}
                onError={() => handleImageError(imageUrl)}
              />

              {/* Selection overlay */}
              {isSelected && (
                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                  <div className="bg-blue-500 text-white rounded-full p-1">
                    <svg
                      className="size-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Remove button for selected images */}
              {isSelected && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleImage(imageUrl);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {validImages.length > 0 && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="neutral"
            size="sm"
            onClick={() => onSelectionChange(validImages)}
          >
            Select All
          </Button>
          <Button
            type="button"
            variant="neutral"
            size="sm"
            onClick={() => onSelectionChange([])}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
