'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { removeFromCart, addToCart, decrementQuantity, setCheckoutStep, setDeliveryTime, setComingNow, clearCart } from '@/lib/store/features/cartSlice';
import { useTranslation } from 'react-i18next';
import { MenuItem as MenuItemType, convertToFarsiNumbers } from '@/types/api';
import { selectTotalItemsInCart } from '@/lib/store/selectors';
import { useEffect, useState } from 'react';
import Button from './Button';
import Line from './Line';
import ItemModal from '@/lib/features/home/components/CategorizedMenu/ItemModal/ItemModal';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineClockCircle } from 'react-icons/ai';
import RestaurantMap from '@/lib/features/cart/components/RestaurantMap';

export default function Cart() {
  const { t, i18n } = useTranslation();
  const dark = useSelector((state: RootState) => state.theme.dark);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItemsCount = useSelector(selectTotalItemsInCart);
  const isComingNow = useSelector((state: RootState) => state.cart.deliveryDetails.isComingNow);
  const isSelectingTableLater = useSelector((state: RootState) => state.cart.deliveryDetails.isSelectingTableLater);
  const dispatch = useDispatch();

  const currentStep = useSelector((state: RootState) => state.cart.currentStep);
  const selectedTime = useSelector((state: RootState) => state.cart.deliveryDetails.selectedTime);
  const selectedTable = useSelector((state: RootState) => state.cart.deliveryDetails.selectedTable);

  // Modal state
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  // Payment state 
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Function to return to cart view
  const handleReturnToCart = () => {
    dispatch(setCheckoutStep('cart'));
  };

  const currentLang = i18n.language as 'en' | 'fa';
  const isFarsi = currentLang === 'fa';

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleDecrementQuantity = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    dispatch(decrementQuantity(itemId));
  };

  const handleIncrementQuantity = (item: any) => {
    dispatch(addToCart(item as MenuItemType));
  };

  const handleItemClick = (item: any) => {
    const menuItem: MenuItemType = {
      id: item.id,
      name_en: item.name_en,
      name_fa: item.name_fa,
      price_en: item.price_en,
      price_fa: item.price_fa,
      description_en: item.description_en || '',
      description_fa: item.description_fa || '',
      is_popular: false,
      category: item.category || '',
      nutritional_info: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
      },
      allergens: [],
      images: item.images,
      estimated_delivery_time_minutes: item.estimated_delivery_time_minutes,
      created_at: ''
    };
    setSelectedItem(menuItem);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleImageError = (itemId: string) => {
    setFailedImages(prev => new Set([...prev, itemId]));
  };

  const getCategoryDisplayName = (category: string) => {
    return category;
  };

  const convertFarsiToEnglishNumbers = (farsiNumber: string): string => {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let result = farsiNumber;
    farsiDigits.forEach((farsiDigit, index) => {
      result = result.replace(new RegExp(farsiDigit, 'g'), englishDigits[index]);
    });
    return result;
  };

  const totalPrice = cartItems.reduce((total, item) => {
    const itemPrice = isFarsi
      ? parseFloat(convertFarsiToEnglishNumbers(item.price_fa).replace(/[,،]/g, ''))
      : item.price_en;
    return total + itemPrice * item.quantity;
  }, 0);

  const formattedTotalPrice = isFarsi ? convertToFarsiNumbers(totalPrice.toLocaleString('en-US')) : totalPrice.toLocaleString('en-US');

  const maxDeliveryTime = Math.max(...cartItems.map(item => item.estimated_delivery_time_minutes || 0));

  const minEstimate = maxDeliveryTime;
  const maxEstimate = maxDeliveryTime + 5;

  const handleStepForward = () => {
    if (currentStep === 'cart') {
      dispatch(setCheckoutStep('delivery'));
    } else if (currentStep === 'delivery') {
      dispatch(setCheckoutStep('payment'));
    }
  };

  const handleStepBack = () => {
    if (currentStep === 'delivery') {
      dispatch(setCheckoutStep('cart'));
    } else if (currentStep === 'payment') {
      dispatch(setCheckoutStep('delivery'));
    }
  };

  const handleFinalPayment = () => {
    // Show loading state
    setIsProcessingPayment(true);

    // Prepare receipt data
    const receiptData = {
      items: cartItems.map(item => ({
        id: item.id,
        name_en: item.name_en,
        name_fa: item.name_fa,
        quantity: item.quantity,
        formattedPriceEn: (item.price_en * item.quantity).toLocaleString('en-US'),
        formattedPriceFa: convertToFarsiNumbers((parseFloat(convertFarsiToEnglishNumbers(item.price_fa).replace(/[,،]/g, '')) * item.quantity).toLocaleString('en-US'))
      })),
      totalItems: totalItemsCount,
      formattedTotal: formattedTotalPrice,
      deliveryTime: selectedTime,
      isComingNow: isComingNow,
      tableNumber: selectedTable,
      isSelectingTableLater: isSelectingTableLater,
      minEstimate: minEstimate,
      maxEstimate: maxEstimate,
      timestamp: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem('orderReceipt', JSON.stringify(receiptData));

    // Set timer to auto-remove receipt after estimated time
    const estimatedTimeMs = maxEstimate * 60 * 1000; // Convert minutes to milliseconds
    setTimeout(() => {
      localStorage.removeItem('orderReceipt');
    }, estimatedTimeMs);

    // Simulate payment processing
    setTimeout(() => {
      // Clear cart
      dispatch(clearCart());

      // Redirect to success page
      window.location.href = '/payment-successful';
    }, 800); // Short delay for loading animation
  };

  const handleResetReceipt = () => {
    localStorage.removeItem('orderReceipt');
    setShowReceipt(false);
    setReceiptData(null);
    dispatch(setCheckoutStep('cart')); // Reset to cart step
  };

  // Check if delivery details are complete
  const isDeliveryComplete = (selectedTime || isComingNow) && (selectedTable || isSelectingTableLater);

  // Generate time slots based on table selection
  const generateTimeSlots = () => {
    const slots: string[] = [];
    const now = new Date();

    let startHour: number;
    if (isSelectingTableLater) {
      // No table selected: start from next hour
      startHour = now.getHours() + 1;
    } else {
      // Table selected: start from 2 hours later, rounded up
      const minutesUntilNextHour = 60 - now.getMinutes();
      const hoursToAdd = minutesUntilNextHour > 30 ? 2 : 3;
      startHour = now.getHours() + hoursToAdd;
    }

    // Generate slots until midnight
    for (let hour = startHour; hour < 24; hour++) {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
      slots.push(`${displayHour}:00 ${period}`);
    }

    return slots;
  };

  useEffect(() => {
    // Check for existing receipt on component mount
    const savedReceipt = localStorage.getItem('orderReceipt');
    if (savedReceipt) {
      setReceiptData(JSON.parse(savedReceipt));
      setShowReceipt(true);
    }
  }, []);

  return (
    <>
      <div className="flex flex-col h-full max-h-[85vh] md:max-h-[86vh]">
        {/* Fixed Header */}
        <div className={`flex-shrink-0 px-2 md:px-4 py-4 md:py-6 border-b border-opacity-20 border-gray-300
          ${dark ? 'bg-slate-800' : 'bg-white'}`}>

          {/* Title - Clickable when in checkout steps */}
          {currentStep === 'cart' ? (
            <h2 className={`text-xl md:text-2xl font-bold flex items-center gap-2
              ${dark ? 'text-white' : 'text-gray-900'}`}>
              <svg
                className={`size-6 ${dark ? 'text-blue-200' : 'text-green-950'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l5.5-6M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                />
              </svg>
              <span className={`${dark ? 'text-blue-200' : 'text-green-950'}`}>
                {t('cart.title') || 'Your Order'}
              </span>
              {totalItemsCount > 0 && (
                <span className={`text-sm font-normal px-2.5 py-1 rounded-full
                  ${dark ? 'bg-yellow-400 text-slate-900' : 'bg-green-100 text-green-800'}`}>
                  {isFarsi ? convertToFarsiNumbers(totalItemsCount) : totalItemsCount}
                </span>
              )}
            </h2>
          ) : (
            <div className="flex items-center justify-between">
              <div className='flex items-end'>
                <button
                  className={`group text-xl md:text-2xl font-bold flex items-center gap-2 transition-colors duration-200 cursor-pointer
                  ${dark ? 'text-white hover:text-blue-200' : 'text-gray-900 hover:text-green-600'}`}
                  onClick={handleReturnToCart}
                >
                  <svg
                    className={`size-5 transition-transform duration-200 ${isFarsi ? 'group-hover:translate-x-0.5' : 'group-hover:-translate-x-0.5'
                      } ${dark ? 'text-blue-200' : 'text-green-950'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={isFarsi ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
                    />
                  </svg>
                  <span className={`${dark ? 'text-blue-200' : 'text-green-950'}`}>
                    {t('cart.title') || 'Your Order'}
                  </span>
                </button>
                {totalItemsCount > 0 && (
                  <span className={`text-sm font-normal px-2.5 py-1 ml-3 rounded-full
                    ${dark ? 'bg-yellow-400 text-slate-900' : 'bg-green-100 text-green-800'}`}>
                    {isFarsi ? convertToFarsiNumbers(totalItemsCount) : totalItemsCount}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Step Indicator - Only show during checkout steps */}
          {totalItemsCount > 0 && currentStep !== 'cart' && (
            <div className="flex items-center justify-center mt-4">
              {['delivery', 'payment'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`size-8 rounded-full flex items-center justify-center text-sm font-semibold
                    ${currentStep === step
                      ? (dark ? 'bg-yellow-400 text-slate-900' : 'bg-green-600 text-white')
                      : (dark ? 'bg-slate-700 text-slate-400' : 'bg-gray-200 text-gray-500')
                    }`}>
                    {index + 1}
                  </div>
                  {index < 1 && (
                    <div className={`w-12 h-1 mx-1 ${dark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className={`custom_scrollbar ${dark ? 'dark_mode_scrollbar' : 'light_mode_scrollbar'
          } overflow-y-auto flex-1`}>
          {showReceipt && receiptData ?
            // Show Receipt View
            <div className="p-4 md:p-6 space-y-6">
              <div className={`rounded-lg p-4 ${dark ? 'bg-slate-700' : 'bg-green-50'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
                  {t('payment.active_order') || 'Active Order'}
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={dark ? 'text-slate-300' : 'text-gray-600'}>
                      {t('cart.items') || 'Items'}:
                    </span>
                    <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                      {isFarsi ? convertToFarsiNumbers(receiptData.totalItems) : receiptData.totalItems}
                    </span>
                  </div>

                  {receiptData.deliveryTime && (
                    <div className="flex justify-between">
                      <span className={dark ? 'text-slate-300' : 'text-gray-600'}>
                        {t('cart.delivery_time') || 'Delivery Time'}:
                      </span>
                      <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {receiptData.deliveryTime}
                      </span>
                    </div>
                  )}

                  {receiptData.isComingNow && (
                    <div className="flex justify-between">
                      <span className={dark ? 'text-slate-300' : 'text-gray-600'}>
                        {t('cart.delivery_time') || 'Delivery Time'}:
                      </span>
                      <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {t('cart.coming_now') || 'Coming now'}
                      </span>
                    </div>
                  )}

                  {receiptData.tableNumber && (
                    <div className="flex justify-between">
                      <span className={dark ? 'text-slate-300' : 'text-gray-600'}>
                        {t('cart.table_number') || 'Table Number'}:
                      </span>
                      <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {isFarsi ? convertToFarsiNumbers(parseInt(receiptData.tableNumber)) : receiptData.tableNumber}
                      </span>
                    </div>
                  )}

                  {receiptData.isSelectingTableLater && (
                    <div className="flex justify-between">
                      <span className={dark ? 'text-slate-300' : 'text-gray-600'}>
                        {t('cart.table_number') || 'Table'}:
                      </span>
                      <span className={`font-medium text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {t('cart.select_later') || 'At restaurant'}
                      </span>
                    </div>
                  )}

                  <Line width='100%' />

                  <div className="flex justify-between text-lg">
                    <span className={`font-semibold ${dark ? 'text-blue-200' : 'text-green-950'}`}>
                      {t('cart.total') || 'Total'}:
                    </span>
                    <span className={`font-bold ${dark ? 'text-yellow-400' : 'text-green-600'}`}>
                      {receiptData.formattedTotal} {isFarsi ? 'ریال' : 'Rials'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items List */}
              <div>
                <h4 className={`text-base font-semibold mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>
                  {t('cart.your_items') || 'Your Items'}
                </h4>
                <div className="space-y-2">
                  {receiptData.items.map((item: any) => (
                    <div key={item.id} className={`flex justify-between items-center py-2 px-3 rounded
              ${dark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                      <span className={`text-sm ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                        {isFarsi ? item.name_fa : item.name_en} × {isFarsi ? convertToFarsiNumbers(item.quantity) : item.quantity}
                      </span>
                      <span className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {isFarsi ? item.formattedPriceFa : item.formattedPriceEn} {isFarsi ? 'ریال' : 'Rials'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            : totalItemsCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                <svg className={`size-16 mb-4 ${dark ? 'text-slate-600' : 'text-gray-300'}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l5.5-6M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                </svg>
                <p className={`text-lg font-medium mb-2 ${dark ? 'text-slate-300' : 'text-gray-600'}`}>
                  {t('cart.empty_title') || 'Your cart is empty'}
                </p>
                <p className={`text-sm ${dark ? 'text-slate-500' : 'text-gray-500'}`}>
                  {t('cart.empty_message') || 'Add some delicious items to get started!'}
                </p>
              </div>
            ) : (
              <>
                {/* Step 1: Cart Items */}
                {currentStep === 'cart' && (
                  <div className='cart_items_container min-h-[50vh]'>
                    {cartItems.map((item, index) => (
                      <div key={item.id}>
                        <div
                          className={`flex items-center gap-4 p-3 md:px-3 md:py-[18.5px] transition-all duration-200 cursor-pointer
                        ${dark ? 'bg-slate-600/85 hover:bg-slate-600/90' : 'bg-[#f8fffa]/90 hover:bg-[#f8fffa]/95'}`}
                          onClick={() => handleItemClick(item)}
                        >
                          <div className="size-16 rounded-lg overflow-hidden flex-shrink-0">
                            {item.images && item.images.length > 0 ? (
                              <img
                                src={`https://cyzwgmruoqhdztzcgcmr.supabase.co/storage/v1/object/public/public_images/${item.images[0]}`}
                                alt={isFarsi ? item.name_fa : item.name_en}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className={`w-full h-full flex items-center justify-center
                            ${dark ? 'bg-slate-600 text-slate-400' : 'bg-gray-200 text-gray-500'}`}>
                                <svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex justify-between items-center flex-1">
                            <div>
                              <h3 className={`font-semibold ${!isFarsi ? 'text-sm md:text-base' : 'text-base md:text-lg'} mb-1 truncate
                            ${dark ? 'text-white' : 'text-gray-900'}`}>
                                {isFarsi ? item.name_fa : item.name_en}
                              </h3>
                              <span className={`${!isFarsi ? 'text-[13px] md:text-sm' : 'text-sm md:text-base'} font-medium
                            ${dark ? 'text-green-400' : 'text-green-600'}`}>
                                {isFarsi ? item.price_fa : item.price_en.toLocaleString('en-US')} {isFarsi ? 'ریال' : 'Rials'}
                              </span>
                              <div className="flex md:hidden items-center gap-3 mt-2.5">
                                <Button
                                  onClick={(e) => handleDecrementQuantity(e, item.id)}
                                  className={`size-4`}
                                  bgColor={`${dark ? 'bg-slate-900' : 'bg-white'}`}
                                  textColor={`${dark ? 'text-yellow-500' : 'text-green-600'}`}
                                  icon={<AiOutlineMinus className="size-3" />}
                                  optionalPaddingAndGapClasses='py-[13px] px-[7px]'
                                />
                                <span className={`min-w-[24px] text-center text-[16px] font-bold
                              ${dark ? 'text-blue-200' : 'text-green-700'}`}>
                                  {isFarsi ? convertToFarsiNumbers(item.quantity) : item.quantity}
                                </span>
                                <Button
                                  onClick={() => handleIncrementQuantity(item)}
                                  className={`size-4`}
                                  icon={<AiOutlinePlus className="size-3" />}
                                  optionalPaddingAndGapClasses='py-[13px] px-[7px]'
                                />
                              </div>
                            </div>
                            <div className="hidden md:flex items-center gap-3">
                              <Button
                                onClick={(e) => handleDecrementQuantity(e, item.id)}
                                className={`size-4`}
                                bgColor={`${dark ? 'bg-slate-900' : 'bg-white'}`}
                                textColor={`${dark ? 'text-yellow-500' : 'text-green-600'}`}
                                icon={<AiOutlineMinus className="size-3" />}
                                optionalPaddingAndGapClasses='py-[13px] px-[7px]'
                              />
                              <span className={`min-w-[24px] text-center text-[16px] font-bold
                            ${dark ? 'text-blue-200' : 'text-green-700'}`}>
                                {isFarsi ? convertToFarsiNumbers(item.quantity) : item.quantity}
                              </span>
                              <Button
                                onClick={() => handleIncrementQuantity(item)}
                                className={`size-4`}
                                icon={<AiOutlinePlus className="size-3" />}
                                optionalPaddingAndGapClasses='py-[13px] px-[7px]'
                              />
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem(item.id);
                            }}
                            className={`size-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer
                          ${dark
                                ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                                : 'text-red-500 hover:bg-red-50 hover:text-red-600'
                              }`}
                          >
                            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        {index < cartItems.length - 1 && <Line width='100%' />}
                      </div>
                    ))}
                  </div>
                )}

                {/* Step 2: Delivery Details */}
                {currentStep === 'delivery' && (
                  <div className="p-5 space-y-5">
                    {/* Table Selection */}
                    <RestaurantMap />

                    {/* Time Selection */}
                    <div>
                      <h3 className={`text-lg font-semibold mb-3 ${dark ? 'text-white' : 'text-green-900'}`}>
                        {t('cart.select_time') || 'Select Delivery Time'}
                      </h3>

                      {/* Coming Now Checkbox */}
                      <label className={`flex items-center gap-2 mb-4 p-3 rounded-2xl transition-colors
                           ${dark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'}
                           ${!isSelectingTableLater ? 'opacity-50' : 'cursor-pointer'}`}>
                        <input
                          type="checkbox"
                          checked={isComingNow}
                          onChange={(e) => dispatch(setComingNow(e.target.checked))}
                          disabled={!isSelectingTableLater}
                          className="size-4"
                        />
                        <div>
                          <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                            {t('cart.coming_now') || "I'll come now"}
                          </span>
                          <p className={`text-xs mt-0.5 ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                            {t('cart.coming_now_desc') || 'Within 30 minutes'}
                          </p>
                        </div>
                      </label>

                      {/* Time Slot Description */}
                      {!isComingNow && (
                        <p className={`text-xs mb-3 ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                          {isSelectingTableLater
                            ? (t('cart.time_desc_no_table') || 'Select any time from next hour onwards')
                            : (t('cart.time_desc_with_table') || 'Available from 2 hours onwards (rounded up)')
                          }
                        </p>
                      )}

                      {/* Time Slots Grid */}
                      {!isComingNow && (
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                          {generateTimeSlots().map(time => (
                            <button
                              key={time}
                              onClick={() => {
                                if (selectedTime === time) {
                                  dispatch(setDeliveryTime(null));
                                } else {
                                  dispatch(setDeliveryTime(time));
                                }
                              }}
                              className={`py-2 px-3 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer
                                ${selectedTime === time
                                  ? (dark ? 'bg-yellow-400 text-slate-900' : 'bg-green-600 text-white')
                                  : (dark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                                }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Payment Confirmation */}
                {currentStep === 'payment' && (
                  <div className="p-4 md:p-6 space-y-6">
                    <div className={`rounded-lg p-4 ${dark ? 'bg-slate-700' : 'bg-green-50'}`}>
                      <h3 className={`text-lg font-semibold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {t('cart.order_summary') || 'Order Summary'}
                      </h3>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className={dark ? 'text-slate-300' : 'text-gray-600'}>
                            {t('cart.items') || 'Items'}:
                          </span>
                          <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                            {isFarsi ? convertToFarsiNumbers(totalItemsCount) : totalItemsCount}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className={dark ? 'text-slate-300' : 'text-gray-600'}>
                            {t('cart.delivery_time') || 'Delivery Time'}:
                          </span>
                          <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                            {selectedTime}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className={dark ? 'text-slate-300' : 'text-gray-600'}>
                            {t('cart.table_number') || 'Table Number'}:
                          </span>
                          <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                            {isFarsi ? convertToFarsiNumbers(parseInt(selectedTable)) : selectedTable}
                          </span>
                        </div>

                        <Line width='100%' />

                        <div className="flex justify-between text-lg">
                          <span className={`font-semibold ${dark ? 'text-blue-200' : 'text-green-950'}`}>
                            {t('cart.total') || 'Total'}:
                          </span>
                          <span className={`font-bold ${dark ? 'text-yellow-400' : 'text-green-600'}`}>
                            {formattedTotalPrice} {isFarsi ? 'ریال' : 'Rials'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div>
                      <h4 className={`text-base font-semibold mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {t('cart.your_items') || 'Your Items'}
                      </h4>
                      <div className="space-y-2">
                        {cartItems.map(item => (
                          <div key={item.id} className={`flex justify-between items-center py-2 px-3 rounded
                          ${dark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                            <span className={`text-sm ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                              {isFarsi ? item.name_fa : item.name_en} × {isFarsi ? convertToFarsiNumbers(item.quantity) : item.quantity}
                            </span>
                            <span className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                              {isFarsi
                                ? convertToFarsiNumbers((parseFloat(convertFarsiToEnglishNumbers(item.price_fa).replace(/[,،]/g, '')) * item.quantity).toLocaleString('en-US'))
                                : (item.price_en * item.quantity).toLocaleString('en-US')
                              } {isFarsi ? 'ریال' : 'Rials'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
        </div>

        {/* Fixed Footer */}
        {!showReceipt && totalItemsCount > 0 && (
          <div className={`flex-shrink-0 px-4 md:px-6 ${!isFarsi ? 'pt-3 pb-11' : 'pt-1.5 pb-10'} md:py-3.5 border-t border-opacity-20 border-gray-300 bg-opacity-95 backdrop-blur-sm
    ${dark ? 'bg-slate-800' : 'bg-white'}`}>
            {currentStep === 'cart' && (
              <>
                <div className={`flex justify-between items-center mb-4 text-sm md:text-lg font-bold
          ${dark ? 'text-white' : 'text-gray-900'}`}>
                  <span className={`${isFarsi ? 'ml-2' : 'mr-2'} ${dark ? 'text-blue-200' : 'text-green-950'}`}>
                    {t('cart.total') || 'Total'}:
                  </span>
                  <span className={`${dark ? 'text-yellow-300' : 'text-green-600'}`}>
                    <span className={`${isFarsi ? 'text-[19px]' : 'text-[17px]'} md:text-2xl`}>{formattedTotalPrice}</span> {isFarsi ? 'ریال' : 'Rials'}
                  </span>
                </div>
                <Button onClick={handleStepForward} text={t('cart.proceed') || 'Proceed'} />
              </>
            )}
            {currentStep === 'delivery' && (
              <div className="flex gap-3">
                <Button
                  onClick={handleStepBack}
                  text={t('cart.back') || 'Back'}
                  bgColor={dark ? 'bg-slate-700' : 'bg-gray-200'}
                  textColor={dark ? 'text-slate-300' : 'text-gray-700'}
                  className="flex-1"
                />
                <Button
                  onClick={handleStepForward}
                  text={t('cart.proceed') || 'Proceed'}
                  className="flex-1"
                  disabled={!isDeliveryComplete}
                />
              </div>
            )}
            {currentStep === 'payment' && (
              <div className="flex gap-3">
                <Button
                  onClick={handleStepBack}
                  text={t('cart.back') || 'Back'}
                  bgColor={dark ? 'bg-slate-700' : 'bg-gray-200'}
                  textColor={dark ? 'text-slate-300' : 'text-gray-700'}
                  className="flex-1"
                />
                <Button
                  onClick={handleFinalPayment}
                  text={isProcessingPayment ? '' : (t('cart.pay_now') || 'Pay Now')}
                  className="flex-1"
                  disabled={isProcessingPayment}
                  icon={isProcessingPayment ? (
                    <svg className="animate-spin size-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : undefined}
                />
              </div>
            )}
            {currentStep === 'cart' && (
              <div className={`text-center mt-4 text-xs md:text-sm flex justify-center items-center ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                <AiOutlineClockCircle className={`${isFarsi ? 'ml-1.5' : 'mr-1.5'}`} size={16} />
                {t('cart.estimated_time', {
                  min: isFarsi ? convertToFarsiNumbers(minEstimate) : minEstimate,
                  max: isFarsi ? convertToFarsiNumbers(maxEstimate) : maxEstimate
                })}
              </div>
            )}
          </div>
        )}

        {/* Receipt Footer with Reset Button */}
        {showReceipt && (
          <div className={`flex-shrink-0 px-4 md:px-6 py-3.5 border-t border-opacity-20 border-gray-300 bg-opacity-95 backdrop-blur-sm
            ${dark ? 'bg-slate-800' : 'bg-white'}`}>
            <Button
              onClick={handleResetReceipt}
              text={t('cart.reset_order') || 'Reset Order (Test)'}
              bgColor={dark ? 'bg-red-600' : 'bg-red-500'}
              textColor="text-white"
              className="w-full"
            />
          </div>
        )}
      </div>

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={handleCloseModal}
          onImageError={handleImageError}
          failedImages={failedImages}
          getCategoryDisplayName={getCategoryDisplayName}
          isInShoppingCart={true}
        />
      )}
    </>
  );
}