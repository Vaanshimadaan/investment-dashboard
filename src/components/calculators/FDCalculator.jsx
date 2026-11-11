import React, { useState, useId } from 'react';
import { calculateFixedDeposit } from '../../utils/calculations';
import { formatINR, formatPercent } from '../../utils/formatters';
import InvestmentDonutChart from '../common/InvestmentDonutChart';

const DEFAULT_STATE = {
  principal: '100000',
  annualRate: '7.5',
  durationValue: '5',
  durationUnit: 'years',
  compoundingFrequency: 4, // Quarterly
};

const PRINCIPAL_PRESETS = [
  { label: '₹50K', val: 50000 },
  { label: '₹1 Lakh', val: 100000 },
  { label: '₹2 Lakh', val: 200000 },
  { label: '₹5 Lakh', val: 500000 },
  { label: '₹10 Lakh', val: 1000000 },
];

const TENURE_PRESETS = [
  { label: '1 Year', val: '1', unit: 'years' },
  { label: '2 Years', val: '2', unit: 'years' },
  { label: '3 Years', val: '3', unit: 'years' },
  { label: '5 Years', val: '5', unit: 'years' },
];

const FREQUENCIES = [
  { label: 'Monthly', n: 12 },
  { label: 'Quarterly', n: 4 },
  { label: 'Half-Yearly', n: 2 },
  { label: 'Yearly', n: 1 },
];

export default function FDCalculator() {
  const [form, setForm] = useState(DEFAULT_STATE);
  const [errors, setErrors] = useState({});
  const [isCalculated, setIsCalculated] = useState(false);

  const principalInputId = useId();
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
    if (!form.principal || Number(form.principal) <= 0) {
      errs.principal = 'Please enter a valid deposit amount';
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

  const results = calculateFixedDeposit({
    principal: form.principal,
    annualRate: form.annualRate,
    durationValue: form.durationValue,
    durationUnit: form.durationUnit,
    compoundingFrequency: form.compoundingFrequency,
  });

  const chartItems = [
    { label: 'Principal Deposit', value: results.principal, color: '#205e46' },
    { label: 'Interest Earned', value: results.interestEarned, color: '#d4a24c' },
  ];

  return (
    <div className="calculator-wrapper">
      <div className="calculator-grid">
        {/* ================= INPUTS PANEL ================= */}
        <div className="calc-card">
          <div className="card-title-row">
            <h3>🏦 Fixed Deposit Parameters</h3>
            <span className="card-title-badge">Fixed Income</span>
          </div>

          <form onSubmit={handleCalculate} noValidate>
            {/* Principal Amount */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor={principalInputId}>Principal Deposit Amount</label>
                <span className="label-hint">Initial investment</span>
              </div>
              <div className="input-container">
                <span className="input-prefix">₹</span>
                <input
                  id={principalInputId}
                  type="text"
                  inputMode="decimal"
                  className={`calc-input has-prefix ${errors.principal ? 'error' : ''}`}
                  placeholder="e.g. 100000"
                  value={form.principal}
                  onChange={(e) => handleInputChange('principal', e.target.value)}
                />
              </div>
              {errors.principal && (
                <div className="input-error-msg">{errors.principal}</div>
              )}

              {/* Presets */}
              <div className="presets-row">
                {PRINCIPAL_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    className={`preset-chip ${Number(form.principal) === p.val ? 'active' : ''}`}
                    onClick={() => handleInputChange('principal', String(p.val))}
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
                  placeholder="e.g. 7.5"
                  value={form.annualRate}
                  onChange={(e) => handleInputChange('annualRate', e.target.value)}
                />
                <span className="input-suffix">% p.a.</span>
              </div>
              {errors.annualRate && (
                <div className="input-error-msg">{errors.annualRate}</div>
              )}
            </div>

            {/* Duration & Unit */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor={durationValueInputId}>Investment Duration</label>
                <div className="unit-toggle" style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className={`preset-chip ${form.durationUnit === 'years' ? 'active' : ''}`}
                    onClick={() => setForm((prev) => ({ ...prev, durationUnit: 'years' }))}
                  >
                    Years
                  </button>
                  <button
                    type="button"
                    className={`preset-chip ${form.durationUnit === 'months' ? 'active' : ''}`}
                    onClick={() => setForm((prev) => ({ ...prev, durationUnit: 'months' }))}
                  >
                    Months
                  </button>
                </div>
              </div>
              <div className="input-container">
                <input
                  id={durationValueInputId}
                  type="text"
                  inputMode="decimal"
                  className={`calc-input has-suffix ${errors.durationValue ? 'error' : ''}`}
                  placeholder={form.durationUnit === 'years' ? 'e.g. 5' : 'e.g. 60'}
                  value={form.durationValue}
                  onChange={(e) => handleInputChange('durationValue', e.target.value)}
                />
                <span className="input-suffix">
                  {form.durationUnit === 'years' ? 'years' : 'months'}
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

            {/* Compounding Frequency */}
            <div className="form-group">
              <div className="label-row">
                <label>Compounding Frequency</label>
                <span className="label-hint">Standard: Quarterly</span>
              </div>
              <div className="segmented-toggle">
                {FREQUENCIES.map((freq) => (
                  <button
                    key={freq.label}
                    type="button"
                    className={`segmented-toggle-btn ${
                      form.compoundingFrequency === freq.n ? 'active' : ''
                    }`}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, compoundingFrequency: freq.n }))
                    }
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="calc-actions">
              <button type="submit" className="calc-btn-primary">
                <span>✦</span> Calculate Maturity
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
            <span className="hero-metric-label">Maturity Amount</span>
            <div className="hero-metric-value-row">
              <span className="hero-metric-value">{formatINR(results.maturityAmount)}</span>
              <span className="hero-metric-badge profit">
                {formatPercent(results.percentageReturn)} Total Yield
              </span>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="metrics-grid">
            <div className="metric-box">
              <span className="metric-label">Principal Deposited</span>
              <strong className="metric-val">{formatINR(results.principal)}</strong>
              <span className="metric-sub" style={{ color: '#849990' }}>
                Tenure: {results.durationValue} {results.durationUnit}
              </span>
            </div>

            <div className="metric-box">
              <span className="metric-label">Total Interest Earned</span>
              <strong className="metric-val" style={{ color: '#50c896' }}>
                +{formatINR(results.interestEarned)}
              </strong>
              <span className="metric-sub" style={{ color: '#50c896' }}>
                Compounded {FREQUENCIES.find((f) => f.n === results.compoundingFrequency)?.label.toLowerCase()}
              </span>
            </div>
          </div>

          {/* Visual Chart */}
          <InvestmentDonutChart
            items={chartItems}
            centerLabel="Maturity Value"
            centerValue={formatINR(results.maturityAmount)}
            centerSubtext={`+${formatINR(results.interestEarned)}`}
          />

          {/* Compound Interest Formula Note */}
          <div className="calc-note-neutral">
            <span className="note-icon">📐</span>
            <span>
              <strong>Compound Interest Formula:</strong> Calculated using{' '}
              <em>A = P × (1 + r/n)^(n×t)</em>, where <em>n</em> = {results.compoundingFrequency} times
              per year and <em>t</em> = {results.durationYears.toFixed(2)} years.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

