import React, { useState, useId } from 'react';
import { calculatePreciousMetal } from '../../utils/calculations';
import { formatINR, formatPercent, formatNumber } from '../../utils/formatters';
import InvestmentDonutChart from '../common/InvestmentDonutChart';

const DEFAULT_STATE = {
  quantity: '10',
  purchasePrice: '6800',
  currentPrice: '7450',
};

const QUANTITY_PRESETS = [5, 10, 20, 50, 100, 250];

export default function GoldCalculator() {
  const [form, setForm] = useState(DEFAULT_STATE);
  const [errors, setErrors] = useState({});
  const [isCalculated, setIsCalculated] = useState(false);

  const quantityInputId = useId();
  const purchasePriceInputId = useId();
  const currentPriceInputId = useId();

  const handleInputChange = (field, value) => {
    // Only allow positive numbers and single decimal point
    const sanitized = value.replace(/[^0-9.]/g, '');
    const valid = sanitized.split('.').length <= 2 ? sanitized : form[field];

    setForm((prev) => ({ ...prev, [field]: valid }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.quantity || Number(form.quantity) <= 0) {
      errs.quantity = 'Please enter a valid quantity greater than 0';
    }
    if (!form.purchasePrice || Number(form.purchasePrice) < 0) {
      errs.purchasePrice = 'Enter a valid purchase price';
    }
    if (!form.currentPrice || Number(form.currentPrice) < 0) {
      errs.currentPrice = 'Enter a valid current market price';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCalculate = (e) => {
    if (e) e.preventDefault();
    if (validate()) {
      setIsCalculated(true);
      setTimeout(() => setIsCalculated(false), 300);
    }
  };

  const handleReset = () => {
    setForm(DEFAULT_STATE);
    setErrors({});
  };

  const results = calculatePreciousMetal({
    quantity: form.quantity,
    purchasePrice: form.purchasePrice,
    currentPrice: form.currentPrice,
  });

  const chartItems = results.isProfit
    ? [
        { label: 'Purchase Cost', value: results.totalCost, color: '#205e46' },
        { label: 'Net Profit', value: Math.max(0, results.profitLoss), color: '#d4a24c' },
      ]
    : [
        { label: 'Current Value', value: results.currentValue, color: '#35966e' },
        { label: 'Unrealized Loss', value: Math.abs(results.profitLoss), color: '#e06c75' },
      ];

  return (
    <div className="calculator-wrapper">
      <div className="calculator-grid">
        {/* ================= INPUTS PANEL ================= */}
        <div className="calc-card">
          <div className="card-title-row">
            <h3>🪙 Gold Investment Parameters</h3>
            <span className="card-title-badge">Precious Metal</span>
          </div>

          <form onSubmit={handleCalculate} noValidate>
            {/* Quantity */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor={quantityInputId}>Gold Quantity (Grams)</label>
                <span className="label-hint">Weight in grams</span>
              </div>
              <div className="input-container">
                <input
                  id={quantityInputId}
                  type="text"
                  inputMode="decimal"
                  className={`calc-input has-suffix ${errors.quantity ? 'error' : ''}`}
                  placeholder="e.g. 10"
                  value={form.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                />
                <span className="input-suffix">grams</span>
              </div>
              {errors.quantity && <div className="input-error-msg">{errors.quantity}</div>}

              {/* Presets */}
              <div className="presets-row">
                {QUANTITY_PRESETS.map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    className={`preset-chip ${Number(form.quantity) === qty ? 'active' : ''}`}
                    onClick={() => handleInputChange('quantity', String(qty))}
                  >
                    {qty}g
                  </button>
                ))}
              </div>
            </div>

            {/* Purchase Price Per Gram */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor={purchasePriceInputId}>Purchase Price Per Gram</label>
                <span className="label-hint">Cost at acquisition</span>
              </div>
              <div className="input-container">
                <span className="input-prefix">₹</span>
                <input
                  id={purchasePriceInputId}
                  type="text"
                  inputMode="decimal"
                  className={`calc-input has-prefix has-suffix ${errors.purchasePrice ? 'error' : ''}`}
                  placeholder="e.g. 6800"
                  value={form.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                />
                <span className="input-suffix">/ gram</span>
              </div>
              {errors.purchasePrice && (
                <div className="input-error-msg">{errors.purchasePrice}</div>
              )}
            </div>

            {/* Current Price Per Gram */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor={currentPriceInputId}>Current Market Price Per Gram</label>
                <span className="label-hint">Manual entry</span>
              </div>
              <div className="input-container">
                <span className="input-prefix">₹</span>
                <input
                  id={currentPriceInputId}
                  type="text"
                  inputMode="decimal"
                  className={`calc-input has-prefix has-suffix ${errors.currentPrice ? 'error' : ''}`}
                  placeholder="e.g. 7450"
                  value={form.currentPrice}
                  onChange={(e) => handleInputChange('currentPrice', e.target.value)}
                />
                <span className="input-suffix">/ gram</span>
              </div>
              {errors.currentPrice && (
                <div className="input-error-msg">{errors.currentPrice}</div>
              )}
            </div>

            {/* Actions */}
            <div className="calc-actions">
              <button type="submit" className="calc-btn-primary">
                <span>✦</span> Calculate Return
              </button>
              <button type="button" className="calc-btn-secondary" onClick={handleReset}>
                ↺ Reset
              </button>
            </div>
          </form>
        </div>

        {/* ================= RESULTS PANEL ================= */}
        <div className={`results-card ${isCalculated ? 'calc-flash-update' : ''}`}>
          <div className="card-title-row">
            <h3>Valuation & Performance</h3>
            <span
              className={`hero-metric-badge ${
                results.profitLoss > 0
                  ? 'profit'
                  : results.profitLoss < 0
                  ? 'loss'
                  : 'neutral'
              }`}
            >
              {results.profitLoss >= 0 ? '▲ Gain' : '▼ Loss'}
            </span>
          </div>

          {/* Hero Metric Banner */}
          <div className="hero-metric-banner">
            <span className="hero-metric-label">Current Market Value</span>
            <div className="hero-metric-value-row">
              <span className="hero-metric-value">{formatINR(results.currentValue)}</span>
              <span
                className={`hero-metric-badge ${
                  results.isProfit ? 'profit' : 'loss'
                }`}
              >
                {formatPercent(results.percentageReturn)}
              </span>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="metrics-grid">
            <div className="metric-box">
              <span className="metric-label">Total Purchase Cost</span>
              <strong className="metric-val">{formatINR(results.totalCost)}</strong>
              <span className="metric-sub" style={{ color: '#849990' }}>
                {formatNumber(results.quantity)}g @ {formatINR(results.purchasePrice)}/g
              </span>
            </div>

            <div className={`metric-box ${results.isProfit ? 'profit' : 'loss'}`}>
              <span className="metric-label">Absolute Profit / Loss</span>
              <strong
                className="metric-val"
                style={{ color: results.isProfit ? '#50c896' : '#e06c75' }}
              >
                {formatINR(results.profitLoss, { showSign: true })}
              </strong>
              <span
                className="metric-sub"
                style={{ color: results.isProfit ? '#50c896' : '#e06c75' }}
              >
                {results.isProfit ? 'Net Capital Gain' : 'Net Capital Loss'}
              </span>
            </div>
          </div>

          {/* Visual Chart */}
          <InvestmentDonutChart
            items={chartItems}
            centerLabel="Current Value"
            centerValue={formatINR(results.currentValue)}
            centerSubtext={formatPercent(results.percentageReturn)}
          />

          {/* Disclaimers & Info */}
          <div className="calc-note-neutral">
            <span className="note-icon">ℹ</span>
            <span>
              <strong>Manual Market Entry:</strong> Real-time gold spot prices fluctuate
              continuously. Calculations reflect values strictly computed from your specified
              purchase and current market rates per gram.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

