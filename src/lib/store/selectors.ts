import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

// Memoized selector to get all cart items
export const selectCartItems = createSelector(
  (state: RootState) => state.cart.items,
  (items) => items
);

// Memoized selector to calculate the total quantity of all items
// This correctly sums up all quantities (e.g., 1 pizza + 2 burgers + 3 kebabs = 6 total)
export const selectTotalItemsInCart = createSelector(
  selectCartItems,
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);

// Memoized selector to get the number of unique items in cart
// This would give you 3 for the example above (3 different types of items)
export const selectUniqueItemsInCart = createSelector(
  selectCartItems,
  (items) => items.length
);

// Memoized selector to calculate total price (you might need this too)
export const selectCartTotal = createSelector(
  selectCartItems,
  (items) => items.reduce((total, item) => {
    // You'll need to adjust this based on whether you're using Farsi or English prices
    const price = typeof item.price_en === 'number' ? item.price_en : 0;
    return total + (price * item.quantity);
  }, 0)
);

// Selector to check if cart is empty
export const selectIsCartEmpty = createSelector(
  selectCartItems,
  (items) => items.length === 0
);