'use client';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { MenuItem as MenuItemType, Review, CreateReviewRequest } from '@/types/api';
import { useEffect, useState, useRef } from 'react';
import { fetchReviews, createReview } from '@/api/menu';

interface ItemModalProps {
  item: MenuItemType | null;
  onClose: () => void;
  onImageError: (itemId: number) => void;
  failedImages: Set<number>;
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
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    userName: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // scrollY is no longer needed for background scroll management in this approach
  // const scrollY = useRef(0); // This can be removed or kept if you have other uses for it

  const currentLang = i18n.language as 'en' | 'fa';
  const isFarsi = currentLang === 'fa';
  const fontClass = isFarsi ? 'font-farsi-chalkboard' : 'font-cursive';

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  // IMPORTANT: remove preventScroll function as we now allow background scroll
  const preventScroll = (e: Event) => {
    e.preventDefault();
  };

  // Fetch reviews for the item using the API service
  const loadReviews = async (itemId: number) => {
    setReviewsLoading(true);
    setReviewsError(null);

    try {
      const data = await fetchReviews(itemId);
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setReviewsError('Failed to load reviews. Please try again.');
    } finally {
      setReviewsLoading(false);
    }
  };

  // Submit new review using the API service
  const submitReview = async () => {
    if (!item || !newReview.rating || !newReview.comment.trim() || !newReview.userName.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const reviewData: CreateReviewRequest = {
        itemId: item.id,
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        userName: newReview.userName.trim()
      };

      const newReviewData = await createReview(reviewData);

      // Add the new review to the beginning of the list
      setReviews(prev => [newReviewData, ...prev]);

      // Reset form
      setNewReview({ rating: 0, comment: '', userName: '' });
      setHoveredRating(0);

    } catch (error) {
      console.error('Failed to submit review:', error);
      setSubmitError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (item) {
      setIsOpen(true);
      // scrollY.current = window.scrollY; 

      // IMPORTANT: Remove all event listeners that prevent background scrolling
      // document.addEventListener('wheel', preventScroll, { passive: false });
      // document.addEventListener('touchmove', preventScroll, { passive: false });
      // document.addEventListener('keydown', (e) => {
      //   if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
      //     e.preventDefault();
      //   }
      // });

      // Fetch reviews when modal opens
      loadReviews(item.id);
    } else {
      setIsOpen(false);
    }

    return () => {
      // document.removeEventListener('wheel', preventScroll);
      // document.removeEventListener('touchmove', preventScroll);
      // document.removeEventListener('keydown', preventScroll);
    };
  }, [item]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
      setActiveTab('details');
      setReviews([]);
      setNewReview({ rating: 0, comment: '', userName: '' });
      setHoveredRating(0);
      setReviewsError(null);
      setSubmitError(null);
      // IMPORTANT: Remove listeners from here too, if they were added (they aren't in the useEffect above now)
      // document.removeEventListener('wheel', preventScroll);
      // document.removeEventListener('touchmove', preventScroll);
      // document.removeEventListener('keydown', preventScroll);
    }, 300);
  };

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void, onHover?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform duration-200`}
            onClick={() => interactive && onRate && onRate(star)}
            onMouseEnter={() => interactive && onHover && onHover(star)}
            onMouseLeave={() => interactive && onHover && onHover(0)}
            disabled={!interactive}
          >
            <svg
              className={`w-5 h-5 ${star <= (interactive ? (hoveredRating || rating) : rating)
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLang === 'fa' ? 'fa-IR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!item && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 backdrop-blur-sm bg-black/50' : 'opacity-0 pointer-events-none bg-black/0'
        }`}
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl transition-all duration-300 ease-in-out transform ${dark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-green-100'
          } ${isOpen ? 'scale-100' : 'scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-opacity-20">
          <div className="flex items-center justify-between p-4">
            <h2 className={`text-xl font-bold ${dark ? 'text-blue-200' : 'text-green-900'}`}>
              {item?.name[currentLang]}
            </h2>
            <button
              onClick={handleClose}
              className={`p-2 rounded-full transition-colors cursor-pointer ${dark ? 'hover:bg-slate-700 text-blue-200' : 'hover:bg-green-100 text-green-600'
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
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'details'
                  ? dark
                    ? 'border-b-2 border-yellow-400 text-yellow-400'
                    : 'border-b-2 border-green-600 text-green-600'
                  : dark
                    ? 'text-blue-200 hover:text-yellow-400'
                    : 'text-green-700 hover:text-green-600'
                } cursor-pointer outline-none`}
            >
              {t('modal.details') || 'Details'}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'reviews'
                  ? dark
                    ? 'border-b-2 border-yellow-400 text-yellow-400'
                    : 'border-b-2 border-green-600 text-green-600'
                  : dark
                    ? 'text-blue-200 hover:text-yellow-400'
                    : 'text-green-700 hover:text-green-600'
                } cursor-pointer outline-none`}
            >
              {t('modal.reviews') || 'Reviews'}
              {reviews.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${dark ? 'bg-slate-700 text-blue-200' : 'bg-green-100 text-green-700'
                  }`}>
                  {reviews.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content - Apply custom-scrollbar classes here */}
        <div className={`custom_scrollbar ${dark ? 'dark_mode_scrollbar' : 'light_mode_scrollbar'
          } overflow-y-auto max-h-[calc(90vh-120px)]`}>
          {activeTab === 'details' ? (
            <>
              {/* Image */}
              <div className="relative h-64">
                {!failedImages.has(item?.id || -1) ? (
                  <img
                    src={item?.image}
                    alt={item?.name[currentLang]}
                    className="w-full h-full object-cover"
                    onError={() => onImageError(item?.id || -1)}
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
                  {(item?.isPopular || showOnlyPopular) && (
                    <div className={`text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-lg ${dark
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900'
                        : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-900'
                      }`}>
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Popular
                    </div>
                  )}
                </div>

                <div className="absolute top-4 left-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm ${dark
                      ? 'bg-slate-900/80 text-yellow-400 border border-yellow-400/30'
                      : 'bg-white/90 text-green-800 border border-green-200'
                    }`}>
                    ${item?.price}
                  </div>
                </div>
              </div>

              {/* Rating Summary */}
              {reviews.length > 0 && (
                <div className="px-6 py-4 border-b border-opacity-20">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {renderStars(Math.round(averageRating))}
                      <span className={`text-sm font-medium ${dark ? 'text-blue-200' : 'text-green-700'}`}>
                        {averageRating.toFixed(1)}
                      </span>
                    </div>
                    <span className={`text-sm ${dark ? 'text-blue-300' : 'text-green-600'}`}>
                      ({reviews.length} {reviews.length === 1 ? t('modal.review') || 'review' : t('modal.reviews') || 'reviews'})
                    </span>
                  </div>
                </div>
              )}

              {/* Details Content */}
              <div className="p-6">
                <div className={`mb-4 ${isFarsi ? 'text-right' : 'text-left'}`}>
                  <p className={`text-base leading-relaxed ${dark ? 'text-blue-100' : 'text-green-700'}`}>
                    {item?.description[currentLang]}
                  </p>
                </div>

                <div className={`flex ${isFarsi ? 'flex-row-reverse' : 'flex-row'} justify-between items-center pt-4 border-t ${dark ? 'border-slate-700' : 'border-green-100'
                  }`}>
                  <span className={`text-xs px-2 py-1 rounded-full ${dark ? 'bg-slate-700 text-blue-200' : 'bg-green-100 text-green-700'
                    }`}>
                    {item?.category ? getCategoryDisplayName(item.category) : ''}
                  </span>

                  <button className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-300 transform hover:scale-105 shadow-lg ${dark
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-slate-900 font-semibold'
                      : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                    }`}>
                    {t('menu.add_to_cart')}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Reviews Tab */
            <div className="p-6">
              {/* Add Review Form */}
              <div className={`mb-6 p-4 rounded-lg border ${dark ? 'bg-slate-900/50 border-slate-700' : 'bg-green-50 border-green-200'
                }`}>
                <h3 className={`text-lg font-semibold mb-4 ${dark ? 'text-blue-200' : 'text-green-900'}`}>
                  {t('modal.add_review') || 'Add a Review'}
                </h3>

                {/* Error Message for Submit */}
                {submitError && (
                  <div className={`mb-4 p-3 rounded-lg ${dark ? 'bg-red-900/50 border border-red-700 text-red-200' : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                    <p className="text-sm">{submitError}</p>
                  </div>
                )}

                {/* Rating Input */}
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${dark ? 'text-blue-200' : 'text-green-700'}`}>
                    {t('modal.rating') || 'Rating'}
                  </label>
                  {renderStars(
                    newReview.rating,
                    true,
                    (rating) => setNewReview(prev => ({ ...prev, rating })),
                    setHoveredRating
                  )}
                </div>

                {/* Name Input */}
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${dark ? 'text-blue-200' : 'text-green-700'}`}>
                    {t('modal.name') || 'Name'}
                  </label>
                  <input
                    type="text"
                    value={newReview.userName}
                    onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border ${dark
                        ? 'bg-slate-800 border-slate-600 text-blue-100 placeholder-slate-400'
                        : 'bg-white border-green-300 text-green-900 placeholder-green-400'
                      } focus:outline-none focus:ring-2 ${dark ? 'focus:ring-yellow-400' : 'focus:ring-green-500'
                      }`}
                  />
                </div>

                {/* Comment Input */}
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${dark ? 'text-blue-200' : 'text-green-700'}`}>
                    {t('modal.comment') || 'Comment'}
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    rows={3}
                    className={`w-full px-3 py-2 rounded-lg border ${dark
                        ? 'bg-slate-800 border-slate-600 text-blue-100 placeholder-slate-400'
                        : 'bg-white border-green-300 text-green-900 placeholder-green-400'
                      } focus:outline-none focus:ring-2 ${dark ? 'focus:ring-yellow-400' : 'focus:ring-green-500'
                      }`}
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={submitReview}
                  disabled={!newReview.rating || !newReview.comment.trim() || !newReview.userName.trim() || isSubmitting}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${!newReview.rating || !newReview.comment.trim() || !newReview.userName.trim() || isSubmitting
                      ? dark
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : dark
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-slate-900'
                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                    }`}
                >
                  {isSubmitting ? (t('modal.submitting') || 'Submitting...') : (t('modal.submit_review') || 'Submit Review')}
                </button>
              </div>

              {/* Reviews List */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${dark ? 'text-blue-200' : 'text-green-900'}`}>
                  {t('modal.all_reviews') || 'All Reviews'} ({reviews.length})
                </h3>

                {/* Error Message for Reviews Loading */}
                {reviewsError && (
                  <div className={`mb-4 p-3 rounded-lg ${dark ? 'bg-red-900/50 border border-red-700 text-red-200' : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                    <p className="text-sm">{reviewsError}</p>
                    <button
                      onClick={() => item && loadReviews(item.id)}
                      className={`mt-2 px-3 py-1 rounded text-sm font-medium ${dark ? 'bg-red-800 hover:bg-red-700 text-red-200' : 'bg-red-100 hover:bg-red-200 text-red-700'
                        }`}
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {reviewsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                  </div>
                ) : reviews.length === 0 && !reviewsError ? (
                  <div className={`text-center py-8 ${dark ? 'text-blue-300' : 'text-green-600'}`}>
                    <p>{t('modal.no_reviews') || 'No reviews yet. Be the first to review this item!'}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className={`p-4 rounded-lg border ${dark ? 'bg-slate-900/30 border-slate-700' : 'bg-white border-green-200'
                        }`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`font-medium ${dark ? 'text-blue-200' : 'text-green-900'}`}>
                                {review.userName}
                              </span>
                              {renderStars(review.rating)}
                            </div>
                            <span className={`text-xs ${dark ? 'text-blue-300' : 'text-green-600'}`}>
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                        </div>
                        <p className={`text-sm leading-relaxed ${dark ? 'text-blue-100' : 'text-green-700'}`}>
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}