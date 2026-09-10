import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export const INITIAL_INVENTORY_ITEMS = [
  // HP Gas
  { id: 'HP_2', company: 'HP Gas', companyCode: 'HP', weight: 2, filledQuantity: 85, emptyQuantity: 25, minimumStock: 15 },
  { id: 'HP_5', company: 'HP Gas', companyCode: 'HP', weight: 5, filledQuantity: 120, emptyQuantity: 40, minimumStock: 15 },
  { id: 'HP_14', company: 'HP Gas', companyCode: 'HP', weight: 14, filledQuantity: 298, emptyQuantity: 85, minimumStock: 25 },
  { id: 'HP_19', company: 'HP Gas', companyCode: 'HP', weight: 19, filledQuantity: 65, emptyQuantity: 30, minimumStock: 10 },
  { id: 'HP_47.5', company: 'HP Gas', companyCode: 'HP', weight: 47.5, filledQuantity: 20, emptyQuantity: 8, minimumStock: 5 },
  
  // Indane Gas
  { id: 'INDANE_2', company: 'Indane Gas', companyCode: 'INDANE', weight: 2, filledQuantity: 70, emptyQuantity: 20, minimumStock: 15 },
  { id: 'INDANE_5', company: 'Indane Gas', companyCode: 'INDANE', weight: 5, filledQuantity: 110, emptyQuantity: 35, minimumStock: 15 },
  { id: 'INDANE_14', company: 'Indane Gas', companyCode: 'INDANE', weight: 14, filledQuantity: 340, emptyQuantity: 95, minimumStock: 30 },
  { id: 'INDANE_19', company: 'Indane Gas', companyCode: 'INDANE', weight: 19, filledQuantity: 55, emptyQuantity: 22, minimumStock: 10 },

  // Bharat Gas
  { id: 'BHARAT_2', company: 'Bharat Gas', companyCode: 'BHARAT', weight: 2, filledQuantity: 60, emptyQuantity: 18, minimumStock: 15 },
  { id: 'BHARAT_5', company: 'Bharat Gas', companyCode: 'BHARAT', weight: 5, filledQuantity: 90, emptyQuantity: 28, minimumStock: 15 },
  { id: 'BHARAT_14', company: 'Bharat Gas', companyCode: 'BHARAT', weight: 14, filledQuantity: 157, emptyQuantity: 62, minimumStock: 25 },
  { id: 'BHARAT_19', company: 'Bharat Gas', companyCode: 'BHARAT', weight: 19, filledQuantity: 42, emptyQuantity: 15, minimumStock: 10 },

  // Reliance Commercial Gas
  { id: 'RELIANCE_19', company: 'Reliance Gas', companyCode: 'RELIANCE', weight: 19, filledQuantity: 38, emptyQuantity: 12, minimumStock: 10 },
  { id: 'RELIANCE_33', company: 'Reliance Gas', companyCode: 'RELIANCE', weight: 33, filledQuantity: 18, emptyQuantity: 6, minimumStock: 5 }
];

export const INITIAL_SETTINGS = {
  agencyName: 'Standard Gas Agency & Distributors',
  address: '45/2 Industrial Estate, Station Road, Pune - 411001',
  phone: '9876543210',
  refillDurationDays: 25,
  defaultMinimumStock: 15,
  updatedAt: new Date()
};

export const INITIAL_CUSTOMERS = [
  {
    id: 'cust_1',
    name: 'Rahul Patil',
    consumerId: 'HP12345',
    mobile: '9876543210',
    address: '12 Green Park Society, Kothrud, Pune',
    company: 'HP Gas',
    totalPurchases: 8,
    totalCylinders: 8,
    lastPurchaseDate: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000), // 32 days ago (ELIGIBLE)
    nextEligibleDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(2025, 1, 10)
  },
  {
    id: 'cust_2',
    name: 'Priya Sharma',
    consumerId: 'IND98765',
    mobile: '9812345678',
    address: 'B-402 Shanti Towers, Viman Nagar, Pune',
    company: 'Indane Gas',
    totalPurchases: 5,
    totalCylinders: 5,
    lastPurchaseDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago (INELIGIBLE)
    nextEligibleDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    createdAt: new Date(2025, 2, 15)
  },
  {
    id: 'cust_3',
    name: 'Amit Deshmukh',
    consumerId: 'BH77889',
    mobile: '9765432109',
    address: '77 Shivaji Marg, Aundh, Pune',
    company: 'Bharat Gas',
    totalPurchases: 12,
    totalCylinders: 16,
    lastPurchaseDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago (ELIGIBLE)
    nextEligibleDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    createdAt: new Date(2024, 11, 5)
  },
  {
    id: 'cust_4',
    name: 'Sunita Joshi',
    consumerId: 'HP99881',
    mobile: '9822334455',
    address: 'Flat 101, Omkar Heights, Baner, Pune',
    company: 'HP Gas',
    totalPurchases: 4,
    totalCylinders: 4,
    lastPurchaseDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago (ELIGIBLE)
    nextEligibleDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    createdAt: new Date(2025, 3, 20)
  },
  {
    id: 'cust_5',
    name: 'Rajesh Kulkarni',
    consumerId: 'IND55443',
    mobile: '9988776655',
    address: '24 Mayur Colony, Karve Nagar, Pune',
    company: 'Indane Gas',
    totalPurchases: 7,
    totalCylinders: 7,
    lastPurchaseDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago (INELIGIBLE)
    nextEligibleDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
    createdAt: new Date(2025, 0, 12)
  },
  {
    id: 'cust_6',
    name: 'Ananya Roy',
    consumerId: 'BH33221',
    mobile: '9711223344',
    address: 'C-12 Sun City, Hadapsar, Pune',
    company: 'Bharat Gas',
    totalPurchases: 2,
    totalCylinders: 2,
    lastPurchaseDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // 28 days ago (ELIGIBLE)
    nextEligibleDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(2025, 4, 1)
  },
  {
    id: 'cust_7',
    name: 'Vikas Verma',
    consumerId: 'HP66778',
    mobile: '9655443322',
    address: '55 Lake View Residency, Katraj, Pune',
    company: 'HP Gas',
    totalPurchases: 3,
    totalCylinders: 3,
    lastPurchaseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago (INELIGIBLE)
    nextEligibleDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    createdAt: new Date(2025, 5, 14)
  },
  {
    id: 'cust_8',
    name: 'Sneha Mehta',
    consumerId: 'IND11223',
    mobile: '9899887766',
    address: 'Plot 88, IT Park Road, Hinjewadi, Pune',
    company: 'Indane Gas',
    totalPurchases: 9,
    totalCylinders: 9,
    lastPurchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago (ELIGIBLE)
    nextEligibleDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(2024, 10, 1)
  },
  {
    id: 'cust_9',
    name: 'Manoj Shinde',
    consumerId: 'HP88990',
    mobile: '9833445566',
    address: '15 Swapna Nagari, Pimpri, Pune',
    company: 'HP Gas',
    totalPurchases: 6,
    totalCylinders: 6,
    lastPurchaseDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago (ELIGIBLE)
    nextEligibleDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    createdAt: new Date(2025, 6, 11)
  },
  {
    id: 'cust_10',
    name: 'Deepak More',
    consumerId: 'REL12345',
    mobile: '9744556677',
    address: 'Chakan MIDC Phase 2, Pune',
    company: 'Reliance Gas',
    totalPurchases: 14,
    totalCylinders: 28,
    lastPurchaseDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // 40 days ago (ELIGIBLE)
    nextEligibleDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    createdAt: new Date(2024, 8, 20)
  },
  {
    id: 'cust_11',
    name: 'Archana Wagh',
    consumerId: 'BH44556',
    mobile: '9855667788',
    address: 'Flat 303, Rose Gardens, Wakad, Pune',
    company: 'Bharat Gas',
    totalPurchases: 4,
    totalCylinders: 4,
    lastPurchaseDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago (INELIGIBLE)
    nextEligibleDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
    createdAt: new Date(2025, 7, 5)
  },
  {
    id: 'cust_12',
    name: 'Ganesh Gaikwad',
    consumerId: 'IND77889',
    mobile: '9966778899',
    address: '88 MG Road, Camp, Pune',
    company: 'Indane Gas',
    totalPurchases: 10,
    totalCylinders: 10,
    lastPurchaseDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000), // 50 days ago (ELIGIBLE)
    nextEligibleDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    createdAt: new Date(2024, 5, 12)
  }
];

export const INITIAL_SALES = [
  // September 2026
  {
    id: 'sale_301',
    customerId: 'cust_1',
    customerName: 'Rahul Patil',
    consumerId: 'HP12345',
    mobile: '9876543210',
    company: 'HP Gas',
    weight: 14,
    quantity: 1,
    unitPrice: 950,
    totalPrice: 950,
    paymentMethod: 'UPI',
    saleDate: new Date(2026, 8, 9, 11, 20),
    nextEligibleDate: new Date(2026, 9, 4)
  },
  {
    id: 'sale_302',
    customerId: 'cust_10',
    customerName: 'Deepak More',
    consumerId: 'REL12345',
    mobile: '9744556677',
    company: 'Reliance Gas',
    weight: 19,
    quantity: 2,
    unitPrice: 1850,
    totalPrice: 3700,
    paymentMethod: 'Cash',
    saleDate: new Date(2026, 8, 8, 14, 30),
    nextEligibleDate: new Date(2026, 9, 3)
  },
  {
    id: 'sale_303',
    customerId: 'cust_3',
    customerName: 'Amit Deshmukh',
    consumerId: 'BH77889',
    mobile: '9765432109',
    company: 'Bharat Gas',
    weight: 19,
    quantity: 2,
    unitPrice: 1850,
    totalPrice: 3700,
    paymentMethod: 'UPI',
    saleDate: new Date(2026, 8, 7, 11, 15),
    nextEligibleDate: new Date(2026, 9, 2)
  },
  {
    id: 'sale_304',
    customerId: 'cust_12',
    customerName: 'Ganesh Gaikwad',
    consumerId: 'IND77889',
    mobile: '9966778899',
    company: 'Indane Gas',
    weight: 14,
    quantity: 1,
    unitPrice: 950,
    totalPrice: 950,
    paymentMethod: 'Card',
    saleDate: new Date(2026, 8, 5, 16, 10),
    nextEligibleDate: new Date(2026, 8, 30)
  },
  {
    id: 'sale_305',
    customerId: 'cust_2',
    customerName: 'Priya Sharma',
    consumerId: 'IND98765',
    mobile: '9812345678',
    company: 'Indane Gas',
    weight: 14,
    quantity: 1,
    unitPrice: 950,
    totalPrice: 950,
    paymentMethod: 'Card',
    saleDate: new Date(2026, 8, 1, 16, 45),
    nextEligibleDate: new Date(2026, 8, 26)
  },

  // August 2026
  {
    id: 'sale_290',
    customerId: 'cust_5',
    customerName: 'Rajesh Kulkarni',
    consumerId: 'IND55443',
    mobile: '9988776655',
    company: 'Indane Gas',
    weight: 14,
    quantity: 1,
    unitPrice: 950,
    totalPrice: 950,
    paymentMethod: 'UPI',
    saleDate: new Date(2026, 7, 28, 10, 0),
    nextEligibleDate: new Date(2026, 8, 22)
  },
  {
    id: 'sale_291',
    customerId: 'cust_4',
    customerName: 'Sunita Joshi',
    consumerId: 'HP99881',
    mobile: '9822334455',
    company: 'HP Gas',
    weight: 5,
    quantity: 2,
    unitPrice: 450,
    totalPrice: 900,
    paymentMethod: 'Cash',
    saleDate: new Date(2026, 7, 20, 15, 20),
    nextEligibleDate: new Date(2026, 8, 14)
  },
  {
    id: 'sale_292',
    customerId: 'cust_9',
    customerName: 'Manoj Shinde',
    consumerId: 'HP88990',
    mobile: '9833445566',
    company: 'HP Gas',
    weight: 14,
    quantity: 1,
    unitPrice: 950,
    totalPrice: 950,
    paymentMethod: 'UPI',
    saleDate: new Date(2026, 7, 15, 13, 40),
    nextEligibleDate: new Date(2026, 8, 9)
  },
  {
    id: 'sale_293',
    customerId: 'cust_8',
    customerName: 'Sneha Mehta',
    consumerId: 'IND11223',
    mobile: '9899887766',
    company: 'Indane Gas',
    weight: 14,
    quantity: 1,
    unitPrice: 950,
    totalPrice: 950,
    paymentMethod: 'UPI',
    saleDate: new Date(2026, 7, 10, 12, 30),
    nextEligibleDate: new Date(2026, 8, 4)
  },

  // July 2026
  {
    id: 'sale_280',
    customerId: 'cust_3',
    customerName: 'Amit Deshmukh',
    consumerId: 'BH77889',
    mobile: '9765432109',
    company: 'Bharat Gas',
    weight: 14,
    quantity: 1,
    unitPrice: 950,
    totalPrice: 950,
    paymentMethod: 'Cash',
    saleDate: new Date(2026, 6, 25, 9, 30),
    nextEligibleDate: new Date(2026, 7, 19)
  },
  {
    id: 'sale_281',
    customerId: 'cust_11',
    customerName: 'Archana Wagh',
    consumerId: 'BH44556',
    mobile: '9855667788',
    company: 'Bharat Gas',
    weight: 14,
    quantity: 1,
    unitPrice: 950,
    totalPrice: 950,
    paymentMethod: 'UPI',
    saleDate: new Date(2026, 6, 18, 11, 20),
    nextEligibleDate: new Date(2026, 7, 12)
  },
  {
    id: 'sale_282',
    customerId: 'cust_1',
    customerName: 'Rahul Patil',
    consumerId: 'HP12345',
    mobile: '9876543210',
    company: 'HP Gas',
    weight: 14,
    quantity: 1,
    unitPrice: 950,
    totalPrice: 950,
    paymentMethod: 'UPI',
    saleDate: new Date(2026, 6, 12, 14, 0),
    nextEligibleDate: new Date(2026, 7, 6)
  },

  // June 2026
  {
    id: 'sale_270',
    customerId: 'cust_7',
    customerName: 'Vikas Verma',
    consumerId: 'HP66778',
    mobile: '9655443322',
    company: 'HP Gas',
    weight: 2,
    quantity: 3,
    unitPrice: 220,
    totalPrice: 660,
    paymentMethod: 'Cash',
    saleDate: new Date(2026, 5, 18, 17, 15),
    nextEligibleDate: new Date(2026, 6, 13)
  },
  {
    id: 'sale_271',
    customerId: 'cust_6',
    customerName: 'Ananya Roy',
    consumerId: 'BH33221',
    mobile: '9711223344',
    company: 'Bharat Gas',
    weight: 14,
    quantity: 1,
    unitPrice: 950,
    totalPrice: 950,
    paymentMethod: 'Card',
    saleDate: new Date(2026, 5, 5, 11, 45),
    nextEligibleDate: new Date(2026, 5, 30)
  },

  // May 2026
  {
    id: 'sale_260',
    customerId: 'cust_2',
    customerName: 'Priya Sharma',
    consumerId: 'IND98765',
    mobile: '9812345678',
    company: 'Indane Gas',
    weight: 14,
    quantity: 1,
    unitPrice: 950,
    totalPrice: 950,
    paymentMethod: 'UPI',
    saleDate: new Date(2026, 4, 22, 13, 10),
    nextEligibleDate: new Date(2026, 5, 16)
  },

  // April 2026
  {
    id: 'sale_250',
    customerId: 'cust_5',
    customerName: 'Rajesh Kulkarni',
    consumerId: 'IND55443',
    mobile: '9988776655',
    company: 'Indane Gas',
    weight: 14,
    quantity: 1,
    unitPrice: 950,
    totalPrice: 950,
    paymentMethod: 'Cash',
    saleDate: new Date(2026, 3, 15, 10, 30),
    nextEligibleDate: new Date(2026, 4, 10)
  },

  // March 2026
  {
    id: 'sale_240',
    customerId: 'cust_3',
    customerName: 'Amit Deshmukh',
    consumerId: 'BH77889',
    mobile: '9765432109',
    company: 'Bharat Gas',
    weight: 19,
    quantity: 1,
    unitPrice: 1850,
    totalPrice: 1850,
    paymentMethod: 'UPI',
    saleDate: new Date(2026, 2, 29, 16, 0),
    nextEligibleDate: new Date(2026, 3, 23)
  },

  // February 2026
  {
    id: 'sale_230',
    customerId: 'cust_1',
    customerName: 'Rahul Patil',
    consumerId: 'HP12345',
    mobile: '9876543210',
    company: 'HP Gas',
    weight: 14,
    quantity: 1,
    unitPrice: 950,
    totalPrice: 950,
    paymentMethod: 'Cash',
    saleDate: new Date(2026, 1, 14, 11, 0),
    nextEligibleDate: new Date(2026, 2, 11)
  },

  // January 2026
  {
    id: 'sale_220',
    customerId: 'cust_8',
    customerName: 'Sneha Mehta',
    consumerId: 'IND11223',
    mobile: '9899887766',
    company: 'Indane Gas',
    weight: 14,
    quantity: 1,
    unitPrice: 950,
    totalPrice: 950,
    paymentMethod: 'UPI',
    saleDate: new Date(2026, 0, 8, 15, 30),
    nextEligibleDate: new Date(2026, 1, 2)
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx_201',
    company: 'HP Gas',
    weight: 14,
    transactionType: 'STOCK_IN',
    quantity: 150,
    previousFilled: 148,
    newFilled: 298,
    previousEmpty: 85,
    newEmpty: 85,
    notes: 'Received bulk shipment from HP Bottling Plant #HP-4490',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'tx_202',
    company: 'Indane Gas',
    weight: 14,
    transactionType: 'STOCK_IN',
    quantity: 180,
    previousFilled: 160,
    newFilled: 340,
    previousEmpty: 95,
    newEmpty: 95,
    notes: 'Received Indane bottling batch #IND-8820',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'tx_203',
    company: 'Reliance Gas',
    weight: 19,
    transactionType: 'SALE',
    quantity: 2,
    previousFilled: 40,
    newFilled: 38,
    previousEmpty: 10,
    newEmpty: 12,
    notes: 'Commercial sale to Deepak More (REL12345)',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    id: 'tx_204',
    company: 'Bharat Gas',
    weight: 14,
    transactionType: 'RETURN',
    quantity: 15,
    previousFilled: 142,
    newFilled: 157,
    previousEmpty: 77,
    newEmpty: 62,
    notes: 'Customer empty cylinder return batch',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  }
];

export const seedInitialDatabase = async () => {
  try {
    const invSnapshot = await getDocs(collection(db, 'inventory'));
    if (invSnapshot.empty) {
      for (const item of INITIAL_INVENTORY_ITEMS) {
        await setDoc(doc(db, 'inventory', item.id), {
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
