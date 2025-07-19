// src/data/menuData.ts
// import { MenuItem } from '@/types/menu'; // <-- OLD LINE
import { MenuItem } from '@/types/api'; // <-- NEW LINE

// Organized by categories
export const menuByCategory = {
  burger: [
    {
      id: 1,
      name: {
        en: "Classic Cheeseburger",
        fa: "چیزبرگر کلاسیک"
      },
      category: "burger",
      price: 12.99,
      image: "/images/menu/cheeseburger.jpg",
      description: {
        en: "Juicy beef patty with cheese, lettuce, tomato",
        fa: "برگر گوشت آبدار با پنیر، کاهو، گوجه"
      },
      isPopular: true
    },
    {
      id: 6,
      name: {
        en: "BBQ Bacon Burger",
        fa: "برگر بیکن باربیکیو"
      },
      category: "burger",
      price: 14.99,
      image: "/images/menu/bbq-burger.jpg",
      description: {
        en: "Smoky BBQ sauce with crispy bacon",
        fa: "سس باربیکیو دودی با بیکن ترد"
      },
      isPopular: false
    },
    {
      id: 7,
      name: {
        en: "Mushroom Swiss Burger",
        fa: "برگر قارچ سوئیسی"
      },
      category: "burger",
      price: 13.99,
      image: "/images/menu/mushroom-burger.jpg",
      description: {
        en: "Grilled mushrooms with Swiss cheese",
        fa: "قارچ کبابی با پنیر سوئیسی"
      },
      isPopular: false
    },
    {
      id: 8,
      name: {
        en: "Double Deluxe Burger",
        fa: "برگر دابل دلوکس"
      },
      category: "burger",
      price: 16.99,
      image: "/images/menu/double-burger.jpg",
      description: {
        en: "Double patty with premium toppings",
        fa: "دو پتی با طعم‌های ممتاز"
      },
      isPopular: true
    }
  ],
  pizza: [
    {
      id: 2,
      name: {
        en: "Margherita Pizza",
        fa: "پیتزا مارگاریتا"
      },
      category: "pizza",
      price: 15.99,
      image: "/images/menu/margherita.jpg",
      description: {
        en: "Fresh mozzarella, tomato sauce, basil",
        fa: "موزارلا تازه، سس گوجه، ریحان"
      },
      isPopular: true
    },
    {
      id: 9,
      name: {
        en: "Pepperoni Pizza",
        fa: "پیتزا پپرونی"
      },
      category: "pizza",
      price: 17.99,
      image: "/images/menu/pepperoni.jpg",
      description: {
        en: "Classic pepperoni with mozzarella cheese",
        fa: "پپرونی کلاسیک با پنیر موزارلا"
      },
      isPopular: false
    },
    {
      id: 10,
      name: {
        en: "Supreme Pizza",
        fa: "پیتزا سوپریم"
      },
      category: "pizza",
      price: 19.99,
      image: "/images/menu/supreme.jpg",
      description: {
        en: "Loaded with pepperoni, sausage, peppers, onions",
        fa: "پر از پپرونی، سوسیس، فلفل، پیاز"
      },
      isPopular: true
    }
  ],
  kebab: [
    {
      id: 3,
      name: {
        en: "Chicken Kebab",
        fa: "کباب مرغ"
      },
      category: "kebab",
      price: 18.50,
      image: "/images/menu/chicken-kebab.jpg",
      description: {
        en: "Grilled chicken skewers with rice",
        fa: "سیخ مرغ کبابی با برنج"
      },
      isPopular: true
    },
    {
      id: 11,
      name: {
        en: "Beef Koobideh",
        fa: "کوبیده گوشت"
      },
      category: "kebab",
      price: 20.99,
      image: "/images/menu/koobideh.jpg",
      description: {
        en: "Traditional Persian ground beef kebab",
        fa: "کباب کوبیده سنتی ایرانی"
      },
      isPopular: false
    },
    {
      id: 12,
      name: {
        en: "Mixed Grill Platter",
        fa: "بشقاب مخلوط"
      },
      category: "kebab",
      price: 24.99,
      image: "/images/menu/mixed-grill.jpg",
      description: {
        en: "Combination of chicken and beef kebabs",
        fa: "ترکیبی از کباب مرغ و گوشت"
      },
      isPopular: true
    }
  ],
  appetizer: [
    {
      id: 4,
      name: {
        en: "Caesar Salad",
        fa: "سالاد سزار"
      },
      category: "appetizer",
      price: 8.99,
      image: "/images/menu/caesar-salad.jpg",
      description: {
        en: "Fresh romaine lettuce with caesar dressing",
        fa: "کاهو تازه با سس سزار"
      },
      isPopular: false
    },
    {
      id: 13,
      name: {
        en: "Buffalo Wings",
        fa: "بال مرغ بوفالو"
      },
      category: "appetizer",
      price: 11.99,
      image: "/images/menu/buffalo-wings.jpg",
      description: {
        en: "Spicy buffalo wings with ranch dressing",
        fa: "بال مرغ تند با سس رنچ"
      },
      isPopular: true
    },
    {
      id: 14,
      name: {
        en: "Mozzarella Sticks",
        fa: "استیک موزارلا"
      },
      category: "appetizer",
      price: 7.99,
      image: "/images/menu/mozzarella-sticks.jpg",
      description: {
        en: "Crispy breaded mozzarella with marinara sauce",
        fa: "موزارلا سوخاری ترد با سس مارینارا"
      },
      isPopular: false
    }
  ],
  shake: [
    {
      id: 5,
      name: {
        en: "Chocolate Milkshake",
        fa: "شیک شکلاتی"
      },
      category: "shake",
      price: 6.99,
      image: "/images/menu/chocolate-shake.jpg",
      description: {
        en: "Rich chocolate milkshake with whipped cream",
        fa: "شیک شکلات غنی با خامه"
      },
      isPopular: true
    },
    {
      id: 15,
      name: {
        en: "Vanilla Milkshake",
        fa: "شیک وانیلی"
      },
      category: "shake",
      price: 6.49,
      image: "/images/menu/vanilla-shake.jpg",
      description: {
        en: "Classic vanilla milkshake with cherry on top",
        fa: "شیک وانیل کلاسیک با آلبالو"
      },
      isPopular: false
    },
    {
      id: 16,
      name: {
        en: "Strawberry Shake",
        fa: "شیک توت فرنگی"
      },
      category: "shake",
      price: 7.49,
      image: "/images/menu/strawberry-shake.jpg",
      description: {
        en: "Fresh strawberry milkshake with real fruit",
        fa: "شیک توت فرنگی با میوه طبیعی"
      },
      isPopular: true
    }
  ]
};

// Define the valid categories type
export type MenuCategory = keyof typeof menuByCategory;

// Helper functions
export const getAllMenuItems = (): MenuItem[] => {
  return Object.values(menuByCategory).flat() as MenuItem[];
};

export const getItemsByCategory = (category: MenuCategory): MenuItem[] => {
  return (menuByCategory[category] || []) as MenuItem[];
};

export const getPopularItems = (): MenuItem[] => {
  return getAllMenuItems().filter(item => item.isPopular);
};

export const getPopularItemsByCategory = (category: MenuCategory): MenuItem[] => {
  return getItemsByCategory(category).filter(item => item.isPopular);
};

export const getCategories = (): string[] => {
  return Object.keys(menuByCategory);
};

export const getItemById = (id: number): MenuItem | undefined => {
  return getAllMenuItems().find(item => item.id === id);
};