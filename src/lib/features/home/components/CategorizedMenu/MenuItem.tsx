'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { useDispatch } from 'react-redux';
import { addToCart, decrementQuantity } from '@/lib/store/features/cartSlice';
import { MenuItem as MenuItemType, convertToFarsiNumbers } from '@/types/api';
import Line from '@/components/Line';
import Button from '@/components/Button';
import GallerySlider from '@/components/GallerySlider';
import { useInView } from 'react-intersection-observer';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineClockCircle } from 'react-icons/ai';

interface ItemProps {
  item: MenuItemType;
  onImageError: (itemId: string) => void;
  failedImages: Set<string>;
  getCategoryDisplayName: (category: string) => string;
  onItemClick?: (item: MenuItemType) => void;
  showOnlyPopular?: boolean;
}

// Function to construct the image URL
const getFullImageUrl = (imagePath: string): string => {
  const SUPABASE_URL = "https://cyzwgmruoqhdztzcgcmr.supabase.co";
  const BUCKET_NAME = "public_images";

  // This removes the leading '/' if it exists
  const sanitizedPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${sanitizedPath}`;
};

export default function MenuItem({
  item,
  onImageError,
  failedImages,
  getCategoryDisplayName,
  onItemClick,
  showOnlyPopular = false,
}: ItemProps) {
  const { t, i18n } = useTranslation();
  const dark = useSelector((state: RootState) => state.theme.dark);
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const itemQuantityInCart = cartItems.find(cartItem => cartItem.id === item.id)?.quantity || 0;

  const currentLang = i18n.language as 'en' | 'fa';
  const isFarsi = currentLang === 'fa';

  const formattedPrice = isFarsi ? item.price_fa : item.price_en.toLocaleString('en-US');

  // Prepare images array from the MenuItem's images property and convert to full URLs
  const itemImages = (item.images || []).map(getFullImageUrl);

  // Intersection Observer hooks
  const { ref: mobileRef, inView: mobileInView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  const { ref: desktopRef, inView: desktopInView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  // Animation classes
  const mobileAnimationClasses = mobileInView
    ? 'opacity-100 translate-y-0 transition-all duration-700 ease-out'
    : 'opacity-0 translate-y-4';

  const desktopAnimationClasses = desktopInView
    ? 'opacity-100 translate-y-0 transition-all duration-700 ease-out'
    : 'opacity-0 translate-y-4';

  const maxDeliveryTime = cartItems.length > 0
    ? Math.max(...cartItems.map(item => item.estimated_delivery_time_minutes || 0))
    : item.estimated_delivery_time_minutes || 0;

  const minEstimate = maxDeliveryTime;
  const maxEstimate = maxDeliveryTime + 5;

  const handleIncrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart({
      id: item.id,
      name_en: item.name_en,
      name_fa: item.name_fa,
      price_en: item.price_en,
      price_fa: item.price_fa,
      description_en: item.description_en,
      description_fa: item.description_fa,
      is_popular: item.is_popular,
      category: item.category,
      nutritional_info: item.nutritional_info,
      allergens: item.allergens,
      images: item.images,
      estimated_delivery_time_minutes: item.estimated_delivery_time_minutes
    }));
  };

  const handleDecrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(decrementQuantity(item.id));
  };

  const handleImageError = (imageUrl: string) => {
    // This is a simple fix for the onImageError function
    onImageError(item.id);
  };

  const handleItemClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevents the modal from opening when clicking on Swiper controls (nav buttons, dots)
    const isSwiperControl = (e.target as HTMLElement).closest('.swiper-button-prev, .swiper-button-next, .swiper-pagination-bullet');
    if (!isSwiperControl) {
      onItemClick?.(item);
    }
  };

  return (
    <>
      {/* Mobile Layout */}
      <div
        ref={mobileRef}
        className={`${!isFarsi ? 'min-h-[132px]' : 'min-h-[137px]'} md:hidden w-full flex items-center py-4 px-2 transition-all duration-300 cursor-pointer ${dark
          ? 'bg-slate-800/90 hover:bg-slate-700/90'
          : 'bg-white/95 hover:bg-green-50/80'
          } ${mobileAnimationClasses}`}
        onClick={handleItemClick}
      >
        <div className="size-18 rounded-lg overflow-hidden flex-shrink-0">
          <GallerySlider
            images={itemImages}
            alt={isFarsi ? item.name_fa : item.name_en}
            onImageError={handleImageError}
            failedImages={failedImages}
            dark={dark}
            className="rounded-lg"
            effect="fade"
          />
        </div>

        <div className={`absolute top-[30px] left-[8px] z-30`}>
          <div className={`flex items-center text-[9px] rounded-t-lg shadow-inner ${dark ? 'bg-slate-700/70 text-yellow-500 px-[3.5px]' : 'bg-white/70 text-green-900 px-[1.4px] font-bold'}`}>
            <AiOutlineClockCircle size={9} className={`${!isFarsi ? 'mr-1' : 'ml-1'}`} />
            {!isFarsi ? minEstimate : convertToFarsiNumbers(minEstimate)} - {!isFarsi ? maxEstimate : convertToFarsiNumbers(maxEstimate)}
            <span className={`${!isFarsi ? 'ml-1' : 'mr-1'}`}>
              {!isFarsi ? 'min' : 'دقیقه'}
            </span>
          </div>
        </div>

        <div className='flex'>
          <div className={`flex-1 mx-4 ${isFarsi ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center justify-between mb-1">
              <h3 className={`text-sm md:text-lg font-bold ${dark ? 'text-blue-200' : 'text-green-900'} ${isFarsi ? 'order-2' : 'order-1'}`}>
                {isFarsi ? item.name_fa : item.name_en}
              </h3>
            </div>

            <p className={`text-xs mt-2 ${dark ? 'text-blue-100' : 'text-green-700'} line-clamp-2`}>
              {isFarsi ? item.description_fa : item.description_en}
            </p>

            <div className={`flex items-center gap-2 mt-2`}>
              {(item.is_popular || showOnlyPopular) && (
                <div className={`text-xs font-bold py-1 px-2 rounded-full ${dark ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900' : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-900'}`}>
                  ⭐
                </div>
              )}
              <span className={`text-xs md:text-lg font-bold ${dark ? 'text-yellow-400' : 'text-green-800'}`}>
                {formattedPrice} {!isFarsi && 'Rials'} {isFarsi && 'ریال'}
              </span>
            </div>
          </div>
        </div>

        {itemQuantityInCart > 0 ? (
          <div className="flex flex-col items-center gap-3">
            <Button onClick={handleDecrementQuantity}
              className={`size-4`}
              bgColor={`${dark ? 'bg-slate-900' : 'bg-white'}`}
              textColor={`${dark ? 'text-yellow-500' : 'text-green-600'}`}
              icon={<AiOutlineMinus className="size-3" />}
              optionalPaddingAndGapClasses='py-[13px] px-[7px]'
            />
            <span
              className={`min-w-[24px] text-center text-[16px] font-bold
              ${dark ? 'text-blue-200' : 'text-green-700'}`}>
              {isFarsi ? convertToFarsiNumbers(itemQuantityInCart) : itemQuantityInCart}
            </span>
            <Button onClick={handleIncrementQuantity}
              className={`size-4`}
              icon={<AiOutlinePlus className="size-3" />}
              optionalPaddingAndGapClasses='py-[13px] px-[7px]'
            />
          </div>
        ) : (
          <Button
            text={t('menu.mobile_add_to_cart')}
            onClick={handleIncrementQuantity}
            textSize={isFarsi ? 'text-[11px]' : 'text-xs'}
            optionalPaddingAndGapClasses='px-3 py-1.5'
          />
        )}
      </div>

      <div className="md:hidden">
        <Line width={'100vw'} isAnimated={true} />
      </div>

      {/* Desktop Layout */}
      <div
        ref={desktopRef}
        className={`hidden md:flex flex-col group relative overflow-hidden rounded-3xl shadow-lg transition-all duration-500 transform cursor-pointer h-full ${dark
          ? 'bg-slate-800/90 border border-slate-700 backdrop-blur-sm hover:border-yellow-500'
          : 'bg-white/95 border border-green-200 backdrop-blur-sm hover:border-green-600'
          } ${desktopAnimationClasses}`}
        onClick={handleItemClick}
      >
        <div className="relative h-56 overflow-hidden">
          <GallerySlider
            images={itemImages}
            alt={isFarsi ? item.name_fa : item.name_en}
            onImageError={handleImageError}
            failedImages={failedImages}
            dark={dark}
            effect="slide"
          />

          {/* Popular Badge */}
          {item.is_popular && (
            <div className="absolute top-4 right-4 z-30">
              <div className={`text-[13px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-lg backdrop-blur-sm ${dark ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900' : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-900'}`}>
                {isFarsi ? 'پرطرفدار' : 'Popular'}
                <svg className={`w-3 h-3 ${isFarsi ? 'mr-0.5' : 'ml-0.5'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          )}

          {/* Price Badge */}
          <div className="absolute top-4 left-4 z-30">
            <div className={`px-2 py-0.5 rounded-full text-[13px] font-bold backdrop-blur-sm ${dark ? 'bg-slate-900/80 text-yellow-400 border border-yellow-400/30' : 'bg-white/90 text-green-800 border border-green-200'}`}>
              {formattedPrice} {isFarsi ? 'ریال' : 'Rials'}
            </div>
          </div>

          <div className={`absolute bottom-[12px] ${!isFarsi ? 'left-4' : 'right-4'} z-30`}>
            <div className={`flex items-center text-xs font-bold px-[3px] py-[.7px] rounded-full shadow-inner ${dark ? 'bg-slate-900/70 text-yellow-400' : 'bg-white/70 text-green-950'}`}>
              <AiOutlineClockCircle size={14} className={`${!isFarsi ? 'mr-1.5' : 'ml-1.5'}`} />
              {!isFarsi ? minEstimate : convertToFarsiNumbers(minEstimate)} - {!isFarsi ? maxEstimate : convertToFarsiNumbers(maxEstimate)}
              <span className={`${!isFarsi ? 'ml-1.5' : 'mr-1.5'}`}>
                {!isFarsi ? 'min' : 'دقیقه'}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 px-4 flex flex-col flex-grow">
          <div className={`mb-3 ${isFarsi ? 'text-right' : 'text-left'} flex-grow`}>
            <h3 className={`mb-2 font-bold ${dark ? 'text-blue-200' : 'text-green-900'}`}>
              {isFarsi ? item.name_fa : item.name_en}
            </h3>
            <p className={`text-sm leading-relaxed ${dark ? 'text-blue-100' : 'text-green-700'} ${isFarsi ? 'text-right' : 'text-left'}`}>
              {isFarsi ? item.description_fa : item.description_en}
            </p>
          </div>

          <div className={`flex ${isFarsi ? 'flex-row-reverse' : 'flex-row'} justify-between items-center py-4 border-t ${dark ? 'border-slate-700' : 'border-green-100'}`}>
            <span className={`text-xs px-2 py-1 rounded-full ${dark ? 'bg-slate-700 text-blue-200' : 'bg-green-100 text-green-700'}`}>
              {getCategoryDisplayName(item.category)}
            </span>

            <div className="min-h-11 flex items-center gap-3">
              {itemQuantityInCart > 0 ? (
                <div className="flex items-center gap-3">
                  <Button onClick={handleDecrementQuantity}
                    className={`size-4`}
                    bgColor={`${dark ? 'bg-slate-900' : 'bg-white'}`}
                    textColor={`${dark ? 'text-yellow-500' : 'text-green-600'}`}
                    icon={<AiOutlineMinus className="size-3" />}
                    optionalPaddingAndGapClasses='px-[7px] py-[13px]'
                  />
                  <span className={`min-w-[24px] text-center text-lg font-bold
                    ${dark ? 'text-blue-200' : 'text-green-700'}`}>
                    {isFarsi ? convertToFarsiNumbers(itemQuantityInCart) : itemQuantityInCart}
                  </span>
                  <Button onClick={handleIncrementQuantity}
                    className={`size-4`}
                    icon={<AiOutlinePlus className="size-3" />}
                    optionalPaddingAndGapClasses='px-[7px] py-[13px]'
                  />
                </div>
              ) : (
                <Button text={t('menu.add_to_cart')} onClick={handleIncrementQuantity} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}