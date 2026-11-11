import React from 'react';
import { formatINR } from '../../utils/formatters';

/**
 * Premium SVG Donut Chart for Investment Allocation & Returns
 * Shows Invested vs Returns breakdown with center metrics and interactive legend.
 */
export default function InvestmentDonutChart({
  items = [],
  centerLabel = 'Total Value',
  centerValue = '₹0',
  centerSubtext = '',
  height = 240,
}) {
  const validItems = items.filter(
    (item) => typeof item.value === 'number' && !isNaN(item.value) && item.value > 0
  );

  const totalValue = validItems.reduce((acc, curr) => acc + curr.value, 0);

  const size = 200;
  const strokeWidth = 24;
  const center = size / 2;
  const radius = center - strokeWidth / 2 - 4;
  const circumference = 2 * Math.PI * radius;

  // Compute stroke offsets
  let accumulatedPercent = 0;
  const slices = validItems.map((item) => {
    const percent = totalValue > 0 ? item.value / totalValue : 0;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += percent;

    return {
      ...item,
      percent: percent * 100,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="donut-chart-container">
      <div className="donut-svg-wrapper" style={{ height }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="donut-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Base background ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {totalValue > 0 ? (
            <g transform={`rotate(-90 ${center} ${center})`}>
              {slices.map((slice, idx) => (
                <circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  strokeLinecap="round"
                  className="donut-slice"
                  style={{
                    transition: 'stroke-dasharray 0.6s ease, stroke-dashoffset 0.6s ease',
                  }}
                />
              ))}
            </g>
          ) : (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#203d32"
              strokeWidth={strokeWidth}
              strokeDasharray="4 6"
            />
          )}

          {/* Center cutout info */}
          <foreignObject
            x={center - radius + strokeWidth / 2}
            y={center - radius + strokeWidth / 2}
            width={(radius - strokeWidth / 2) * 2}
            height={(radius - strokeWidth / 2) * 2}
          >
            <div className="donut-center-content">
              <span className="donut-center-label">{centerLabel}</span>
              <span className="donut-center-value">{centerValue}</span>
              {centerSubtext && (
                <span className="donut-center-sub">{centerSubtext}</span>
              )}
            </div>
          </foreignObject>
        </svg>
      </div>

      {/* Comparison Progress Bar */}
      {totalValue > 0 && (
        <div className="ratio-bar-container">
          <div className="ratio-bar">
            {slices.map((slice, idx) => (
              <div
                key={idx}
                className="ratio-bar-segment"
                style={{
                  width: `${slice.percent}%`,
                  backgroundColor: slice.color,
                }}
                title={`${slice.label}: ${slice.percent.toFixed(1)}%`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="donut-legend">
        {items.map((item, idx) => {
          const percent = totalValue > 0 ? ((Math.max(0, item.value || 0) / totalValue) * 100).toFixed(1) : '0.0';
          return (
            <div key={idx} className="legend-item">
              <div className="legend-label-row">
                <span
                  className="legend-dot"
                  style={{ backgroundColor: item.color }}
                />
                <span className="legend-label">{item.label}</span>
                <span className="legend-percent">{percent}%</span>
              </div>
              <div className="legend-value">{formatINR(item.value || 0)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

