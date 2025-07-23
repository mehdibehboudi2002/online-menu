'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { fetchCategories, fetchMenuByCategory, fetchPopularMenuByCategory } from '@/api/menu';
import { MenuItem as MenuItemType } from '@/types/api'; 
import { useState, useEffect } from 'react';
import MenuItem from './MenuItem'; 
import ItemModal from './ItemModal';

interface CategorizedMenuProps {
  className?: string;
  showOnlyPopular?: boolean;
}

export default function CategorizedMenu({
  className = '',
  showOnlyPopular = false
}: CategorizedMenuProps) {
  const { t, i18n } = useTranslation();
  const dark = useSelector((state: RootState) => state.theme.dark);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);

  const currentLang = i18n.language as 'en' | 'fa';
  const isFarsi = currentLang === 'fa';

  // Determine font class based on language
  const fontClass = isFarsi ? 'font-farsi-chalkboard' : 'font-cursive';

  // Fetch all categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Fetch items for each category
  const categoryQueries = useQuery({
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
            console.error(`Failed to fetch ${category} items:`, error);
            results[category] = [];
          }
        })
      );

      return results;
    },
    enabled: !!categories && categories.length > 0,
  });

  useEffect(() => {
    if (!categories || categories.length === 0) return;

    // Clean up any existing placeholder elements first
    categories.forEach(category => {
      const existingPlaceholder = document.getElementById(`category-${category}`);
      if (existingPlaceholder && existingPlaceholder.style.visibility === 'hidden') {
        existingPlaceholder.remove();
      }
    });

    // Create placeholders only if we don't have data yet
    if (!categoryQueries.data) {
      categories.forEach(category => {
        // Double-check that no element with this ID exists
        const existingElement = document.getElementById(`category-${category}`);
        if (!existingElement) {
          const placeholder = document.createElement('div');
          placeholder.id = `category-${category}`;
          placeholder.className = 'scroll-mt-32'; // Add scroll margin
          placeholder.style.position = 'absolute';
          placeholder.style.top = '200px'; // Approximate position
          placeholder.style.visibility = 'hidden';
          placeholder.style.height = '1px';
          placeholder.style.pointerEvents = 'none';
          document.body.appendChild(placeholder);
        }
      });
    }
  }, [categories, categoryQueries.data]);

  // Clean up placeholder elements when real content is rendered or component unmounts
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

  // Additional cleanup when data is loaded - remove placeholders
  useEffect(() => {
    if (categoryQueries.data && categories) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        categories.forEach(category => {
          const placeholder = document.getElementById(`category-${category}`);
          if (placeholder && placeholder.style.visibility === 'hidden') {
            placeholder.remove();
          }
        });
      }, 100);
    }
  }, [categoryQueries.data, categories]);


  const handleImageError = (itemId: number) => {
    setFailedImages(prev => new Set(prev).add(itemId));
  };

  const handleItemClick = (item: MenuItemType) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  // Category display names mapping
  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, { en: string; fa: string }> = {
      burger: { en: 'Burgers', fa: 'برگرها' },
      pizza: { en: 'Pizzas', fa: 'پیتزاها' },
      kebab: { en: 'Kebabs', fa: 'کبابها' },
      appetizer: { en: 'Appetizers', fa: 'پیش غذاها' },
      shake: { en: 'Shakes', fa: 'شیک ها' },
    };

    return categoryMap[category]?.[currentLang] || category;
  };

  if (categoriesLoading || categoryQueries.isLoading) {
    return (
      <div className={`${className} flex justify-center items-center py-12`}>
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 bg-yellow-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (categoriesError || categoryQueries.error) {
    return (
      <div className={`${className} text-center py-12 ${fontClass}`}>
        <div className={`inline-flex items-center px-4 py-2 rounded-lg ${dark ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'
          }`}>
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {t('errors.failed_to_load')}
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className={`${className} text-center py-12 ${fontClass}`}>
        <div className={`inline-flex items-center px-4 py-2 rounded-lg ${dark ? 'bg-slate-800 text-blue-200' : 'bg-green-50 text-green-800'
          }`}>
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {t('menu.no_categories')}
        </div>
      </div>
    );
  }

  const categorizedItems = categoryQueries.data || {};

  // For popular view, collect all items without categories
  if (showOnlyPopular) {
    const allPopularItems = Object.values(categorizedItems).flat();

    if (allPopularItems.length === 0) return null;

    return (
      <>
        <div className={`${className} ${fontClass}`} id="category-popular">
          {/* Use a single grid for popular items, Item component handles responsiveness */}
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

  // For regular view, show categories with headers
  return (
    <>
      <div className={`${className} ${fontClass}`}>
        {categories.map((category) => {
          const items = categorizedItems[category] || [];

          // Skip empty categories
          if (items.length === 0) return null;

          return (
            <div key={category} className="mb-8 md:mb-12">
              {/* Category Header - This is the scroll target */}
              <div id={`category-${category}`} className={`mb-8 md:mb-12 ${isFarsi ? 'text-right' : 'text-left'} scroll-mt-32`}>
                <div className="flex items-center justify-center mb-4">
                  <div className={`h-px flex-1 ${dark ? 'bg-slate-700' : 'bg-green-200'}`}></div>
                  <h2 className={`mx-6 text-3xl font-bold ${dark ? 'text-blue-200' : 'text-green-900'}`}>
                    {getCategoryDisplayName(category)}
                  </h2>
                  <div className={`h-px flex-1 ${dark ? 'bg-slate-700' : 'bg-green-200'}`}></div>
                </div>
                <div className="flex justify-center">
                  <div className={`w-20 h-1 rounded-full ${dark ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 'bg-gradient-to-r from-green-600 to-green-700'
                    }`}></div>
                </div>
              </div>

              {/* Use a single grid for items, Item component handles responsiveness */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8"> 
                {/* Adjusted gap for mobile/desktop */}
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