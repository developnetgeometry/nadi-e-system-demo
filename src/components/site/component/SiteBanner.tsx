import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

interface SiteBannerProps {
  name?: string; // Optional name
  type?: string; // Optional type
  bannerImage?: string[]; // Array of banner images
}

const SiteBanner: React.FC<SiteBannerProps> = ({ name, type, bannerImage }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="relative w-full h-60 overflow-hidden rounded-t-lg">
      {bannerImage && bannerImage.length > 0 ? (
        <Carousel
          className="w-full h-full"
          setApi={(api) => {
            api?.on('select', () => handleSlideChange(api.selectedScrollSnap()));
          }}
        >
          {/* Left and Right Buttons */}
          <CarouselPrevious
          />
          <CarouselNext
          />
          <CarouselContent className="h-full">
            {bannerImage.map((image, index) => (
              <CarouselItem key={index} className="h-full">
                <img
                  src={image}
                  alt={`${name || 'Site'} banner ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {bannerImage.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${activeIndex === index ? 'bg-white' : 'bg-gray-400'
                  }`}
              />
            ))}
          </div>
        </Carousel>
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Banner Image</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
        {name && <h1 className="text-2xl font-bold text-white">{name}</h1>}
        {type && (
          <Badge className="mt-1 bg-gray-600 dark:bg-gray-800 hover:bg-gray-600">
            {type}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default SiteBanner;