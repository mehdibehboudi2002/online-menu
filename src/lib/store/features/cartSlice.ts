import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of an item in the cart
export interface CartItem {
  id: string;
  name_en: string;
  name_fa: string;
  price_en: number;
  price_fa: string;
  quantity: number;
  description_en?: string;
  description_fa?: string;
  is_popular?: boolean;
  category?: string;
  nutritional_info?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  allergens?: Array<{ en: string; fa: string }>;
  images: string[];
  estimated_delivery_time_minutes?: number;
}

export type CheckoutStep = "cart" | "delivery" | "payment";

// Define the shape of the entire cart state
interface CartState {
  items: CartItem[];
  currentStep: CheckoutStep;
  deliveryDetails: {
    selectedTime: string;
    selectedTable: string;
    isComingNow: boolean; // State for "I'll come in current time"
    isSelectingTableLater: boolean; // State for "I don't wanna select my table here"
  };
}

// Helper functions for cookie management
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

// Load initial cart items from cookie
const loadCartFromCookie = (): CartItem[] => {
  try {
    const cartCookie = getCookie("cart");
    if (cartCookie) {
      return JSON.parse(decodeURIComponent(cartCookie));
    }
  } catch (error) {
    console.error("Error loading cart from cookie:", error);
  }
  return [];
};

// Default delivery details structure for loading/initial state
const defaultDeliveryDetails = {
  selectedTime: "",
  selectedTable: "",
  isComingNow: false,
  isSelectingTableLater: false,
};

// Load cart state (step and delivery details) from cookie
const loadCartStateFromCookie = (): Pick<
  CartState,
  "currentStep" | "deliveryDetails"
> => {
  try {
    const stateCookie = getCookie("cartState");
    if (stateCookie) {
      const state = JSON.parse(decodeURIComponent(stateCookie)); // Ensure all loaded values match the expected type, falling back to defaults
      return {
        currentStep: state.currentStep || "cart",
        deliveryDetails: {
          ...defaultDeliveryDetails, // Start with defaults
          ...state.deliveryDetails, // Overwrite with stored values
          selectedTime: state.deliveryDetails.selectedTime || "",
          selectedTable: state.deliveryDetails.selectedTable || "",
          isComingNow: !!state.deliveryDetails.isComingNow,
          isSelectingTableLater: !!state.deliveryDetails.isSelectingTableLater,
        },
      };
    }
  } catch (error) {
    console.error("Error loading cart state from cookie:", error);
  }
  return {
    currentStep: "cart",
    deliveryDetails: defaultDeliveryDetails,
  };
};

// Save cart to cookie
const saveCartToCookie = (items: CartItem[]) => {
  try {
    const cartData = encodeURIComponent(JSON.stringify(items));
    setCookie("cart", cartData, 7);
  } catch (error) {
    console.error("Error saving cart to cookie:", error);
  }
};

// Save cart state to cookie
const saveCartStateToCookie = (
  state: Pick<CartState, "currentStep" | "deliveryDetails">
) => {
  try {
    const stateData = encodeURIComponent(JSON.stringify(state));
    setCookie("cartState", stateData, 7);
  } catch (error) {
    console.error("Error saving cart state to cookie:", error);
  }
};

const initialState: CartState = {
  items: loadCartFromCookie(),
  ...loadCartStateFromCookie(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Omit<CartItem, "quantity">>) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...newItem,
          quantity: 1,
          description_en: newItem.description_en || "",
          description_fa: newItem.description_fa || "",
          is_popular: newItem.is_popular || false,
          category: newItem.category || "",
          nutritional_info: newItem.nutritional_info || {
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
          },
          allergens: newItem.allergens || [],
          estimated_delivery_time_minutes:
            newItem.estimated_delivery_time_minutes || 0,
        });
      }

      saveCartToCookie(state.items);
    },

    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCartToCookie(state.items);
    },

    decrementQuantity(state, action: PayloadAction<string>) {
      const existingItem = state.items.find(
        (item) => item.id === action.payload
      );
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      } else if (existingItem && existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== action.payload);
      }
      saveCartToCookie(state.items);
    },

    setItemQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          existingItem.quantity = quantity;
        }
        saveCartToCookie(state.items);
      }
    },

    setCheckoutStep(state, action: PayloadAction<CheckoutStep>) {
      state.currentStep = action.payload;
      saveCartStateToCookie({
        currentStep: state.currentStep,
        deliveryDetails: state.deliveryDetails,
      });
    },

    setDeliveryTime(state, action: PayloadAction<string | null | undefined>) {
      // Coerce null/undefined to empty string for consistency
      state.deliveryDetails.selectedTime = action.payload || ""; // LOGIC: If a specific time is selected, uncheck "Coming Now"
      if (state.deliveryDetails.selectedTime !== "") {
        state.deliveryDetails.isComingNow = false;
      }

      saveCartStateToCookie({
        currentStep: state.currentStep,
        deliveryDetails: state.deliveryDetails,
      });
    },

    setDeliveryTable(state, action: PayloadAction<string | null | undefined>) {
      // Coerce null/undefined to empty string for consistency
      state.deliveryDetails.selectedTable = action.payload || ""; // LOGIC: If a specific table is selected, uncheck "Select Table Later"
      if (state.deliveryDetails.selectedTable !== "") {
        state.deliveryDetails.isSelectingTableLater = false;
      }

      saveCartStateToCookie({
        currentStep: state.currentStep,
        deliveryDetails: state.deliveryDetails,
      });
    },

    // Toggle 'Coming Now' checkbox
    setComingNow(state, action: PayloadAction<boolean>) {
      state.deliveryDetails.isComingNow = action.payload;
      // If 'Coming Now' is checked, clear selected time
      if (action.payload) {
        state.deliveryDetails.selectedTime = "";
      }
      saveCartStateToCookie({
        currentStep: state.currentStep,
        deliveryDetails: state.deliveryDetails,
      });
    },

    // Toggle 'Select Table Later' checkbox
    setIsSelectingTableLater(state, action: PayloadAction<boolean>) {
      state.deliveryDetails.isSelectingTableLater = action.payload;
      // If 'Select Table Later' is checked, clear selected table
      if (action.payload) {
        state.deliveryDetails.selectedTable = "";
      }
      saveCartStateToCookie({
        currentStep: state.currentStep,
        deliveryDetails: state.deliveryDetails,
      });
    },

    clearCart(state) {
      state.items = [];
      state.currentStep = "cart";
      state.deliveryDetails = defaultDeliveryDetails; // Use the default object
      saveCartToCookie(state.items);
      saveCartStateToCookie({
        currentStep: "cart",
        deliveryDetails: defaultDeliveryDetails,
      });
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  decrementQuantity,
  setItemQuantity,
  setCheckoutStep,
  setDeliveryTime,
  setDeliveryTable,
  setComingNow,
  setIsSelectingTableLater,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;