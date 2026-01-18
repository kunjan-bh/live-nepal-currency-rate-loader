import axios from "axios";
import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Brush } from "recharts";
const Graph = () => {
    const [data, setData] = useState([]);
    const [globalData, setGlobalData] = useState([]);
    const [selectedLocalMetal, setSelectedLocalMetal] = useState("Gold");
    const [selectedLiveMetal, setSelectedLiveMetal] = useState("Gold");
    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/local_metal_graph_data/");

                const data = response.data;
                setData(data);
                console.log(data);
            } catch (error) {
                console.error("Error fetching Local graph data:", error);
            }
            try {
                const response = await axios.get("http://localhost:8000/global_metal_graph_data/");
                const data = response.data;
                setGlobalData(data);
                console.log(data);
            } catch (error) {
                console.error("Error fetching Global graph data:", error);
            }
        };
        fetchGraphData();

        
        const interval = setInterval(fetchGraphData, 30 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="graph-container">
            <h2>Graph</h2>
            <div className="metal-graph">
                <div className="graph-fenegosida">
                    <h3>Fenegosida(Daily Nepal Rate)</h3>
                    <div className="metal_option">
                        <button className={selectedLocalMetal === "Gold" ? "gold-btn active" : "gold-btn"} onClick={() => setSelectedLocalMetal("Gold")}>Gold</button>
                        <button className={selectedLocalMetal === "Silver" ? "silver-btn active" : "silver-btn"} onClick={() => setSelectedLocalMetal("Silver")}>Silver</button>
                    </div>
                    {selectedLocalMetal === "Gold" && (
                        <div className="graph-card">
                            <h3>Gold Price (Fine Gold)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={data}>
                                    <Brush dataKey="date" height={20} stroke="#8884d8" />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis domain={['dataMin - 5000', 'dataMax + 5000']} tickCount={6} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="fine_gold"
                                        stroke="#d4af37"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                    {selectedLocalMetal === "Silver" && (
                        <div className="graph-card">
                            <h3>Silver Price</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={data}>
                                    <Brush dataKey="date" height={20} stroke="#8884d8" />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis domain={['dataMin - 500', 'dataMax + 500']} tickCount={6} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="silver"
                                        stroke="#9e9e9e"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
                <div className="graph-live-gold">
                    <h3>Live Gold(every 1 hour)</h3>
                    <div className="metal_option">
                        <button className={selectedLiveMetal === "Gold" ? "gold-btn active" : "gold-btn"} onClick={() => setSelectedLiveMetal("Gold")}>Gold</button>
                        <button className={selectedLiveMetal === "Silver" ? "silver-btn active" : "silver-btn"} onClick={() => setSelectedLiveMetal("Silver")}>Silver</button>
                    </div>
                    {selectedLiveMetal === "Gold" && (
                        <div className="graph-card">
                            <h3>Gold Price (Fine Gold)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={globalData}>
                                    <Brush dataKey="fetched_at" height={20} stroke="#8884d8" />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="fetched_at" />
                                    <YAxis domain={['dataMin - 5000', 'dataMax + 5000']} tickCount={6} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="gold"
                                        stroke="#d4af37"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                    {selectedLiveMetal === "Silver" && (
                        <div className="graph-card">
                            <h3>Silver Price</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={globalData}>
                                    <Brush dataKey="date" height={20} stroke="#8884d8" />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="fetched_at" />
                                    <YAxis domain={['dataMin - 500', 'dataMax + 500']} tickCount={6} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="silver"
                                        stroke="#9e9e9e"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Graph;