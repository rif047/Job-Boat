import axios from "axios";
import Layout from "../../Layout";
import CachedIcon from "@mui/icons-material/Cached";
import { useEffect, useState } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, } from "recharts";


const CHART_ORDER = ["leads", "closed", "lost"];

const CHART_COLORS = {
    leads: "#f59e0b",
    closed: "#0fb07a",
    lost: "#ef4444",
    income: "#64748b"
};

const formatCurrency = (v) =>
    new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(v);

export default function Dashboard() {
    document.title = "Dashboard";

    const [loading, setLoading] = useState(true);

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

    const [charts, setCharts] = useState({
        closedDaily: [],
        lostDaily: [],
        createdDaily: [],
        incomeMonthly: [],
        sixMonth: [],
    });

    const monthLabel = () =>
        new Date().toLocaleString("default", { month: "short", year: "numeric" });

    const firstDay = () =>
        new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const processJobs = (jobs) => {
        let pendingPayments = 0,
            pendingLeads = 0,
            totalClosed = 0,
            totalLost = 0,
            monthClosed = 0,
            monthLost = 0;

        const cd = {},
            ld = {},
            crd = {};
        const cm = {},
            lm = {},
            crm = {},
            im = {};

        const start = firstDay();

        jobs.forEach((j) => {
            const created = new Date(j.createdOn);
            const date = j.date ? new Date(j.date) : created;

            const mk = `${date.getFullYear()}-${date.getMonth() + 1}`;
            const cmk = `${created.getFullYear()}-${created.getMonth() + 1}`;
            const ds = date.toISOString().split("T")[0];
            const cds = created.toISOString().split("T")[0];

            if (j.status === "PendingPayment") pendingPayments++;
            if (j.status === "Pending") pendingLeads++;

            if (j.status === "Closed") {
                totalClosed++;
                if (date >= start) monthClosed++;
                cd[ds] = (cd[ds] || 0) + 1;
                cm[mk] = (cm[mk] || 0) + 1;
                im[mk] = (im[mk] || 0) + Number(j.fee || 0);
            }

            if (j.status === "LeadLost") {
                totalLost++;
                if (date >= start) monthLost++;
                ld[ds] = (ld[ds] || 0) + 1;
                lm[mk] = (lm[mk] || 0) + 1;
            }

            crd[cds] = (crd[cds] || 0) + 1;
            crm[cmk] = (crm[cmk] || 0) + 1;
        });

        return {
            counts: { pendingPayments, pendingLeads, totalClosed, totalLost, monthClosed, monthLost },
            daily: { cd, ld, crd },
            monthly: { cm, lm, crm, im }
        };
    };

    const lastSixMonths = (cm, lm, crm, im) => {
        const now = new Date();
        const out = [];

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const k = `${d.getFullYear()}-${d.getMonth() + 1}`;

            out.push({
                month: d.toLocaleString("default", { month: "short" }),
                leads: crm[k] || 0,
                closed: cm[k] || 0,
                lost: lm[k] || 0,
                income: im[k] || 0,
            });
        }
        return out;
    };

    const monthFilter = (obj) => {
        const y = new Date().getFullYear();
        const m = new Date().getMonth();
        return Object.entries(obj)
            .filter(([d]) => {
                const dt = new Date(d);
                return dt.getFullYear() === y && dt.getMonth() === m;
            })
            .map(([date, count]) => ({ date, count }));
    };

    const dailyToChart = (crd, cd, ld) => {
        const map = {};
        crd.forEach((x) => (map[x.date] = { date: x.date, leads: x.count, closed: 0, lost: 0 }));
        cd.forEach((x) => {
            if (!map[x.date]) map[x.date] = { date: x.date, leads: 0, closed: 0, lost: 0 };
            map[x.date].closed = x.count;
        });
        ld.forEach((x) => {
            if (!map[x.date]) map[x.date] = { date: x.date, leads: 0, closed: 0, lost: 0 };
            map[x.date].lost = x.count;
        });

        const y = new Date().getFullYear();
        const m = new Date().getMonth();
        const days = new Date(y, m + 1, 0).getDate();
        const arr = [];

        for (let d = 1; d <= days; d++) {
            const ds = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            arr.push(map[ds] || { date: ds, leads: 0, closed: 0, lost: 0 });
        }
        return arr;
    };

    const load = async () => {
        setLoading(true);
        try {
            const [j, o, e] = await Promise.all([
                axios.get(`${import.meta.env.VITE_SERVER_URL}/api/jobs`),
                axios.get(`${import.meta.env.VITE_SERVER_URL}/api/owners`),
                axios.get(`${import.meta.env.VITE_SERVER_URL}/api/employees`),
            ]);

            const jobs = j.data || [];
            const owners = o.data || [];
            const employees = e.data || [];
            const start = firstDay();

            const { counts, daily, monthly } = processJobs(jobs);

            const six = lastSixMonths(monthly.cm, monthly.lm, monthly.crm, monthly.im);

            setStats({
                pendingPayments: counts.pendingPayments,
                pendingLeads: counts.pendingLeads,
                totalOwners: owners.length,
                monthOwners: owners.filter((x) => new Date(x.createdOn) >= start).length,
                totalEmployees: employees.length,
                monthEmployees: employees.filter((x) => new Date(x.createdOn) >= start).length,
                totalClosed: counts.totalClosed,
                monthClosed: counts.monthClosed,
                totalLost: counts.totalLost,
                monthLost: counts.monthLost,
            });

            setCharts({
                closedDaily: monthFilter(daily.cd),
                lostDaily: monthFilter(daily.ld),
                createdDaily: monthFilter(daily.crd),
                incomeMonthly: six.map((x) => ({ month: x.month, income: x.income })),
                sixMonth: six,
            });
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, []);

    const Card = ({ icon, title, value, sub }) => (
        <div className="bg-white hover:bg-green-50 p-5 rounded-xl shadow-sm border border-gray-400">
            <div className="text-3xl mb-1">{icon}</div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
    );

    const SimpleChart = ({ title, color, data, dataKey }) => (
        <div className="bg-white p-5 rounded-xl shadow border border-gray-400">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">{title}</h2>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Bar
                        dataKey={dataKey}
                        fill={color}
                        radius={[6, 6, 0, 0]}
                        stroke="#4B5563"
                        strokeWidth={.5} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

    const SixMonth = () => (
        <div className="bg-white p-5 rounded-xl shadow border border-gray-400">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Summary (Last 6 Months)</h2>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={charts.sixMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                        formatter={(v, n) => [v, n.charAt(0).toUpperCase() + n.slice(1)]}
                    />
                    <Legend />
                    {CHART_ORDER.map((k) => (
                        <Bar
                            key={k}
                            dataKey={k}
                            name={k.charAt(0).toUpperCase() + k.slice(1)}
                            fill={CHART_COLORS[k]}
                            radius={[6, 6, 0, 0]}
                            stroke="#4B5563"
                            strokeWidth={.5}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

    const MonthChart = () => {
        const data = dailyToChart(charts.createdDaily, charts.closedDaily, charts.lostDaily);

        const total = data.reduce(
            (a, b) => ({
                leads: a.leads + b.leads,
                closed: a.closed + b.closed,
                lost: a.lost + b.lost,
            }),
            { leads: 0, closed: 0, lost: 0 }
        );

        return (
            <div className="bg-white p-5 rounded-xl shadow border border-gray-400">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">
                    Summary ({monthLabel()})
                </h2>
                <div className="mb-4 text-sm text-gray-600">
                    Total Leads: {total.leads} | Closed: {total.closed} | Lost: {total.lost}
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart barCategoryGap="20%" data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(d) => new Date(d).getDate()}
                            tick={{ fontSize: 10 }}
                            height={40}
                        />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip
                            formatter={(v, n) => [v, n.charAt(0).toUpperCase() + n.slice(1)]}
                            labelFormatter={(d) =>
                                new Date(d).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                })
                            }
                        />
                        <Legend />
                        {CHART_ORDER.map((k) => (
                            <Bar
                                key={k}
                                dataKey={k}
                                name={k.charAt(0).toUpperCase() + k.slice(1)}
                                fill={CHART_COLORS[k]}
                                radius={[6, 6, 0, 0]}
                                stroke="#4B5563"
                                strokeWidth={.5}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };

    if (loading)
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p>Loading Dashboard...</p>
                </div>
            </Layout>
        );

    return (
        <Layout>
            <section className="p-2 space-y-8 min-h-screen">
                <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard Overview</h1>
                    <button
                        onClick={load}
                        disabled={loading}
                        className="flex items-center gap-2 border-2 text-green-700 border-green-700 px-4 py-2 rounded-md hover:bg-green-50 cursor-pointer"
                    >
                        <CachedIcon className={loading ? "animate-spin" : ""} />
                        {loading ? "Refreshing..." : "Reload"}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card icon="⏳" title="Hot Leads (Pending)" value={stats.pendingLeads} />
                    <Card icon="💷" title="Pending Payments" value={stats.pendingPayments} />
                    <Card
                        icon="👤"
                        title={`Owners (${monthLabel()})`}
                        value={stats.monthOwners}
                        sub={`${stats.totalOwners} total`}
                    />
                    <Card
                        icon="👔"
                        title={`Employees (${monthLabel()})`}
                        value={stats.monthEmployees}
                        sub={`${stats.totalEmployees} total`}
                    />
                </div>

                <MonthChart />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SixMonth />

                    <SimpleChart
                        title="Income (Last 6 Months)"
                        color={CHART_COLORS.income}
                        data={charts.incomeMonthly}
                        dataKey="income"
                    />
                </div>
            </section>
        </Layout>
    );
}
