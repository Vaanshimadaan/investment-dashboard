/**
 * Indian & International Formatting Utilities
 */

/**
 * Format a number into Indian Rupee currency format (e.g., ₹1,44,995)
 * @param {number} value
 * @param {Object} options
 * @param {boolean} [options.compact=false] - Use compact notation (e.g. 1.2L, 1.5Cr)
 * @param {number} [options.decimals=0] - Decimal digits
 * @param {boolean} [options.showSign=false] - Show + sign for positive values
 */
export function formatINR(value, { compact = false, decimals = 0, showSign = false } = {}) {
  const num = Number(value);
  if (isNaN(num)) return '₹0';

  const sign = showSign && num > 0 ? '+' : '';

  if (compact && Math.abs(num) >= 10000000) {
    const cr = (num / 10000000).toFixed(2);
    return `${sign}₹${cr} Cr`;
  }
  if (compact && Math.abs(num) >= 100000) {
    const l = (num / 100000).toFixed(2);
    return `${sign}₹${l} L`;
  }

  const rounded = Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(Math.abs(rounded));

  if (num < 0) {
    return `-₹${formatted}`;
  }

  return `${sign}₹${formatted}`;
}

/**
 * Format a percentage with standard sign and decimals
 * @param {number} value
 * @param {number} [decimals=2]
 */
export function formatPercent(value, decimals = 2) {
  const num = Number(value);
  if (isNaN(num)) return '0.00%';
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(decimals)}%`;
}

/**
 * Format a general number in Indian numbering system
 * @param {number} value
 * @param {number} [decimals=0]
 */
export function formatNumber(value, decimals = 0) {
  const num = Number(value);
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(num);
}

