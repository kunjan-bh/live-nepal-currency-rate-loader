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
    const [nrbRates, setNrbRates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        if (nrbRates.length === 0) {
            setError('No rates fetched yet.');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (nrbRates.length === 0) fetchNRBRates();
    }, []);

    if (loading) return <p>Loading NRB rates...</p>;


    return (
        <>
            {loading && <p>Loading NRB rates...</p>}
            {error && <p style={{ color: "#f84343ff", fontWeight: 500 }}>{error}</p>}
            <div className="rates-grid">
                {nrbRates.map((cur) => (
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
                            {cur.date && <div className="rate-date">Date: {cur.date}</div>}
                        </div>

                        <div className="rate-status">Official Daily Rate</div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default NrbRates;
