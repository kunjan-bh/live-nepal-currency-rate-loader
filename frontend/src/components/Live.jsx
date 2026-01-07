import { useState } from "react";
import NrbRates from "./NrbRates";
import CurrencyFreak from "./CurrencyFreaks";

const sources = ["CurrencyFreaks", "NRB"];

const Live = () => {
  const [selectedSource, setSelectedSource] = useState("");

  return (
    <section className="live-section">
      <div className="container live-container">
        <div className="live-header">
          <h1>Live Exchange Rates</h1>
          <p>Rates based on: <strong>{selectedSource}</strong></p>

          {selectedSource === "NRB" && (
            <div style={{ marginBottom: "12px", color: "#0f766e", fontWeight: 500 }}>
              NRB rates update once per day. Automatically fetched.{" "}
              <span style={{ color: "#f84343ff", fontWeight: 500 }}>
                Use other source for live update (in 30 min each)
              </span>
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

        {/* Show rates based on selected source */}
        {selectedSource === "NRB" && <NrbRates />}
        {selectedSource === "CurrencyFreaks" && <CurrencyFreak />}
      </div>
    </section>
  );
};

export default Live;
