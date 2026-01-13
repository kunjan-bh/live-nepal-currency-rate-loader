import AboutUs from "./components/AboutUs";
import DasNav from "./components/DasNav";
import Hero from "./components/Hero";
import Live from "./components/Live";
import LiveMetal from "./components/LiveMetal";
const Platform = () => {
    return (
        <div className="platform">
            <DasNav />
            <div className="container">
                <Hero />
                <AboutUs />
                <Live /> 
                <LiveMetal />   
                
            </div>
        </div>
    );
};
export default Platform;