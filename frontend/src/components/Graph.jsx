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
const Graph = () => {
    const [data, setData] = useState([]);
    const [selectedMetal, setSelectedMetal] = useState("Gold");
    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/local_metal_graph_data/");
                const data = response.data;
                setData(data);
                console.log(data);
            } catch (error) {
                console.error("Error fetching graph data:", error);
            }
        };
        fetchGraphData();
    }, []);
    return (
        <div className="graph-container">
            <h2>Graph</h2>
            <div className="metal-graph">
                <div className="graph-fenegosida">
                    <h3>Fenegosida</h3>
                    <div className="metal_option">
                        <button className="gold-btn" onClick={() => setSelectedMetal("Gold")}>Gold</button>
                        <button className="silver-btn" onClick={() => setSelectedMetal("Silver")}>Silver</button>
                    </div>
                    {selectedMetal === "Gold" && (
                        <div className="graph-card">
                            <h3>Gold Price (Fine Gold)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
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
                    {selectedMetal === "Silver" && (
                        <div className="graph-card">
                            <h3>Silver Price</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
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
                <div className="graph-nrb">
                    <h3>NRB</h3>
                </div>
            </div>
        </div>
    );
};
export default Graph;