/**
 * Calculate default price for cylinder weights.
 */
export const getDefaultUnitPrice = (weight) => {
  const numWeight = Number(weight);
  const priceMap = {
    2: 220,
    5: 450,
    14: 950,
    14.2: 950,
    19: 1850,
    33: 3200,
    47.5: 4600
  };
  return priceMap[numWeight] || Math.round(numWeight * 95);
};

/**
 * Format currency to INR format (₹).
 */
export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};
