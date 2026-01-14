import { useEffect, useState } from "react";

const LiveMetal = () => {
  const [rateType, setRateType] = useState("local");
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        let url;
        if (rateType === "local") url = "http://127.0.0.1:8000/local_metal_rate/";
        else if (rateType === "live1") url = "http://127.0.0.1:8000/metal_rates/";
        else if (rateType === "live2") url = "http://127.0.0.1:8000/metal_rates_v2/";

        const res = await fetch(url);
        const json = await res.json();

        let mapped = { gold: null, silver: null };

        if (rateType === "local") {
          mapped = {
            gold: json.fine_gold ?? null,
            silver: json.silver ?? null,
          };
        } else if (rateType === "live1") {
          if (!json.error) {
            mapped = {
              gold: json.gold?.price_tola_npr ?? json.gold ?? null,
              silver: json.silver?.price_tola_npr ?? json.xag?.price_tola_npr ?? null,
            };
          }
        } else if (rateType === "live2") {
          if (!json.error) {
            mapped = {
              gold: json.gold_tola ?? null,
              silver: json.silver_tola ?? json.xag_tola ?? null,
            };
          }
        }

        setData(mapped);
      } catch (err) {
        console.error(err);
        setData(null);
      }
    };

    fetchRates();
    // Optional: refresh every ~5–15 min for live sources
    // const interval = setInterval(fetchRates, 8 * 60 * 1000);
    // return () => clearInterval(interval);
  }, [rateType]);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="metal-premium-wrapper">
      <div className="metal-premium-container">
        <h2 className="metal-premium-title">Gold & Silver Rates in NPR</h2>

        <div className="metal-premium-tabs">
          <button
            className={`tab-btn ${rateType === "local" ? "active" : ""}`}
            onClick={() => setRateType("local")}
          >
            Nepal Federation (Daily)
          </button>
          <button
            className={`tab-btn ${rateType === "live1" ? "active" : ""}`}
            onClick={() => setRateType("live1")}
          >
            Live — GoldAPI
          </button>
          <button
            className={`tab-btn ${rateType === "live2" ? "active" : ""}`}
            onClick={() => setRateType("live2")}
          >
            Live — Gold-API
          </button>
        </div>

        {data ? (
          <div className="metal-premium-card">
            <div className="metal-premium-header">
              <span className="date">📅 {today}</span>
              <span className="update-info">
                {rateType === "local"
                  ? "Official daily update — Federation of Nepal"
                  : "Real-time • updates ~every 8 hours"}
              </span>
            </div>

            <div className="metal-premium-rates">
              <div className="metal-item gold-item">
                <div className="metal-icon">🟡</div>
                <div className="metal-content">
                  <span className="metal-label">Fine Gold (1 Tola • 11.664 g)</span>
                  <strong className="metal-price">
                    Rs. {data.gold?.toLocaleString("en-US") || "—"}
                  </strong>
                </div>
              </div>

              <div className="metal-item silver-item">
                <div className="metal-icon">⚪</div>
                <div className="metal-content">
                  <span className="metal-label">Fine Silver (1 Tola • 11.664 g)</span>
                  <strong className="metal-price">
                    Rs. {data.silver?.toLocaleString("en-US") || "—"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="metal-premium-empty">
            {rateType === "local"
              ? "Loading today's official rates..."
              : "Connecting to live feed..."}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMetal;