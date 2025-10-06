// Define the structure of an item in the receipt
interface ReceiptItem {
  id: string;
  name_en: string;
  name_fa: string;
  quantity: number;
  formattedPriceEn: string;
  formattedPriceFa: string;
}

// Define the structure of the entire receipt data object
interface OrderReceiptData {
  items: ReceiptItem[];
  totalItems: number;
  formattedTotal: string;
  deliveryTime: string | null;
  isComingNow: boolean;
  tableNumber: string | null;
  isSelectingTableLater: boolean;
  minEstimate: number;
  maxEstimate: number;
  timestamp: string;
}