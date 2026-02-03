import Layout from '../../Layout';
import { useState, useEffect, useRef } from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';

export default function Task_Report() {
    const ENDPOINT = 'tasks';


    const [allData, setAllData] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [agents, setAgents] = useState([]);
    const [selectedAgentFilter, setSelectedAgentFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
    const startRef = useRef(null);
    const endRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [showFilter, setShowFilter] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const getCurrentMonthDates = () => {
        const now = new Date();

        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        return {
            startDate: formatDate(firstDay),
            endDate: formatDate(lastDay)
        };
    };


    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setRefreshing(true);
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/${ENDPOINT}`);
            const result = await response.json();
            setAllData(result);

            const currentMonth = getCurrentMonthDates();
            setDateFilter(currentMonth);

            filterData(result, currentMonth.startDate, currentMonth.endDate, 'all');

            const uniqueAgents = [...new Set(result.map(item => item.agent))];
            setAgents(uniqueAgents);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const filterData = (data, startDate, endDate, agentName) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        let filtered = data.filter(item => {
            const createdDate = new Date(item.createdOn);
            return createdDate >= start && createdDate <= end;
        });

        if (agentName !== 'all') {
            filtered = filtered.filter(item => item.agent === agentName);
        }

        setDisplayData(filtered);
    };

    const handleApplyFilter = () => {
        if (!dateFilter.startDate || !dateFilter.endDate) {
            alert('Please select both start and end dates');
            return;
        }

        filterData(allData, dateFilter.startDate, dateFilter.endDate, selectedAgentFilter);
        setShowFilter(false);
    };

    const handleResetToCurrentMonth = () => {
        const currentMonth = getCurrentMonthDates();
        setDateFilter(currentMonth);
        setSelectedAgentFilter('all');
        filterData(allData, currentMonth.startDate, currentMonth.endDate, 'all');
        setShowFilter(false);
    };

    const calculateTotals = () => {
        const totals = {
            post: 0,
            vacancy: 0,
            query: 0,
            duplicate_post: 0,
            call: 0,
            potential_lead: 0,
            confirm_lead: 0,
            payment: 0,
            no_employee: 0,
            lost_lead: 0
        };

        displayData.forEach(item => {
            totals.post += item.post || 0;
            totals.vacancy += item.vacancy || 0;
            totals.query += item.query || 0;
            totals.duplicate_post += item.duplicate_post || 0;
            totals.call += item.call || 0;
            totals.potential_lead += item.potential_lead || 0;
            totals.confirm_lead += item.confirm_lead || 0;
            totals.payment += item.payment || 0;
            totals.no_employee += item.no_employee || 0;
            totals.lost_lead += item.lost_lead || 0;
        });

        return totals;
    };

    const getAgentsData = () => {
        const agentsMap = {};

        displayData.forEach(item => {
            if (!agentsMap[item.agent]) {
                agentsMap[item.agent] = {
                    name: item.agent,
                    post: 0,
                    vacancy: 0,
                    query: 0,
                    duplicate_post: 0,
                    call: 0,
                    potential_lead: 0,
                    confirm_lead: 0,
                    payment: 0,
                    no_employee: 0,
                    lost_lead: 0
                };
            }

            const agentData = agentsMap[item.agent];
            agentData.post += item.post || 0;
            agentData.vacancy += item.vacancy || 0;
            agentData.query += item.query || 0;
            agentData.duplicate_post += item.duplicate_post || 0;
            agentData.call += item.call || 0;
            agentData.potential_lead += item.potential_lead || 0;
            agentData.confirm_lead += item.confirm_lead || 0;
            agentData.payment += item.payment || 0;
            agentData.no_employee += item.no_employee || 0;
            agentData.lost_lead += item.lost_lead || 0;
        });

        return Object.values(agentsMap);
    };

    const totals = calculateTotals();
    const agentsData = getAgentsData();

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4ea863] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading task report...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen p-4 md:p-6">
                {refreshing && (
                    <div className="fixed top-4 right-4 z-50 bg-[#4ea863] text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Refreshing data...
                    </div>
                )}

                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Daily Task Report</h1>
                            <p className="text-gray-600 mt-1">
                                {dateFilter.startDate} to {dateFilter.endDate}
                                {selectedAgentFilter !== 'all' && ` • Agent: ${selectedAgentFilter}`}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <FilterAltIcon className="h-5 w-5 text-gray-600" />
                                <span>Filter</span>
                            </button>

                            <button
                                onClick={fetchAllData}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <RefreshIcon className="h-5 w-5 text-gray-600" />
                                <span>Reload</span>
                            </button>
                        </div>
                    </div>

                    {showFilter && (
                        <div className="bg-white p-4 rounded-lg shadow-md mb-5 border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-medium text-gray-800">Filter Data</h3>
                                <button
                                    onClick={() => setShowFilter(false)}
                                    className="text-gray-500 hover:text-gray-700 p-1 cursor-pointer"
                                >
                                    <CloseIcon className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div onClick={() => startRef.current.showPicker()}>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Start Date
                                        </label>
                                        <input
                                            ref={startRef}
                                            type="date"
                                            value={dateFilter.startDate}
                                            onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#4ea863] focus:border-transparent text-sm cursor-pointer"
                                        />
                                    </div>


                                    <div onClick={() => endRef.current.showPicker()}>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            End Date
                                        </label>
                                        <input
                                            ref={endRef}
                                            type="date"
                                            value={dateFilter.endDate}
                                            onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#4ea863] focus:border-transparent text-sm cursor-pointer"
                                        />
                                    </div>

                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Select Agent
                                    </label>
                                    <select
                                        value={selectedAgentFilter}
                                        onChange={(e) => setSelectedAgentFilter(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#4ea863] focus:border-transparent text-sm"
                                    >
                                        <option value="all">All Agents</option>
                                        {agents.map((agent) => (
                                            <option key={agent} value={agent}>{agent}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleApplyFilter}
                                    className="flex-1 bg-[#4ea863] text-white py-2 px-3 rounded hover:bg-[#3c8e53] transition-colors font-medium text-sm cursor-pointer"
                                >
                                    Apply
                                </button>

                                <button
                                    onClick={handleResetToCurrentMonth}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded hover:bg-gray-200 transition-colors font-medium text-sm cursor-pointer"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Task Summary</h2>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                                <p className="text-xs text-gray-600 mb-1">Number of Posts</p>
                                <p className="text-xl font-bold text-gray-800">{totals.post}</p>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                                <p className="text-xs text-gray-600 mb-1">Vacancy (Owner)</p>
                                <p className="text-xl font-bold text-gray-800">{totals.vacancy}</p>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                                <p className="text-xs text-gray-600 mb-1">Queries (Employees)</p>
                                <p className="text-xl font-bold text-gray-800">{totals.query}</p>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                                <p className="text-xs text-gray-600 mb-1">Duplicate Posts</p>
                                <p className="text-xl font-bold text-gray-800">{totals.duplicate_post}</p>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                                <p className="text-xs text-gray-600 mb-1">Calls</p>
                                <p className="text-xl font-bold text-gray-800">{totals.call}</p>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                                <p className="text-xs text-gray-600 mb-1">Potential Leads</p>
                                <p className="text-xl font-bold text-gray-800">{totals.potential_lead}</p>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                                <p className="text-xs text-gray-600 mb-1">Confirmed Leads</p>
                                <p className="text-xl font-bold text-gray-800">{totals.confirm_lead}</p>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                                <p className="text-xs text-gray-600 mb-1">Payments Received</p>
                                <p className="text-xl font-bold text-gray-800">{totals.payment}</p>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                                <p className="text-xs text-gray-600 mb-1">No Employees Provided</p>
                                <p className="text-xl font-bold text-gray-800">{totals.no_employee}</p>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                                <p className="text-xs text-gray-600 mb-1">Lost Leads</p>
                                <p className="text-xl font-bold text-gray-800">{totals.lost_lead}</p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        {selectedAgentFilter === 'all' ? 'Agent Report' : `Agent: ${selectedAgentFilter}`}
                    </h2>

                    {agentsData.length === 0 ? (
                        <div className="bg-white rounded-xl shadow p-12 text-center">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Data Available</h3>
                            <p className="text-gray-500">Try changing your filter criteria</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {agentsData.map((agent) => (
                                <div
                                    key={agent.name}
                                    className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6"
                                >
                                    <div className="mb-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-10 w-10 bg-[#4ea863]/10 rounded-lg flex items-center justify-center">
                                                <span className="text-[#3c8e53] font-bold">
                                                    {agent.name.split('-')[0]?.[0] || 'A'}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800">
                                                    {agent.name.split('-')[0] || agent.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    ID: {agent.name.split('-')[1] || 'N/A'}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {dateFilter.startDate} → {dateFilter.endDate}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="pb-3 border-b border-gray-100">
                                            <p className="text-sm text-gray-500">Number of Posts</p>
                                            <p className="font-semibold text-gray-800">{agent.post}</p>
                                        </div>
                                        <div className="pb-3 border-b border-gray-100">
                                            <p className="text-sm text-gray-500">Vacancy (Owner)</p>
                                            <p className="font-semibold text-gray-800">{agent.vacancy}</p>
                                        </div>
                                        <div className="pb-3 border-b border-gray-100">
                                            <p className="text-sm text-gray-500">Queries (Employees)</p>
                                            <p className="font-semibold text-gray-800">{agent.query}</p>
                                        </div>
                                        <div className="pb-3 border-b border-gray-100">
                                            <p className="text-sm text-gray-500">Duplicate Posts</p>
                                            <p className="font-semibold text-gray-800">{agent.duplicate_post}</p>
                                        </div>
                                        <div className="pb-3 border-b border-gray-100">
                                            <p className="text-sm text-gray-500">Calls</p>
                                            <p className="font-semibold text-gray-800">{agent.call}</p>
                                        </div>
                                        <div className="pb-3 border-b border-gray-100">
                                            <p className="text-sm text-gray-500">Potential Leads</p>
                                            <p className="font-semibold text-gray-800">{agent.potential_lead}</p>
                                        </div>
                                        <div className="pb-3 border-b border-gray-100">
                                            <p className="text-sm text-gray-500">Confirmed Leads</p>
                                            <p className="font-semibold text-gray-800">{agent.confirm_lead}</p>
                                        </div>
                                        <div className="pb-3 border-b border-gray-100">
                                            <p className="text-sm text-gray-500">Payments Received</p>
                                            <p className="font-semibold text-gray-800">{agent.payment}</p>
                                        </div>
                                        <div className="pb-3 border-b border-gray-100">
                                            <p className="text-sm text-gray-500">No Employees Provided</p>
                                            <p className="font-semibold text-gray-800">{agent.no_employee}</p>
                                        </div>
                                        <div className="pb-3 border-b border-gray-100">
                                            <p className="text-sm text-gray-500">Lost Leads</p>
                                            <p className="font-semibold text-gray-800">{agent.lost_lead}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}