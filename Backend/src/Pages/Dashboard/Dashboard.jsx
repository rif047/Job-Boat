import Layout from "../../Layout";
import axios from "axios";
import { useState, useEffect } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, } from "recharts";
import { subMonths } from "date-fns";

export default function Dashboard() {
    document.title = "Dashboard";

    // const [sellData, setSellData] = useState([]);
    // const [letData, setLetData] = useState([]);

    // useEffect(() => {
    //     async function load() {
    //         try {
    //             const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/properties`);
    //             const sixMonthsAgo = subMonths(new Date(), 6);

    //             const getData = (filterType) => {
    //                 const counts = {};
    //                 res.data.forEach((property) => {
    //                     if (property.property_for?.toLowerCase() === filterType && new Date(property.createdOn) >= sixMonthsAgo) {
    //                         const dateString = new Date(property.createdOn).toISOString().slice(0, 10);
    //                         counts[dateString] = (counts[dateString] || 0) + 1;
    //                     }
    //                 });
    //                 return Object.entries(counts).sort().map(([date, count]) => ({ date, count }));
    //             };

    //             setSellData(getData("sell"));
    //             setLetData(getData("let"));
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     }
    //     load();
    // }, []);

    return (
        <Layout>
            Dash
            {/* <section className="p-4 space-y-6">
                <h2 className="text-lg font-semibold">Test (last 6 months)</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sellData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" angle={-30} textAnchor="end" height={70} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>

                <h2 className="text-lg font-semibold">Test (last 6 months)</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={letData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" angle={-30} textAnchor="end" height={70} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </section> */}
        </Layout>
    );
}
