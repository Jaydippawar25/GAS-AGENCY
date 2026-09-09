import { addDays, getDaysRemaining, formatDateLong } from './dateUtils';

/**
 * Calculates next eligible refill date based on last purchase date and agency duration setting.
 * @param {Date|Timestamp} lastPurchaseDate 
 * @param {number} refillDurationDays 
 * @returns {Date}
 */
export const calculateNextEligibleDate = (lastPurchaseDate, refillDurationDays = 25) => {
  if (!lastPurchaseDate) {
    return new Date(); // Immediately eligible if no prior purchase
  }
  return addDays(lastPurchaseDate, refillDurationDays);
};

/**
 * Checks customer refill eligibility status.
 * @param {Date|Timestamp} lastPurchaseDate 
 * @param {Date|Timestamp} nextEligibleDate 
 * @param {number} refillDurationDays 
 * @returns {Object} { isEligible, daysRemaining, nextEligibleFormatted, message }
 */
export const checkRefillEligibility = (lastPurchaseDate, nextEligibleDate, refillDurationDays = 25) => {
  if (!lastPurchaseDate) {
    return {
      isEligible: true,
      daysRemaining: 0,
      nextEligibleFormatted: 'Immediate',
      message: 'Refill Available (First Purchase)'
    };
  }

  // Calculate target date if nextEligibleDate is missing
  const targetDate = nextEligibleDate 
    ? (nextEligibleDate.toDate ? nextEligibleDate.toDate() : new Date(nextEligibleDate))
    : calculateNextEligibleDate(lastPurchaseDate, refillDurationDays);

  const daysRemaining = getDaysRemaining(targetDate);
  const isEligible = daysRemaining <= 0;
  const nextEligibleFormatted = formatDateLong(targetDate);

  if (isEligible) {
    return {
      isEligible: true,
      daysRemaining: 0,
      nextEligibleFormatted,
      message: 'Refill Available'
    };
  }

  return {
    isEligible: false,
    daysRemaining,
    nextEligibleFormatted,
    message: `Refill Not Available. Next eligible date: ${nextEligibleFormatted} (${daysRemaining} day${daysRemaining > 1 ? 's' : ''} remaining)`
  };
};
