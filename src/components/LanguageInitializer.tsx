'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLanguage } from '@/lib/features/languageSlice';

export default function LanguageInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Read the language from the cookie on client side
    const langFromCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('i18next='))
      ?.split('=')[1] || 'en';

    dispatch(setLanguage(langFromCookie));
  }, [dispatch]);

  return <>{children}</>;
}
