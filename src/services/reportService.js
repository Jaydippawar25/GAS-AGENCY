import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { INITIAL_SALES } from '../firebase/seedData';
import { withTimeout } from '../utils/promiseUtils';

let memorySalesCache = [...INITIAL_SALES];

/**
 * Fetch all sales data with safety timeout.
 */
export const getAllSalesRecords = async () => {
  const fetchTask = (async () => {
    const q = query(collection(db, 'sales'), orderBy('saleDate', 'desc'));
    const snapshot = await getDocs(q);
    const sales = [];
    snapshot.forEach(docSnap => {
      sales.push({ id: docSnap.id, ...docSnap.data() });
    });
    memorySalesCache = sales;
    return sales;
  })();

  return withTimeout(fetchTask, memorySalesCache, 1200);
};

/**
 * Process monthly sales trend data for Recharts.
 */
export const getMonthlySalesTrend = (salesList, targetYear = new Date().getFullYear()) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const trend = monthNames.map((name, index) => ({
    month: name,
    shortName: name.substring(0, 3),
    monthIndex: index,
    totalSales: 0,
    cylindersSold: 0,
    salesCount: 0
  }));

  salesList.forEach((sale) => {
    let date;
    if (sale.saleDate?.toDate) {
      date = sale.saleDate.toDate();
    } else if (sale.saleDate?.seconds) {
      date = new Date(sale.saleDate.seconds * 1000);
    } else {
      date = new Date(sale.saleDate);
    }

    if (!isNaN(date.getTime()) && date.getFullYear() === Number(targetYear)) {
      const monthIdx = date.getMonth();
      trend[monthIdx].totalSales += Number(sale.totalPrice || 0);
      trend[monthIdx].cylindersSold += Number(sale.quantity || 0);
      trend[monthIdx].salesCount += 1;
    }
  });

  return trend;
};

/**
 * Process company breakdown report.
 */
export const getCompanyBreakdown = (salesList) => {
  const companies = {
    'HP Gas': { company: 'HP Gas', cylindersSold: 0, totalSales: 0, count: 0 },
    'Indane Gas': { company: 'Indane Gas', cylindersSold: 0, totalSales: 0, count: 0 },
    'Bharat Gas': { company: 'Bharat Gas', cylindersSold: 0, totalSales: 0, count: 0 }
  };

  salesList.forEach(sale => {
    const comp = sale.company || 'HP Gas';
    if (!companies[comp]) {
      companies[comp] = { company: comp, cylindersSold: 0, totalSales: 0, count: 0 };
    }
    companies[comp].cylindersSold += Number(sale.quantity || 0);
    companies[comp].totalSales += Number(sale.totalPrice || 0);
    companies[comp].count += 1;
  });

  return Object.values(companies);
};

/**
 * Process expanded weight breakdown report (2, 5, 14, 19, 33, 47.5 KG).
 */
export const getWeightBreakdown = (salesList) => {
  const weights = {
    2: { weight: '2 KG', cylindersSold: 0, totalSales: 0 },
    5: { weight: '5 KG', cylindersSold: 0, totalSales: 0 },
    14: { weight: '14 KG', cylindersSold: 0, totalSales: 0 },
    19: { weight: '19 KG', cylindersSold: 0, totalSales: 0 },
    33: { weight: '33 KG', cylindersSold: 0, totalSales: 0 },
    47.5: { weight: '47.5 KG', cylindersSold: 0, totalSales: 0 }
  };

  salesList.forEach(sale => {
    const w = Number(sale.weight);
    if (!weights[w]) {
      weights[w] = { weight: `${w} KG`, cylindersSold: 0, totalSales: 0 };
    }
    weights[w].cylindersSold += Number(sale.quantity || 0);
    weights[w].totalSales += Number(sale.totalPrice || 0);
  });

  return Object.values(weights);
};

/**
 * Filter sales records.
 */
export const filterSalesRecords = (salesList, { dateFilter = 'ALL', company = 'ALL', weight = 'ALL', startDate = null, endDate = null }) => {
  return salesList.filter(sale => {
    if (company !== 'ALL' && sale.company !== company) return false;
    if (weight !== 'ALL' && Number(sale.weight) !== Number(weight)) return false;

    let saleDate;
    if (sale.saleDate?.toDate) {
      saleDate = sale.saleDate.toDate();
    } else if (sale.saleDate?.seconds) {
      saleDate = new Date(sale.saleDate.seconds * 1000);
    } else {
      saleDate = new Date(sale.saleDate);
    }

    if (isNaN(saleDate.getTime())) return true;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (dateFilter === 'TODAY') {
      const targetDay = new Date(saleDate.getFullYear(), saleDate.getMonth(), saleDate.getDate());
      return targetDay.getTime() === today.getTime();
    }

    if (dateFilter === 'THIS_MONTH') {
      return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
    }

    if (dateFilter === 'THIS_YEAR') {
      return saleDate.getFullYear() === now.getFullYear();
    }

    if (dateFilter === 'CUSTOM' && startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      return saleDate >= start && saleDate <= end;
    }

    return true;
  });
};
