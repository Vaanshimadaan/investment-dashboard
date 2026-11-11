import React, { useState, useId } from 'react';
import { calculateStocks } from '../../utils/calculations';
import { formatINR, formatPercent } from '../../utils/formatters';
import InvestmentDonutChart from '../common/InvestmentDonutChart';

const DEFAULT_STATE = {
  initialInvestment: '50000',
  monthlyInvestment: '5000',
  annualReturn: '12',
  durationYears: '10',
};

const LUMP_PRESETS = [
  { label: '₹0 (SIP Only)', val: 0 },
  { label: '₹25,000', val: 25000 },
  { label: '₹50,000', val: 50000 },
  { label: '₹1 Lakh', val: 100000 },
  { label: '₹5 Lakh', val: 500000 },
];

const SIP_PRESETS = [
  { label: '₹0 (Lump Only)', val: 0 },
  { label: '₹2,500', val: 2500 },
  { label: '₹5,000', val: 5000 },
  { label: '₹10,000', val: 10000 },
  { label: '₹25,000', val: 25000 },
];

const RETURN_PRESETS = [8, 10, 12, 15, 18];
const DURATION_PRESETS = [3, 5, 10, 15, 20];

export default function StocksCalculator() {
  const [form, setForm] = useState(DEFAULT_STATE);
  const [errors, setErrors] = useState({});
  const [isCalculated, setIsCalculated] = useState(false);

  const initialInvestmentInputId = useId();
  const monthlyInvestmentInputId = useId();
  const annualReturnInputId = useId();
  const durationYearsInputId = useId();

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
    const lump = Number(form.initialInvestment) || 0;
    const sip = Number(form.monthlyInvestment) || 0;

    if (lump <= 0 && sip <= 0) {
      errs.initialInvestment = 'Please enter either an initial amount or monthly SIP';
    }
    if (!form.annualReturn || Number(form.annualReturn) < 0) {
      errs.annualReturn = 'Enter an expected annual return percentage';
    }
    if (!form.durationYears || Number(form.durationYears) <= 0) {
      errs.durationYears = 'Enter investment horizon in years';
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

  const results = calculateStocks({
    initialInvestment: form.initialInvestment,
    monthlyInvestment: form.monthlyInvestment,
    annualReturn: form.annualReturn,
    durationYears: form.durationYears,
  });

  // Dynamic Chart Breakdown:
  // If both lump-sum and SIP exist, show 3 distinct slices
  const chartItems = [];
  if (results.initialInvestment > 0 && results.totalSipDeposited > 0) {
    chartItems.push(
      { label: 'Initial Lump-Sum', value: results.initialInvestment, color: '#1a4f3b' },
      { label: 'SIP Contributions', value: results.totalSipDeposited, color: '#35966e' },
      { label: 'Estimated Wealth Gain', value: Math.max(0, results.estimatedProfit), color: '#d4a24c' }
    );
  } else {
    chartItems.push(
      { label: 'Total Invested', value: results.totalInvested, color: '#205e46' },
      { label: 'Estimated Wealth Gain', value: Math.max(0, results.estimatedProfit), color: '#d4a24c' }
    );
  }

  return (
    <div className="calculator-wrapper">
      <div className="calculator-grid">
        {/* ================= INPUTS PANEL ================= */}
        <div className="calc-card">
          <div className="card-title-row">
            <h3>📈 Equity & Stocks Parameters</h3>
            <span className="card-title-badge">Market Linked</span>
          </div>

          <form onSubmit={handleCalculate} noValidate>
            {/* Initial Investment (Lump-sum) */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor={initialInvestmentInputId}>Initial Investment (Lump-sum)</label>
                <span className="label-hint">One-time capital</span>
              </div>
              <div className="input-container">
                <span className="input-prefix">₹</span>
                <input
                  id={initialInvestmentInputId}
                  type="text"
                  inputMode="decimal"
                  className={`calc-input has-prefix ${errors.initialInvestment ? 'error' : ''}`}
                  placeholder="e.g. 50000"
                  value={form.initialInvestment}
                  onChange={(e) => handleInputChange('initialInvestment', e.target.value)}
                />
              </div>
              {errors.initialInvestment && (
                <div className="input-error-msg">{errors.initialInvestment}</div>
              )}

              {/* Presets */}
              <div className="presets-row">
                {LUMP_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    className={`preset-chip ${Number(form.initialInvestment) === p.val ? 'active' : ''}`}
                    onClick={() => handleInputChange('initialInvestment', String(p.val))}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Monthly Investment (SIP) */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor={monthlyInvestmentInputId}>Monthly Investment (SIP)</label>
                <span className="label-hint">Optional regular deposit</span>
              </div>
              <div className="input-container">
                <span className="input-prefix">₹</span>
                <input
                  id={monthlyInvestmentInputId}
                  type="text"
                  inputMode="decimal"
                  className={`calc-input has-prefix has-suffix ${errors.monthlyInvestment ? 'error' : ''}`}
                  placeholder="e.g. 5000"
                  value={form.monthlyInvestment}
                  onChange={(e) => handleInputChange('monthlyInvestment', e.target.value)}
                />
                <span className="input-suffix">/ month</span>
              </div>

              {/* Presets */}
              <div className="presets-row">
                {SIP_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    className={`preset-chip ${Number(form.monthlyInvestment) === p.val ? 'active' : ''}`}
                    onClick={() => handleInputChange('monthlyInvestment', String(p.val))}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Expected Annual Return */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor={annualReturnInputId}>Expected Annual Return (%)</label>
                <span className="label-hint">Benchmark: ~12% (Nifty 50)</span>
              </div>
              <div className="input-container">
                <input
                  id={annualReturnInputId}
                  type="text"
                  inputMode="decimal"
                  className={`calc-input has-suffix ${errors.annualReturn ? 'error' : ''}`}
                  placeholder="e.g. 12"
                  value={form.annualReturn}
                  onChange={(e) => handleInputChange('annualReturn', e.target.value)}
                />
                <span className="input-suffix">% p.a.</span>
              </div>
              {errors.annualReturn && (
                <div className="input-error-msg">{errors.annualReturn}</div>
              )}

              {/* Presets */}
              <div className="presets-row">
                {RETURN_PRESETS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`preset-chip ${Number(form.annualReturn) === r ? 'active' : ''}`}
                    onClick={() => handleInputChange('annualReturn', String(r))}
                  >
                    {r}%
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor={durationYearsInputId}>Investment Horizon</label>
                <span className="label-hint">Years invested</span>
              </div>
              <div className="input-container">
                <input
                  id={durationYearsInputId}
                  type="text"
                  inputMode="decimal"
                  className={`calc-input has-suffix ${errors.durationYears ? 'error' : ''}`}
                  placeholder="e.g. 10"
                  value={form.durationYears}
                  onChange={(e) => handleInputChange('durationYears', e.target.value)}
                />
                <span className="input-suffix">years</span>
              </div>
              {errors.durationYears && (
                <div className="input-error-msg">{errors.durationYears}</div>
              )}

              {/* Presets */}
              <div className="presets-row">
                {DURATION_PRESETS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`preset-chip ${Number(form.durationYears) === d ? 'active' : ''}`}
                    onClick={() => handleInputChange('durationYears', String(d))}
                  >
                    {d} Yrs
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="calc-actions">
              <button type="submit" className="calc-btn-primary">
                <span>✦</span> Calculate Growth
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
            <h3>Projected Portfolio Value</h3>
            <span className="hero-metric-badge neutral">Estimate Only</span>
          </div>

          {/* Hero Metric Banner */}
          <div className="hero-metric-banner">
            <span className="hero-metric-label">Estimated Future Value</span>
            <div className="hero-metric-value-row">
              <span className="hero-metric-value">{formatINR(results.portfolioValue)}</span>
              <span className="hero-metric-badge profit">
                {formatPercent(results.percentageReturn)} Total Growth
              </span>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="metrics-grid">
            <div className="metric-box">
              <span className="metric-label">Total Invested Capital</span>
              <strong className="metric-val">{formatINR(results.totalInvested)}</strong>
              <span className="metric-sub" style={{ color: '#849990' }}>
                Lump: {formatINR(results.initialInvestment)} + SIP: {formatINR(results.totalSipDeposited)}
              </span>
            </div>

            <div className="metric-box">
              <span className="metric-label">Estimated Wealth Gain</span>
              <strong className="metric-val" style={{ color: '#50c896' }}>
                +{formatINR(results.estimatedProfit)}
              </strong>
              <span className="metric-sub" style={{ color: '#50c896' }}>
                Compounded over {results.durationYears} years
              </span>
            </div>
          </div>

          {/* Visual Chart */}
          <InvestmentDonutChart
            items={chartItems}
            centerLabel="Future Value"
            centerValue={formatINR(results.portfolioValue)}
            centerSubtext={`+${formatINR(results.estimatedProfit)} gain`}
          />

          {/* Mandatory Disclaimer */}
          <div className="calc-disclaimer">
            <span className="disclaimer-icon">⚠️</span>
            <span>
              <strong>Market Estimate Disclaimer:</strong> Stock and equity market projections are
              hypothetical estimates computed using constant compounding at your assumed {results.annualReturn}%
              annual rate. Real equity markets fluctuate unpredictably, are subject to market risks and
              inflation, and do not guarantee future returns.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

