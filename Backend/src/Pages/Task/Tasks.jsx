import { useState, useEffect } from 'react';
import Layout from '../../Layout';

export default function Tasks() {
    const ENDPOINT = 'tasks';

    const [loggedUser, setLoggedUser] = useState(null);
    const [todayData, setTodayData] = useState(null);
    const [monthTotal, setMonthTotal] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);

    const [form, setForm] = useState({
        post: '',
        vacancy: '',
        query: '',
        duplicate_post: '',
        call: '',
        potential_lead: '',
        confirm_lead: '',
        payment: '',
        no_employee: '',
        lost_lead: ''
    });

    const fieldConfig = [
        { name: 'post', label: 'Total Posts' },
        { name: 'vacancy', label: 'Vacancies (Owner)' },
        { name: 'query', label: 'Queries (Employees)' },
        { name: 'duplicate_post', label: 'Duplicate Posts' },
        { name: 'call', label: 'Calls' },
        { name: 'potential_lead', label: 'Potential Leads (Interested)' },
        { name: 'confirm_lead', label: 'Confirmed Leads' },
        { name: 'payment', label: 'Payments Received' },
        { name: 'no_employee', label: 'No Employee Provided' },
        { name: 'lost_lead', label: 'Lost Leads' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const getTodayDate = () => new Date().toISOString().split('T')[0];
    const getCurrentMonth = () => new Date().toLocaleString('default', { month: 'short', year: 'numeric' });
    const getAgentId = () => `${loggedUser?.name}-${loggedUser?.phone}`;

    const fetchTodayReport = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/${ENDPOINT}`);
            const data = await response.json();

            const agentId = getAgentId();
            const today = getTodayDate();

            const todayReport = data.find(
                item => item.agent === agentId && item.createdOn.split('T')[0] === today
            );

            if (todayReport) {
                setTodayData(todayReport);
                setIsDisabled(true);
            } else {
                setTodayData(null);
                setIsDisabled(false);
            }
        } catch (error) {
            console.error('Error fetching today report:', error);
        }
    };

    const fetchMonthlyTotals = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/${ENDPOINT}`);
            const data = await response.json();

            const agentId = getAgentId();
            const currentMonth = new Date().toISOString().slice(0, 7);

            const monthlyData = data.filter(
                item => item.agent === agentId && item.createdOn.slice(0, 7) === currentMonth
            );

            const totals = fieldConfig.reduce((acc, field) => {
                acc[field.name] = monthlyData.reduce((sum, item) => sum + item[field.name], 0);
                return acc;
            }, {});

            setMonthTotal(totals);
        } catch (error) {
            console.error('Error fetching monthly totals:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const agentId = getAgentId();

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/${ENDPOINT}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, agent: agentId })
            });

            if (response.ok) {
                fetchTodayReport();
                fetchMonthlyTotals();
                setIsDisabled(true);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setLoggedUser(userData);
    }, []);

    useEffect(() => {
        if (loggedUser) {
            fetchTodayReport();
            fetchMonthlyTotals();
        }
    }, [loggedUser]);

    return (
        <Layout>
            <div className="min-h-screen p-2 md:p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6  mx-auto mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="bg-gradient-to-r from-[#3c8e53] to-[#4da662] text-white px-5 py-3 rounded-t-xl">
                            <h2 className="text-lg font-semibold">Submit Daily Report</h2>
                        </div>
                        <div className="p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-3">
                                    {fieldConfig.map((field) => (
                                        <div key={field.name} className="space-y-1">
                                            <label className="block text-xs font-medium text-gray-700">
                                                {field.label}
                                            </label>
                                            <input
                                                name={field.name}
                                                type="number"
                                                value={form[field.name]}
                                                onChange={handleInputChange}
                                                disabled={isDisabled}
                                                min="0"
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c8e53] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="submit"
                                    disabled={isDisabled}
                                    className={`w-full mt-4 py-2.5 px-4 rounded-lg font-medium text-sm ${isDisabled
                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[#3c8e53] to-[#4da662] text-white hover:from-[#357a46] hover:to-[#3c8e53] transition-all'
                                        }`}
                                >
                                    {isDisabled ? 'Already Submitted' : 'Submit Daily Report'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="bg-gradient-to-r from-[#3c8e53] to-[#4da662] text-white px-5 py-3 rounded-t-xl">
                            <h2 className="text-lg font-semibold">Today's Report</h2>
                        </div>
                        <div className="p-4">
                            {todayData ? (
                                <div>
                                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            Date: {todayData.createdOn.split('T')[0]}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Agent: {todayData.agent}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                        {fieldConfig.map((field) => (
                                            <div key={field.name} className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                <p className="text-xs text-gray-500 truncate">{field.label}</p>
                                                <p className="text-lg font-bold text-[#3c8e53]">{todayData[field.name]}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-sm text-gray-500 mb-1">No Report Today</p>
                                    <p className="text-xs text-gray-400">
                                        Submit your daily report to see data here
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                <div className=" mx-auto">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="bg-gradient-to-r from-[#1764c4] to-[#165ffc] text-white px-5 py-3 rounded-t-xl">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold">Monthly Report - {getCurrentMonth()}</h2>
                                <span className="text-xs bg-white/20 px-2 py-1 rounded-full text-center">
                                    Current Month
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            {monthTotal ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                    {fieldConfig.map((field) => (
                                        <div key={field.name} className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-[#1764c4] transition-colors">
                                            <p className="text-xs font-medium text-gray-500 mb-1">
                                                {field.label}
                                            </p>
                                            <p className="text-xl font-bold text-[#1764c4]">
                                                {monthTotal[field.name]}
                                            </p>
                                            <p className="text-[10px] text-gray-500 mt-0.5">month total</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#1764c4] border-t-transparent mb-3"></div>
                                    <p className="text-sm text-gray-600 mb-1">No Monthly Data Available</p>
                                    <p className="text-xs text-gray-500">
                                        Submit your first daily report to see monthly statistics
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}