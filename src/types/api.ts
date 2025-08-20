export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Allergen {
  en: string;
  fa: string;
}

export interface MenuItem {
  id: string; 
  name_en: string; 
  name_fa: string; 
  description_en: string; 
  description_fa: string; 
  price_en: number; 
  price_fa: string; 
  image: string;
  is_popular: boolean; 
  category: string;
  rating?: number; 
  reviewsCount?: number; 
  nutritional_info: NutritionalInfo; 
  allergens: Allergen[]; 
  created_at: string; 
}

export interface Review {
  id: string;           
  created_at: string;   
  itemId: string; 
  userName: string; 
  rating: number; 
  comment: string; 
}

export interface CreateReviewRequest {
  itemId: string; 
  userName: string; 
  rating: number; 
  comment: string; 
}

// Helper functions for handling bilingual content and Farsi number conversion

export const convertToFarsiNumbers = (text: string | number): string => {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return text.toString().replace(/\d/g, (digit) => farsiDigits[parseInt(digit)]);
};

export const allergenTranslations: Record<string, string> = {
  'gluten': 'گلوتن',
  'dairy': 'لبنیات',
  'soy': 'سویا',
  'egg': 'تخم مرغ',
  'fish': 'ماهی',
  'nuts': 'آجیل',
  'shellfish': 'صدف',
  'sesame': 'کنجد',
  'peanuts': 'بادام زمینی'
};

export const getAllergensInLanguage = (allergens: Allergen[], lang: 'en' | 'fa'): string[] => {
  if (lang === 'fa') {
    return allergens.map(allergen => allergenTranslations[allergen.en] || allergen.fa);
  }
  return allergens.map(allergen => allergen.en);
};

export const unitTranslations = {
  kcal: { en: 'kcal', fa: 'کیلوکالری' },
  g: { en: 'g', fa: 'گرم' }
};