import Layout from "../../Layout";
// import axios from "axios";
// import { useState, useEffect } from "react";
// import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, } from "recharts";


// function safeDate(value) {
//     if (!value) return null;
//     const d = new Date(value);
//     return isNaN(d) ? null : d.toISOString().slice(0, 10);
// }

export default function Dashboard() {
    document.title = "Dashboard";


    // const [jobData, setJobData] = useState([]);
    // const [ownerData, setOwnerData] = useState([]);
    // const [empData, setEmpData] = useState([]);
    // const [sum, setSum] = useState({ jobMonth: 0, jobAll: 0, ownerMonth: 0, ownerAll: 0, empMonth: 0, empAll: 0, });


    // useEffect(() => {
    //     async function load() {
    //         try {
    //             const jobsRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/jobs`);
    //             const ownersRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/owners`);
    //             const empsRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/employees`);

    //             const startMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    //             const jobCounts = {};
    //             let jobMonth = 0, jobAll = 0;
    //             const statuses = ["Pending", "PendingPayment", "Closed", "LeadLost"];

    //             jobsRes.data.forEach((j) => {
    //                 const dCreated = safeDate(j.createdOn);
    //                 if (dCreated) {
    //                     if (new Date(j.createdOn) >= startMonth) jobMonth++;
    //                     jobAll++;
    //                 }

    //                 if (statuses.includes(j.status)) {
    //                     const d = safeDate(j.date || j.createdOn);
    //                     if (!d) return;
    //                     if (!jobCounts[d]) jobCounts[d] = { date: d };
    //                     jobCounts[d][j.status] = (jobCounts[d][j.status] || 0) + 1;
    //                 }
    //             });

    //             const jobChart = Object.values(jobCounts).sort((a, b) =>
    //                 a.date.localeCompare(b.date)
    //             );

    //             const ownerCounts = {};
    //             let ownerMonth = 0, ownerAll = 0;

    //             ownersRes.data.forEach((o) => {
    //                 const d = safeDate(o.createdOn);
    //                 if (!d) return;
    //                 if (!ownerCounts[d]) ownerCounts[d] = { date: d, count: 0 };
    //                 ownerCounts[d].count++;
    //                 if (new Date(o.createdOn) >= startMonth) ownerMonth++;
    //                 ownerAll++;
    //             });

    //             const ownerChart = Object.values(ownerCounts).sort((a, b) =>
    //                 a.date.localeCompare(b.date)
    //             );

    //             const empCounts = {};
    //             let empMonth = 0, empAll = 0;

    //             empsRes.data.forEach((e) => {
    //                 const d = safeDate(e.createdOn);
    //                 if (!d) return;
    //                 if (!empCounts[d]) empCounts[d] = { date: d, count: 0 };
    //                 empCounts[d].count++;
    //                 if (new Date(e.createdOn) >= startMonth) empMonth++;
    //                 empAll++;
    //             });

    //             const empChart = Object.values(empCounts).sort((a, b) =>
    //                 a.date.localeCompare(b.date)
    //             );

    //             setJobData(jobChart);
    //             setOwnerData(ownerChart);
    //             setEmpData(empChart);
    //             setSum({ jobMonth, jobAll, ownerMonth, ownerAll, empMonth, empAll });
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     }
    //     load();
    // }, []);

    return (
        <Layout>
            Dashboard coming soon........
            {/* <section className="p-6 space-y-8">

                <div className="bg-white rounded-2xl p-6">
                    <h2 className="text-xl font-semibold mb-2">Jobs (Last 6 Months)</h2>
                    <p className="text-gray-600 mb-4">
                        This Month: <b>{sum.jobMonth}</b> | All Time: <b>{sum.jobAll}</b>
                    </p>
                    <ResponsiveContainer width="100%" height={360}>
                        <BarChart data={jobData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="date" angle={-30} textAnchor="end" height={70} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Pending" fill="#facc15" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="PendingPayment" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="Closed" fill="#22c55e" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="LeadLost" fill="#ef4444" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="bg-white rounded-2xl p-6">
                        <h2 className="text-xl font-semibold mb-2">Owners</h2>
                        <p className="text-gray-600 mb-4">
                            This Month: <b>{sum.ownerMonth}</b> | All Time: <b>{sum.ownerAll}</b>
                        </p>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={ownerData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="date" angle={-30} textAnchor="end" height={70} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-2xl p-6">
                        <h2 className="text-xl font-semibold mb-2">Employees</h2>
                        <p className="text-gray-600 mb-4">
                            This Month: <b>{sum.empMonth}</b> | All Time: <b>{sum.empAll}</b>
                        </p>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={empData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="date" angle={-30} textAnchor="end" height={70} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </section> */}
        </Layout>
    );
}
