'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/lib/store/features/cartSlice';
import { MenuItem as MenuItemType, Review, convertToFarsiNumbers, getAllergensInLanguage, unitTranslations } from '@/types/api';
import { fetchReviews } from '@/api/menu';
import Button from '@/components/Button';
import ReviewsTab from './ReviewsTab';
import Line from '@/components/Line';
import GallerySlider from '@/components/GallerySlider';
import { useScrollLock } from '@/hooks/useScrollLock';
import { AiOutlineClockCircle } from 'react-icons/ai';

interface ItemModalProps {
  item: MenuItemType;
  onClose: () => void;
  onImageError: (itemId: string) => void;
  failedImages: Set<string>;
  getCategoryDisplayName: (category: string) => string;
  showOnlyPopular?: boolean;
  isInShoppingCart?: boolean;
}

const getFullImageUrl = (imagePath: string): string => {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const BUCKET_NAME = "public_images";

  const sanitizedPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${sanitizedPath}`;
};

export default function ItemModal({
  item,
  onClose,
  onImageError,
  failedImages,
  getCategoryDisplayName,
  showOnlyPopular = false,
  isInShoppingCart = false,
}: ItemModalProps) {
  const { t, i18n } = useTranslation();
  const dark = useSelector((state: RootState) => state.theme.dark);
  const dispatch = useDispatch(); // Initialize the dispatch hook
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const itemQuantityInCart = cartItems.find(cartItem => cartItem.id === item.id)?.quantity || 0;
  console.log(item);

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [, setHasMounted] = useState(false);

  // New refs for drag detection
  const modalContentRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  const currentLang = i18n.language as 'en' | 'fa';
  const isFarsi = currentLang === 'fa';

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const itemImages = item ? (item.images || []).map(getFullImageUrl) : [];
  const handleIncrementQuantity = () => {
    if (item) {
      dispatch(addToCart({
        id: item.id,
        name_en: item.name_en,
        name_fa: item.name_fa,
        price_en: item.price_en,
        price_fa: item.price_fa,
        images: item.images,
        description_en: item.description_en,
        description_fa: item.description_fa,
        is_popular: item.is_popular,
        category: item.category,
        nutritional_info: item.nutritional_info,
        allergens: item.allergens
      }));
    }
  };

  const maxDeliveryTime = cartItems.length > 0
    ? Math.max(...cartItems.map(item => item.estimated_delivery_time_minutes || 0))
    : item.estimated_delivery_time_minutes || 0;

  const minEstimate = maxDeliveryTime;
  const maxEstimate = maxDeliveryTime + 5;

  const loadReviews = async (itemId: string) => {
    setReviewsLoading(true);
    setReviewsError(null);
    try {
      const data = await fetchReviews(itemId);
      setReviews(data);
    } catch {
      setReviewsError('Failed to load reviews. Please try again.');
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (item) {
      setIsOpen(true);
      loadReviews(item.id);
    } else {
      setIsOpen(false);
    }
  }, [item]);

  useScrollLock(isOpen);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
      setActiveTab('details');
      setReviews([]);
      setReviewsError(null);
    }, 300);
  };

  const handleImageError = () => {
    if (item) {
      onImageError(item.id);
    }
  };

  const renderStars = (rating: number, isLink?: boolean, onClick?: (event: React.MouseEvent) => void) => {
    return (
      <div onClick={onClick} className={`flex items-center gap-1 ${isLink && 'cursor-pointer'}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="transition-transform duration-200 cursor-pointer"
          >
            <svg
              className={`w-5 h-5 ${star <= rating
                ? 'text-yellow-400 fill-current'
                : dark ? 'text-slate-600' : 'text-gray-300'
                }`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only track if the click is on the backdrop itself
    if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
      draggedRef.current = false;
      startPosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) { // Check if the left mouse button is held down
      const distance = Math.sqrt(
        Math.pow(e.clientX - startPosRef.current.x, 2) +
        Math.pow(e.clientY - startPosRef.current.y, 2)
      );
      if (distance > 10) { // A threshold of 10 pixels to detect a drag
        draggedRef.current = true;
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    // Only handle if the mouse up is on the backdrop and no drag was detected
    if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
      if (!draggedRef.current) {
        handleClose();
      }
    }
  };

  if (!item && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-3 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 backdrop-blur-sm bg-black/50' : 'opacity-0 pointer-events-none bg-black/0'
        }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        ref={modalContentRef}
        className={`w-full ${!isInShoppingCart ? 'max-w-2xl max-h-[86vh] md:max-h-[90vh]' : 'md:max-w-[500px] max-h-[69vh] md:max-h-[79vh]'} flex flex-col overflow-hidden rounded-2xl transition-all duration-300 ease-in-out transform ${dark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-green-100'
          } ${isOpen ? 'scale-100' : 'scale-95'}`}
      >
        {/* Header */}
        <div className={`sticky top-0 z-40 border-b border-opacity-20 ${dark ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between p-4 pt-3">
            <h2 className={`text-[17px] md:text-xl font-bold ${dark ? 'text-blue-200' : 'text-green-900'}`}>
              {isFarsi ? item?.name_fa : item?.name_en}
            </h2>
            <button
              onClick={handleClose}
              className={`p-2 rounded-full transition-colors duration-300 cursor-pointer ${dark ? 'hover:bg-slate-700 text-blue-200' : 'hover:bg-green-100 text-green-600'
                }`}
            >
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-opacity-20">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${isFarsi ? 'rounded-tl-3xl' : 'rounded-tr-3xl'} ${activeTab === 'details'
                ? dark
                  ? 'border-b-2 border-yellow-400 text-yellow-400'
                  : 'border-b-2 border-green-600 text-green-600'
                : dark
                  ? 'border-b-2 border-slate-700 text-blue-200 hover:bg-slate-900/50'
                  : 'border-b-2 border-white text-green-700 hover:bg-green-50'
                } ${activeTab !== 'details' && 'cursor-pointer'} outline-none`}
            >
              {t('modal.details') || 'Details'}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${isFarsi ? 'rounded-tr-3xl' : 'rounded-tl-3xl'} ${activeTab === 'reviews'
                ? dark
                  ? 'border-b-2 border-yellow-400 text-yellow-400'
                  : 'border-b-2 border-green-600 text-green-600'
                : dark
                  ? 'border-b-2 border-slate-700 text-blue-200 hover:bg-slate-900/50'
                  : 'border-b-2 border-white text-green-700 hover:bg-green-50'
                } ${activeTab !== 'reviews' && 'cursor-pointer'} outline-none`}
            >
              {t('modal.reviews') || 'Reviews'}
              {reviewsLoading ? (
                <span className={`px-[2px] py-0.5 rounded-full text-xs flex items-center justify-center ${dark ? 'text-blue-200' : 'text-green-700'
                  }`}>
                  <svg className={`animate-spin h-4 w-4 ${dark ? 'text-blue-200' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : (
                <span className={`min-w-5 px-1.5 py-0.5 rounded-full text-xs ${dark ? 'bg-slate-700 text-blue-200' : 'bg-green-100 text-green-700'
                  }`}>
                  {reviews.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className={`custom_scrollbar flex-1 overflow-y-auto overflow-x-hidden ${dark ? 'dark_mode_scrollbar' : 'light_mode_scrollbar'}`}>
          {activeTab === 'details' ? (
            <>
              {/* Image Gallery */}
              <div className="relative h-64">
                <GallerySlider
                  images={itemImages}
                  alt={isFarsi ? item?.name_fa || '' : item?.name_en || ''}
                  onImageError={handleImageError}
                  failedImages={failedImages}
                  dark={dark}
                  effect="slide"
                  isModal={true}
                />

                {/* Badges */}
                <div className="absolute top-3 right-3 flex gap-2 z-30">
                  {(item?.is_popular || showOnlyPopular) && (
                    <div className={`text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-lg backdrop-blur-sm ${dark
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900'
                      : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-900'
                      }`}>
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {isFarsi ? 'پرطرفدار' : 'Popular'}
                    </div>
                  )}
                </div>

                {item && <div className="absolute top-3 left-3 z-30">
                  <div className={`px-2 py-0.5 rounded-full text-[13px] font-bold backdrop-blur-sm ${dark ? 'bg-slate-900/80 text-yellow-400 border border-yellow-400/30' : 'bg-white/90 text-green-800 border border-green-200'}`}>
                    {isFarsi ? item.price_fa : item.price_en.toLocaleString('en-US')} {isFarsi ? 'ریال' : 'Rials'}
                  </div>
                </div>}

                <div className={`absolute bottom-[10px] ${!isFarsi ? 'left-3' : 'right-3'} z-30`}>
                  <div className={`flex items-center text-xs font-bold px-[3px] py-[.5px] rounded-full shadow-inner ${dark ? 'bg-slate-900/70 text-yellow-400' : 'bg-white/70 text-green-950'}`}>
                    <AiOutlineClockCircle size={14} className={`${!isFarsi ? 'mr-1.5' : 'ml-1.5'}`} />
                    {!isFarsi ? minEstimate : convertToFarsiNumbers(minEstimate)} - {!isFarsi ? maxEstimate : convertToFarsiNumbers(maxEstimate)}
                    <span className={`${!isFarsi ? 'ml-1.5' : 'mr-1.5'}`}>
                      {!isFarsi ? 'min' : 'دقیقه'}
                    </span>
                  </div>
                </div>
              </div>

              {reviews.length > 0 && (
                <>
                  <div
                    onClick={() => setActiveTab('reviews')}
                    className={`py-8 sm:py-5 px-3 sm:px-6 cursor-pointer transition-all duration-200 group relative`}>
                    <div className={`flex items-center gap-4`}>
                      <div className="flex items-center gap-2">
                        {renderStars(Math.round(averageRating))}
                        <span className={`text-sm font-medium ${dark ? 'text-blue-200' : 'text-green-700'}`}>
                          {averageRating.toFixed(1)}
                        </span>
                      </div>
                      <span className={`text-sm ${dark ? 'text-blue-300' : 'text-green-600'}`}>
                        ({reviews.length} {!isFarsi ? (reviews.length === 1 ? t('modal.review') || 'review' : t('modal.reviews') || 'reviews') : (t('modal.review') || 'review')})
                      </span>
                      <div className={`absolute ${isFarsi ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 
                      opacity-0 group-hover:opacity-100 
                      transition-all duration-300 ease-in-out
                      ${isFarsi ? 'translate-x-2 group-hover:translate-x-0' : '-translate-x-2 group-hover:translate-x-0'}`}>
                        <svg
                          className={`w-5 h-5 ${dark ? 'text-blue-200' : 'text-green-600'} ${isFarsi ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <Line />
                </>
              )}

              {/* Details Content */}
              <div className="pt-3 pb-4 px-3 sm:px-6">
                <div className={`mb-4 ${isFarsi ? 'text-right' : 'text-left'}`}>
                  <p className={`text-base leading-relaxed ${dark ? 'text-blue-100' : 'text-green-700'}`}>
                    {isFarsi ? item?.description_fa : item?.description_en}
                  </p>
                </div>
                <Line />

                {item && (
                  <div className={`space-y-4 py-4`}>
                    <div>
                      <h3 className={`text-sm font-semibold mb-2 ${dark ? 'text-[#ffc903]' : 'text-green-950'}`}>
                        {t('item_details.nutritional_info') || 'Nutritional Information'}
                      </h3>
                      <div className={`md:grid grid-cols-3 gap-2 text-[13px] ${dark ? 'text-blue-200' : 'text-green-800'}`}>
                        <div className='flex mt-2 md:mt-1'>
                          <p>{t('item_details.calories') || 'Calories'}:</p>
                          <span className={`${dark ? 'text-blue-100' : 'text-green-700'} ${isFarsi ? 'mr-1' : 'ml-1'}`}>
                            {isFarsi ? convertToFarsiNumbers(item.nutritional_info.calories) : item.nutritional_info.calories} {unitTranslations.kcal[currentLang]}
                          </span>
                        </div>
                        <div className='flex mt-2 md:mt-1'>
                          <p>{t('item_details.protein') || 'Protein'}:</p>
                          <span className={`${dark ? 'text-blue-100' : 'text-green-700'} ${isFarsi ? 'mr-1' : 'ml-1'}`}>
                            {isFarsi ? convertToFarsiNumbers(item.nutritional_info.protein) : item.nutritional_info.protein} {unitTranslations.g[currentLang]}
                          </span>
                        </div>
                        <div className='flex mt-2 md:mt-1'>
                          <p>{t('item_details.carbs') || 'Carbs'}:</p>
                          <span className={`${dark ? 'text-blue-100' : 'text-green-700'} ${isFarsi ? 'mr-1' : 'ml-1'}`}>
                            {isFarsi ? convertToFarsiNumbers(item.nutritional_info.carbs) : item.nutritional_info.carbs} {unitTranslations.g[currentLang]}
                          </span>
                        </div>
                        <div className='flex mt-2 md:mt-1'>
                          <p>{t('item_details.fats') || 'Fats'}:</p>
                          <span className={`${dark ? 'text-blue-100' : 'text-green-700'} ${isFarsi ? 'mr-1' : 'ml-1'}`}>
                            {isFarsi ? convertToFarsiNumbers(item.nutritional_info.fats) : item.nutritional_info.fats} {unitTranslations.g[currentLang]}
                          </span>
                        </div>
                      </div>
                    </div>
                    {item.allergens && item.allergens.length > 0 && (
                      <div>
                        <h3 className={`text-sm font-semibold mb-2 ${dark ? 'text-[#ffc903]' : 'text-green-950'}`}>
                          {t('item_details.allergens') || 'Allergens'}
                        </h3>
                        <p className={`text-[13px] ${dark ? 'text-red-300' : 'text-red-500'}`}>
                          {getAllergensInLanguage(item.allergens, currentLang).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <Line />
                <div className={`flex ${isFarsi ? 'flex-row-reverse' : 'flex-row'} justify-between items-center pt-4`}>
                  <span className={`text-xs px-2 py-1 rounded-full ${dark ? 'bg-slate-700 text-blue-200' : 'bg-green-100 text-green-700'
                    }`}>
                    {item?.category ? getCategoryDisplayName(item.category) : ''}
                  </span>
                  <div className='flex items-center'>
                    <Button text={t('menu.add_to_cart')} onClick={handleIncrementQuantity} />
                    {/* Quantity Badge */}
                    {itemQuantityInCart > 0 && (
                      <div className={`wrapper bg-red-500 text-white size-8 ${!isFarsi ? 'ml-2' : 'mr-2'} rounded-full text-sm font-bold flex items-center justify-center`}>
                        {isFarsi ? convertToFarsiNumbers(itemQuantityInCart) : itemQuantityInCart}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <ReviewsTab
              item={item}
              reviews={reviews}
              setReviews={setReviews}
              loadReviews={loadReviews}
              reviewsLoading={reviewsLoading}
              reviewsError={reviewsError}
            />
          )}
        </div>
      </div>
    </div>
  );
}