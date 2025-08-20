'use client';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { MenuItem as MenuItemType, Review, convertToFarsiNumbers, getAllergensInLanguage, unitTranslations } from '@/types/api';
import { useEffect, useState } from 'react';
import { fetchReviews } from '@/api/menu';
import Button from '@/components/Button';
import ReviewsTab from './ReviewsTab';
import Line from '@/components/Line';

interface ItemModalProps {
  item: MenuItemType | null;
  onClose: () => void;
  onImageError: (itemId: string) => void;
  failedImages: Set<string>;
  getCategoryDisplayName: (category: string) => string;
  showOnlyPopular?: boolean;
}

export default function ItemModal({
  item,
  onClose,
  onImageError,
  failedImages,
  getCategoryDisplayName,
  showOnlyPopular = false
}: ItemModalProps) {
  const { t, i18n } = useTranslation();
  const dark = useSelector((state: RootState) => state.theme.dark);

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  const currentLang = i18n.language as 'en' | 'fa';
  const isFarsi = currentLang === 'fa';

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  // Ensure component is hydrated before any operations
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Fetch reviews for the item using the API service
  const loadReviews = async (itemId: string) => {
    setReviewsLoading(true);
    setReviewsError(null);

    try {
      const data = await fetchReviews(itemId);
      setReviews(data);
    } catch (error) {
      setReviewsError('Failed to load reviews. Please try again.');
    } finally {
      setReviewsLoading(false);
    }
  };

  // Effect to handle background scroll lock
  useEffect(() => {
    if (!hasMounted) return;

    if (item) {
      const scrollY = window.scrollY;
      document.body.style.setProperty('--scroll-y', `${scrollY}px`);
      document.body.classList.add('modal-scroll-lock');
      document.body.style.top = `-${scrollY}px`;
    } else {
      const scrollY = document.body.style.getPropertyValue('--scroll-y');
      document.body.classList.remove('modal-scroll-lock');
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY) || 0);
      }
    }

    return () => {
      if (item) {
        const scrollY = document.body.style.getPropertyValue('--scroll-y');
        document.body.classList.remove('modal-scroll-lock');
        document.body.style.top = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY) || 0);
        }
      }
    };
  }, [item, hasMounted]);

  useEffect(() => {
    if (item) {
      setIsOpen(true);
      // Fetch reviews when modal opens
      loadReviews(item.id);
    } else {
      setIsOpen(false);
    }
  }, [item]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
      setActiveTab('details');
      setReviews([]);
      setReviewsError(null);
    }, 300);
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

  if (!item && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[5000] flex items-center justify-center p-3 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 backdrop-blur-sm bg-black/50' : 'opacity-0 pointer-events-none bg-black/0'
        }`}
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-2xl max-h-[87vh] md:max-h-[90vh] overflow-hidden rounded-2xl transition-all duration-300 ease-in-out transform ${dark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-green-100'
          } ${isOpen ? 'scale-100' : 'scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-opacity-20">
          <div className="flex items-center justify-between p-4 pt-3">
            <h2 className={`text-[17px] md:text-xl font-bold ${dark ? 'text-blue-200' : 'text-green-900'}`}>
              {isFarsi ? item?.name_fa : item?.name_en}
            </h2>
            <button
              onClick={handleClose}
              className={`p-2 rounded-full transition-colors duration-300 cursor-pointer ${dark ? 'hover:bg-slate-700 text-blue-200' : 'hover:bg-green-100 text-green-600'
                }`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                } cursor-pointer outline-none`}
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
                } cursor-pointer outline-none`}
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
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${dark ? 'bg-slate-700 text-blue-200' : 'bg-green-100 text-green-700'
                  }`}>
                  {reviews.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className={`custom_scrollbar overflow-x-hidden ${dark ? 'dark_mode_scrollbar' : 'light_mode_scrollbar'
          } overflow-y-auto max-h-[calc(90vh-120px)]`}>
          {activeTab === 'details' ? (
            <>
              {/* Image */}
              <div className="relative h-64">
                {!failedImages.has(item?.id || '') ? (
                  <img
                    src={item?.image}
                    alt={isFarsi ? item?.name_fa : item?.name_en}
                    className="w-full h-full object-cover"
                    onError={() => onImageError(item?.id || '')}
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${dark ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-green-50 to-green-100'
                    }`}>
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
                )}

                {/* Badges */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {(item?.is_popular || showOnlyPopular) && (
                    <div className={`text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-lg ${dark
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

                {item && <div className="absolute top-4 left-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm ${dark
                    ? 'bg-slate-900/80 text-yellow-400 border border-yellow-400/30'
                    : 'bg-white/90 text-green-800 border border-green-200'
                    }`}>
                    {/* Inline the price formatting logic */}
                    {isFarsi ? item.price_fa : item.price_en.toLocaleString('en-US')} {isFarsi ? 'ریال' : 'Rials'}
                  </div>
                </div>}
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

                      {/* Arrow Icon */}
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
              <div className="py-8 sm:py-5 px-3 sm:px-6">
                <div className={`mb-4 ${isFarsi ? 'text-right' : 'text-left'}`}>
                  <p className={`text-base leading-relaxed ${dark ? 'text-blue-100' : 'text-green-700'}`}>
                    {isFarsi ? item?.description_fa : item?.description_en}
                  </p>
                </div>
                <Line />

                {/* --- Nutritional Info and Allergens Section --- */}
                {item && (
                  <div className={`space-y-4 py-4`}>
                    {/* Nutritional Information */}
                    <div>
                      <h3 className={`text-sm font-semibold mb-2 ${dark ? 'text-[#ffc903]' : 'text-green-950'}`}>
                        {t('item_details.nutritional_info') || 'Nutritional Information'}
                      </h3>
                      <div className={`md:grid grid-cols-3 gap-2 text-[13px] ${dark ? 'text-blue-200' : 'text-green-800'}`}>
                        {/* Calories */}
                        <div className='flex mt-2 md:mt-1'>
                          <p>{t('item_details.calories') || 'Calories'}:</p>
                          <span className={`${dark ? 'text-blue-100' : 'text-green-700'} ${isFarsi ? 'mr-1' : 'ml-1'}`}>
                            {isFarsi ? convertToFarsiNumbers(item.nutritional_info.calories) : item.nutritional_info.calories} {unitTranslations.kcal[currentLang]}
                          </span>
                        </div>
                        {/* Protein */}
                        <div className='flex mt-2 md:mt-1'>
                          <p>{t('item_details.protein') || 'Protein'}:</p>
                          <span className={`${dark ? 'text-blue-100' : 'text-green-700'} ${isFarsi ? 'mr-1' : 'ml-1'}`}>
                            {isFarsi ? convertToFarsiNumbers(item.nutritional_info.protein) : item.nutritional_info.protein} {unitTranslations.g[currentLang]}
                          </span>
                        </div>
                        {/* Carbs */}
                        <div className='flex mt-2 md:mt-1'>
                          <p>{t('item_details.carbs') || 'Carbs'}:</p>
                          <span className={`${dark ? 'text-blue-100' : 'text-green-700'} ${isFarsi ? 'mr-1' : 'ml-1'}`}>
                            {isFarsi ? convertToFarsiNumbers(item.nutritional_info.carbs) : item.nutritional_info.carbs} {unitTranslations.g[currentLang]}
                          </span>
                        </div>
                        {/* Fats */}
                        <div className='flex mt-2 md:mt-1'>
                          <p>{t('item_details.fats') || 'Fats'}:</p>
                          <span className={`${dark ? 'text-blue-100' : 'text-green-700'} ${isFarsi ? 'mr-1' : 'ml-1'}`}>
                            {isFarsi ? convertToFarsiNumbers(item.nutritional_info.fats) : item.nutritional_info.fats} {unitTranslations.g[currentLang]}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Allergens */}
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
                {/* End of the Section */}

                <div className={`flex ${isFarsi ? 'flex-row-reverse' : 'flex-row'} justify-between items-center pt-4`}>
                  <span className={`text-xs px-2 py-1 rounded-full ${dark ? 'bg-slate-700 text-blue-200' : 'bg-green-100 text-green-700'
                    }`}>
                    {item?.category ? getCategoryDisplayName(item.category) : ''}
                  </span>

                  <Button text={t('menu.add_to_cart')} />
                </div>
              </div>
            </>
          ) : (
            /* Reviews Tab */
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