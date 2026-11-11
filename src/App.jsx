import { useState } from "react";
import GoldCalculator from "./components/calculators/GoldCalculator";
import SilverCalculator from "./components/calculators/SilverCalculator";
import FDCalculator from "./components/calculators/FDCalculator";
import RDCalculator from "./components/calculators/RDCalculator";
import StocksCalculator from "./components/calculators/StocksCalculator";

const investments = [
  {
    name: "Gold",
    symbol: "Au",
    description: "Explore gold as an investment",
    icon: "🪙",
    type: "Precious Metal",
    value: "₹7,420 / 10g",
    risk: "Moderate",
    about:
      "Gold is commonly used as a diversification asset. Users can explore its value, investment options and historical performance.",
  },
  {
    name: "Silver",
    symbol: "Ag",
    description: "Explore silver investments",
    icon: "🥈",
    type: "Precious Metal",
    value: "₹88,000 / kg",
    risk: "Moderate",
    about:
      "Silver is a precious metal that can be used to diversify an investment portfolio and offers exposure to commodity markets.",
  },
  {
    name: "Fixed Deposit",
    symbol: "FD",
    description: "Stable returns with fixed deposits",
    icon: "🏦",
    type: "Fixed Income",
    value: "Up to 7.5%",
    risk: "Low",
    about:
      "Fixed deposits provide predetermined returns for a selected period and are generally considered a lower-risk investment option.",
  },
  {
    name: "Recurring Deposit",
    symbol: "RD",
    description: "Build savings through monthly deposits",
    icon: "💰",
    type: "Fixed Income",
    value: "Up to 7.0%",
    risk: "Low",
    about:
      "Recurring deposits allow users to invest a fixed amount regularly and build savings over a chosen period.",
  },
  {
    name: "Stocks",
    symbol: "EQ",
    description: "Explore equity investments",
    icon: "📈",
    type: "Equity",
    value: "Market Linked",
    risk: "High",
    about:
      "Stocks represent ownership in companies and can offer growth opportunities, but their value can fluctuate with market conditions.",
  },
];

function App() {
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState("home");

  const selectedInvestment = investments.find(
    (investment) => investment.name === page
  );

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div
          className="logo"
          onClick={() => {
            setPage("home");
            setSelected(null);
          }}
          style={{ cursor: "pointer" }}
        >
          <span className="logo-icon">◆</span>
          <span>Investly</span>
        </div>

        <button className="profile-btn">
          Profile
        </button>
      </header>

      <main className="main">
        {/* ================= DETAIL PAGE WITH CALCULATOR ================= */}
        {page !== "home" && selectedInvestment ? (
          <section className="gold-page">
            {/* Navigation Bar with Back Button & Quick Switcher */}
            <div className="calc-nav-bar">
              <button
                className="back-btn"
                onClick={() => {
                  setPage("home");
                  setSelected(null);
                }}
              >
                ← Back to Dashboard
              </button>

              <div className="calc-tabs">
                {investments.map((inv) => (
                  <button
                    key={inv.name}
                    type="button"
                    className={`calc-tab-btn ${page === inv.name ? "active" : ""}`}
                    onClick={() => {
                      setPage(inv.name);
                      setSelected(inv.name);
                    }}
                  >
                    <span className="tab-icon">{inv.icon}</span>
                    <span>{inv.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 1. Investment Title & Hero */}
            <div className="gold-hero">
              <p className="eyebrow">{selectedInvestment.type}</p>
              <h1>
                {selectedInvestment.icon} {selectedInvestment.name}
              </h1>
              <p>{selectedInvestment.description}</p>
            </div>

            {/* 2. Investment Overview Information Cards */}
            <div className="gold-info">
              <div className="info-card">
                <span>Indicative Value</span>
                <strong>{selectedInvestment.value}</strong>
                <small>Reference benchmark</small>
              </div>

              <div className="info-card">
                <span>Investment Type</span>
                <strong>{selectedInvestment.type}</strong>
                <small>Asset classification</small>
              </div>

              <div className="info-card">
                <span>Risk Level</span>
                <strong>{selectedInvestment.risk}</strong>
                <small>Risk profile</small>
              </div>
            </div>

            {/* 3. About Section */}
            <div className="gold-about">
              <p className="eyebrow">ABOUT</p>
              <h2>Why consider {selectedInvestment.name}?</h2>
              <p>{selectedInvestment.about}</p>
            </div>

            {/* 4. Prominently Placed Functional Calculator Section */}
            <div className="calculator-section" style={{ marginTop: "48px" }}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">CALCULATE & ESTIMATE</p>
                  <h2>{selectedInvestment.name} Calculator</h2>
                </div>
                <span className="count">Real-time simulation</span>
              </div>

              {page === "Gold" && <GoldCalculator />}
              {page === "Silver" && <SilverCalculator />}
              {page === "Fixed Deposit" && <FDCalculator />}
              {page === "Recurring Deposit" && <RDCalculator />}
              {page === "Stocks" && <StocksCalculator />}
            </div>
          </section>
        ) : (
          /* ================= HOME / LANDING PAGE ================= */
          <>
            {/* Hero */}
            <section className="hero">
              <p className="eyebrow">SMART INVESTING</p>
              <h1>
                Grow your money,
                <br />
                <span>your way.</span>
              </h1>
              <p className="subtitle">
                Explore different investment options and find what works best
                for your financial goals.
              </p>
            </section>

            {/* Investment Cards */}
            <section className="investments">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">EXPLORE</p>
                  <h2>Choose an investment</h2>
                </div>
                <span className="count">{investments.length} options</span>
              </div>

              <div className="cards">
                {investments.map((investment) => (
                  <div
                    key={investment.name}
                    className={`investment-card ${
                      selected === investment.name ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelected(investment.name);
                      setPage(investment.name);
                    }}
                  >
                    <div className="card-top">
                      <div className="investment-icon">{investment.icon}</div>
                      <span className="symbol">{investment.symbol}</span>
                    </div>

                    <div className="card-content">
                      <h3>{investment.name}</h3>
                      <p>{investment.description}</p>
                    </div>

                    <div className="card-arrow">→</div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer>
        <span>Investly</span>
        <span>Investment exploration platform</span>
      </footer>
    </div>
  );
}

export default App;
