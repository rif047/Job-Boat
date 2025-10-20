import axios from "axios";
import Layout from "../../Layout";
import { useEffect, useState } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, } from "recharts";
import CachedIcon from "@mui/icons-material/Cached";

const formatCurrency = (val) =>
    new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(val);


export default function Dashboard() {
    document.title = "Dashboard";

    const [stats, setStats] = useState({
        pendingPayments: 0,
        pendingLeads: 0,
        totalOwners: 0,
        monthOwners: 0,
        totalEmployees: 0,
        monthEmployees: 0,
        totalClosed: 0,
        monthClosed: 0,
        totalLost: 0,
        monthLost: 0,
    });

    const [loading, setLoading] = useState(true);
    const [closedChart, setClosedChart] = useState([]);
    const [lostChart, setLostChart] = useState([]);
    const [incomeChart, setIncomeChart] = useState([]);
    const [jobCreationChart, setJobCreationChart] = useState([]);
    const [sixMonthChart, setSixMonthChart] = useState([]);

    const monthLabel = new Date().toLocaleString("default", { month: "short", year: "numeric" });
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const toDate = (v) => (v ? new Date(v).toISOString().slice(0, 10) : null);

    const loadDashboard = async () => {
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
                totalOwners = owners.length,
                monthOwners = owners.filter((o) => new Date(o.createdOn) >= startOfMonth).length,
                totalEmployees = employees.length,
                monthEmployees = employees.filter((e) => new Date(e.createdOn) >= startOfMonth).length,
                totalClosed = 0,
                monthClosed = 0,
                totalLost = 0,
                monthLost = 0;

            const closedDaily = {},
                lostDaily = {},
                closedMonthly = {},
                lostMonthly = {},
                incomeMonthly = {},
                createdMonthly = {};

            jobs.forEach((job) => {
                const created = new Date(job.createdOn);
                const jobDate = job.date ? new Date(job.date) : created;
                const date = toDate(jobDate);
                if (!date) return;

                if (job.status === "PendingPayment") pendingPayments++;
                if (job.status === "Pending") pendingLeads++;

                const key = `${jobDate.getFullYear()}-${jobDate.getMonth() + 1}`;
                const createdKey = `${created.getFullYear()}-${created.getMonth() + 1}`;

                if (job.status === "Closed") {
                    totalClosed++;
                    if (jobDate >= startOfMonth) monthClosed++;
                    closedDaily[date] = (closedDaily[date] || 0) + 1;
                    closedMonthly[key] = (closedMonthly[key] || 0) + 1;
                    const fee = Number(job.fee) || 0;
                    incomeMonthly[key] = (incomeMonthly[key] || 0) + fee;
                }

                if (job.status === "LeadLost") {
                    totalLost++;
                    if (jobDate >= startOfMonth) monthLost++;
                    lostDaily[date] = (lostDaily[date] || 0) + 1;
                    lostMonthly[key] = (lostMonthly[key] || 0) + 1;
                }


                createdMonthly[createdKey] = (createdMonthly[createdKey] || 0) + 1;
            });

            const now = new Date();
            const months = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
                months.push({
                    month: d.toLocaleString("default", { month: "short" }),
                    closed: closedMonthly[key] || 0,
                    lost: lostMonthly[key] || 0,
                    income: incomeMonthly[key] || 0,
                    jobs: createdMonthly[key] || 0,
                });
            }

            setStats({
                pendingPayments,
                pendingLeads,
                totalOwners,
                monthOwners,
                totalEmployees,
                monthEmployees,
                totalClosed,
                monthClosed,
                totalLost,
                monthLost,
            });
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth();

            const filterCurrentMonth = (obj) =>
                Object.entries(obj)
                    .filter(([date]) => {
                        const d = new Date(date);
                        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
                    })
                    .map(([date, count]) => ({ date, count }));

            setClosedChart(filterCurrentMonth(closedDaily));
            setLostChart(filterCurrentMonth(lostDaily));

            setIncomeChart(months.map((m) => ({ month: m.month, income: m.income })));
            setJobCreationChart(months.map((m) => ({ month: m.month, jobs: m.jobs })));
            setSixMonthChart(months.map((m) => ({ month: m.month, closed: m.closed, lost: m.lost })));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const StatCard = ({ icon, title, value, sub }) => (
        <div className="bg-white hover:bg-green-50 transition-all p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md">
            <div className="text-3xl mb-1">{icon}</div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
    );

    const BarBox = ({ title, color, data, dataKey = "count", yLabel = "" }) => (
        <div className="bg-white p-5 rounded-xl shadow border border-gray-100 hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">{title}</h2>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={50} />
                    <YAxis
                        tick={{ fontSize: 11 }}
                        label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft" } : undefined}
                    />
                    <Tooltip />
                    <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

    const SimpleBarBox = ({ title, color, data, dataKey, yLabel, format }) => (
        <div className="bg-white p-5 rounded-xl shadow border border-gray-100 hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">{title}</h2>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft" } : undefined}
                    />
                    <Tooltip formatter={(val) => (format === "currency" ? formatCurrency(val) : val)} />
                    <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

    const PieBox = () => {
        const colors = ["#0fb07a", "#f87171"];
        const monthRate =
            stats.monthClosed + stats.monthLost > 0
                ? ((stats.monthClosed / (stats.monthClosed + stats.monthLost)) * 100).toFixed(1)
                : 0;
        const totalRate =
            stats.totalClosed + stats.totalLost > 0
                ? ((stats.totalClosed / (stats.totalLost + stats.totalClosed)) * 100).toFixed(1)
                : 0;

        return (
            <div className="bg-white p-5 rounded-xl shadow border border-gray-100 hover:shadow-md transition">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Closed vs Lost Jobs</h2>
                <p className="text-sm text-gray-500 mb-4">Monthly & All-time comparison</p>
                <div className="flex flex-col sm:flex-row justify-around items-center gap-4">
                    {[{ data: [{ name: "Closed", value: stats.monthClosed }, { name: "Lost", value: stats.monthLost }], rate: monthRate, label: "Current Month" },
                    { data: [{ name: "Closed", value: stats.totalClosed }, { name: "Lost", value: stats.totalLost }], rate: totalRate, label: "Overall" }].map((v, i) => (
                        <div key={i} className="flex flex-col items-center w-full sm:w-1/2">
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={v.data} dataKey="value" cx="50%" cy="50%" outerRadius={70} label>
                                        {v.data.map((_, i2) => <Cell key={i2} fill={colors[i2]} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <p className="text-sm text-gray-600 mt-2">
                                {v.label} Success Rate:{" "}
                                <span className="font-semibold text-green-600">{v.rate}%</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const SixMonthBox = () => {
        const totalClosed = sixMonthChart.reduce((a, b) => a + b.closed, 0);
        const totalLost = sixMonthChart.reduce((a, b) => a + b.lost, 0);
        const rate = totalClosed + totalLost > 0 ? ((totalClosed / (totalClosed + totalLost)) * 100).toFixed(1) : 0;

        return (
            <div className="bg-white p-5 rounded-xl shadow border border-gray-100 hover:shadow-md transition">
                <h2 className="text-lg font-semibold text-gray-800">Closed vs Lost Jobs</h2>
                <p className="text-sm text-gray-500 mb-3">
                    {/* Success Rate: <span className="font-semibold text-green-600">{rate}%</span> */}
                    Last 6 Months
                </p>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={sixMonthChart}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="closed" fill="#0fb07a" radius={[6, 6, 0, 0]} />
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
            <section className="p-2 space-y-8 min-h-screen">
                <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard Overview</h1>
                    <button
                        onClick={loadDashboard}
                        disabled={loading}
                        className="flex items-center gap-2 border-2 text-green-700 border-green-700 px-4 py-2 rounded-md hover:bg-green-50 cursor-pointer"
                    >
                        <CachedIcon className={loading ? "animate-spin" : ""} />
                        {loading ? "Refreshing..." : "Reload"}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon="⏳" title="Hot Leads (Backlog)" value={stats.pendingLeads} />
                    <StatCard icon="💷" title="Pending Payments" value={stats.pendingPayments} />
                    <StatCard icon="👤" title={`Owners (${monthLabel})`} value={stats.monthOwners} sub={`${stats.totalOwners} total`} />
                    <StatCard icon="👔" title={`Employees (${monthLabel})`} value={stats.monthEmployees} sub={`${stats.totalEmployees} total`} />
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white p-5 rounded-xl shadow border border-gray-100 hover:shadow-md transition">
                        <h2 className="text-lg font-semibold mb-3 text-gray-800">
                            Closed vs Lost Jobs ({new Date().toLocaleString("default", { month: "short", year: "numeric" })})
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={(() => {
                                    const map = {};
                                    closedChart.forEach((item) => {
                                        map[item.date] = { date: item.date, closed: item.count || 0, lost: 0 };
                                    });
                                    lostChart.forEach((item) => {
                                        if (!map[item.date]) map[item.date] = { date: item.date, closed: 0, lost: 0 };
                                        map[item.date].lost = item.count || 0;
                                    });

                                    const year = new Date().getFullYear();
                                    const month = new Date().getMonth();
                                    const daysInMonth = new Date(year, month + 1, 0).getDate();

                                    // ✅ local date formatter (no UTC shift)
                                    const formatLocalDate = (y, m, d) =>
                                        `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

                                    const fullMonthData = [];
                                    for (let d = 1; d <= daysInMonth; d++) {
                                        const dateStr = formatLocalDate(year, month, d);
                                        const dayData = map[dateStr] || { date: dateStr, closed: 0, lost: 0 };
                                        const total = dayData.closed + dayData.lost;
                                        const rate = total > 0 ? ((dayData.closed / total) * 100).toFixed(1) : 0;
                                        fullMonthData.push({ ...dayData, rate });
                                    }

                                    return fullMonthData;
                                })()}

                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(v) => new Date(v).getDate()}
                                    tick={{ fontSize: 10 }}
                                    height={40}
                                />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{ fontSize: 12 }}
                                    formatter={(value, name, props) => {
                                        if (name === "rate") return [`${value}%`, "Success Rate"];
                                        return [value, name === "closed" ? "Closed Jobs" : "Lost Leads"];
                                    }}
                                    labelFormatter={(label, data) => {
                                        const dateObj = new Date(label);
                                        return dateObj.toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                        });
                                    }}
                                    cursor={{ fill: "rgba(0,0,0,0.05)" }}
                                />
                                <Legend />
                                <Bar
                                    dataKey="closed"
                                    name="Closed"
                                    fill="#0fb07a"
                                    radius={[6, 6, 0, 0]}
                                    onMouseOver={(data, index, e) => {
                                        e?.target?.setAttribute("data-rate", data.payload.rate);
                                    }}
                                />
                                <Bar
                                    dataKey="lost"
                                    name="Lost"
                                    fill="#f87171"
                                    radius={[6, 6, 0, 0]}
                                    onMouseOver={(data, index, e) => {
                                        e?.target?.setAttribute("data-rate", data.payload.rate);
                                    }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                        <p className="text-xs text-gray-500 text-center mt-2">
                            Showing from 1st to {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()}{" "}
                            {new Date().toLocaleString("default", { month: "short" })}
                        </p>
                    </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PieBox />
                    <SixMonthBox />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SimpleBarBox title="💵 Income (Last 6 Months)" color="#64748b" data={incomeChart} dataKey="income" yLabel="Amount (£)" format="currency" />
                    <SimpleBarBox title="🗓️ Collected Leads (Last 6 Months)" color="#0ea5e9" data={jobCreationChart} dataKey="jobs" yLabel="Count" />
                </div>


            </section>
        </Layout>
    );
}
