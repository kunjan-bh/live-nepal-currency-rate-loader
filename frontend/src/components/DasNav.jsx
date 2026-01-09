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
                    <li><a href="#Live">Live Rates</a></li>
                    <li><a href="#about">About Us</a></li>
                </ul>
            </div>
        </nav>
    );
};

export default DasNav;
