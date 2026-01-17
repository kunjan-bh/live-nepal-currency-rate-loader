
import DasNav from "./components/DasNav";
import Hero from "./components/Hero";
import Live from "./components/Live";
import LiveMetal from "./components/LiveMetal";
import Graph from "./components/Graph";
const Platform = () => {
    return (
        <div className="platform">
            <DasNav />
            <div className="container">
                <Hero />
                <Live /> 
                <LiveMetal /> 
                <Graph /> 
                
                
            </div>
        </div>
    );
};
export default Platform;