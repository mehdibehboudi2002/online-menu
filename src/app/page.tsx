'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store'
import useHasMounted from '../hooks/useHasMounted';
import Line from '../components/Line';
import CategorizedMenu from '../lib/features/home/components/CategorizedMenu/CategorizedMenu';
import FerrisWheelHero from '../lib/features/home/components/FerrisWheelHero/FerrisWheelHero';

export default function Home() {
  const dark = useSelector((state: RootState) => state.theme.dark);

  const hasMounted = useHasMounted();

  if (!hasMounted) return null;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark
        ? 'bg-green-950 text-[#99ceff]' 
        : 'bg-gradient-to-r from-[#f7fee7] via-green-100 to-[#f7fee7] text-green-950' 
      }`}>
      <div className="md:container mx-auto md:px-8 py-1 pt-0">

        {/* Header Section */}
        <FerrisWheelHero />
        <Line />

        {/* All Items Section */}
        <div id='home-menu-container' className="flex flex-col justify-center items-center">
          <CategorizedMenu className="w-full" showOnlyPopular={true} showLoadingDetails={false} />
          <CategorizedMenu className="w-full" />
        </div>

      </div>
    </div> 
  );
}