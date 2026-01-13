import { useEffect, useState } from "react";

const LiveMetal = () => {
    const [rateType, setRateType] = useState("local");
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                let res = await fetch(
                    rateType === "local"
                        ? "http://127.0.0.1:8000/local_metal_rate/"
                        : "http://127.0.0.1:8000/metal_rates/"
                );
                let json = await res.json();

                if (rateType === "live") {
                    // Map backend keys to frontend keys
                    if (!json.error && (json.gold || json.xag)) {
                        json = {
                            gold: json.gold?.price_tola_npr ?? null,
                            silver: json.silver?.price_tola_npr ?? json.xag?.price_tola_npr ?? null
                        };
                    } else {
                        console.error("Live metal API error or incomplete data:", json);
                        throw new Error("Live metal data unavailable");
                    }
                }

                setData(json);
            } catch (err) {
                console.error(err);
                setData(null);
            }
        };

        fetchRates();
    }, [rateType]);


    const today = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    return (
        <div className="metal-container">
            <h2 className="metal-title">Gold & Silver Rates</h2>

            <div className="metal-buttons">
                <button
                    className={rateType === "local" ? "active" : ""}
                    onClick={() => setRateType("local")}
                >
                    Federation of Nepal (Daily)
                </button>

                <button
                    className={rateType === "live" ? "active" : ""}
                    onClick={() => setRateType("live")}
                >
                    Live Frequent Updates(goldapi.io)
                </button>
            </div>

            {data && (
                <div className="metal-card">
                    <div className="metal-header">
                        <span className="metal-date">📅 {today}</span>
                        <span className="metal-note">
                            {rateType === "local" ? "Updated once a day" : "Updated every 8 hours"}
                        </span>
                    </div>

                    <div className="metal-rates">
                        <div>
                            <span>Fine Gold/ 1 tola (12g)</span>
                            <strong>Rs. {rateType === "local" ? data.fine_gold : data.gold}</strong>
                        </div>

                        <div>
                            <span>Silver/ 1 tola (12g)</span>
                            <strong>Rs. {data.silver}</strong>
                        </div>
                    </div>
                </div>
            )}

            {!data && rateType === "live" && (
                <div className="metal-placeholder">
                    Unable to load live rates...
                </div>
            )}
        </div>
    );
};

export default LiveMetal;