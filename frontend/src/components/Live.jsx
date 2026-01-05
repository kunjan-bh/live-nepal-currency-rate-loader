import { useState, useEffect } from "react";

const sources = ["XE.com", "Bloomberg", "NRB"];
const API_URL = "http://localhost:8000";

const currencies = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
];

const FLAGS = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  JPY: "🇯🇵",
  AUD: "🇦🇺",
  CAD: "🇨🇦",
  CNY: "🇨🇳",
  INR: "🇮🇳",
};

const Live = () => {
  const [selectedSource, setSelectedSource] = useState("XE.com");
  const [nrbRates, setNrbRates] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dummy rates for live sources
  const dummyRates = currencies.map((cur) => ({
    ...cur,
    nprToCur: (Math.random() * 0.01 + 0.008).toFixed(2),
    curToNpr: (Math.random() * 150 + 120).toFixed(2),
  }));

  const fetchNRBRates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/nrb_rates/`);
      const data = await res.json();
      console.log("NRB API Response:", data);
      if (data.success) {
        setNrbRates(
          data.rates.map((cur) => ({
            ...cur,
            flag: FLAGS[cur.code],
            nprToCur: cur.buy ? (cur.unit / parseFloat(cur.buy)).toFixed(2) : "-",
            curToNpr: cur.sell ? parseFloat(cur.sell).toFixed(2) : "-",
          }))
        );
      }
    } catch (err) {
      console.error("NRB fetch error:", err);
    }
    setLoading(false);
  };

  // Automatically fetch NRB rates daily
  useEffect(() => {
    if (selectedSource === "NRB") {
      // Fetch immediately if no rates yet
      if (nrbRates.length === 0) fetchNRBRates();

      // Calculate interval: 24 hours in ms (or adjust if you want just 10 min after publishing)
      const oneDay = 24 * 60 * 60 * 1000;

      // Example: 10 min after 12 PM (assume NRB publishes at 12:00)
      const now = new Date();
      const nextFetch = new Date();
      nextFetch.setHours(11, 10, 0, 0); // 12:10 PM
      if (nextFetch <= now) {
        // If already past today, schedule for tomorrow
        nextFetch.setDate(nextFetch.getDate() + 1);
      }

      const delay = nextFetch - now;

      // Schedule first fetch at correct time
      const timeoutId = setTimeout(() => {
        fetchNRBRates();

        // Then repeat every 24 hours
        const intervalId = setInterval(fetchNRBRates, oneDay);

        // Save interval so we can clear if component unmounts
        return () => clearInterval(intervalId);
      }, delay);

      // Clean up timeout on unmount
      return () => clearTimeout(timeoutId);
    }
  }, [selectedSource]);

  const ratesToShow = selectedSource === "NRB" ? nrbRates : dummyRates;

  return (
    <section className="live-section">
      <div className="container live-container">
        <div className="live-header">
          <h1>Live Exchange Rates</h1>
          <p>Rates based on: <strong>{selectedSource}</strong></p>

          {selectedSource === "NRB" && (
            <div style={{ marginBottom: "12px", color: "#0f766e", fontWeight: 500 }}>
              NRB rates update once per day. Automatically fetched.
            </div>
          )}

          <div className="source-filter">
            {sources.map((src) => (
              <button
                key={src}
                className={src === selectedSource ? "active" : ""}
                onClick={() => setSelectedSource(src)}
              >
                {src}
              </button>
            ))}
          </div>
        </div>

        <div className="rates-grid">
          {ratesToShow.length === 0 && selectedSource === "NRB" && !loading && (
            <p>No rates fetched yet.</p>
          )}

          {ratesToShow.map((cur) => (
            <div className="rate-card" key={cur.iso3 || cur.code}>
              <div className="rate-header">
                <span className="flag">{cur.flag}</span>
                <span className="currency-name">{cur.name}</span>
                <span className="currency-code">{cur.iso3 || cur.code}</span>
              </div>

              <div className="rate-values">
                <div className="rate-row">
                  <span>NPR → {cur.iso3 || cur.code}</span>
                  <span>{cur.nprToCur}</span>
                </div>
                <div className="rate-row">
                  <span>{cur.iso3 || cur.code} → NPR</span>
                  <span>{cur.curToNpr}</span>
                </div>
                {cur.date && <div className="rate-date">Date: {cur.date}</div>}
              </div>

              <div className="rate-status">
                {selectedSource === "NRB" ? "Official Daily Rate" : "Updated just now"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Live;
