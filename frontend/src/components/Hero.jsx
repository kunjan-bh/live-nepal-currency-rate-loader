import { Link } from "react-router-dom";
const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-container">
                {/* Left content */}
                <div className="hero-content">
                    <span className="hero-badge">🇳🇵 Live Currency & Gold/Silver Updates</span>

                    <h1>
                        Real-Time Nepal <br />
                        <span>Currency & Gold/Silver</span>
                    </h1>

                    <p>
                        Track live foreign exchange rates, gold (hallmark), and silver prices in Nepal. Accurate, fast, and always up-to-date — trusted by thousands daily.
                    </p>

                    <div className="hero-actions">
                        <button className="btn-primary"><a href="#Live">View Live Rates</a></button>
                    </div>
                </div>

                {/* Right visual */}
                <div className="hero-visual">
                    <div className="hero-visual">
                        <div className="currency-grid">
                            <div className="currency-item" data-name="US Dollar (USD)">🇺🇸</div>
                            <div className="currency-item" data-name="Euro (EUR)">🇪🇺</div>
                            <div className="currency-item" data-name="British Pound (GBP)">🇬🇧</div>
                            <div className="currency-item" data-name="Japanese Yen (JPY)">🇯🇵</div>
                            <div className="currency-item" data-name="Australian Dollar (AUD)">🇦🇺</div>
                            <div className="currency-item" data-name="Canadian Dollar (CAD)">🇨🇦</div>
                            <div className="currency-item" data-name="Chinese Yuan (CNY)">🇨🇳</div>
                            <div className="currency-item" data-name="Indian Rupee (INR)">🇮🇳</div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
