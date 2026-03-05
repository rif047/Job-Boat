import { useState, useEffect, useMemo } from 'react';
import Layout from '../../Layout';
import Datatable from '../../Components/Datatable/Datatable';
import Add_Edit from './Add_Edit';
import View from './View';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CachedIcon from '@mui/icons-material/Cached';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Autocomplete } from '@mui/material';
import { filterLeadsByUserTypes, getUserTypesFromStorage, hasUserType } from '../../Utils/userAccess';

export default function Jobs() {
    document.title = 'Jobs';

    const EndPoint = 'jobs';

    const userTypes = getUserTypesFromStorage();
    const isAdmin = hasUserType(userTypes, "Admin");

    const userPermissions =
        isAdmin
            ? {
                canEdit: true,
                canView: true,
                canDelete: true,
            }
            : {
                canEdit: true,
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

    const [selectedStatus, setSelectedStatus] = useState("PendingPayment");
    const [employees, setEmployees] = useState([]);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [form, setForm] = useState({ agent: "", employee: "", fee: "", wages: "", remark: "" });



    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/${EndPoint}`
            );

            let filteredData = response.data.filter(
                item => item.status === "Pending"
            );

            filteredData = filterLeadsByUserTypes(filteredData, userTypes);

            setData(filteredData.reverse());
        } catch (error) {
            toast.error("Failed to fetch data. Please try again.");
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };



    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/employees`);
            setEmployees(res.data.reverse());
        } catch {
            toast.error("Failed to fetch employees");
        }
    };


    const handleStatusClick = async (row, type = "PendingPayment") => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        setSelectedRow(row);

        setForm({
            agent: loggedUser?.name || "",
            employee: "",
            advance_fee: "",
            fee: row.fee || "",
            wages: row.wages || "",
            remark: row.remark || ""
        });

        await fetchEmployees();
        setStatusModalOpen(true);
        setSelectedStatus(type);
    };


    const handleCloseJob = async (row) => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        setSelectedRow(row);

        setForm({
            agent: loggedUser?.name || "",
            employee: "",
            fee: row.fee || "",
            wages: row.wages || "",
            remark: row.remark || ""
        });

        await fetchEmployees();
        setStatusModalOpen(true);
        setSelectedStatus("Closed");
    };


    const handleStatusSubmit = async () => {
        try {
            let url;

            if (selectedStatus === "LeadLost") {
                url = `${import.meta.env.VITE_SERVER_URL}/api/${EndPoint}/lead_lost/${selectedRow._id}`;
            } else if (selectedStatus === "Closed") {
                url = `${import.meta.env.VITE_SERVER_URL}/api/${EndPoint}/closed/${selectedRow._id}`;
            } else {
                url = `${import.meta.env.VITE_SERVER_URL}/api/${EndPoint}/pending_payment/${selectedRow._id}`;
            }

            await axios.patch(url, {
                ...form,
                status: selectedStatus,
            });

            toast.success(
                selectedStatus === "LeadLost"
                    ? "Job marked as Lost Lead!"
                    : selectedStatus === "Closed"
                        ? "Job closed successfully!"
                        : "Job moved to Pending Payment!"
            );

            fetchData();
            setStatusModalOpen(false);
        } catch {
            toast.error("Please complete all fields.");
        }
    };


    const handleLostLead = async (row) => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        setSelectedRow(row);

        setForm({
            agent: loggedUser?.name || "",
            employee: "",
            fee: row.fee || "",
            wages: row.wages || "",
            remark: row.remark || ""
        });

        setSelectedStatus("LeadLost");
        setStatusModalOpen(true);
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

    const handleAdd = () => { setEditData(null); setModalOpen(true); };
    const handleEdit = (row) => { setEditData(row); setModalOpen(true); };
    const handleView = (row) => { setViewData(row); setViewModalOpen(true); };

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
        { id: 'wages', accessorFn: row => row.wages ? `£${row.wages}` : '', header: 'Wage', maxSize: 60 },
        { key: "agent", accessorKey: 'agent', header: 'agent', maxSize: 80 },
        {
            key: "actions", header: 'Set Status', maxSize: 50,
            Cell: ({ row }) => (
                <div className='flex'>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleStatusClick(row.original, "PendingPayment"); }}
                        className="text-[#3498db] font-bold flex items-center cursor-pointer">
                        <span className="text-xs mr-1 text-center ">Add Emp</span>
                        <EventRepeatIcon fontSize="small" />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); handleCloseJob(row.original); }}
                        className="text-green-600 font-bold flex items-center cursor-pointer ml-3 border-x-2 px-2">
                        <span className="text-xs mr-1 text-center ">Close</span>
                        <TaskAltIcon fontSize="small" />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); handleLostLead(row.original); }}
                        className="text-red-400 font-bold flex items-center cursor-pointer ml-3">
                        <span className="text-xs mr-1 text-center ">Lost</span>
                        <HighlightOffIcon fontSize="small" />
                    </button>
                </div>
            )
        }

    ];

    return (
        <Layout>
            <ToastContainer position="bottom-right" autoClose={2000} />

            <section className="flex justify-between px-1 md:px-4 py-2 bg-[#4ea863] shadow-2xs">
                <div className='flex justify-center items-center'>
                    <h1 className="font-bold text-sm md:text-lg text-white mr-2">Hot Leads</h1>

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
                        <label htmlFor="leadTypeFilter" className="text-xs text-gray-200 mr-2 whitespace-nowrap">
                            Type
                        </label>
                        <select
                            id="leadTypeFilter"
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
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-xl font-semibold text-sm shadow-sm border border-gray-200 hover:bg-gray-100 hover:shadow transition-all duration-200 cursor-pointer"
                >
                    Create +
                </button>
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





            <Dialog open={statusModalOpen} onClose={() => setStatusModalOpen(false)} maxWidth='xs'>
                <DialogTitle>
                    <b>
                        {selectedStatus === "Closed"
                            ? "Set Status to Closed"
                            : selectedStatus === "LeadLost"
                                ? "Set Status to Lead Lost"
                                : "Set Status to Pending Payment"}
                    </b>
                </DialogTitle>


                <DialogContent>
                    {selectedStatus === "LeadLost" ? (
                        <>
                            <TextField
                                fullWidth
                                label="Remark"
                                size="small"
                                margin="normal"
                                multiline
                                minRows={8}
                                // value={form.remark}
                                onChange={e => setForm({ ...form, remark: e.target.value })}
                            />
                        </>
                    ) : (
                        <>
                            <Autocomplete
                                fullWidth
                                size="small"
                                options={employees}
                                getOptionLabel={o => `${o.name} (${o.phone})`}
                                value={employees.find(emp => `${emp.name} (${emp.phone})` === form.employee) || null}
                                onChange={(e, v) => setForm({ ...form, employee: v ? `${v.name} (${v.phone})` : "" })}
                                autoHighlight
                                selectOnFocus
                                clearOnBlur
                                handleHomeEndKeys
                                renderInput={p => (
                                    <TextField {...p} label="Select Employee*" margin="normal" />
                                )}
                            />

                            <TextField
                                fullWidth
                                size="small"
                                margin="normal"
                                label={selectedStatus === "Closed" ? "Final Fees*" : "Fees*"}
                                value={form.fee}
                                onChange={e => setForm({ ...form, fee: e.target.value })}
                            />

                            {selectedStatus !== "Closed" && (
                                <TextField
                                    fullWidth
                                    size="small"
                                    margin="normal"
                                    label="Advance Paid*"
                                    value={form.advance_fee}
                                    onChange={e => setForm({ ...form, advance_fee: e.target.value })}
                                />
                            )}

                            <TextField
                                fullWidth
                                size="small"
                                margin="normal"
                                label="Wages*"
                                value={form.wages}
                                onChange={e => setForm({ ...form, wages: e.target.value })}
                            />

                            <TextField
                                fullWidth
                                label="Remark"
                                size="small"
                                margin="normal"
                                multiline
                                minRows={8}
                                // value={form.remark}
                                onChange={e => setForm({ ...form, remark: e.target.value })}
                            />
                        </>
                    )}
                </DialogContent>


                <small className='text-gray-600 mx-auto my-2'>All fields are required.</small>

                <DialogActions>
                    <Button fullWidth variant="contained" onClick={handleStatusSubmit} className="!bg-[#4ea863] hover:!bg-green-700 !font-bold">
                        Submit
                    </Button>
                </DialogActions>


            </Dialog>

        </Layout>
    );
}
