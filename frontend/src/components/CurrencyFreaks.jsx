import { useState } from "react";

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

const CurrencyFreak = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchRates = async () => {
    if (fetched) return; // prevent repeated hits
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/currencyfreaks_rates/`);
      const data = await res.json();

      if (data.success) {
        // USD → NPR rate
        const usdToNpr = data.rates.find(r => r.code === "INR" || r.code === "NPR")?.sell || 1;

        const filteredRates = data.rates
          .filter(r => currencies.some(c => c.code === r.code))
          .map(cur => {
            const usdToCur = cur.sell;

            const nprToCur = usdToCur / usdToNpr / 1.6; // NPR → CUR
            const curToNpr = usdToNpr / usdToCur * 1.6; // CUR → NPR

            return {
              ...cur,
              flag: currencies.find(c => c.code === cur.code)?.flag || "",
              nprToCur: nprToCur.toFixed(4),
              curToNpr: curToNpr.toFixed(2),
            };
          });

        setRates(filteredRates);
        setFetched(true);
      }
    } catch (err) {
      console.error("CurrencyFreak fetch error:", err);
    }

    setLoading(false);
  };

  return (
    <>
      {!fetched && (
        <button onClick={fetchRates} disabled={loading}>
          {loading ? "Fetching rates..." : "Load live rates"}
        </button>
      )}

      <div className="rates-grid">
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
    </>
  );
};

export default CurrencyFreak;
