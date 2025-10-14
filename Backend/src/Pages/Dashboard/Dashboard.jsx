import axios from "axios";
import Layout from "../../Layout";
import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import CachedIcon from "@mui/icons-material/Cached";

export default function Dashboard() {
    document.title = "Dashboard";

    const [stats, setStats] = useState({
        pendingPayments: 0,
        pendingLeads: 0,
        leads: 0,
        leadsMonth: 0,
        owners: 0,
        ownersMonth: 0,
        employees: 0,
        employeesMonth: 0,
        closedJobs: 0,
        closedMonth: 0,
        lostJobs: 0,
        lostMonth: 0,
    });

    const [loading, setLoading] = useState(true);
    const [closedJobsData, setClosedJobsData] = useState([]);
    const [lostJobsData, setLostJobsData] = useState([]);
    const [monthlyComparisonData, setMonthlyComparisonData] = useState([]);

    const monthName = new Date().toLocaleString("default", {
        month: "long",
        year: "numeric",
    });

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const safeDate = (v) => (v ? new Date(v).toISOString().slice(0, 10) : null);

    const loadData = async () => {
        setLoading(true);
        try {
            const [jobsRes, ownersRes, employeesRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_SERVER_URL}/api/jobs`),
                axios.get(`${import.meta.env.VITE_SERVER_URL}/api/owners`),
                axios.get(`${import.meta.env.VITE_SERVER_URL}/api/employees`),
            ]);

            const jobs = jobsRes.data || [];
            const owners = ownersRes.data || [];
            const employees = employeesRes.data || [];

            let pendingPayments = 0,
                pendingLeads = 0,
                leads = 0,
                leadsMonth = 0,
                ownersAll = 0,
                ownersMonth = 0,
                employeesAll = 0,
                employeesMonth = 0,
                closedJobs = 0,
                closedMonth = 0,
                lostJobs = 0,
                lostMonth = 0;

            const closedCount = {};
            const lostCount = {};
            const monthlyClosed = {};
            const monthlyLost = {};

            jobs.forEach((job) => {
                const created = new Date(job.createdOn);
                const jobDate = job.date ? new Date(job.date) : created;
                const date = safeDate(jobDate);
                if (!date) return;

                leads++;
                if (created >= startOfMonth) leadsMonth++;
                if (job.status === "PendingPayment") pendingPayments++;
                if (job.status === "Pending") pendingLeads++;

                const monthKey = `${jobDate.getFullYear()}-${jobDate.getMonth() + 1}`;

                if (job.status === "Closed") {
                    closedJobs++;
                    if (created >= startOfMonth) closedMonth++;
                    closedCount[date] = (closedCount[date] || 0) + 1;
                    monthlyClosed[monthKey] = (monthlyClosed[monthKey] || 0) + 1;
                }

                // ==== Lost Leads ====
                if (job.status === "LeadLost") {
                    lostJobs++;
                    if (created >= startOfMonth) lostMonth++;
                    lostCount[date] = (lostCount[date] || 0) + 1;
                    monthlyLost[monthKey] = (monthlyLost[monthKey] || 0) + 1;
                }
            });


            owners.forEach((o) => {
                const created = new Date(o.createdOn);
                ownersAll++;
                if (created >= startOfMonth) ownersMonth++;
            });

            employees.forEach((e) => {
                const created = new Date(e.createdOn);
                employeesAll++;
                if (created >= startOfMonth) employeesMonth++;
            });

            setStats({
                pendingPayments,
                pendingLeads,
                leads,
                leadsMonth,
                owners: ownersAll,
                ownersMonth,
                employees: employeesAll,
                employeesMonth,
                closedJobs,
                closedMonth,
                lostJobs,
                lostMonth,
            });

            setClosedJobsData(Object.entries(closedCount).map(([date, count]) => ({ date, count })));
            setLostJobsData(Object.entries(lostCount).map(([date, count]) => ({ date, count })));

            const now = new Date();
            const last6Months = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
                last6Months.push({
                    month: d.toLocaleString("default", { month: "short" }),
                    closed: monthlyClosed[key] || 0,
                    lost: monthlyLost[key] || 0,
                });
            }
            setMonthlyComparisonData(last6Months);
        } catch (err) {
            console.error("Error loading dashboard:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const StatCard = ({ icon, title, value, sub }) => (
        <div className="bg-white rounded-xl shadow p-5 border border-gray-100 text-left hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
            <div className="text-3xl mb-2">{icon}</div>
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
    );

    const ChartBox = ({ title, color, data, month, total }) => (
        <div className="bg-white rounded-xl shadow p-5 border border-gray-100 hover:shadow-md transition-all">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">{title}</h2>
            <p className="text-sm text-gray-500 mb-3">
                {month} in <b>{monthName}</b> | <b>{total}</b> total
            </p>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} angle={-30} textAnchor="end" height={50} />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <Tooltip />
                    <Bar dataKey="count" fill={color} radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

    const PieChartBox = () => {
        const COLORS = ["#4ade80", "#f87171"];
        const monthData = [
            { name: "Closed (This Month)", value: stats.closedMonth },
            { name: "Lost (This Month)", value: stats.lostMonth },
        ];
        const totalData = [
            { name: "Closed (All Time)", value: stats.closedJobs },
            { name: "Lost (All Time)", value: stats.lostJobs },
        ];

        const monthlyRate =
            stats.closedMonth + stats.lostMonth > 0
                ? ((stats.closedMonth / (stats.closedMonth + stats.lostMonth)) * 100).toFixed(1)
                : 0;
        const totalRate =
            stats.closedJobs + stats.lostJobs > 0
                ? ((stats.closedJobs / (stats.closedJobs + stats.lostJobs)) * 100).toFixed(1)
                : 0;

        return (
            <div className="bg-white rounded-xl shadow p-5 border border-gray-100 hover:shadow-md transition-all">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Closed vs Lost Jobs</h2>
                <p className="text-sm text-gray-500 mb-4">Monthly & All-time comparison with conversion rates</p>

                <div className="flex flex-col sm:flex-row justify-around items-center gap-4">
                    <div className="flex flex-col items-center w-full sm:w-1/2">
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={monthData} dataKey="value" cx="50%" cy="50%" outerRadius={70} label>
                                    {monthData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <p className="text-sm text-gray-600 mt-2">
                            Monthly Conversion:{" "}
                            <span className="font-semibold text-green-600">{monthlyRate}%</span>
                        </p>
                    </div>

                    <div className="flex flex-col items-center w-full sm:w-1/2">
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={totalData} dataKey="value" cx="50%" cy="50%" outerRadius={70} label>
                                    {totalData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <p className="text-sm text-gray-600 mt-2">
                            Overall Conversion:{" "}
                            <span className="font-semibold text-green-600">{totalRate}%</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const MonthlyComparisonBox = () => {
        const totalClosed = monthlyComparisonData.reduce((a, b) => a + b.closed, 0);
        const totalLost = monthlyComparisonData.reduce((a, b) => a + b.lost, 0);
        const rate =
            totalClosed + totalLost > 0 ? ((totalClosed / (totalClosed + totalLost)) * 100).toFixed(1) : 0;

        return (
            <div className="bg-white rounded-xl shadow p-5 border border-gray-100 hover:shadow-md transition-all">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Last 6 Months: Closed vs Lost</h2>
                <p className="text-sm text-gray-500 mb-3">
                    Trend comparison | Conversion Rate:{" "}
                    <span className="font-semibold text-green-600">{rate}%</span>
                </p>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlyComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} />
                        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="closed" fill="#4ade80" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="lost" fill="#f87171" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p>Loading Dashboard...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="p-4 space-y-8 min-h-screen bg-gray-50">
                <div className="flex justify-between items-center flex-wrap gap-3 mb-3">
                    <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard Overview</h1>
                    <button
                        onClick={loadData}
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
                    >
                        <CachedIcon className={`${loading ? "animate-spin" : ""}`} />
                        {loading ? "Refreshing..." : "Reload"}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    <StatCard icon="⏳" title="Hot Leads" value={stats.pendingLeads} />
                    <StatCard icon="💰" title="Pending Payments" value={stats.pendingPayments} />
                    <StatCard icon="💼" title={`Jobs (${monthName})`} value={stats.leadsMonth} sub={`${stats.leads} total`} />
                    <StatCard icon="👤" title={`Owners (${monthName})`} value={stats.ownersMonth} sub={`${stats.owners} total`} />
                    <StatCard
                        icon="👔"
                        title={`Employees (${monthName})`}
                        value={stats.employeesMonth}
                        sub={`${stats.employees} total`}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ChartBox title="✅ Closed Jobs" color="#4ade80" data={closedJobsData} month={stats.closedMonth} total={stats.closedJobs} />
                    <ChartBox title="❌ Lost Leads" color="#f87171" data={lostJobsData} month={stats.lostMonth} total={stats.lostJobs} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PieChartBox />
                    <MonthlyComparisonBox />
                </div>
            </section>
        </Layout>
    );
}
