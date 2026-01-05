const DasNav = () => {
    return (
        <nav className="dasNav">
            <div className="container">
                {/* Left: Logo */}
                <div className="nav-left">
                    <div className="logo-circle">₨</div>
                    <span className="logo-text">Nepal FX</span>
                </div>

                {/* Right: Navigation */}
                <ul className="nav-right">
                    <li>Live Rates</li>
                    <li>Exchange</li>
                    <li>About Us</li>
                </ul>
            </div>
        </nav>
    );
};

export default DasNav;
