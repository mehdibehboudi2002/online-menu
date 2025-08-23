'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { fetchCategories, fetchMenuByCategory, fetchPopularMenuByCategory } from '@/api/menu';
import { MenuItem as MenuItemType } from '@/types/api';
import { useState, useEffect } from 'react';
import MenuItem from './MenuItem';
import ItemModal from './ItemModal/ItemModal';
import { MdRefresh } from 'react-icons/md';
import Line from '@/components/Line';

interface CategorizedMenuProps {
  className?: string;
  showOnlyPopular?: boolean;
  showLoadingDetails?: boolean;
}

export default function CategorizedMenu({
  className = '',
  showOnlyPopular = false,
  showLoadingDetails = true
}: CategorizedMenuProps) {
  const { t, i18n } = useTranslation();
  const dark = useSelector((state: RootState) => state.theme.dark);
  const queryClient = useQueryClient();
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);

  const currentLang = i18n.language as 'en' | 'fa';
  const isFarsi = currentLang === 'fa';
  const fontClass = isFarsi ? 'font-farsi-chalkboard' : 'font-cursive';

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const {
    data: categoryQueriesData,
    isLoading: categoryQueriesLoading,
    error: categoryQueriesError,
    refetch: refetchMenuItems
  } = useQuery({
    queryKey: ['categorizedMenu', showOnlyPopular],
    queryFn: async () => {
      if (!categories) return {};

      const results: Record<string, MenuItemType[]> = {};

      await Promise.all(
        categories.map(async (category) => {
          try {
            const items = showOnlyPopular
              ? await fetchPopularMenuByCategory(category)
              : await fetchMenuByCategory(category);
            results[category] = items || [];
          } catch (error) {
            results[category] = [];
          }
        })
      );

      return results;
    },
    enabled: !!categories && categories.length > 0,
  });

  // Manual refresh function that refreshes both categories and ALL menu items variants
  const handleManualRefresh = async () => {
    try {
      // First refetch categories
      await refetchCategories();

      // Explicitly refetch BOTH popular and non-popular menu queries
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: ['categorizedMenu', true], // Popular items
          exact: true
        }),
        queryClient.refetchQueries({
          queryKey: ['categorizedMenu', false], // Non-popular items  
          exact: true
        })
      ]);
    } catch (error) {
    }
  };

  useEffect(() => {
    if (!categories || categories.length === 0) return;
    categories.forEach(category => {
      const existingPlaceholder = document.getElementById(`category-${category}`);
      if (existingPlaceholder && existingPlaceholder.style.visibility === 'hidden') {
        existingPlaceholder.remove();
      }
    });
    if (!categoryQueriesData) {
      categories.forEach(category => {
        const existingElement = document.getElementById(`category-${category}`);
        if (!existingElement) {
          const placeholder = document.createElement('div');
          placeholder.id = `category-${category}`;
          placeholder.className = 'scroll-mt-32';
          placeholder.style.position = 'absolute';
          placeholder.style.top = '200px';
          placeholder.style.visibility = 'hidden';
          placeholder.style.height = '1px';
          placeholder.style.pointerEvents = 'none';
          document.body.appendChild(placeholder);
        }
      });
    }
  }, [categories, categoryQueriesData]);

  useEffect(() => {
    return () => {
      if (categories) {
        categories.forEach(category => {
          const placeholder = document.getElementById(`category-${category}`);
          if (placeholder && placeholder.style.visibility === 'hidden') {
            placeholder.remove();
          }
        });
      }
    };
  }, [categories]);

  useEffect(() => {
    if (categoryQueriesData && categories) {
      setTimeout(() => {
        categories.forEach(category => {
          const placeholder = document.getElementById(`category-${category}`);
          if (placeholder && placeholder.style.visibility === 'hidden') {
            placeholder.remove();
          }
        });
      }, 100);
    }
  }, [categoryQueriesData, categories]);

  const handleImageError = (itemId: string) => {
    setFailedImages(prev => new Set(prev).add(itemId));
  };

  const handleItemClick = (item: MenuItemType) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, { en: string; fa: string }> = {
      burger: { en: 'Burgers', fa: 'برگرها' },
      pizza: { en: 'Pizzas', fa: 'پیتزاها' },
      kebab: { en: 'Kebabs', fa: 'کباب ها' },
      appetizer: { en: 'Appetizers', fa: 'پیش غذاها' },
      shake: { en: 'Shakes', fa: 'شیک ها' },
    };
    return categoryMap[category]?.[currentLang] || category;
  };

  if (showLoadingDetails) {
    if (categoriesLoading || categoryQueriesLoading) {
      return (
        <div className={`${className} flex justify-center items-center h-[50vh]`}>
          <div className="relative">
            <div className="animate-spin size-12 rounded-full border-b-2 border-yellow-500"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-6 h-6 bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      );
    }

    if (categoriesError || categoryQueriesError) {
      return (
        <>
          <div className={`${className} flex justify-center items-center h-[50vh]`}>
            <div className={`text-center ${fontClass}`}>
              <div className={`inline-flex items-center px-1 md:px-4 py-2 rounded-2xl text-xs md:text-sm ${dark ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'}`}>
                {t('errors.failed_to_load')}
                <button
                  onClick={handleManualRefresh}
                  className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${dark
                    ? 'hover:bg-red-800/30 text-red-400 hover:text-red-300'
                    : 'hover:bg-red-100 text-red-600 hover:text-red-700'
                    } cursor-pointer active:scale-95`}
                  title="Retry loading data"
                  type="button"
                >
                  <MdRefresh size={18} className="hover:rotate-180 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
          <Line className='block md:hidden' />
        </>
      );
    }

    if (!categories || categories.length === 0) {
      return (
        <div className={`${className} flex justify-center items-center h-[50vh]`}>
          <div className={`text-center ${fontClass}`}>
            <div className={`inline-flex items-center px-4 py-2 rounded-lg text-xs md:text-sm ${dark ? 'bg-slate-800 text-blue-200' : 'bg-green-50 text-green-800'}`}>
              {t('menu.no_categories')}
            </div>
          </div>
        </div>
      );
    }
  }
  if (!categories) {
    return null;
  }

  const categorizedItems = categoryQueriesData || {};


  if (showOnlyPopular) {
    const allPopularItems = Object.values(categorizedItems).flat();
    if (allPopularItems.length === 0) return null;

    return (
      <>
        <div className={`${className} ${fontClass}`}>
          <div className={`text-center ${isFarsi ? 'font-farsi-chalkboard' : ''} my-6 md:my-8 md:mb-12`}>
            <div className="flex items-center justify-center mb-4 w-full">
              <div className={`h-px flex-1 ${dark ? 'bg-slate-700' : 'bg-green-200'}`}></div>
              <h2 className={`mx-6 text-2xl md:text-3xl font-bold ${dark ? 'text-[#99ceff]' : 'text-green-950'} ${isFarsi ? 'font-farsi-chalkboard' : 'font-cursive'} whitespace-nowrap`}>
                {t('home.most_popular')}
              </h2>
              <div className={`h-px flex-1 ${dark ? 'bg-slate-700' : 'bg-green-200'}`}></div>
            </div>
            <div className={`w-20 h-1 mx-auto rounded-full ${dark ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 'bg-gradient-to-r from-green-600 to-green-700'}`}></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8">
            {allPopularItems.map((item: MenuItemType) => (
              <MenuItem
                key={item.id}
                item={item}
                onItemClick={handleItemClick}
                onImageError={handleImageError}
                failedImages={failedImages}
                getCategoryDisplayName={getCategoryDisplayName}
                showOnlyPopular={showOnlyPopular}
              />
            ))}
          </div>
        </div>
        {selectedItem && (
          <ItemModal
            item={selectedItem}
            onClose={closeModal}
            onImageError={handleImageError}
            failedImages={failedImages}
            getCategoryDisplayName={getCategoryDisplayName}
            showOnlyPopular={showOnlyPopular}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className={`${className} ${fontClass}`}>
        {categories.map((category) => {
          const items = categorizedItems[category] || [];
          if (items.length === 0) return null;

          return (
            <div key={category} className="my-6 md:my-8 md:mb-12">
              <div id={`category-${category}`} className={`mb-8 md:mb-12 ${isFarsi ? 'text-right' : 'text-left'} scroll-mt-32`}>
                <div className="flex items-center justify-center mb-4">
                  <div className={`h-px flex-1 ${dark ? 'bg-slate-700' : 'bg-green-200'}`}></div>
                  <h2 className={`mx-6 text-2xl md:text-3xl font-bold ${dark ? 'text-blue-200' : 'text-green-900'}`}>
                    {getCategoryDisplayName(category)}
                  </h2>
                  <div className={`h-px flex-1 ${dark ? 'bg-slate-700' : 'bg-green-200'}`}></div>
                </div>
                <div className="flex justify-center">
                  <div className={`w-20 h-1 rounded-full ${dark ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 'bg-gradient-to-r from-green-600 to-green-700'}`}></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8">
                {items.map((item: MenuItemType) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    onItemClick={handleItemClick}
                    onImageError={handleImageError}
                    failedImages={failedImages}
                    getCategoryDisplayName={getCategoryDisplayName}
                    showOnlyPopular={showOnlyPopular}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={closeModal}
          onImageError={handleImageError}
          failedImages={failedImages}
          getCategoryDisplayName={getCategoryDisplayName}
          showOnlyPopular={showOnlyPopular}
        />
      )}
    </>
  );
}