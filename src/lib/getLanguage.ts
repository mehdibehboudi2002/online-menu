import { cookies } from 'next/headers';

export async function getCurrentLanguage(): Promise<string> {
  const cookieStore = await cookies(); 
  const lang = cookieStore.get('i18next')?.value;
  return lang === 'fa' || lang === 'en' ? lang : 'fa'; // fallback if cookie is invalid
}
