import { useState, useEffect } from "react";

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

const ONE_HOUR = 60 * 60 * 1000;

const CurrencyFreak = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRates = async () => {
    try {
      const res = await fetch(`${API_URL}/currencyfreaks_rates/`);
      const data = await res.json();

      if (!data.success) return;

      const usdToInr =
        data.rates.find(r => r.code === "INR")?.sell || 1;

      const filteredRates = data.rates
        .filter(r => currencies.some(c => c.code === r.code))
        .map(cur => {
          const usdToCur = cur.sell;

          return {
            ...cur,
            flag: currencies.find(c => c.code === cur.code)?.flag || "",
            nprToCur: (usdToCur / usdToInr / 1.6).toFixed(4),
            curToNpr: (usdToInr / usdToCur * 1.6).toFixed(2),
          };
        });

      setRates(filteredRates);
    } catch (err) {
      console.error("Fetch failed, showing cached rates");
      // ❗ Do nothing → last rates remain visible
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates(); // Initial load

    const interval = setInterval(fetchRates, ONE_HOUR);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rates-grid">
      {loading && <p>Loading latest rates…</p>}

      {rates.map(cur => (
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

          <div className="rate-status">Live (CurrencyFreaks)</div>
        </div>
      ))}
    </div>
  );
};

export default CurrencyFreak;
