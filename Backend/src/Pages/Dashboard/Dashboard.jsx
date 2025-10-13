import axios from "axios";
import Layout from "../../Layout";
import { useEffect, useState } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, } from "recharts";

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

    const monthName = new Date().toLocaleString("default", {
        month: "long",
        year: "numeric",
    });
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const safeDate = (v) => (v ? new Date(v).toISOString().slice(0, 10) : null);

    useEffect(() => {
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

                let pendingPayments = 0;
                let pendingLeads = 0;
                let leads = 0;
                let leadsMonth = 0;
                let ownersAll = 0;
                let ownersMonth = 0;
                let employeesAll = 0;
                let employeesMonth = 0;
                let closedJobs = 0;
                let closedMonth = 0;
                let lostJobs = 0;
                let lostMonth = 0;

                const closedCount = {};
                const lostCount = {};

                jobs.forEach((job) => {
                    const created = new Date(job.createdOn);
                    const date = safeDate(job.date || job.createdOn);
                    if (!date) return;

                    leads++;
                    if (created >= startOfMonth) leadsMonth++;

                    if (job.status === "PendingPayment") pendingPayments++;
                    if (job.status === "Pending") pendingLeads++;

                    if (job.status === "Closed") {
                        closedJobs++;
                        if (created >= startOfMonth) closedMonth++;
                        closedCount[date] = (closedCount[date] || 0) + 1;
                    }

                    if (job.status === "LeadLost") {
                        lostJobs++;
                        if (created >= startOfMonth) lostMonth++;
                        lostCount[date] = (lostCount[date] || 0) + 1;
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
            } catch (err) {
                console.error("Error loading dashboard:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const StatCard = ({ icon, title, value, sub }) => (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg p-5 border border-gray-100 transition-all text-left">
            <div className=" text-2xl mb-2">{icon}</div>
            <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
            <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
            {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
        </div>
    );

    const ChartBox = ({ title, color, data, month, total }) => (
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">{title}</h2>

            <p className="text-sm text-gray-500 mb-3">
                {month} in <b>{monthName}</b> | <b>{total}</b> total
            </p>

            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="date"
                        angle={-30}
                        textAnchor="end"
                        height={50}
                        tick={{ fontSize: 11, fill: "#6b7280" }}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #eee",
                            borderRadius: 8,
                        }}
                    />
                    <Bar dataKey="count" fill={color} radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );


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
            <section className="p-4 space-y-8 min-h-screen">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    <StatCard icon="⏳" title="Hot Leads" value={stats.pendingLeads} />
                    <StatCard icon="💰" title="Pending Payments" value={stats.pendingPayments} />

                    <StatCard
                        icon="💼"
                        title={`Jobs (${monthName})`}
                        value={stats.leadsMonth}
                        sub={`${stats.leads} total`}
                    />
                    <StatCard
                        icon="👤"
                        title={`Owners (${monthName})`}
                        value={stats.ownersMonth}
                        sub={`${stats.owners} total`}
                    />
                    <StatCard
                        icon="👔"
                        title={`Employees (${monthName})`}
                        value={stats.employeesMonth}
                        sub={`${stats.employees} total`}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ChartBox
                        title="✅ Closed Jobs"
                        color="#4ade80"
                        data={closedJobsData}
                        month={stats.closedMonth}
                        total={stats.closedJobs}
                    />
                    <ChartBox
                        title="❌ Lost Leads"
                        color="#f87171"
                        data={lostJobsData}
                        month={stats.lostMonth}
                        total={stats.lostJobs}
                    />
                </div>
            </section>
        </Layout>
    );
}
