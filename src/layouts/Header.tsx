'use client';

import { useEffect, useRef, useState, useCallback } from "react"; // Added useCallback
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

// Constants for better maintainability
const SCROLL_SPEED = 1;
const SCROLL_INTERVAL = 20; // milliseconds

const Header = () => {
  const hasMounted = useHasMounted();
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.language.language);
  const dark = useSelector((state: RootState) => state.theme.dark);
  const { t } = useTranslation();

  // Determine font class based on language
  const fontClass = language === 'fa' ? 'font-farsi-chalkboard' : 'font-cursive';
  const isFarsi = language === 'fa';

  // Mobile categories scroll logic
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const directionRef = useRef(1);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null); // NEW: Ref to store interval ID

  // Removed setShouldAutoScroll here as it's no longer directly controlling the interval

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
  // Wrapped in useCallback to prevent unnecessary re-creation
  const startAutoScroll = useCallback(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // Clear any existing interval to prevent multiple intervals running
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    intervalIdRef.current = setInterval(() => {
      // Re-check scrollContainer inside interval for safety if component unmounts quickly
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
  }, [language]); // Depend on language if scroll behavior could change with it

  // Initialize auto-scroll after component has mounted (NEW LOGIC)
  useEffect(() => {
    if (hasMounted) {
      // Small delay to ensure DOM is fully ready
      const timer = setTimeout(() => {
        startAutoScroll(); // Start auto-scroll initially
      }, 100);

      return () => {
        clearTimeout(timer);
        // Cleanup: clear the interval when component unmounts
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
        }
      };
    }
  }, [hasMounted, startAutoScroll]); // startAutoScroll is a dependency because it's a memoized function

  // Handle mouse enter/leave for auto-scroll control (NEW LOGIC)
  const handleMouseEnter = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current); // Stop the auto-scroll
      intervalIdRef.current = null; // Clear the ref, indicating no interval is running
    }
  };

  const handleMouseLeave = () => {
    // Only restart if it's currently stopped (i.e., intervalIdRef.current is null)
    if (!intervalIdRef.current) {
      startAutoScroll(); // Resume auto-scroll
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
  const buttonBaseStyles = `h-fit py-2 px-4 rounded-2xl bg-white text-green-950 border-1 border-green-950 hover:bg-green-950 hover:text-white hover:border-1 hover:border-white transition-all duration-300 cursor-pointer ${fontClass}`;
  const mobileButtonStyles = `min-w-9 h-fit py-2 px-0 text-xs font-bold rounded-xl bg-white text-green-950 border-1 border-green-950 hover:bg-green-950 hover:text-white hover:border-1 hover:border-white transition-all duration-300 cursor-pointer ${fontClass}`;

  const CategoryItem = ({ category }: { category: typeof categories[0] }) => (
    <button
      key={category.id}
      className="flex flex-col items-center group cursor-pointer bg-transparent border-none"
    >
      <div className="relative w-[70px] h-[70px]">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 p-[2px]">
          <div className={`w-full h-full rounded-full flex items-center justify-center ${dark ? "bg-green-950" : "bg-lime-50"}`}>
            <Image
              src={category.image}
              alt={t(`categories.${category.key}`)}
              width={60}
              height={60}
              // THIS IS THE LINE THAT NOW WORKS SMOOTHLY!
              className="rounded-full transition-transform duration-1000 group-hover:rotate-[360deg]"
            />
          </div>
        </div>
      </div>
      <span className={`mt-2 text-center text-sm font-medium ${dark ? 'text-[#ffc903]' : 'text-[#6d5500]'} ${fontClass}`}>
        {t(`categories.${category.key}`)}
      </span>
    </button>
  );

  return (
    <>
      {/* Non-sticky Header Section */}
      <div className={fontClass}>
        {/* Desktop Header */}
        <div className={`hidden lg:flex justify-between items-center gap-3 p-4 bg-green-950`}>
          <button
            onClick={() => dispatch(toggleTheme())}
            className={`min-w-40 ${buttonBaseStyles}`}
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
              className={`rounded-full ${isFarsi && 'mr-8'}`}
            />
          </Link>

          <Link href={'/'} className={`header_link text-blue-200 mr-3 ${fontClass}`}>
            {t('header.cart')}
          </Link>

          <button
            onClick={() => dispatch(toggleLanguage())}
            className={`min-w-40 ${buttonBaseStyles}`}
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
        <div className={`${dark ? "bg-green-950" : "bg-lime-50"}`}>
          {/* Categories with Auto-scroll */}
          <div className={`flex justify-between items-center gap-3 p-4`}>
            <div
              className="categories_container w-full overflow-x-auto scrollbar-hide"
              ref={scrollRef}
              // RE-ADDED THESE LINES: They now safely control auto-scroll
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                direction: 'ltr' // Force LTR for consistent scroll behavior
              }}
            >
              <div className="categories_wrapper w-full flex justify-between gap-4 min-w-max">
                {categories.map(category => (
                  <CategoryItem key={category.id} category={category} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <Line width={'100vw'} />
      </div>
    </>
  );
};

export default Header;