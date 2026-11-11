/**
 * Financial Calculation Utilities
 * Mathematically precise calculation formulas for Indian and international investment instruments.
 */

/**
 * 1. Precious Metal Calculator (Gold / Silver)
 * @param {Object} params
 * @param {number|string} params.quantity - Quantity in grams
 * @param {number|string} params.purchasePrice - Purchase price per gram (₹)
 * @param {number|string} params.currentPrice - Current price per gram (₹)
 */
export function calculatePreciousMetal({ quantity, purchasePrice, currentPrice }) {
  const q = Math.max(0, Number(quantity) || 0);
  const buy = Math.max(0, Number(purchasePrice) || 0);
  const curr = Math.max(0, Number(currentPrice) || 0);

  const totalCost = q * buy;
  const currentValue = q * curr;
  const profitLoss = currentValue - totalCost;
  const percentageReturn = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

  return {
    quantity: q,
    purchasePrice: buy,
    currentPrice: curr,
    totalCost,
    currentValue,
    profitLoss,
    percentageReturn,
    isProfit: profitLoss >= 0,
  };
}

/**
 * 2. Fixed Deposit Calculator
 * Formula: A = P * (1 + r / (100 * n))^(n * t)
 * @param {Object} params
 * @param {number|string} params.principal - Principal deposit amount (₹)
 * @param {number|string} params.annualRate - Annual interest rate (%)
 * @param {number|string} params.durationValue - Duration magnitude
 * @param {'years'|'months'} params.durationUnit - 'years' or 'months'
 * @param {number|string} params.compoundingFrequency - Compounding per year: 12 (monthly), 4 (quarterly), 2 (half-yearly), 1 (yearly)
 */
export function calculateFixedDeposit({
  principal,
  annualRate,
  durationValue,
  durationUnit = 'years',
  compoundingFrequency = 4,
}) {
  const p = Math.max(0, Number(principal) || 0);
  const r = Math.max(0, Number(annualRate) || 0);
  const durVal = Math.max(0, Number(durationValue) || 0);
  const t = durationUnit === 'months' ? durVal / 12 : durVal;
  const n = Math.max(1, Number(compoundingFrequency) || 4);

  let maturityAmount = p;
  if (p > 0 && t > 0) {
    if (r === 0) {
      maturityAmount = p;
    } else {
      maturityAmount = p * Math.pow(1 + r / (100 * n), n * t);
    }
  }

  const interestEarned = Math.max(0, maturityAmount - p);
  const percentageReturn = p > 0 ? (interestEarned / p) * 100 : 0;

  return {
    principal: p,
    annualRate: r,
    durationYears: t,
    durationValue: durVal,
    durationUnit,
    compoundingFrequency: n,
    maturityAmount,
    interestEarned,
    percentageReturn,
  };
}

/**
 * 3. Recurring Deposit Calculator
 * Standard Indian Banking Convention: Quarterly compounding on monthly deposits
 * Formula: A = sum_{k=1..N} [ M * (1 + r / 400)^((N - k + 1) / 3) ]
 * @param {Object} params
 * @param {number|string} params.monthlyDeposit - Monthly deposit amount (₹)
 * @param {number|string} params.annualRate - Annual interest rate (%)
 * @param {number|string} params.durationValue - Duration magnitude
 * @param {'months'|'years'} params.durationUnit - 'months' or 'years'
 */
export function calculateRecurringDeposit({
  monthlyDeposit,
  annualRate,
  durationValue,
  durationUnit = 'months',
}) {
  const m = Math.max(0, Number(monthlyDeposit) || 0);
  const r = Math.max(0, Number(annualRate) || 0);
  const durVal = Math.max(0, Number(durationValue) || 0);
  const totalMonths = durationUnit === 'years' ? Math.round(durVal * 12) : Math.round(durVal);

  const totalDeposited = m * totalMonths;

  let maturityValue = totalDeposited;
  if (m > 0 && totalMonths > 0) {
    if (r === 0) {
      maturityValue = totalDeposited;
    } else {
      const quarterlyRate = r / 400;
      let sum = 0;
      for (let k = 1; k <= totalMonths; k++) {
        const remainingMonths = totalMonths - k + 1;
        const quarters = remainingMonths / 3;
        sum += m * Math.pow(1 + quarterlyRate, quarters);
      }
      maturityValue = sum;
    }
  }

  const interestEarned = Math.max(0, maturityValue - totalDeposited);
  const percentageReturn = totalDeposited > 0 ? (interestEarned / totalDeposited) * 100 : 0;

  return {
    monthlyDeposit: m,
    annualRate: r,
    totalMonths,
    durationValue: durVal,
    durationUnit,
    totalDeposited,
    interestEarned,
    maturityValue,
    percentageReturn,
  };
}

/**
 * 4. Stocks & Equity Calculator
 * Compound growth for initial lump-sum + optional regular monthly SIP.
 * Formula:
 * Lump FV = P_lump * (1 + r/100)^t
 * SIP FV = P_sip * [ ((1 + i)^n - 1) / i ] * (1 + i) where i = r / (12 * 100)
 * @param {Object} params
 * @param {number|string} params.initialInvestment - Initial lump sum (₹)
 * @param {number|string} params.monthlyInvestment - Monthly SIP contribution (₹)
 * @param {number|string} params.annualReturn - Expected annual return (%)
 * @param {number|string} params.durationYears - Investment duration in years
 */
export function calculateStocks({
  initialInvestment,
  monthlyInvestment,
  annualReturn,
  durationYears,
}) {
  const lump = Math.max(0, Number(initialInvestment) || 0);
  const sip = Math.max(0, Number(monthlyInvestment) || 0);
  const r = Math.max(0, Number(annualReturn) || 0);
  const t = Math.max(0, Number(durationYears) || 0);
  const totalMonths = Math.round(t * 12);

  // Lump sum calculation
  let lumpFV = lump;
  if (lump > 0 && t > 0) {
    lumpFV = lump * Math.pow(1 + r / 100, t);
  }

  // Monthly SIP calculation
  const totalSipDeposited = sip * totalMonths;
  let sipFV = totalSipDeposited;
  if (sip > 0 && totalMonths > 0) {
    const monthlyRate = r / (100 * 12);
    if (monthlyRate === 0) {
      sipFV = totalSipDeposited;
    } else {
      sipFV = sip * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    }
  }

  const totalInvested = lump + totalSipDeposited;
  const portfolioValue = lumpFV + sipFV;
  const estimatedProfit = portfolioValue - totalInvested;
  const percentageReturn = totalInvested > 0 ? (estimatedProfit / totalInvested) * 100 : 0;

  return {
    initialInvestment: lump,
    monthlyInvestment: sip,
    annualReturn: r,
    durationYears: t,
    totalMonths,
    totalInvested,
    totalSipDeposited,
    lumpFV,
    sipFV,
    portfolioValue,
    estimatedProfit,
    percentageReturn,
  };
}

