'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { categories } from "@/data/categories";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { toggleLanguage, setLanguage } from '@/lib/features/languageSlice';
import { toggleTheme } from '@/lib/features/themeSlice';
import { useTranslation } from 'react-i18next';
import useHasMounted from '../hooks/useHasMounted';
import i18n from '@/lib/i18n';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Line from '@/components/Line';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchMenuByCategory, fetchPopularMenuByCategory, searchMenuItems } from '@/api/menu';
import SearchIcon from "@/components/icons/SearchIcon";
import SearchModal from '../components/SearchModal';

// Constants for better maintainability
const SCROLL_SPEED = 1;
const SCROLL_INTERVAL = 20; // milliseconds

interface HeaderProps {
  showOnlyPopular?: boolean;
}

const Header = ({ showOnlyPopular = false }: HeaderProps) => {
  const hasMounted = useHasMounted();
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.language.language);
  const dark = useSelector((state: RootState) => state.theme.dark);
  const { t } = useTranslation();

  // The state for the search modal
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // The handler functions for the search modal
  const handleOpenSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const handleSearchSubmit = async (query: string) => {
    try {
      // Call the new search API with the query
      const results = await searchMenuItems(query);
      console.log('Search results:', results);
      // You can now use these results to update your UI, e.g.,
      // by setting a state variable with the search results.

    } catch (error) {
      console.error('Failed to perform search:', error);
      // Handle the error appropriately in your UI
    }
  };


  // Determine font class based on language
  const fontClass = language === 'fa' ? 'font-farsi-chalkboard' : 'font-cursive';
  const isFarsi = language === 'fa';

  // Mobile categories scroll logic
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const directionRef = useRef(1);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch categories to check which ones have items
  const { data: apiCategories, isLoading: isLoadingApiCategories, error: apiCategoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Fetch items for each category to determine which are empty
  const { data: categoriesWithItems, isLoading: isLoadingCategoriesWithItems, error: categoriesWithItemsError } = useQuery({
    queryKey: ['categoriesWithItems', showOnlyPopular, apiCategories],
    queryFn: async () => {
      if (!apiCategories || apiCategories.length === 0) {
        return new Set<string>();
      }

      const categoriesWithItemsSet = new Set<string>();

      await Promise.all(
        apiCategories.map(async (category) => {
          try {
            const items = showOnlyPopular
              ? await fetchPopularMenuByCategory(category)
              : await fetchMenuByCategory(category);

            if (Array.isArray(items) && items.length > 0) {
              categoriesWithItemsSet.add(category);
            }
          } catch (error) {
            console.error(`Failed to fetch ${category} items:`, error);
          }
        })
      );
      return categoriesWithItemsSet;
    },
    enabled: !!apiCategories && apiCategories.length > 0 && !isLoadingApiCategories,
  });

  // Function to scroll to the category section with improved reliability
  const scrollToCategory = (categoryKey: string) => {
    const hasItems = categoriesWithItems?.has(categoryKey) ?? false;
    const isCategoryTrulyEmpty = !isLoadingCategoriesWithItems && !hasItems;

    if (isCategoryTrulyEmpty) {
      return;
    }

    handleMouseEnter();

    const attemptScroll = (retries = 0) => {
      const categoryElement = document.getElementById(`category-${categoryKey}`);

      if (categoryElement) {
        const headerHeight = 200;
        const elementPosition = categoryElement.offsetTop - headerHeight;

        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      } else if (retries < 10) {
        setTimeout(() => attemptScroll(retries + 1), 100);
      }
    };

    attemptScroll();
  };

  // Sync Redux with cookie on mount (only runs once)
  useEffect(() => {
    const cookieLang = Cookies.get('i18next');
    if (cookieLang && cookieLang !== language) {
      dispatch(setLanguage(cookieLang));
    }
  }, [dispatch]);

  // Update i18n and cookie when Redux language changes
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
      Cookies.set('i18next', language);
    }
  }, [language]);

  // Helper function to start the auto-scroll interval
  const startAutoScroll = useCallback(() => {
    if (window.innerWidth >= 1024) return;

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    intervalIdRef.current = setInterval(() => {
      if (!scrollContainer) {
        if (intervalIdRef.current) clearInterval(intervalIdRef.current);
        return;
      }

      const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      const tolerance = 1;

      scrollContainer.scrollLeft += SCROLL_SPEED * directionRef.current;

      if (directionRef.current === 1 && scrollContainer.scrollLeft >= (maxScrollLeft - tolerance)) {
        directionRef.current = -1;
      } else if (directionRef.current === -1 && scrollContainer.scrollLeft <= tolerance) {
        directionRef.current = 1;
      }
    }, SCROLL_INTERVAL);
  }, [language]);

  // Initialize auto-scroll after component has mounted and clean up
  useEffect(() => {
    if (hasMounted) {
      const timer = setTimeout(() => {
        startAutoScroll();
      }, 100);

      return () => {
        clearTimeout(timer);
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
        }
      };
    }
  }, [hasMounted, startAutoScroll]);

  // Handle mouse enter/leave for auto-scroll control (only on mobile)
  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) return;
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) return;
    if (!intervalIdRef.current) {
      startAutoScroll();
    }
  };

  // Render fallback during hydration
  if (!hasMounted) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-green-950"></div>
        <div className="h-1 bg-gray-300"></div>
        <div className="h-24 bg-lime-50"></div>
        <div className="h-1 bg-gray-300"></div>
        <div className="h-24 bg-lime-50"></div>
      </div>
    );
  }

  // Extracted button styles for reusability
  const buttonBaseStyles = `min-w-36 min-h-9 rounded-2xl bg-white text-green-950 text-sm border-1 border-green-950 hover:bg-green-950 hover:text-white hover:border-1 hover:border-white transition-all duration-300 cursor-pointer ${fontClass}`;
  const mobileButtonStyles = `w-[39.2px] h-[39.2px] p-0 text-xs font-bold rounded-full bg-white text-green-950 border-1 border-green-950 hover:bg-green-950 hover:text-white hover:border-1 hover:border-white transition-all duration-300 cursor-pointer ${fontClass}`;

  const CategoryItem = ({ category }: { category: typeof categories[0] }) => {
    const [isHovered, setIsHovered] = useState(false);

    const hasItems = categoriesWithItems?.has(category.key) ?? false;
    const isCategoryEmpty = !isLoadingCategoriesWithItems && !hasItems;

    return (
      <div className="relative flex flex-col items-center">
        <button
          onClick={() => scrollToCategory(category.key)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          key={category.id}
          className={`
            flex flex-col items-center group
            bg-transparent border-none
            cursor-pointer
            transition-all duration-300
          `}
        >
          <div className="relative w-[70px] h-[70px]">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 p-[2px]">
              <div className={`w-full h-full rounded-full flex items-center justify-center ${dark ? "bg-green-950" : "bg-lime-50"}`}>
                <Image
                  src={category.image}
                  alt={t(`categories.${category.key}`)}
                  width={60}
                  height={60}
                  className={`
                    rounded-full
                    transition-transform duration-1000
                    transition-filter ease-in-out
                    ${isHovered ? 'rotate-[360deg]' : ''}
                    ${isCategoryEmpty ? 'grayscale' : ''}
                  `}
                />
                {/* Conditionally render "No Items!" text */}
                {isCategoryEmpty && (
                  <span
                    className={`
                      absolute
                      top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      text-red-500 ${!isFarsi ? 'text-xs' : 'text-sm'} font-black whitespace-nowrap
                      transform -rotate-12
                      pointer-events-none 
                      ${fontClass}
                    `}
                  >
                    {t('category_status.no_items')}
                  </span>
                )}
              </div>
            </div>
          </div>
          <span className={`mt-2 text-center text-sm font-medium ${dark ? 'text-[#ffc903]' : 'text-[#6d5500]'} ${fontClass}`}>
            {t(`categories.${category.key}`)}
          </span>
        </button>
      </div>
    );
  };

  // Calculate the middle index for inserting SearchIcon
  const middleIndex = Math.floor(categories.length / 2);
  const leftCategories = categories.slice(0, middleIndex);
  const rightCategories = categories.slice(middleIndex);

  return (
    <>
      {/* Non-sticky Header Section */}
      <div className={fontClass} dir="ltr">
        {/* Desktop Header */}
        <div className={`hidden lg:flex justify-between items-center gap-3 p-4 bg-green-950`}>
          <button
            onClick={() => dispatch(toggleTheme())}
            className={`${buttonBaseStyles}`}
          >
            {dark ? t('header.theme_light') : t('header.theme_dark')}
          </button>

          <Link href={'/'} className={`header_link text-blue-200 ${fontClass}`}>
            {t('header.contact_us')}
          </Link>

          <Link href={'/'}>
            <Image
              src={'/images/logo.jpg'}
              alt='logo'
              width={75}
              height={75}
              className={`rounded-full ${isFarsi ? 'mr-11' : 'mr-7'}`}
            />
          </Link>

          <Link href={'/'} className={`header_link text-blue-200 mr-3 ${fontClass}`}>
            {t('header.cart')}
          </Link>

          <button
            onClick={() => dispatch(toggleLanguage())}
            className={`${buttonBaseStyles}`}
          >
            {t('header.language_button')}
          </button>
        </div>

        {/* Mobile Header */}
        <div className={`flex lg:hidden justify-between items-center gap-3 p-4 bg-green-950`}>
          <p className={`text-white ${fontClass}`}>M</p>

          <button
            onClick={() => dispatch(toggleTheme())}
            className={mobileButtonStyles}
          >
            {dark ? t('header.theme_light_responsive') : t('header.theme_dark_responsive')}
          </button>

          <Link href={'/'}>
            <Image
              src={'/images/logo.jpg'}
              alt='logo'
              width={45}
              height={45}
              className='rounded-full'
            />
          </Link>

          <button
            onClick={() => dispatch(toggleLanguage())}
            className={mobileButtonStyles}
          >
            {t('header.language_button_responsive')}
          </button>

          <p className={`text-white ${fontClass}`}>M</p>
        </div>

        <Line width={'100vw'} />
      </div>

      {/* Sticky Categories Section */}
      <div className={`sticky top-0 z-50 ${fontClass}`} style={{ position: 'sticky' }}>
        <div className={`${dark ? "bg-green-950" : "bg-gradient-to-r from-[#f7fee7] via-green-100 to-[#f7fee7] text-green-950"}`}>
          {/* Categories with Auto-scroll and Centered SearchIcon */}
          <div className={`flex justify-between items-center gap-3 p-4`}>
            <div
              className="categories_container w-full overflow-x-auto scrollbar-hide"
              ref={scrollRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                direction: 'ltr' // Force LTR for consistent scroll behavior
              }}
            >
              <div className="categories_wrapper w-full flex justify-between gap-4 min-w-max items-center">
                {/* Left side categories */}
                {leftCategories.map(category => (
                  <CategoryItem key={category.id} category={category} />
                ))}

                {/* SearchIcon in the middle */}
                <div className="hidden md:flex flex-col items-center justify-center">
                  <div 
                    className="w-[30px] flex items-center justify-center"
                    // New onClick handler to open the modal
                    onClick={handleOpenSearchModal} 
                  >
                    <SearchIcon
                      className="cursor-pointer"
                      hasBorder={true}
                      bgColor={"#fff"}
                    />
                  </div>
                </div>

                {/* Right side categories */}
                {rightCategories.map(category => (
                  <CategoryItem key={category.id} category={category} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <Line width={'100vw'} />
      </div>
      
      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={handleCloseSearchModal}
        onSearch={handleSearchSubmit}
        dark={dark}
      />
    </>
  );
};

export default Header;