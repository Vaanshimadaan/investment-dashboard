import React, { useState, useId } from 'react';
import { calculateRecurringDeposit } from '../../utils/calculations';
import { formatINR, formatPercent } from '../../utils/formatters';
import InvestmentDonutChart from '../common/InvestmentDonutChart';

const DEFAULT_STATE = {
  monthlyDeposit: '5000',
  annualRate: '7.0',
  durationValue: '24',
  durationUnit: 'months',
};

const DEPOSIT_PRESETS = [
  { label: '₹1,000', val: 1000 },
  { label: '₹2,500', val: 2500 },
  { label: '₹5,000', val: 5000 },
  { label: '₹10,000', val: 10000 },
  { label: '₹25,000', val: 25000 },
];

const TENURE_PRESETS = [
  { label: '12 Mo (1 Yr)', val: '12', unit: 'months' },
  { label: '24 Mo (2 Yrs)', val: '24', unit: 'months' },
  { label: '36 Mo (3 Yrs)', val: '36', unit: 'months' },
  { label: '60 Mo (5 Yrs)', val: '60', unit: 'months' },
];

export default function RDCalculator() {
  const [form, setForm] = useState(DEFAULT_STATE);
  const [errors, setErrors] = useState({});
  const [isCalculated, setIsCalculated] = useState(false);

  const monthlyDepositInputId = useId();
  const annualRateInputId = useId();
  const durationValueInputId = useId();

  const handleInputChange = (field, value) => {
    const sanitized = value.replace(/[^0-9.]/g, '');
    const valid = sanitized.split('.').length <= 2 ? sanitized : form[field];

    setForm((prev) => ({ ...prev, [field]: valid }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.monthlyDeposit || Number(form.monthlyDeposit) <= 0) {
      errs.monthlyDeposit = 'Please enter a valid monthly installment';
    }
    if (!form.annualRate || Number(form.annualRate) <= 0) {
      errs.annualRate = 'Enter an annual interest rate';
    }
    if (!form.durationValue || Number(form.durationValue) <= 0) {
      errs.durationValue = 'Enter duration';
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

  const results = calculateRecurringDeposit({
    monthlyDeposit: form.monthlyDeposit,
    annualRate: form.annualRate,
    durationValue: form.durationValue,
    durationUnit: form.durationUnit,
  });

  const chartItems = [
    { label: 'Amount Deposited', value: results.totalDeposited, color: '#205e46' },
    { label: 'Interest Earned', value: results.interestEarned, color: '#d4a24c' },
  ];

  return (
    <div className="calculator-wrapper">
      <div className="calculator-grid">
        {/* ================= INPUTS PANEL ================= */}
        <div className="calc-card">
          <div className="card-title-row">
            <h3>💰 Recurring Deposit Parameters</h3>
            <span className="card-title-badge">Fixed Income</span>
          </div>

          <form onSubmit={handleCalculate} noValidate>
            {/* Monthly Deposit */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor={monthlyDepositInputId}>Monthly Deposit Amount</label>
                <span className="label-hint">Installment per month</span>
              </div>
              <div className="input-container">
                <span className="input-prefix">₹</span>
                <input
                  id={monthlyDepositInputId}
                  type="text"
                  inputMode="decimal"
                  className={`calc-input has-prefix ${errors.monthlyDeposit ? 'error' : ''}`}
                  placeholder="e.g. 5000"
                  value={form.monthlyDeposit}
                  onChange={(e) => handleInputChange('monthlyDeposit', e.target.value)}
                />
              </div>
              {errors.monthlyDeposit && (
                <div className="input-error-msg">{errors.monthlyDeposit}</div>
              )}

              {/* Presets */}
              <div className="presets-row">
                {DEPOSIT_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    className={`preset-chip ${Number(form.monthlyDeposit) === p.val ? 'active' : ''}`}
                    onClick={() => handleInputChange('monthlyDeposit', String(p.val))}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor={annualRateInputId}>Annual Interest Rate (%)</label>
                <span className="label-hint">Per annum rate</span>
              </div>
              <div className="input-container">
                <input
                  id={annualRateInputId}
                  type="text"
                  inputMode="decimal"
                  className={`calc-input has-suffix ${errors.annualRate ? 'error' : ''}`}
                  placeholder="e.g. 7.0"
                  value={form.annualRate}
                  onChange={(e) => handleInputChange('annualRate', e.target.value)}
                />
                <span className="input-suffix">% p.a.</span>
              </div>
              {errors.annualRate && (
                <div className="input-error-msg">{errors.annualRate}</div>
              )}
            </div>

            {/* Duration */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor={durationValueInputId}>Deposit Duration</label>
                <div className="unit-toggle" style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className={`preset-chip ${form.durationUnit === 'months' ? 'active' : ''}`}
                    onClick={() => setForm((prev) => ({ ...prev, durationUnit: 'months' }))}
                  >
                    Months
                  </button>
                  <button
                    type="button"
                    className={`preset-chip ${form.durationUnit === 'years' ? 'active' : ''}`}
                    onClick={() => setForm((prev) => ({ ...prev, durationUnit: 'years' }))}
                  >
                    Years
                  </button>
                </div>
              </div>
              <div className="input-container">
                <input
                  id={durationValueInputId}
                  type="text"
                  inputMode="decimal"
                  className={`calc-input has-suffix ${errors.durationValue ? 'error' : ''}`}
                  placeholder={form.durationUnit === 'months' ? 'e.g. 24' : 'e.g. 2'}
                  value={form.durationValue}
                  onChange={(e) => handleInputChange('durationValue', e.target.value)}
                />
                <span className="input-suffix">
                  {form.durationUnit === 'months' ? 'months' : 'years'}
                </span>
              </div>
              {errors.durationValue && (
                <div className="input-error-msg">{errors.durationValue}</div>
              )}

              {/* Tenure Presets */}
              <div className="presets-row">
                {TENURE_PRESETS.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    className={`preset-chip ${
                      form.durationUnit === t.unit && form.durationValue === t.val ? 'active' : ''
                    }`}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        durationValue: t.val,
                        durationUnit: t.unit,
                      }))
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="calc-actions">
              <button type="submit" className="calc-btn-primary">
                <span>✦</span> Calculate RD Maturity
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
            <h3>Maturity Breakdown</h3>
            <span className="hero-metric-badge profit">Guaranteed Return</span>
          </div>

          {/* Hero Metric Banner */}
          <div className="hero-metric-banner">
            <span className="hero-metric-label">Estimated Maturity Value</span>
            <div className="hero-metric-value-row">
              <span className="hero-metric-value">{formatINR(results.maturityValue)}</span>
              <span className="hero-metric-badge profit">
                {formatPercent(results.percentageReturn)} Total Gain
              </span>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="metrics-grid">
            <div className="metric-box">
              <span className="metric-label">Total Amount Deposited</span>
              <strong className="metric-val">{formatINR(results.totalDeposited)}</strong>
              <span className="metric-sub" style={{ color: '#849990' }}>
                {results.totalMonths} installments × {formatINR(results.monthlyDeposit)}
              </span>
            </div>

            <div className="metric-box">
              <span className="metric-label">Estimated Interest Earned</span>
              <strong className="metric-val" style={{ color: '#50c896' }}>
                +{formatINR(results.interestEarned)}
              </strong>
              <span className="metric-sub" style={{ color: '#50c896' }}>
                Quarterly Compounding
              </span>
            </div>
          </div>

          {/* Visual Chart */}
          <InvestmentDonutChart
            items={chartItems}
            centerLabel="Maturity Value"
            centerValue={formatINR(results.maturityValue)}
            centerSubtext={`+${formatINR(results.interestEarned)}`}
          />

          {/* Banking Standard Note */}
          <div className="calc-note-neutral">
            <span className="note-icon">🏦</span>
            <span>
              <strong>Indian Banking Standard:</strong> Compounded quarterly as per RBI guidelines.
              Each monthly deposit earns interest for its remaining tenure until final maturity.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

