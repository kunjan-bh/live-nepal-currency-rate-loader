import { useState } from "react";
import NrbRates from "./NrbRates";
import CurrencyFreak from "./CurrencyFreaks";

const sources = ["CurrencyFreaks", "NRB"];

const Live = () => {
  const [selectedSource, setSelectedSource] = useState("NRB");

  return (
    <section className="live-section" id="Live">
      <div className="container live-container">
        <div className="live-header">

          {selectedSource === "NRB" && (
            <div className="info" style={{ marginBottom: "12px", color: "#0f766e", fontWeight: 500}}>
              NRB rates update once per day. Automatically fetched.{" "}
              <span style={{ color: "#f84343ff", fontWeight: 500 }}>
                Use other source for live update (in 30 min each)
              </span>
            </div>
          )}
          {selectedSource === "CurrencyFreaks" && (
            <div className="info" style={{ marginBottom: "12px", color: "#0f766e", fontWeight: 500 }}>
              CurrencyFreaks rates update <span style={{ color: "#f84343ff", fontWeight: 500 }}>every 1 hour</span>. Automatically fetched.{" "}
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
