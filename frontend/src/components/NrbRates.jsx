import { useState, useEffect } from "react";

const API_URL = "http://localhost:8000";

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

const NrbRates = () => {
  const [rates, setRates] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(`${API_URL}/nrb_rates/`);
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to load NRB rates");
        }

        setRates(
            data.rates.map((cur) => {
                const nprToCur = 1 / (cur.buy / cur.unit);  // 1 NPR → Foreign
                const curToNpr = cur.sell / cur.unit;      // 1 unit Foreign → NPR
                return {
                ...cur,
                flag: FLAGS[cur.code],
                nprToCur: nprToCur < 0.01 ? nprToCur.toFixed(6) : nprToCur.toFixed(4),
                curToNpr: curToNpr.toFixed(2),
                };
            })
        );




        setLastUpdated(data.last_updated);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  if (loading) return <p>Loading NRB rates…</p>;
  if (error) return <p style={{ color: "#f84343" }}>{error}</p>;

  return (
    <>
      <p style={{ marginBottom: "12px", fontWeight: 500 }}>
        Last updated: {lastUpdated}
      </p>

      <div className="rates-grid">
        {rates.map((cur) => (
          <div className="rate-card" key={cur.code}>
            <div className="rate-header">
              <span className="flag">{cur.flag}</span>
              <span className="currency-name">{cur.name}</span>
              <span className="currency-code">{cur.code}</span>
            </div>

            <div className="rate-values">
              <div className="rate-row">
                <span>NPR → {cur.code}</span>
                <span>{cur.nprToCur}</span>
              </div>
              <div className="rate-row">
                <span>{cur.code} → NPR</span>
                <span>{cur.curToNpr}</span>
              </div>
            </div>

            <div className="rate-status">Official NRB Rate</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default NrbRates;
