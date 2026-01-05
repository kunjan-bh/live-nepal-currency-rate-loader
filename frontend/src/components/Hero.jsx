const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-container">
                {/* Left content */}
                <div className="hero-content">
                    <span className="hero-badge">🇳🇵 Live Currency Updates</span>

                    <h1>
                        Real-Time Nepal <br />
                        <span>Currency Exchange Rates</span>
                    </h1>

                    <p>
                        Track live foreign exchange rates in Nepal with accurate,
                        up-to-date data. Simple, fast, and reliable.
                    </p>

                    <div className="hero-actions">
                        <button className="btn-primary">View Live Rates</button>
                        <button className="btn-secondary">Exchange Calculator</button>
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
