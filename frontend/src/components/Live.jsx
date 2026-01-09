import { useState } from "react";
import NrbRates from "./NrbRates";
import CurrencyFreak from "./CurrencyFreaks";

const sources = ["CurrencyFreaks", "NRB"];

const Live = () => {
  const [selectedSource, setSelectedSource] = useState("");

  return (
    <section className="live-section" id="Live">
      <div className="container live-container">
        <div className="live-header">
          <h1>Live Exchange Rates</h1>
          <p>Rates based on: <strong>{selectedSource}</strong></p>
          <form action="" className="email-form">
            <h2>Want to be updated hourly about the currency exchange rates?</h2>
            <span>Send us your email</span>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" />
            <button type="submit">Submit</button>
          </form>

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
