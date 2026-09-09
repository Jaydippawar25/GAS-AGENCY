import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export const INITIAL_INVENTORY_ITEMS = [
  // HP Gas
  { id: 'HP_2', company: 'HP Gas', companyCode: 'HP', weight: 2, filledQuantity: 60, emptyQuantity: 20, minimumStock: 15 },
  { id: 'HP_5', company: 'HP Gas', companyCode: 'HP', weight: 5, filledQuantity: 80, emptyQuantity: 25, minimumStock: 15 },
  { id: 'HP_14', company: 'HP Gas', companyCode: 'HP', weight: 14, filledQuantity: 150, emptyQuantity: 45, minimumStock: 20 },
  { id: 'HP_19', company: 'HP Gas', companyCode: 'HP', weight: 19, filledQuantity: 8, emptyQuantity: 32, minimumStock: 10 }, // Low stock item
  
  // Indane Gas
  { id: 'INDANE_2', company: 'Indane Gas', companyCode: 'INDANE', weight: 2, filledQuantity: 50, emptyQuantity: 15, minimumStock: 15 },
  { id: 'INDANE_5', company: 'Indane Gas', companyCode: 'INDANE', weight: 5, filledQuantity: 75, emptyQuantity: 30, minimumStock: 15 },
  { id: 'INDANE_14', company: 'Indane Gas', companyCode: 'INDANE', weight: 14, filledQuantity: 180, emptyQuantity: 50, minimumStock: 25 },
  { id: 'INDANE_19', company: 'Indane Gas', companyCode: 'INDANE', weight: 19, filledQuantity: 35, emptyQuantity: 10, minimumStock: 10 },

  // Bharat Gas
  { id: 'BHARAT_2', company: 'Bharat Gas', companyCode: 'BHARAT', weight: 2, filledQuantity: 45, emptyQuantity: 18, minimumStock: 15 },
  { id: 'BHARAT_5', company: 'Bharat Gas', companyCode: 'BHARAT', weight: 5, filledQuantity: 70, emptyQuantity: 22, minimumStock: 15 },
  { id: 'BHARAT_14', company: 'Bharat Gas', companyCode: 'BHARAT', weight: 14, filledQuantity: 12, emptyQuantity: 68, minimumStock: 20 }, // Low stock item
  { id: 'BHARAT_19', company: 'Bharat Gas', companyCode: 'BHARAT', weight: 19, filledQuantity: 30, emptyQuantity: 8, minimumStock: 10 },
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
    totalPurchases: 6,
    totalCylinders: 6,
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
    totalPurchases: 4,
    totalCylinders: 4,
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
    totalPurchases: 9,
    totalCylinders: 12,
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
    totalPurchases: 3,
    totalCylinders: 3,
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
    totalPurchases: 5,
    totalCylinders: 5,
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
    totalPurchases: 1,
    totalCylinders: 1,
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
    totalPurchases: 2,
    totalCylinders: 2,
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
    totalPurchases: 7,
    totalCylinders: 7,
    lastPurchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago (ELIGIBLE)
    nextEligibleDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(2024, 10, 1)
  }
];

export const INITIAL_SALES = [
  // September 2026 (Recent)
  {
    id: 'sale_201',
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
    saleDate: new Date(2026, 8, 8, 14, 30),
    nextEligibleDate: new Date(2026, 9, 3)
  },
  {
    id: 'sale_202',
    customerId: 'cust_3',
    customerName: 'Amit Deshmukh',
    consumerId: 'BH77889',
    mobile: '9765432109',
    company: 'Bharat Gas',
    weight: 19,
    quantity: 2,
    unitPrice: 1850,
    totalPrice: 3700,
    paymentMethod: 'Cash',
    saleDate: new Date(2026, 8, 7, 11, 15),
    nextEligibleDate: new Date(2026, 9, 2)
  },
  {
    id: 'sale_203',
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
    id: 'sale_190',
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
    id: 'sale_191',
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
    id: 'sale_192',
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
    id: 'sale_180',
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
    id: 'sale_181',
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
    id: 'sale_170',
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
    id: 'sale_171',
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
    id: 'sale_160',
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
    id: 'sale_150',
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
    id: 'sale_140',
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
    id: 'sale_130',
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
    id: 'sale_120',
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
    id: 'tx_101',
    company: 'HP Gas',
    weight: 14,
    transactionType: 'STOCK_IN',
    quantity: 100,
    previousFilled: 50,
    newFilled: 150,
    previousEmpty: 45,
    newEmpty: 45,
    notes: 'Received shipment from refinery #HP-8890',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'tx_102',
    company: 'Indane Gas',
    weight: 14,
    transactionType: 'SALE',
    quantity: 1,
    previousFilled: 181,
    newFilled: 180,
    previousEmpty: 49,
    newEmpty: 50,
    notes: 'Sale to Priya Sharma (IND98765)',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'tx_103',
    company: 'Bharat Gas',
    weight: 19,
    transactionType: 'SALE',
    quantity: 2,
    previousFilled: 32,
    newFilled: 30,
    previousEmpty: 6,
    newEmpty: 8,
    notes: 'Commercial sale to Amit Deshmukh (BH77889)',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
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
