import { useState, useEffect, useMemo } from 'react';
import Layout from '../../../Layout';
import Datatable from '../../../Components/Datatable/Datatable';
import View from './View';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CachedIcon from '@mui/icons-material/Cached';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { filterLeadsByUserTypes, getUserTypesFromStorage, hasUserType } from '../../../Utils/userAccess';

export default function LostLead() {
    document.title = 'Closed Jobs';

    const EndPoint = 'jobs';

    const userTypes = getUserTypesFromStorage();
    const isAdmin = hasUserType(userTypes, 'Admin');

    const userPermissions = {
        canEdit: false,
        canView: true,
        canDelete: false,
    };


    const [modalOpen, setModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [viewData, setViewData] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedLeadType, setSelectedLeadType] = useState("All");


    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/${EndPoint}`);

            let filteredData = response.data.filter(item => item.status === "LeadLost");
            filteredData = filterLeadsByUserTypes(filteredData, userTypes);

            setData(filteredData.reverse());
        } catch (error) {
            toast.error('Failed to fetch data. Please try again.');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };



    const handleDelete = async (row) => {
        if (window.confirm(`Are you sure you want to delete ${row.position.toUpperCase()}?`)) {
            try {
                await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/${EndPoint}/${row._id}`);
                toast.success(`${row.position.toUpperCase()} deleted.`);
                fetchData();
            } catch (error) {
                toast.error('Failed to delete. Please try again.');
                console.error('Error deleting data:', error);
            }
        }
    };

    const handleToPending = async (row) => {
        if (window.confirm(`Back to Hot Lead for ${row.position.toUpperCase()}?`)) {
            try {
                await axios.patch(
                    `${import.meta.env.VITE_SERVER_URL}/api/${EndPoint}/deal_cancelled/${row._id}`,
                    { status: "Pending" }
                );
                toast.success("Job moved back to Hot Lead!");
                fetchData();
            } catch (error) {
                console.error("Error updating status:", error);
                toast.error("Failed to mark as Cancelled.");
            }
        }
    };


    const handleEdit = (row) => {
        setEditData(row);
        setModalOpen(true);
    };

    const handleView = (row) => {
        setViewData(row);
        setViewModalOpen(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const leadTypeOptions = useMemo(() => {
        const uniqueTypes = [...new Set(data.map(item => item.lead_type).filter(Boolean))];
        return ["All", ...uniqueTypes];
    }, [data]);

    useEffect(() => {
        if (!leadTypeOptions.includes(selectedLeadType)) {
            setSelectedLeadType("All");
        }
    }, [leadTypeOptions, selectedLeadType]);

    const filteredData = useMemo(() => {
        if (selectedLeadType === "All") return data;
        return data.filter(item => item.lead_type === selectedLeadType);
    }, [data, selectedLeadType]);



    const columns = [
        { key: "createdOn", accessorFn: (row) => row.createdOn ? new Date(row.createdOn).toLocaleDateString() : '', header: 'Date', maxSize: 80 },
        { key: "code", accessorKey: 'code', header: 'Code', maxSize: 60 },
        { key: "lead_type", accessorKey: 'lead_type', header: 'Type', maxSize: 60 },
        { key: "owner", accessorKey: 'owner', header: 'Owner' },
        { key: "position", accessorKey: 'position', header: 'Position' },
        { key: "city", accessorKey: 'city', header: 'City' },
        { key: "accommodation", accessorKey: 'accommodation', header: 'Accom', maxSize: 60 },
        { key: "agent", accessorKey: 'agent', header: 'agent', maxSize: 80 },
        ...(isAdmin
            ? [
                {
                    key: "actions",
                    header: "Set Status",
                    maxSize: 50,
                    Cell: ({ row }) => (
                        <div className="flex">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToPending(row.original);
                                }}
                                className="text-orange-500 font-bold flex items-center cursor-pointer ml-3"
                            >
                                <span className="text-xs mr-1 text-center">Hot Lead</span>
                                <ArrowOutwardIcon fontSize="small" />
                            </button>
                        </div>
                    ),
                },
            ]
            : []),
    ];

    return (
        <Layout>
            <ToastContainer position="bottom-right" autoClose={2000} />

            <section className="flex justify-between px-1 md:px-4 py-2 bg-[#4ea863]">
                <div className='flex justify-center items-center'>
                    <h1 className="font-bold text-sm md:text-lg text-white mr-2">Lost Leads</h1>

                    {loading ? (
                        <div className="flex justify-center items-center text-white">
                            <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="3" strokeDasharray="10" strokeDashoffset="75" />
                            </svg>
                        </div>
                    ) : <button className="text-gray-200 cursor-pointer" onClick={fetchData}><CachedIcon /></button>
                    }

                    <span className="ml-2 text-xs text-gray-300">
                        Total: {filteredData.length}
                    </span>

                    <div className="ml-3 flex items-center">
                        <label htmlFor="lostLeadTypeFilter" className="text-xs text-gray-200 mr-2 whitespace-nowrap">
                            Type
                        </label>
                        <select
                            id="lostLeadTypeFilter"
                            value={selectedLeadType}
                            onChange={(e) => setSelectedLeadType(e.target.value)}
                            className="h-7 rounded-md border border-white/30 bg-white/15 px-2 text-xs text-white outline-none backdrop-blur-sm focus:border-white/70"
                        >
                            {leadTypeOptions.map((type) => (
                                <option key={type} value={type} className="text-gray-800">
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
            </section>

            <section>
                {loading ? (
                    <div className="flex justify-center py-4">
                        <svg className="animate-spin p-5 h-32 w-32 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="3" strokeDasharray="50" strokeDashoffset="80" />
                        </svg>
                    </div>
                ) : (
                    <Datatable
                        columns={columns}
                        data={filteredData}
                        onEdit={handleEdit}
                        onView={handleView}
                        onDelete={handleDelete}
                        permissions={userPermissions}
                    />
                )}
            </section>

            {modalOpen && (
                <Add_Edit
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    data={editData}
                    refreshData={fetchData}
                />
            )}

            {viewModalOpen && (
                <View
                    open={viewModalOpen}
                    onClose={() => setViewModalOpen(false)}
                    viewData={viewData}
                />
            )}
        </Layout>
    );
}
