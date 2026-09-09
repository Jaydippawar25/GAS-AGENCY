/**
 * Validation utilities for form inputs and business rules.
 */

// Validate 10-digit mobile number
export const isValidMobile = (mobile) => {
  if (!mobile) return false;
  const cleanMobile = String(mobile).trim().replace(/[\s-]/g, '');
  return /^[6-9]\d{9}$/.test(cleanMobile);
};

// Validate Consumer ID format (alphanumeric, 4 to 20 chars)
export const isValidConsumerId = (consumerId) => {
  if (!consumerId) return false;
  const cleanId = String(consumerId).trim();
  return /^[A-Za-z0-9-]{4,20}$/.test(cleanId);
};

// Validate inventory stock sufficiency
export const validateStockAvailability = (availableFilled, requestedQuantity) => {
  const available = Number(availableFilled) || 0;
  const requested = Number(requestedQuantity) || 0;

  if (requested <= 0) {
    return {
      isValid: false,
      message: 'Quantity must be at least 1 cylinder.'
    };
  }

  if (requested > available) {
    return {
      isValid: false,
      message: `Insufficient Stock! Available filled cylinders: ${available}, requested: ${requested}.`
    };
  }

  return {
    isValid: true,
    message: 'Stock available.'
  };
};
