'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

interface BackgroundWrapperProps {
  children: React.ReactNode;
}

export default function BackgroundWrapper({ children }: BackgroundWrapperProps) {
  const dark = useSelector((state: RootState) => state.theme.dark);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      dark
        ? 'bg-green-950 text-[#99ceff]' // Dark mode: solid green-950 background
        : 'bg-gradient-to-r from-[#f7fee7] via-green-100 to-[#f7fee7] text-green-950' // Light mode: subtle green gradient to center
    }`}>
      {children}
    </div>
  );
}