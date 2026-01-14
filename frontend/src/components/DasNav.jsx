import { Link } from "react-router-dom";
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
                    <li><a href="#Live">Live Currency Rates</a></li>
                    <li><a href="#Metal">Live Gold Rates</a></li>
                    <li><a href="#Metal">Live Silver Rates</a></li>
                </ul>
            </div>
        </nav>
    );
};

export default DasNav;
