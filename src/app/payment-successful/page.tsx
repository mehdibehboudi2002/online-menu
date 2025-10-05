'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { useTranslation } from 'react-i18next';
import { convertToFarsiNumbers } from '@/types/api';
import Button from '@/components/Button';
import Line from '@/components/Line';

export default function PaymentSuccess() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const dark = useSelector((state: RootState) => state.theme.dark);
  const [receipt, setReceipt] = useState<any>(null);
  
  const currentLang = i18n.language as 'en' | 'fa';
  const isFarsi = currentLang === 'fa';

  useEffect(() => {
    // Load receipt from localStorage
    const savedReceipt = localStorage.getItem('orderReceipt');
    if (savedReceipt) {
      setReceipt(JSON.parse(savedReceipt));
    } else {
      // If no receipt, redirect to home
      router.push('/');
    }
  }, [router]);

  const handleReturnHome = () => {
    router.push('/');
  };

  if (!receipt) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${dark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center px-3 py-4 md:py-6 ${dark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${dark ? 'bg-slate-800' : 'bg-white'}`}>
        {/* Success Header */}
        <div className={`p-4 md:p-6 text-center ${dark ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 'bg-gradient-to-r from-green-500 to-green-600'}`}>
          <div className="flex justify-center mb-3 md:mb-4">
            <div className="rounded-full bg-white p-2 md:p-3">
              <svg className="w-12 h-12 md:w-16 md:h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className={`text-xl md:text-2xl font-bold mb-2 ${dark ? 'text-slate-900' : 'text-white'}`}>
            {t('payment.success_title') || 'Payment Successful!'}
          </h1>
          <p className={`text-xs md:text-sm ${dark ? 'text-slate-800' : 'text-green-50'}`}>
            {t('payment.success_message') || 'Your order has been confirmed'}
          </p>
        </div>

        {/* Receipt Details */}
        <div className="p-4 md:p-6 md:pb-0 space-y-4 md:space-y-6 max-h-[60vh] md:max-h-[70vh] overflow-y-auto">
          <div className={`rounded-lg p-3 md:p-4 ${dark ? 'bg-slate-700' : 'bg-green-50'}`}>
            <h3 className={`text-base md:text-lg font-semibold mb-3 md:mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
              {t('cart.order_summary') || 'Order Summary'}
            </h3>

            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between text-sm md:text-base">
                <span className={dark ? 'text-slate-300' : 'text-gray-600'}>
                  {t('cart.items') || 'Items'}:
                </span>
                <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                  {isFarsi ? convertToFarsiNumbers(receipt.totalItems) : receipt.totalItems}
                </span>
              </div>

              {receipt.deliveryTime && (
                <div className="flex justify-between text-sm md:text-base">
                  <span className={dark ? 'text-slate-300' : 'text-gray-600'}>
                    {t('cart.delivery_time') || 'Delivery Time'}:
                  </span>
                  <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                    {receipt.deliveryTime}
                  </span>
                </div>
              )}

              {receipt.isComingNow && (
                <div className="flex justify-between text-sm md:text-base">
                  <span className={dark ? 'text-slate-300' : 'text-gray-600'}>
                    {t('cart.delivery_time') || 'Delivery Time'}:
                  </span>
                  <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                    {t('cart.coming_now') || 'Coming now'}
                  </span>
                </div>
              )}

              {receipt.tableNumber && (
                <div className="flex justify-between text-sm md:text-base">
                  <span className={dark ? 'text-slate-300' : 'text-gray-600'}>
                    {t('cart.table_number') || 'Table Number'}:
                  </span>
                  <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                    {isFarsi ? convertToFarsiNumbers(parseInt(receipt.tableNumber)) : receipt.tableNumber}
                  </span>
                </div>
              )}

              {receipt.isSelectingTableLater && (
                <div className="flex justify-between text-sm md:text-base">
                  <span className={dark ? 'text-slate-300' : 'text-gray-600'}>
                    {t('cart.table_number') || 'Table'}:
                  </span>
                  <span className={`font-medium text-xs md:text-base ${dark ? 'text-white' : 'text-gray-900'}`}>
                    {t('cart.select_later') || 'At restaurant'}
                  </span>
                </div>
              )}

              <Line className='mt-4 mb-6' width='100%' />

              <div className="flex justify-between text-base md:text-lg">
                <span className={`font-semibold ${dark ? 'text-blue-200' : 'text-green-950'}`}>
                  {t('cart.total') || 'Total'}:
                </span>
                <span className={`font-bold ${dark ? 'text-yellow-400' : 'text-green-600'}`}>
                  {receipt.formattedTotal} {isFarsi ? 'ریال' : 'Rials'}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className={`text-sm md:text-base font-semibold mb-2 md:mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>
              {t('cart.your_items') || 'Your Items'}
            </h4>
            <div className="space-y-2">
              {receipt.items.map((item: any) => (
                <div key={item.id} className={`flex justify-between items-center py-2 px-2 md:px-3 rounded text-xs md:text-sm ${dark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                  <span className={`${dark ? 'text-slate-300' : 'text-gray-700'} break-words pr-2`}>
                    {isFarsi ? item.name_fa : item.name_en} × {isFarsi ? convertToFarsiNumbers(item.quantity) : item.quantity}
                  </span>
                  <span className={`font-medium whitespace-nowrap ${dark ? 'text-white' : 'text-gray-900'}`}>
                    {isFarsi ? item.formattedPriceFa : item.formattedPriceEn} {isFarsi ? 'ریال' : 'Rials'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Estimated Time */}
          {receipt.maxEstimate && (
            <div className={`text-xs md:text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
              <p>
                {t('payment.estimated_prep') || 'Estimated preparation time'}: {' '}
                <span className="font-semibold">
                  {isFarsi ? convertToFarsiNumbers(receipt.minEstimate) : receipt.minEstimate} - {isFarsi ? convertToFarsiNumbers(receipt.maxEstimate) : receipt.maxEstimate} {t('payment.minutes') || 'minutes'}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="p-4 md:p-6 pt-0">
          <Button
            onClick={handleReturnHome}
            text={t('payment.return_home') || 'Return to Home'}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}