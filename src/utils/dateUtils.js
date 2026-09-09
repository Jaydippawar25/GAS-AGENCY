/**
 * Utility functions for date manipulation and formatting.
 */

// Format timestamp or Date object into DD/MM/YYYY
export const formatDate = (dateInput) => {
  if (!dateInput) return 'N/A';
  
  let date;
  if (dateInput.toDate && typeof dateInput.toDate === 'function') {
    date = dateInput.toDate();
  } else if (dateInput.seconds) {
    date = new Date(dateInput.seconds * 1000);
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) return 'N/A';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

// Format timestamp or Date object into DD MMM YYYY (e.g., 09 Sep 2026)
export const formatDateLong = (dateInput) => {
  if (!dateInput) return 'N/A';

  let date;
  if (dateInput.toDate && typeof dateInput.toDate === 'function') {
    date = dateInput.toDate();
  } else if (dateInput.seconds) {
    date = new Date(dateInput.seconds * 1000);
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) return 'N/A';

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Convert input date into ISO string format (YYYY-MM-DD) for HTML date inputs
export const formatDateForInput = (dateInput) => {
  if (!dateInput) return '';

  let date;
  if (dateInput.toDate && typeof dateInput.toDate === 'function') {
    date = dateInput.toDate();
  } else if (dateInput.seconds) {
    date = new Date(dateInput.seconds * 1000);
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// Add days to a given date
export const addDays = (dateInput, days) => {
  let date;
  if (!dateInput) {
    date = new Date();
  } else if (dateInput.toDate && typeof dateInput.toDate === 'function') {
    date = dateInput.toDate();
  } else if (dateInput.seconds) {
    date = new Date(dateInput.seconds * 1000);
  } else {
    date = new Date(dateInput);
  }

  const result = new Date(date);
  result.setDate(result.getDate() + Number(days));
  return result;
};

// Difference in days between target date and current date
export const getDaysRemaining = (targetDateInput) => {
  if (!targetDateInput) return 0;

  let targetDate;
  if (targetDateInput.toDate && typeof targetDateInput.toDate === 'function') {
    targetDate = targetDateInput.toDate();
  } else if (targetDateInput.seconds) {
    targetDate = new Date(targetDateInput.seconds * 1000);
  } else {
    targetDate = new Date(targetDateInput);
  }

  const now = new Date();
  // Normalize both dates to midnight for accurate day calculation
  targetDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
