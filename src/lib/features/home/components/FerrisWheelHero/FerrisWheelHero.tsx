'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import {
  FaPizzaSlice, FaHamburger, FaIceCream
} from 'react-icons/fa';
import {
  MdOutlineLunchDining, MdRestaurantMenu, MdEmojiFoodBeverage
} from 'react-icons/md';
import { IconType } from 'react-icons';
import styles from './FerrisWheelHero.module.css';
import Pointer from '@/components/icons/Pointer';

interface FerrisWheelImage {
  src: string;
  alt: string;
}

interface ChalkboardTextElement {
  type: 'text';
  translationKey: string;
  position: string;
  rotate: string;
  colors: { dark: string; light: string };
}

interface ChalkboardIconElement {
  type: 'icon';
  component: IconType;
  alt: string;
  position: string;
  size: string;
  rotate: string;
  colors: { dark: string; light: string };
}

type ChalkboardElement = ChalkboardTextElement | ChalkboardIconElement;


const FERRIS_WHEEL_IMAGES: FerrisWheelImage[] = [
  { src: '/images/home/hero-burger.webp', alt: 'Burger' },
  { src: '/images/home/hero-pizza.jpeg', alt: 'Pizza' },
  { src: '/images/home/hero-kebab.jpg', alt: 'Kebab' },
  { src: '/images/home/hero-dessert.webp', alt: 'Dessert' },
  { src: '/images/home/hero-drink.avif', alt: 'Drink' },
  { src: '/images/home/hero-cake.webp', alt: 'Cake' },
  { src: '/images/home/hero-fries.jpg', alt: 'Fries' },
  { src: '/images/home/hero-salad.jpg', alt: 'Salad' },
];

// Define chalkboard-style text messages and their properties with more dispersed positions
const CHALKBOARD_ELEMENTS: ChalkboardElement[] = [ // Apply the new type here
  // Left Side Elements - More varied positions
  { type: 'text', translationKey: 'home.chalkboard.delicious', position: 'left-[10%] top-[8%]', rotate: 'rotate-[-5deg]', colors: { dark: 'text-[#ffb4c1]', light: 'text-green-600' } },
  { type: 'icon', component: FaPizzaSlice, alt: 'Pizza Icon', position: 'left-[29%] top-[15%]', size: 'text-sm', rotate: 'rotate-[15deg]', colors: { dark: 'text-white', light: 'text-gray-600' } },
  { type: 'text', translationKey: 'home.chalkboard.fresh', position: 'left-[2%] top-[30%]', rotate: 'rotate-[-1deg]', colors: { dark: 'text-blue-200', light: 'text-purple-600' } },
  { type: 'icon', component: FaHamburger, alt: 'Burger Icon', position: 'left-[15%] top-[47%]', size: 'text-sm', rotate: 'rotate-[20deg]', colors: { dark: 'text-blue-300', light: 'text-gray-600' } },
  { type: 'icon', component: MdEmojiFoodBeverage, alt: 'Cup Icon', position: 'left-[2%] top-[85%]', size: 'text-sm', rotate: 'rotate-[-5deg]', colors: { dark: 'text-[#ffb4c1]', light: 'text-gray-600' } },
  { type: 'text', translationKey: 'home.chalkboard.tasty', position: 'left-[13%] top-[80%]', rotate: 'rotate-[-4deg]', colors: { dark: 'text-white', light: 'text-blue-600' } },

  // Right Side Elements - More varied positions
  { type: 'text', translationKey: 'home.chalkboard.great_food', position: 'right-[7%] top-[10%]', rotate: 'rotate-[7deg]', colors: { dark: 'text-white', light: 'text-blue-600' } },
  { type: 'text', translationKey: 'home.chalkboard.great_mood', position: 'right-[5%] top-[20%]', rotate: 'rotate-[7deg]', colors: { dark: 'text-[#ffb4c1]', light: 'text-green-600' } },
  { type: 'icon', component: FaIceCream, alt: 'Dessert Icon', position: 'right-[23%] top-[18%]', size: 'text-sm', rotate: 'rotate-[-12deg]', colors: { dark: 'text-[#ffb4c1]', light: 'text-gray-600' } },
  { type: 'icon', component: MdOutlineLunchDining, alt: 'Sandwich Icon', position: 'right-[23%] top-[80%]', size: 'text-sm', rotate: 'rotate-[-20deg]', colors: { dark: 'text-white', light: 'text-gray-600' } },
  { type: 'icon', component: MdRestaurantMenu, alt: 'Pizza Slice Icon', position: 'right-[5%] top-[75%]', size: 'text-sm', rotate: 'rotate-[8deg]', colors: { dark: 'text-blue-300', light: 'text-gray-600' } },
  { type: 'text', translationKey: 'home.chalkboard.enjoy', position: 'right-[16%] top-[50%]', rotate: 'rotate-[-6deg]', colors: { dark: 'text-blue-200', light: 'text-purple-400' } },
];

// Mobile-specific elements (2 texts + 3 icons) - positioned outside the ferris wheel area
const MOBILE_CHALKBOARD_ELEMENTS: ChalkboardElement[] = [
  // Top left corner
  { type: 'text', translationKey: 'home.chalkboard.fresh', position: 'left-[2%] top-[8%]', rotate: 'rotate-[-8deg]', colors: { dark: 'text-white', light: 'text-green-600' } },
  // Top right corner
  { type: 'icon', component: FaPizzaSlice, alt: 'Pizza Icon', position: 'right-[4%] top-[12%]', size: 'text-xs', rotate: 'rotate-[12deg]', colors: { dark: 'text-[#ffb4c1]', light: 'text-gray-600' } },
  // Bottom left corner
  { type: 'icon', component: FaHamburger, alt: 'Burger Icon', position: 'left-[8%] top-[85%]', size: 'text-xs', rotate: 'rotate-[-15deg]', colors: { dark: 'text-blue-300', light: 'text-gray-600' } },
  // Bottom center-right
  { type: 'text', translationKey: 'home.chalkboard.tasty', position: 'right-[6%] top-[88%]', rotate: 'rotate-[6deg]', colors: { dark: 'text-[#ffb4c1]', light: 'text-purple-400' } },
  // Right side middle
  { type: 'icon', component: FaIceCream, alt: 'Dessert Icon', position: 'right-[2%] top-[55%]', size: 'text-xs', rotate: 'rotate-[-8deg]', colors: { dark: 'text-white', light: 'text-gray-600' } },
];

const FerrisWheelHero: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dark = useSelector((state: RootState) => state.theme.dark);
  const isFarsi = i18n.language === 'fa';

  const [heroHeight, setHeroHeight] = useState(280);
  const heroRef = useRef<HTMLDivElement>(null);

  const getRadius = () => {
    return (heroHeight / 2) * 0.7;
  };

  useLayoutEffect(() => {
    const updateHeroHeight = () => {
      if (heroRef.current) {
        setHeroHeight(heroRef.current.offsetHeight);
      }
    };
    updateHeroHeight();
    window.addEventListener('resize', updateHeroHeight);
    return () => window.removeEventListener('resize', updateHeroHeight);
  }, []);

  const numImages = FERRIS_WHEEL_IMAGES.length;

  return (
    <div
      ref={heroRef}
      className="relative flex items-center justify-center h-[305px] md:h-[350px] lg:h-[400px] xl:h-[410px] overflow-hidden"
    >
      {/* Desktop Chalkboard Text and Icons */}
      {CHALKBOARD_ELEMENTS.map((element, index) => (
        <React.Fragment key={`desktop-${index}`}>
          {element.type === 'text' ? (
            <p
              className={`
                absolute z-0 text-xs lg:text-xs opacity-80 whitespace-nowrap
                hidden lg:block
                ${element.position} ${element.rotate}
                ${dark ? element.colors.dark : element.colors.light}
                ${isFarsi ? 'font-farsi-chalkboard' : 'font-cursive'}
              `}
              style={{
                // Add a small delay for a "hand-drawn" appearance effect if desired
                transitionDelay: `${index * 50}ms`,
                // Ensure text pivot for rotation is roughly centered relative to its position
                transform: `${element.rotate} ${element.position.includes('left') ? 'translateX(-10%)' : 'translateX(10%)'}` // Slight adjustment for more natural rotation
              }}
            >
              {t(element.translationKey)}
            </p>
          ) : (
            <element.component
              className={`
                absolute z-0 ${element.size}
                hidden lg:block
                ${element.position} ${element.rotate}
                ${dark ? element.colors.dark : element.colors.light}
              `}
              style={{
                // Adjust icon pivot for rotation
                transform: `${element.rotate} ${element.position.includes('left') ? 'translateX(-10%)' : 'translateX(10%)'}`
              }}
            />
          )}
        </React.Fragment>
      ))}

      {/* Mobile Chalkboard Text and Icons */}
      {MOBILE_CHALKBOARD_ELEMENTS.map((element, index) => (
        <React.Fragment key={`mobile-${index}`}>
          {element.type === 'text' ? (
            <p
              className={`
                absolute z-0 text-[10px] opacity-80 whitespace-nowrap
                block lg:hidden
                ${element.position} ${element.rotate}
                ${dark ? element.colors.dark : element.colors.light}
                ${isFarsi ? 'font-farsi-chalkboard' : 'font-cursive'}
              `}
              style={{
                transitionDelay: `${index * 50}ms`,
                transform: `${element.rotate} ${element.position.includes('left') ? 'translateX(-10%)' : 'translateX(10%)'}`
              }}
            >
              {t(element.translationKey)}
            </p>
          ) : (
            <element.component
              className={`
                absolute z-0 ${element.size}
                block lg:hidden
                ${element.position} ${element.rotate}
                ${dark ? element.colors.dark : element.colors.light}
              `}
              style={{
                transform: `${element.rotate} ${element.position.includes('left') ? 'translateX(-10%)' : 'translateX(10%)'}`
              }}
            />
          )}
        </React.Fragment>
      ))}

      {/* Central Text Message */}
      <div
        className={`
          relative z-10 text-center
          size-[158px] md:size-[184px] lg:size-52
          flex flex-col items-center justify-center
          px-2 md:px-3 lg:px-4 rounded-full shadow-lg
          text-green-950
          ${isFarsi ? 'font-farsi-chalkboard' : 'font-cursive'}
        `}
        style={{
          backgroundImage: 'url(/images/home/wood-design.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <h1 className={`text-base md:text-lg lg:text-xl xl:text-2xl font-bold mb-1 md:mb-2 leading-tight`}>
          {t('home.title')}
        </h1>
        <p className={`${isFarsi ? 'text-[11px]' : 'text-xs'} lg:text-sm ${!isFarsi ? 'lg:text-base' : ''} mb-1 md:mb-2 font-bold opacity-90 leading-tight`}>
          {t('home.subtitle')}
        </p>
        <Pointer className='block md:hidden' targetId="home-menu-container" offset={-126} />
        <Pointer className='hidden md:block' targetId="home-menu-container" offset={-130} />
      </div>

      {/* Ferris Wheel Images Container */}
      <div className={`
        absolute inset-0
        flex items-center justify-center
        transform scale-100
        ${dark ? 'text-gray-300' : 'text-gray-700'}
        ${styles.ferrisWheelSpin}
      `}>
        {FERRIS_WHEEL_IMAGES.map((image, index) => {
          const angle = (360 / numImages) * index;
          const radius = getRadius();

          return (
            <div
              key={index}
              className={`
                absolute
                rounded-full shadow-md
                ${dark ? 'bg-green-700/80' : 'bg-white/90'}
                size-16 md:size-18 lg:size-20 xl:size-22
              `}
              style={{
                transform: `
                  rotate(${angle}deg)
                  translate(${radius}px)
                  rotate(${-angle}deg)
                `,
                transition: 'transform 0.3s ease-out'
              }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="size-full object-cover rounded-full"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FerrisWheelHero;