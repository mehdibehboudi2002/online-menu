'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useTranslation } from 'react-i18next';
import useHasMounted from '../hooks/useHasMounted';
import Line from '../components/Line';
import CategorizedMenu from '../lib/features/home/components/CategorizedMenu/CategorizedMenu';

export default function Home() {
  const dark = useSelector((state: RootState) => state.theme.dark);
  const { t, i18n } = useTranslation();

  const hasMounted = useHasMounted();

  if (!hasMounted) return null;

  const isFarsi = i18n.language === 'fa';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-green-950 text-[#99ceff]' : 'bg-[#f7fee7] text-green-950'
      }`}>
      <div className="md:container mx-auto md:px-8 py-8">

        {/* Header Section */}
        <div className={`text-center mb-16 ${isFarsi ? 'font-farsi-chalkboard' : ''}`}>
          <div className={`mb-6`}>
            <h1 className={`text-2xl md:text-4xl font-bold mb-4 ${dark ? 'text-[#99ceff]' : 'text-green-950'
              } ${isFarsi ? 'font-farsi-chalkboard leading-relaxed' : 'font-cursive'}`}>
              {t('home.title')}
            </h1>
          </div>

          <div className={`mb-8`}>
            <p className={`text-lg md:text-2xl ${dark ? 'text-[#99ceff]/80' : 'text-green-950/80'
              } ${isFarsi ? 'font-farsi-chalkboard leading-loose' : 'font-cursive'}`}>
              {t('home.subtitle')}
            </p>
          </div>

          <Line />
        </div>

        {/* All Items Section */}
        <div className="mb-16">
          <div className={`text-center mb-12 ${isFarsi ? 'font-farsi-chalkboard' : ''}`}>
            <div className="flex items-center justify-center mb-6">
              <div className={`h-px flex-1 ${dark ? 'bg-slate-700' : 'bg-green-200'}`}></div>
              <h2 className={`mx-6 text-2xl md:text-4xl font-bold ${dark ? 'text-[#99ceff]' : 'text-green-950'
                } ${isFarsi ? 'font-farsi-chalkboard' : 'font-cursive'}`}>
                {t('home.most_popular')}
              </h2>
              <div className={`h-px flex-1 ${dark ? 'bg-slate-700' : 'bg-green-200'}`}></div>
            </div>
          </div>
          <CategorizedMenu className="my-8" showOnlyPopular={true} />
          <CategorizedMenu className="my-8" />
        </div>

      </div>
    </div>
  );
}