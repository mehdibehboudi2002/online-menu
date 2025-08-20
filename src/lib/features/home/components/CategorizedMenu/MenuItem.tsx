'use client';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { MenuItem as MenuItemType } from '@/types/api';
import Line from '@/components/Line';
import Button from '@/components/Button';

interface ItemProps {
  item: MenuItemType;
  onImageError: (itemId: string) => void;
  failedImages: Set<string>;
  getCategoryDisplayName: (category: string) => string;
  onItemClick?: (item: MenuItemType) => void;
  showOnlyPopular?: boolean;
}

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

  const currentLang = i18n.language as 'en' | 'fa';
  const isFarsi = currentLang === 'fa';
  const fontClass = isFarsi ? 'font-farsi-chalkboard' : 'font-cursive';
  
  // Directly access the new price properties
  const formattedPrice = isFarsi ? item.price_fa : item.price_en.toLocaleString('en-US');

  return (
    <>
      {/* Mobile Layout */}
      <div
        className={`md:hidden w-full flex items-center p-4 transition-all duration-300 cursor-pointer ${dark
          ? 'bg-slate-800/90 hover:bg-slate-700/90'
          : 'bg-white/95 hover:bg-green-50/80'
          }`}
        onClick={() => onItemClick?.(item)}
      >
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          {!failedImages.has(item.id) ? (
            <img
              src={item.image}
              alt={isFarsi ? item.name_fa : item.name_en}
              className="w-full h-full object-cover"
              onError={() => onImageError(item.id)}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${dark ? 'bg-slate-600' : 'bg-green-200'}`}>
              <svg className={`w-6 h-6 ${dark ? 'text-blue-200' : 'text-green-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className={`flex-1 ${isFarsi ? 'mr-4 text-right' : 'ml-4 text-left'}`}>
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
              <div className={`text-xs font-bold px-2 py-1 rounded-full ${dark ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900' : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-900'}`}>
                ⭐
              </div>
            )}
            <span className={`text-xs md:text-lg font-bold ${dark ? 'text-yellow-400' : 'text-green-800'}`}>
              {!isFarsi && 'Rial'} {formattedPrice} {isFarsi && 'ریال'}
            </span>
          </div>
        </div>
        <div className={`${isFarsi ? 'mr-2' : 'ml-2'}`}>
          <svg className={`w-5 h-5 ${dark ? 'text-blue-200' : 'text-green-600'} ${isFarsi ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Desktop Layout */}
      <div
        className={`hidden md:flex flex-col group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 transform cursor-pointer h-full ${dark
          ? 'bg-slate-800/90 border border-slate-700 backdrop-blur-sm hover:border-yellow-500'
          : 'bg-white/95 border border-green-200 backdrop-blur-sm hover:border-green-600'
          }`}
        onClick={() => onItemClick?.(item)}
      >
        <div className="relative h-56 overflow-hidden">
          {!failedImages.has(item.id) ? (
            <img
              src={item.image}
              alt={isFarsi ? item.name_fa : item.name_en}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => onImageError(item.id)}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${dark ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-green-50 to-green-100'}`}>
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${dark ? 'bg-slate-600' : 'bg-green-200'}`}>
                  <svg className={`w-8 h-8 ${dark ? 'text-blue-200' : 'text-green-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className={`text-sm ${dark ? 'text-blue-200' : 'text-green-600'}`}>No Image</p>
              </div>
            </div>
          )}
          {item.is_popular && (
            <div className="absolute top-4 right-4">
              <div className={`text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-lg ${dark ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900' : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-900'}`}>
                {isFarsi ? 'پرطرفدار' : 'Popular'}
                <svg className={`w-3 h-3 ${isFarsi ? 'mr-1' : 'ml-1'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <div className={`px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm ${dark ? 'bg-slate-900/80 text-yellow-400 border border-yellow-400/30' : 'bg-white/90 text-green-800 border border-green-200'}`}>
              {formattedPrice} {isFarsi ? 'ریال' : 'Rials'}
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className={`mb-3 ${isFarsi ? 'text-right' : 'text-left'} flex-grow`}>
            <h3 className={`font-bold mb-2 ${dark ? 'text-blue-200' : 'text-green-900'}`}>
              {isFarsi ? item.name_fa : item.name_en}
            </h3>
            <p className={`text-sm leading-relaxed ${dark ? 'text-blue-100' : 'text-green-700'} ${isFarsi ? 'text-right' : 'text-left'}`}>
              {isFarsi ? item.description_fa : item.description_en}
            </p>
          </div>

          <div className={`mt-auto flex ${isFarsi ? 'flex-row-reverse' : 'flex-row'} justify-between items-center pt-4 border-t ${dark ? 'border-slate-700' : 'border-green-100'}`}>
            <span className={`text-xs px-2 py-1 rounded-full ${dark ? 'bg-slate-700 text-blue-200' : 'bg-green-100 text-green-700'}`}>
              {getCategoryDisplayName(item.category)}
            </span>
            <Button text={t('menu.add_to_cart')} />
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <Line width={'100vw'} />
      </div>
    </>
  );
}