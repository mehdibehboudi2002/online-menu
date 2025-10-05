'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { categories } from "@/data/categories";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { selectTotalItemsInCart } from '@/lib/store/selectors';
import CartModal from '../../components/CartModal';
import { toggleLanguage, setLanguage } from '@/lib/store/features/languageSlice';
import { toggleTheme } from '@/lib/store/features/themeSlice';
import { useTranslation } from 'react-i18next';
import useHasMounted from '../../hooks/useHasMounted';
import i18n from '@/lib/i18n';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Line from '@/components/Line';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchMenuByCategory, fetchPopularMenuByCategory, searchMenuItems } from '@/api/menu';
import SearchIcon from "@/components/icons/SearchIcon";
import SearchModal from '../../components/SearchModal';
import {
  MdOutlineShoppingBag,
  MdSupportAgent
} from 'react-icons/md';
import { triggerContactHighlight } from '@/lib/store/features/contactSlice';
import { usePathname } from "next/navigation";

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
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const totalItemsCount = useSelector(selectTotalItemsInCart);
  const pathname = usePathname();
  const isPaymentSuccessPage = pathname === '/payment-successful';

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

    } catch (error) { }
  };

  // For the desktop contact button
  const handleDesktopContactClick = () => {
    // Scroll to contact section
    const contactSection = document.getElementById('footer'); // It's better to scroll to the footer section with the ID of 'footer'
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    // Then, dispatch the highlight trigger after a short delay
    setTimeout(() => {
      dispatch(triggerContactHighlight());
    }, 700); // Delay
  };

  const handleOpenCartModal = () => {
    setIsCartModalOpen(true);
  };

  const handleCloseCartModal = () => {
    setIsCartModalOpen(false);
  };

  // For the mobile fixed contact button
  const handleMobileContactClick = () => {
    // Scroll to contact section
    const contactSection = document.getElementById('footer'); // It's better to scroll to the footer section with the ID of 'footer'
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    // Then, dispatch the highlight trigger after a short delay
    setTimeout(() => {
      dispatch(triggerContactHighlight());
    }, 700); // Delay
  };

  // Determine font class based on language
  const fontClass = language === 'fa' ? 'font-farsi-chalkboard' : 'font-cursive';
  const isFarsi = language === 'fa';

  // Mobile categories scroll logic
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const directionRef = useRef(1);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch categories to check which ones have items
  const { data: apiCategories, isLoading: isLoadingApiCategories, error: apiCategoriesError, refetch: refetchApiCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Fetch items for each category to determine which are empty
  const { data: categoriesWithItems, isLoading: isLoadingCategoriesWithItems, error: categoriesWithItemsError, refetch: refetchCategoriesWithItems } = useQuery({
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

  // Loading Spinner Component
  const LoadingSpinner = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
    <span className={`px-[2px] py-0.5 rounded-full text-xs flex items-center justify-center ${dark ? 'text-blue-200' : 'text-green-700'
      }`}>
      <svg className={`animate-spin h-4 w-4 ${dark ? 'text-yellow-400' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
  );

  // Render fallback during hydration
  if (!hasMounted) {
    return (
      <div className={`${fontClass}`} dir="ltr">
        {/* Desktop Header */}
        <div className={`hidden lg:flex justify-center items-center gap-3 p-4 bg-green-950`}>
          <Link href={'/'}>
            <Image
              src={'/images/logo.jpg'}
              alt='logo'
              width={75}
              height={75}
              className={`rounded-full`}
            />
          </Link>
        </div>

        {/* Mobile Header */}
        <div className={`flex lg:hidden justify-center items-center gap-3 p-4 bg-green-950`}>
          <Link href={'/'}>
            <Image
              src={'/images/logo.jpg'}
              alt='logo'
              width={45}
              height={45}
              className='rounded-full'
            />
          </Link>
        </div>

        <Line width={'100vw'} />
      </div>
    );
  }

  const CategoryItem = ({ category }: { category: typeof categories[0] }) => {
    const [isHovered, setIsHovered] = useState(false);

    const hasItems = categoriesWithItems?.has(category.key) ?? false;
    const isCategoryEmpty = !hasItems;
    const hasError = apiCategoriesError || categoriesWithItemsError;
    const isLoading = isLoadingApiCategories || isLoadingCategoriesWithItems || apiCategoriesError || categoriesWithItemsError;

    return (
      <div className="relative flex flex-col items-center">
        <button
          onClick={() => scrollToCategory(category.key)}
          onMouseEnter={() => {
            if (!isCategoryEmpty) {
              setIsHovered(true);
            }
          }} onMouseLeave={() => setIsHovered(false)}
          className={`
          flex flex-col items-center group
          bg-transparent border-none
          transition-all duration-300
          ${!isCategoryEmpty && !isLoading && !hasError ? 'cursor-pointer' : ''}
        `}
        >
          <div className="relative w-[70px] h-[70px]">
            <div className={`p-[2px] absolute inset-0 rounded-full bg-gradient-to-br ${isCategoryEmpty && !isLoading && !hasError ? 'bg-slate-400' : 'from-yellow-400 via-red-500 to-pink-500'}`}>
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
                  ${isCategoryEmpty && !isLoading && !hasError ? 'grayscale' : ''}
                  ${isLoading || hasError ? 'opacity-40' : ''}
                `}
                />

                {/* Loading Spinner */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingSpinner size={24} />
                  </div>
                )}

                {/* Conditionally render "No Items!" text only when not loading and no error */}
                {/* {isCategoryEmpty && !isLoading && !hasError && (
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
                )} */}
              </div>
            </div>
          </div>
          <span className={`mt-2 text-center text-xs lg:text-sm font-medium ${isCategoryEmpty && !isLoading ? 'text-slate-400' : dark ? 'text-[#ffc903]' : 'text-[#6d5500]'} ${fontClass}`}>
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
        <div className={`hidden lg:grid grid-cols-3 items-center p-4 bg-green-950`}>
          {/* Left section */}
          <div className="flex justify-between items-center gap-3">
            <button
              onClick={() => dispatch(toggleTheme())}
              className={`min-w-36 min-h-9 rounded-2xl bg-white text-green-950 text-sm border-1 border-green-950 hover:bg-green-950 hover:text-white hover:border-1 hover:border-white transition-all duration-300 cursor-pointer ${fontClass}`}
            >
              {dark ? t('header.theme_light') : t('header.theme_dark')}
            </button>
            <button
              onClick={handleDesktopContactClick}
              className={`header_link text-blue-200 ${fontClass} bg-transparent border-none cursor-pointer`}
            >
              {t('header.contact_us')}
            </button>
          </div>

          {/* Center section with logo */}
          <div className="flex justify-center">
            <Link href={'/'}>
              <Image
                src={'/images/logo.jpg'}
                alt='logo'
                width={75}
                height={75}
                className={`rounded-full`}
              />
            </Link>
          </div>

          {/* Right section */}
          <div className="flex justify-between items-center gap-3">
            <button
              onClick={handleOpenCartModal}
              className={`relative header_link text-blue-200 ${fontClass} bg-transparent border-none cursor-pointer`}
            >
              {t('header.cart')}
              {totalItemsCount > 0 && (
                <span className={`absolute ${isFarsi ? '-top-0.5' : '-top-2.5'} -right-4 size-6 md:size-5 text-[11px] md:text-xs font-bold rounded-full bg-yellow-400 text-slate-900 flex items-center justify-center pointer-events-none`}>
                  {totalItemsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => dispatch(toggleLanguage())}
              className={`min-w-36 min-h-9 rounded-2xl bg-white text-green-950 text-sm border-1 border-green-950 hover:bg-green-950 hover:text-white hover:border-1 hover:border-white transition-all duration-300 cursor-pointer ${fontClass}`}
            >
              {t('header.language_button')}
            </button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className={`flex lg:hidden justify-between items-center gap-3 p-4 bg-green-950`}>
          <div className="flex lg:hidden flex-col items-center justify-center">
            <div
              className="w-[30px] flex items-center justify-center"
              onClick={handleOpenSearchModal}
            >
              <SearchIcon
                className="cursor-pointer"
                color="#000"
              />
            </div>
          </div>

          <button
            onClick={() => dispatch(toggleTheme())}
            className={`w-[36.9px] h-[36.9px] p-0 text-xs font-bold rounded-full bg-white text-green-950 border-1 border-green-950 hover:bg-green-950 hover:text-white hover:border-1 hover:border-white transition-all duration-300 cursor-pointer ${fontClass}`}
          >
            {dark ? t('header.theme_light_responsive') : t('header.theme_dark_responsive')}
          </button>

          <Link href={'/'}>
            <Image
              src={'/images/logo.jpg'}
              alt='logo'
              width={52}
              height={52}
              className='rounded-full'
            />
          </Link>

          <button
            onClick={() => dispatch(toggleLanguage())}
            className={`w-[36.9px] h-[36.9px] p-0 text-xs font-bold rounded-full bg-white text-green-950 border-1 border-green-950 hover:bg-green-950 hover:text-white hover:border-1 hover:border-white transition-all duration-300 cursor-pointer ${fontClass}`}
          >
            {t('header.language_button_responsive')}
          </button>

          <button
            onClick={handleOpenCartModal}
            className={`relative flex justify-center items-center p-[4.5px] rounded-full bg-white hover:bg-green-50 hover:border-1 transition-all duration-300 cursor-pointer ${fontClass}`}
          >
            <MdOutlineShoppingBag size={19} color="#000" />
            {totalItemsCount > 0 && ( // Display the count
              <span className="absolute -top-2 -right-2 size-5 text-[10px] font-bold rounded-full bg-yellow-400 text-slate-900 flex items-center justify-center pointer-events-none">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>

        <Line width={'100vw'} />
      </div>

      {/* Sticky Categories Section */}
      {!isPaymentSuccessPage && (
      <div className={`sticky top-0 z-50 ${fontClass}`} style={{ position: 'sticky' }}>
        <div className={`${dark ? "bg-green-950" : "bg-gradient-to-r from-[#f7fee7] via-green-100 to-[#f7fee7] text-green-950"}`}>
          <div className={`flex justify-center items-center p-4`}>
            <div
              className="categories_container w-full overflow-x-auto scrollbar-hide"
              ref={scrollRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                direction: 'ltr'
              }}
            >
              <div className="w-full hidden lg:inline-flex items-center justify-between flex-nowrap gap-4 min-w-max">
                {/* Left side */}
                <div className="flex-1 flex justify-between gap-4 lg:pr-6 xl:pr-23">
                  {leftCategories.map(category => (
                    <CategoryItem key={category.id} category={category} />
                  ))}
                </div>

                {/* SearchIcon in the middle */}
                <div className="hidden lg:flex flex-col items-center justify-center">
                  <div
                    className="w-[30px] flex items-center justify-center"
                    onClick={handleOpenSearchModal}
                  >
                    <SearchIcon
                      className="cursor-pointer"
                      hasBorder={true}
                    />
                  </div>
                </div>

                {/* Right side */}
                <div className="flex-1 flex justify-between gap-4 lg:pl-6 xl:pl-23">
                  {rightCategories.map(category => (
                    <CategoryItem key={category.id} category={category} />
                  ))}
                </div>
              </div>

              <div className="w-full inline-flex lg:hidden items-center justify-between flex-nowrap gap-4 min-w-max">
                {/* Left side */}
                <div className="flex-1 flex justify-between gap-4 lg:pr-6 xl:pr-23">
                  {categories.map(category => (
                    <CategoryItem key={category.id} category={category} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Line width={'100vw'} />
      </div>)}

      {/* Mobile Fixed Contact Button */}
      <button
        onClick={handleMobileContactClick}
        className={`
        size-[46px] md:size-12 fixed lg:hidden bottom-4 left-4 md:bottom-7 md:left-7 z-50
        rounded-full 
        ${dark
            ? 'bg-[#ffc903] text-[#032e15] hover:bg-[#008f39]'
            : 'bg-[#032e15] text-[#ffc903] hover:bg-[#008f39]'
          }
        shadow-lg 
        transition-all duration-300
        flex items-center justify-center
        animate-pulse hover:animate-none
      `}
        aria-label={t('footer.contact_info')}
      >
        <MdSupportAgent size={24} />
      </button>

      <CartModal
        isOpen={isCartModalOpen}
        onClose={handleCloseCartModal}
      />

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