import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  setDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  runTransaction, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { checkRefillEligibility, calculateNextEligibleDate } from '../utils/refillUtils';
import { validateStockAvailability } from '../utils/validationUtils';
import { getAgencySettings } from './settingsService';
import { findCustomerByConsumerId } from './customerService';
import { getAllInventory, updateInventoryStock } from './inventoryService';
import { INITIAL_SALES } from '../firebase/seedData';
import { withTimeout } from '../utils/promiseUtils';

let memorySales = [...INITIAL_SALES];

/**
 * Execute Gas Sale Transaction safely with memory fallback.
 */
export const executeGasSale = async ({
  consumerId,
  company,
  weight,
  quantity = 1,
  unitPrice,
  paymentMethod = 'Cash',
  notes = '',
  createdBy = 'staff'
}) => {
  const cleanConsumerId = String(consumerId).trim().toUpperCase();
  const numWeight = Number(weight);
  const numQty = Number(quantity);
  const numUnitPrice = Number(unitPrice);
  const totalPrice = numUnitPrice * numQty;
  const saleDate = new Date();

  // 1. Agency Settings
  const agencySettings = await getAgencySettings();
  const refillDurationDays = agencySettings.refillDurationDays || 25;

  // 2. Customer Lookup
  const customerData = await findCustomerByConsumerId(cleanConsumerId);
  if (!customerData) {
    throw new Error(`Customer with Consumer ID "${cleanConsumerId}" not found. Please add customer first.`);
  }

  // 3. Refill Eligibility Validation
  const eligibility = checkRefillEligibility(
    customerData.lastPurchaseDate,
    customerData.nextEligibleDate,
    refillDurationDays
  );

  if (!eligibility.isEligible) {
    throw new Error(`Customer is NOT eligible for refill yet! ${eligibility.message}`);
  }

  // 4. Stock Availability Check
  const inventoryList = await getAllInventory();
  const companyCodeMap = { 'HP Gas': 'HP', 'Indane Gas': 'INDANE', 'Bharat Gas': 'BHARAT' };
  const code = companyCodeMap[company] || company.split(' ')[0].toUpperCase();
  const targetInvId = `${code}_${numWeight}`;

  const invItem = inventoryList.find(i => i.id === targetInvId || (i.company === company && Number(i.weight) === numWeight));
  const currentFilled = invItem ? Number(invItem.filledQuantity || 0) : 0;

  const stockCheck = validateStockAvailability(currentFilled, numQty);
  if (!stockCheck.isValid) {
    throw new Error(stockCheck.message);
  }

  // Calculate Next Eligible Date
  const nextEligibleDate = calculateNextEligibleDate(saleDate, refillDurationDays);

  const newSaleRecord = {
    id: `sale_${Date.now()}`,
    customerId: customerData.id,
    customerName: customerData.name,
    consumerId: cleanConsumerId,
    mobile: customerData.mobile,
    address: customerData.address || '',
    company,
    weight: numWeight,
    quantity: numQty,
    unitPrice: numUnitPrice,
    totalPrice,
    paymentMethod,
    notes,
    saleDate,
    nextEligibleDate,
    createdAt: new Date(),
    createdBy
  };

  memorySales.unshift(newSaleRecord);

  // Update Inventory Stock (Deduct filled, add empty)
  updateInventoryStock({
    inventoryId: invItem ? invItem.id : targetInvId,
    company,
    weight: numWeight,
    filledToAdd: -numQty,
    emptyToAdd: numQty,
    transactionType: 'SALE',
    notes: `Sale to ${customerData.name} (${cleanConsumerId})`
  }).catch(console.warn);

  // Update Customer Stats
  customerData.totalPurchases = (customerData.totalPurchases || 0) + 1;
  customerData.totalCylinders = (customerData.totalCylinders || 0) + numQty;
  customerData.lastPurchaseDate = saleDate;
  customerData.nextEligibleDate = nextEligibleDate;

  // Background Firestore async save
  addDoc(collection(db, 'sales'), {
    ...newSaleRecord,
    createdAt: serverTimestamp()
  }).catch(console.warn);

  return { success: true, sale: newSaleRecord };
};

/**
 * Fetch recent sales with safety timeout.
 */
export const getRecentSales = async (limitCount = 10) => {
  const fetchTask = (async () => {
    const q = query(
      collection(db, 'sales'), 
      orderBy('saleDate', 'desc'), 
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    const salesList = [];
    snapshot.forEach((docSnap) => {
      salesList.push({ id: docSnap.id, ...docSnap.data() });
    });
    memorySales = salesList;
    return salesList;
  })();

  return withTimeout(fetchTask, memorySales.slice(0, limitCount), 1200);
};

/**
 * Get customer sales.
 */
export const getCustomerSales = async (consumerId) => {
  if (!consumerId) return [];
  const cleanId = String(consumerId).trim().toUpperCase();

  const fetchTask = (async () => {
    const q = query(
      collection(db, 'sales'), 
      where('consumerId', '==', cleanId),
      orderBy('saleDate', 'desc')
    );
    const snapshot = await getDocs(q);
    const salesList = [];
    snapshot.forEach((docSnap) => {
      salesList.push({ id: docSnap.id, ...docSnap.data() });
    });
    return salesList;
  })();

  return withTimeout(fetchTask, memorySales.filter(s => String(s.consumerId).toUpperCase() === cleanId), 1200);
};
