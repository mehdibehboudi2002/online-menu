'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useTranslation } from 'react-i18next';
import useHasMounted from '../hooks/useHasMounted';
import Line from '../components/Line';
import CategorizedMenu from '../lib/features/home/components/CategorizedMenu/CategorizedMenu';
import FerrisWheelHero from '../lib/features/home/components/FerrisWheelHero/FerrisWheelHero';

export default function Home() {
  const dark = useSelector((state: RootState) => state.theme.dark);
  const { t, i18n } = useTranslation();

  const hasMounted = useHasMounted();

  if (!hasMounted) return null;

  const isFarsi = i18n.language === 'fa';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark
        ? 'bg-green-950 text-[#99ceff]' // Dark mode: solid green-950 background
        : 'bg-gradient-to-r from-[#f7fee7] via-green-100 to-[#f7fee7] text-green-950' // Light mode: subtle green gradient to center
      }`}>
      <div className="md:container mx-auto md:px-8 py-1 pt-0">

        {/* Header Section */}
        <FerrisWheelHero />
        <Line />

        {/* All Items Section */}
        <div className="mb-16 mt-8">
          <div className={`text-center mb-12 ${isFarsi ? 'font-farsi-chalkboard' : ''}`}>
            <div className="flex items-center justify-center mb-3 md:mb-4">
              <div className={`h-px flex-1 ${dark ? 'bg-slate-700' : 'bg-green-200'}`}></div>
              <h2 className="mx-6 text-2xl md:text-4xl font-bold ${dark ? 'text-[#99ceff]' : 'text-green-950'} ${isFarsi ? 'font-farsi-chalkboard' : 'font-cursive'}">
                {t('home.most_popular')}
              </h2>
              <div className={`h-px flex-1 ${dark ? 'bg-slate-700' : 'bg-green-200'}`}></div>
            </div>
            <div className={`w-20 h-1 mx-auto rounded-full ${dark ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 'bg-gradient-to-r from-green-600 to-green-700'
              }`}></div>
          </div>
          <CategorizedMenu className="my-8" showOnlyPopular={true} />
          <CategorizedMenu className="my-8" />
        </div>

      </div>
    </div>
  );
}