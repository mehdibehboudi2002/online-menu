'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

export default function DirectionManager() {
  const language = useSelector((state: RootState) => state.language.language);

  useEffect(() => {
    if (language === 'fa') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  return null; // no UI output
}
