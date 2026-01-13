import { useEffect, useState } from "react";

const LiveMetal = () => {
    const [rateType, setRateType] = useState("local");
    const [data, setData] = useState(null);

    useEffect(() => {
        if (rateType === "local") {
            fetch("http://127.0.0.1:8000/local_metal_rate/")
                .then((res) => res.json())
                .then((res) => setData(res))
                .catch(() => setData(null));
        }
        console.log(data);
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
                    Live Frequent Updates
                </button>
            </div>

            {rateType === "local" && data && (
                <div className="metal-card">
                    <div className="metal-header">
                        <span className="metal-date">📅 {today}</span>
                        <span className="metal-note">Updated once a day</span>
                    </div>

                    <div className="metal-rates">
                        <div>
                            <span>Fine Gold/ 1 tola (12g)</span>
                            <strong>Rs. {data.fine_gold}</strong>
                        </div>

                        <div>
                            <span>Silver/ 1 tola (12g)</span>
                            <strong>Rs. {data.silver}</strong>
                        </div>
                    </div>
                </div>
            )}

            {rateType === "live" && (
                <div className="metal-placeholder">
                    Live metal prices coming soon...
                </div>
            )}
        </div>
    );
};

export default LiveMetal;
