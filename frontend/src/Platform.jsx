import AboutUs from "./components/AboutUs";
import DasNav from "./components/DasNav";
import Hero from "./components/Hero";
import Live from "./components/Live";
const Platform = () => {
    return (
        <div className="platform">
            <DasNav />
            <div className="container">
                <Hero />
                <AboutUs />
                <Live />    
                
            </div>
        </div>
    );
};
export default Platform;