import type React from "react";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoCarouselProps {
  photos: string[];
  altText?: string;
}

export const PhotoCarousel: React.FC<PhotoCarouselProps> = ({
  photos,
  altText = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className="h-[300px] w-full bg-gray-300 flex items-center justify-center">
        <p className="text-gray-600">Нет фото</p>
      </div>
    );
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? photos.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === photos.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="relative h-[300px] w-full">
      {photos.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full"
            aria-label="Previous photo"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full"
            aria-label="Next photo"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      <div className="h-full w-full">
        <img
          src={photos[currentIndex] || "/placeholder.svg"}
          alt={altText}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
      </div>

      {photos.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {photos.map((_, slideIndex) => (
            <button
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`w-2 h-2 rounded-full ${
                slideIndex === currentIndex ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${slideIndex + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
