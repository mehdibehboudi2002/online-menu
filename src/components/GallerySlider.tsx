'use client';

import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectFade, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface GallerySliderProps {
  images: string[];
  alt: string;
  className?: string;
  onImageError?: (imageUrl: string) => void;
  failedImages?: Set<string>;
  dark?: boolean;
  effect?: 'slide' | 'fade';
  onGalleryClick?: (event: React.MouseEvent) => void;
  isModal?: boolean;
}

export default function GallerySlider({
  images,
  alt,
  className = '',
  onImageError,
  failedImages = new Set(),
  dark = false,
  effect = 'slide',
  onGalleryClick,
  isModal = false
}: GallerySliderProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const validImages = images.filter(img => !failedImages.has(img));

  if (validImages.length === 0) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${dark ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-green-50 to-green-100'
        } ${className}`} onClick={onGalleryClick}>
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${dark ? 'bg-slate-600' : 'bg-green-200'
            }`}>
            <svg className={`w-8 h-8 ${dark ? 'text-blue-200' : 'text-green-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className={`text-sm ${dark ? 'text-blue-200' : 'text-green-600'}`}>No Image</p>
        </div>
      </div>
    );
  }

  // For non-modal on mobile (<md), show only first image without slider
  if (!isModal && validImages.length >= 1) {
    return (
      <>
        {/* Mobile: Single image only */}
        <div className={`md:hidden relative w-full h-full overflow-hidden ${className}`} onClick={onGalleryClick}>
          <img
            src={validImages[0]}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-500"
            onError={() => onImageError?.(validImages[0])}
          />
        </div>

        {/* Desktop: Full slider */}
        <div className={`hidden md:block relative w-full h-full ${className}`}>
          {validImages.length === 1 ? (
            <div className="relative w-full h-full overflow-hidden" onClick={onGalleryClick}>
              <img
                src={validImages[0]}
                alt={alt}
                className="w-full h-full object-cover transition-transform duration-500"
                onError={() => onImageError?.(validImages[0])}
              />
            </div>
          ) : (
            <SliderContent
              validImages={validImages}
              alt={alt}
              effect={effect}
              dark={dark}
              onImageError={onImageError}
              onGalleryClick={onGalleryClick}
              isModal={isModal}
              swiperRef={swiperRef}
              isBeginning={isBeginning}
              isEnd={isEnd}
              setIsBeginning={setIsBeginning}
              setIsEnd={setIsEnd}
            />
          )}
        </div>
      </>
    );
  }

  // For modal or single image: show slider on all screens
  if (validImages.length === 1) {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`} onClick={onGalleryClick}>
        <img
          src={validImages[0]}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-500"
          onError={() => onImageError?.(validImages[0])}
        />
      </div>
    );
  }

  return (
    <SliderContent
      validImages={validImages}
      alt={alt}
      effect={effect}
      dark={dark}
      onImageError={onImageError}
      onGalleryClick={onGalleryClick}
      isModal={isModal}
      swiperRef={swiperRef}
      isBeginning={isBeginning}
      isEnd={isEnd}
      setIsBeginning={setIsBeginning}
      setIsEnd={setIsEnd}
    />
  );
}

// Slider Content Component
function SliderContent({
  validImages,
  alt,
  effect,
  dark,
  onImageError,
  onGalleryClick,
  isModal,
  swiperRef,
  isBeginning,
  isEnd,
  setIsBeginning,
  setIsEnd
}: {
  validImages: string[];
  alt: string;
  effect: 'slide' | 'fade';
  dark: boolean;
  onImageError?: (imageUrl: string) => void;
  onGalleryClick?: (event: React.MouseEvent) => void;
  isModal: boolean;
  swiperRef: React.MutableRefObject<SwiperType | null>;
  isBeginning: boolean;
  isEnd: boolean;
  setIsBeginning: (val: boolean) => void;
  setIsEnd: (val: boolean) => void;
}) {
  const handlePrevClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (swiperRef.current && !isBeginning) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (swiperRef.current && !isEnd) {
      swiperRef.current.slideNext();
    }
  };

  const handleSwiperInit = (swiper: SwiperType) => {
    swiperRef.current = swiper;
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const navClasses = isModal
    ? 'opacity-100'
    : 'opacity-0 group-hover:opacity-100 md:opacity-100 xl:opacity-0 xl:group-hover:opacity-100';

  return (
    <div className="relative w-full h-full">
      <Swiper
        modules={[Pagination, EffectFade, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        effect={effect}
        speed={600}
        loop={false}
        autoplay={false}
        dir="ltr"
        pagination={{
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 3,
        }}
        className={`w-full h-full gallery-swiper group ${isModal ? 'modal-gallery' : ''}`}
        onSwiper={handleSwiperInit}
        onSlideChange={handleSlideChange}
      >
        {validImages.map((image, index) => (
          <SwiperSlide key={`${image}-${index}`}>
            <div className="relative w-full h-full" onClick={onGalleryClick}>
              <img
                src={image}
                alt={`${alt} - Image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500"
                onError={() => onImageError?.(image)}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      {validImages.length > 1 && (
        <>
          <button
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 size-7 md:size-8 rounded-full backdrop-blur-md transition-all duration-300 flex items-center justify-center 
              ${navClasses}
              ${isBeginning ? 'opacity-30 ' : 'cursor-pointer'}
              ${dark
                ? `bg-slate-800/90 border border-slate-600 ${!isBeginning ? 'hover:bg-slate-800' : ''}`
                : `bg-white/90 border border-gray-300 ${!isBeginning ? 'hover:bg-white' : ''}`}
              `}
            onClick={handlePrevClick}
            disabled={isBeginning}
            aria-label="Previous image"
          >
            <svg
              className={`size-[19px] ${isBeginning ? 'text-gray-400' : (dark ? 'text-yellow-400' : 'text-green-600')}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 size-7 md:size-8 rounded-full backdrop-blur-md transition-all duration-300 flex items-center justify-center 
              ${navClasses}
              ${isEnd ? 'opacity-30 ' : 'cursor-pointer'}
              ${dark
                ? `bg-slate-800/90 border border-slate-600 ${!isEnd ? 'hover:bg-slate-800' : ''}`
                : `bg-white/90 border border-gray-300 ${!isEnd ? 'hover:bg-white' : ''}`}
              `}
            onClick={handleNextClick}
            disabled={isEnd}
            aria-label="Next image"
          >
            <svg
              className={`size-[19px] ${isEnd ? 'text-gray-400' : (dark ? 'text-yellow-400' : 'text-green-600')}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Custom Pagination Styles */}
      <style jsx global>{`
          .gallery-swiper .swiper-pagination {
            bottom: 10px !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 6px 4px !important;
            border-radius: 20px !important;
            backdrop-filter: blur(12px) !important;
            width: auto !important;
            height: auto !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            position: absolute !important;
            transition: all 0.3s ease !important; 
            opacity: 0;
          }
          .gallery-swiper:hover .swiper-pagination {
            opacity: 1;
          }
          
          @media (min-width: 768px) {
            .gallery-swiper .swiper-pagination {
              opacity: 1;
            }
          }

          .gallery-swiper .swiper-pagination-bullet {
            width: 8px !important;
            height: 8px !important;
            background: ${dark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.5)'} !important;
            opacity: 1 !important;
            margin: 0 4px !important;
            transition: all 0.3s ease !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            position: relative !important;
            display: inline-block !important;
            border: none !important;
            outline: none !important;
          }

          .gallery-swiper .swiper-pagination-bullet::before {
            content: '' !important;
            position: absolute !important;
            top: -4px !important;
            left: -4px !important;
            right: -4px !important;
            bottom: -4px !important;
            border-radius: 50% !important;
            background: transparent !important;
            transition: background 0.2s ease !important;
          }

          .gallery-swiper .swiper-pagination-bullet-active {
            background: ${dark ? '#facc15' : '#fff'} !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5) !important;
          }

          .gallery-swiper .swiper-pagination-bullet:hover {
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
          }

          .gallery-swiper {
            --swiper-theme-color: ${dark ? '#facc15' : '#16a34a'};
            --swiper-pagination-color: ${dark ? '#facc15' : '#16a34a'};
          }
          
          @media (max-width: 768px) {
            .gallery-swiper .swiper-pagination-bullet {
              margin: 0 6px !important;
              width: 10px !important;
              height: 10px !important;
              display: inline-flex !important;
              align-items: center !important;
              justify-content: center !important;
              background: transparent !important;
            }

            .gallery-swiper .swiper-pagination-bullet::after {
              content: '' !important;
              width: 8px !important;
              height: 8px !important;
              background: ${dark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.8)'} !important;
              border-radius: 50% !important;
              transition: all 0.3s ease !important;
            }

            .gallery-swiper .swiper-pagination-bullet-active::after {
              background: ${dark ? '#facc15' : '#ffffff'} !important;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
            }

            .gallery-swiper .swiper-pagination-bullet:hover::after {
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
            }

            /* Modal-specific always appeared dots for < lg screens */
            @media (max-width: 1023px) {
            .gallery-swiper.modal-gallery .swiper-pagination {
              opacity: 1 !important;
            }
           }

           /* Modal-specific smaller pagination for < md screens */
           .gallery-swiper.modal-gallery .swiper-pagination {
             padding: 4.5px 1.5px !important;
           }

           .gallery-swiper.modal-gallery .swiper-pagination-bullet {
             margin: 0 4px !important;
             width: 8px !important;
             height: 8px !important;
           }

           .gallery-swiper.modal-gallery .swiper-pagination-bullet::after {
             width: 7px !important;
             height: 7px !important;
           }
          }
        `}</style>
    </div>
  );
}