import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { INITIAL_INVENTORY_ITEMS, INITIAL_TRANSACTIONS } from '../firebase/seedData';
import { withTimeout } from '../utils/promiseUtils';

let memoryInventory = [...INITIAL_INVENTORY_ITEMS];
let memoryTransactions = [...(INITIAL_TRANSACTIONS || [])];

/**
 * Fetch all inventory items with safety timeout.
 */
export const getAllInventory = async () => {
  const fetchTask = (async () => {
    const querySnapshot = await getDocs(collection(db, 'inventory'));
    if (querySnapshot.empty) {
      return INITIAL_INVENTORY_ITEMS;
    }
    const items = [];
    querySnapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() });
    });
    memoryInventory = items;
    return items;
  })();

  return withTimeout(fetchTask, memoryInventory, 1200);
};

/**
 * Add a brand new Gas Company / Weight item to Inventory.
 */
export const addInventoryItem = async ({
  company,
  weight,
  filledQuantity = 0,
  emptyQuantity = 0,
  minimumStock = 15,
  notes = 'New gas cylinder category registered'
}) => {
  const cleanCompany = String(company).trim();
  const numWeight = Number(weight);
  const numFilled = Math.max(0, Number(filledQuantity));
  const numEmpty = Math.max(0, Number(emptyQuantity));
  const numMinStock = Math.max(1, Number(minimumStock));

  const companyCode = cleanCompany.replace(/[\s-]/g, '_').toUpperCase();
  const inventoryId = `${companyCode}_${numWeight}`;

  // Check if item already exists
  const existing = memoryInventory.find(i => i.id === inventoryId || (i.company === cleanCompany && Number(i.weight) === numWeight));
  if (existing) {
    throw new Error(`Gas category for ${cleanCompany} (${numWeight} KG) already exists in inventory! Please use Update Stock.`);
  }

  const newItem = {
    id: inventoryId,
    company: cleanCompany,
    companyCode,
    weight: numWeight,
    filledQuantity: numFilled,
    emptyQuantity: numEmpty,
    minimumStock: numMinStock,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  memoryInventory.push(newItem);

  const txData = {
    id: `tx_${Date.now()}`,
    inventoryId,
    company: cleanCompany,
    weight: numWeight,
    transactionType: 'STOCK_IN',
    quantity: numFilled,
    previousFilled: 0,
    newFilled: numFilled,
    previousEmpty: 0,
    newEmpty: numEmpty,
    notes,
    createdAt: new Date(),
    createdBy: 'admin'
  };
  memoryTransactions.unshift(txData);

  // Firestore background sync
  setDoc(doc(db, 'inventory', inventoryId), {
    ...newItem,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }).catch(console.warn);

  addDoc(collection(db, 'inventoryTransactions'), {
    ...txData,
    createdAt: serverTimestamp()
  }).catch(console.warn);

  return { success: true, item: newItem };
};

/**
 * Update stock for an inventory item.
 */
export const updateInventoryStock = async ({
  inventoryId,
  company,
  weight,
  filledToAdd = 0,
  emptyToAdd = 0,
  minimumStock,
  transactionType = 'STOCK_IN',
  notes = '',
  createdBy = 'staff'
}) => {
  const itemIndex = memoryInventory.findIndex(i => i.id === inventoryId);
  const currentItem = itemIndex >= 0 ? memoryInventory[itemIndex] : {
    id: inventoryId,
    company,
    companyCode: company.split(' ')[0].toUpperCase(),
    weight: Number(weight),
    filledQuantity: 0,
    emptyQuantity: 0,
    minimumStock: 15
  };

  const previousFilled = currentItem.filledQuantity || 0;
  const previousEmpty = currentItem.emptyQuantity || 0;

  const newFilled = Math.max(0, previousFilled + Number(filledToAdd));
  const newEmpty = Math.max(0, previousEmpty + Number(emptyToAdd));
  const newMinStock = minimumStock !== undefined ? Number(minimumStock) : (currentItem.minimumStock || 15);

  const updatedData = {
    ...currentItem,
    filledQuantity: newFilled,
    emptyQuantity: newEmpty,
    minimumStock: newMinStock,
    updatedAt: new Date()
  };

  // Update memory immediately
  if (itemIndex >= 0) {
    memoryInventory[itemIndex] = updatedData;
  } else {
    memoryInventory.push(updatedData);
  }

  const txData = {
    id: `tx_${Date.now()}`,
    inventoryId,
    company: currentItem.company || company,
    weight: Number(currentItem.weight || weight),
    transactionType,
    quantity: Number(filledToAdd) !== 0 ? Math.abs(Number(filledToAdd)) : Math.abs(Number(emptyToAdd)),
    previousFilled,
    newFilled,
    previousEmpty,
    newEmpty,
    notes,
    referenceId: null,
    createdAt: new Date(),
    createdBy
  };
  memoryTransactions.unshift(txData);

  // Firestore async sync (non-blocking)
  setDoc(doc(db, 'inventory', inventoryId), { ...updatedData, updatedAt: serverTimestamp() }, { merge: true }).catch(console.warn);
  addDoc(collection(db, 'inventoryTransactions'), { ...txData, createdAt: serverTimestamp() }).catch(console.warn);

  return { success: true, item: updatedData };
};

/**
 * Fetch inventory transactions with safety timeout.
 */
export const getInventoryTransactions = async (maxResults = 50) => {
  const fetchTask = (async () => {
    const q = query(
      collection(db, 'inventoryTransactions'), 
      orderBy('createdAt', 'desc'), 
      limit(maxResults)
    );
    const snapshot = await getDocs(q);
    const txs = [];
    snapshot.forEach(docSnap => {
      txs.push({ id: docSnap.id, ...docSnap.data() });
    });
    if (txs.length > 0) memoryTransactions = txs;
    return memoryTransactions;
  })();

  return withTimeout(fetchTask, memoryTransactions, 1200);
};
