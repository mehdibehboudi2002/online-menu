'use client';

import Cookies from 'js-cookie';

export function setThemeCookie(value: 'dark' | 'light') {
  Cookies.set('theme', value, { expires: 365 });
}

export function getThemeFromCookie(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'light'; 
  const cookie = Cookies.get('theme');
  return cookie === 'dark' ? 'dark' : 'light'; 
}