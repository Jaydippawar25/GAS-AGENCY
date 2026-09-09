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
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { INITIAL_CUSTOMERS } from '../firebase/seedData';
import { withTimeout } from '../utils/promiseUtils';

let memoryCustomers = [...INITIAL_CUSTOMERS];

/**
 * Fetch all customers with safety timeout.
 */
export const getAllCustomers = async () => {
  const fetchTask = (async () => {
    const querySnapshot = await getDocs(query(collection(db, 'customers'), orderBy('createdAt', 'desc')));
    if (querySnapshot.empty) {
      return INITIAL_CUSTOMERS;
    }
    const customers = [];
    querySnapshot.forEach((docSnap) => {
      customers.push({ id: docSnap.id, ...docSnap.data() });
    });
    memoryCustomers = customers;
    return customers;
  })();

  return withTimeout(fetchTask, memoryCustomers, 1200);
};

/**
 * Get customer by ID with fallback.
 */
export const getCustomerById = async (id) => {
  const fetchTask = (async () => {
    const docRef = doc(db, 'customers', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return memoryCustomers.find(c => c.id === id) || null;
  })();

  return withTimeout(fetchTask, memoryCustomers.find(c => c.id === id) || null, 1200);
};

/**
 * Find customer by Consumer ID.
 */
export const findCustomerByConsumerId = async (consumerId) => {
  if (!consumerId) return null;
  const cleanId = String(consumerId).trim().toUpperCase();

  const fetchTask = (async () => {
    const q = query(collection(db, 'customers'), where('consumerId', '==', cleanId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() };
    }
    return memoryCustomers.find(c => String(c.consumerId).toUpperCase() === cleanId) || null;
  })();

  return withTimeout(fetchTask, memoryCustomers.find(c => String(c.consumerId).toUpperCase() === cleanId) || null, 1200);
};

/**
 * Check Consumer ID uniqueness.
 */
export const isConsumerIdUnique = async (consumerId, excludeCustomerId = null) => {
  if (!consumerId) return false;
  const existing = await findCustomerByConsumerId(consumerId);
  if (!existing) return true;
  if (excludeCustomerId && existing.id === excludeCustomerId) return true;
  return false;
};

/**
 * Create new customer.
 */
export const createCustomer = async (customerData) => {
  const cleanConsumerId = String(customerData.consumerId).trim().toUpperCase();

  const isUnique = await isConsumerIdUnique(cleanConsumerId);
  if (!isUnique) {
    throw new Error(`Consumer ID "${cleanConsumerId}" already exists. Please enter a unique Consumer ID.`);
  }

  const newDoc = {
    id: `cust_${Date.now()}`,
    name: customerData.name.trim(),
    consumerId: cleanConsumerId,
    mobile: customerData.mobile.trim(),
    address: customerData.address ? customerData.address.trim() : '',
    company: customerData.company || 'HP Gas',
    totalPurchases: 0,
    totalCylinders: 0,
    lastPurchaseDate: null,
    nextEligibleDate: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  memoryCustomers.unshift(newDoc);

  addDoc(collection(db, 'customers'), {
    ...newDoc,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }).catch(console.warn);

  return newDoc;
};

/**
 * Update customer.
 */
export const updateCustomer = async (id, updatedFields) => {
  if (updatedFields.consumerId) {
    const isUnique = await isConsumerIdUnique(updatedFields.consumerId, id);
    if (!isUnique) {
      throw new Error(`Consumer ID "${updatedFields.consumerId}" is already taken by another customer.`);
    }
  }

  const memIndex = memoryCustomers.findIndex(c => c.id === id);
  if (memIndex >= 0) {
    memoryCustomers[memIndex] = { ...memoryCustomers[memIndex], ...updatedFields };
  }

  setDoc(doc(db, 'customers', id), {
    ...updatedFields,
    updatedAt: serverTimestamp()
  }, { merge: true }).catch(console.warn);

  return { success: true };
};
