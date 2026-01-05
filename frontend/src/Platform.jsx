import AboutUs from "./components/AboutUs";
import DasNav from "./components/DasNav";
import Hero from "./components/Hero";
const Platform = () => {
    return (
        <div className="platform">
            <DasNav />
            <div className="container">
                <Hero />
                <AboutUs />
                
            </div>
        </div>
    );
};
export default Platform;