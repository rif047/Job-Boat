import { useState, useEffect } from 'react';
import Layout from '../../Layout';
import Datatable from '../../Components/Datatable/Datatable';
import View from './View';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CachedIcon from '@mui/icons-material/Cached';
import {
    TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, Autocomplete
} from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const columnPermissions = {
    Admin: [
        "owner", "employee", "name", "code", "city",
        "decimal", "agree_price", "sell_price", "images", "property_for"
    ],
    Operator: [
        "name", "code", "decimal", "sell_price", "images"
    ]
};

export default function Under_Offers() {
    document.title = 'Under Offer';
    const EndPoint = 'properties';
    const userType = localStorage.getItem("userType") || "Operator";

    const [loading, setLoading] = useState(false);
    const [allData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [tickModalOpen, setTickModalOpen] = useState(false);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [sellPrice, setSellPrice] = useState('');
    const [sellDate, setSellDate] = useState('');
    const [sellCustomer, setSellCustomer] = useState('');
    const [employees, setCustomers] = useState([]);

    const userPermissions = userType === "Admin"
        ? { canEdit: false, canView: true, canDelete: false }
        : { canEdit: false, canView: false, canDelete: false };

    const capitalizeWords = str =>
        str.split(' ').map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(' ');

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/${EndPoint}`);
            const allProperties = res.data.reverse();
            setAllData(allProperties);
            const offeringProperties = allProperties.filter(property => property.status === "Offering");
            setFilteredData(offeringProperties);
        } catch {
            toast.error('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    };

    const handleView = row => { setViewData(row); setViewModalOpen(true); };

    const handleTickClick = async row => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/employees`);
            setCustomers(res.data.reverse());
        } catch {
            toast.error('Failed to fetch employees.');
        } finally {
            setSelectedRow(row);
            setSellPrice(row.sell_price || '');
            setSellDate(row.date || '');
            setSellCustomer(row.employee?._id || '');
            setTickModalOpen(true);
        }
    };

    const handleCancelClick = row => { setSelectedRow(row); setCancelModalOpen(true); };

    const handleTickSubmit = async () => {
        try {
            const updateData = {
                sell_price: sellPrice,
                employee: sellCustomer,
                date: sellDate,
                status: selectedRow.property_for
            };
            await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/${EndPoint}/status/${selectedRow._id}`, updateData);
            toast.success('Status updated successfully!');
            fetchData();
            setTickModalOpen(false);
        } catch {
            toast.error('Failed to update property.');
        }
    };

    const handleCancelSubmit = async () => {
        try {
            await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/${EndPoint}/cancel/${selectedRow._id}`, { status: "Pending" });
            toast.success('Property status set to Pending!');
            fetchData();
            setCancelModalOpen(false);
        } catch {
            toast.error('Failed to update property.');
        }
    };

    useEffect(() => { fetchData(); }, []);

    let columns = [
        { accessorFn: row => `${row.owner?.name} (${row.owner?.clientType})`, key: "owner", header: 'Owner', size: 80 },
        { accessorFn: row => `${row.employee?.name} (${row.employee?.phone})`, key: "employee", header: 'Employee', size: 80 },
        { accessorKey: 'name', key: "name", header: 'Name', size: 80 },
        { accessorKey: 'code', key: "code", header: 'Code', size: 80 },
        { accessorKey: 'city', key: "city", header: 'City', size: 80 },
        { accessorFn: row => `${row.decimal} dec`, key: "decimal", header: 'Size', size: 80 },
        { accessorFn: row => `${row.agree_price} tk`, key: "agree_price", header: 'Agreed', size: 80 },
        { accessorFn: row => `${row.sell_price} tk`, key: "sell_price", header: 'Target', size: 80 },
        {
            accessorKey: 'images',
            key: "images",
            header: 'Image',
            size: 70,
            Cell: ({ cell }) => {
                const images = cell.getValue();
                return Array.isArray(images) && images.length > 0 ? (
                    <img src={`${import.meta.env.VITE_SERVER_URL}/api/Images/${EndPoint}/${images[0]}`}
                        alt="Image" style={{ width: '50px', height: '30px', objectFit: 'cover', borderRadius: '4px', margin: '0 auto', display: 'block' }} />
                ) : <div style={{ textAlign: 'center' }}>No Image</div>;
            }
        },
        {
            accessorKey: 'property_for',
            key: "property_for",
            header: 'Status',
            size: 80,
            Cell: ({ row }) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>{row.original.property_for}</span>
                    <button className='text-green-900 ml-3' onClick={e => { e.stopPropagation(); handleTickClick(row.original); }}>
                        <span className='text-[10px] mr-1 font-bold'>Done</span><CheckCircleOutlinedIcon fontSize='small' />
                    </button>
                    <button className='text-red-900 ml-3' onClick={e => { e.stopPropagation(); handleCancelClick(row.original); }}>
                        <span className='text-[10px] mr-1 font-bold'>Cancel</span><CancelOutlinedIcon fontSize='small' />
                    </button>
                </div>
            )
        }
    ];

    // Filter columns according to userType
    const allowedCols = columnPermissions[userType] || [];
    columns = columns.filter(col => allowedCols.includes(col.key));

    // Trim long text
    columns.forEach(col => {
        if (!['images', 'property_for'].includes(col.accessorKey)) {
            col.Cell = ({ cell }) => {
                const val = String(cell.getValue() || '');
                return <span title={val}>{val.slice(0, 30)}{val.length > 30 && '...'}</span>;
            };
        }
    });

    return (
        <Layout>
            <ToastContainer position="bottom-right" autoClose={2000} />
            <section className="flex justify-between px-5 py-2 bg-[#1664c5]">
                <div className='flex items-center'>
                    <h1 className="font-bold text-sm md:text-lg text-white mr-2">Under Offer Property List</h1>
                    {loading ? (
                        <div className="flex justify-center items-center text-white">
                            <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="3" strokeDasharray="10" strokeDashoffset="75" />
                            </svg>
                        </div>
                    ) : <button className="text-gray-200 cursor-pointer" onClick={fetchData}><CachedIcon /></button>}
                </div>
            </section>

            <section>
                {loading ? (
                    <div className="flex justify-center py-4">
                        <svg className="animate-spin p-5 h-32 w-32 text-gray-700" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="3" strokeDasharray="50" strokeDashoffset="80" />
                        </svg>
                    </div>
                ) : (
                    <Datatable
                        columns={columns}
                        data={filteredData}
                        onView={handleView}
                        permissions={userPermissions}
                    />
                )}
            </section>

            {viewModalOpen && <View open={viewModalOpen} onClose={() => setViewModalOpen(false)} viewData={viewData} />}

            <Dialog open={tickModalOpen} onClose={() => setTickModalOpen(false)}>
                <DialogTitle><b>Update Property</b></DialogTitle>
                <DialogContent>
                    <Autocomplete
                        fullWidth size="small"
                        options={employees}
                        value={employees.find(c => c._id === sellCustomer) || null}
                        getOptionLabel={option => capitalizeWords(option.name)}
                        onChange={(e, newVal) => setSellCustomer(newVal?._id || '')}
                        isOptionEqualToValue={(a, b) => a._id === b._id}
                        renderInput={params => <TextField {...params} label="Select Employee*" />}
                        style={{ marginBottom: 20 }}
                    />
                    <TextField
                        label="Final Price" type="text" fullWidth variant="standard"
                        value={sellPrice} onChange={e => setSellPrice(e.target.value)}
                        style={{ marginBottom: 20 }}
                    />
                    <TextField
                        label="Final Deal Date" type="date" fullWidth variant="standard"
                        InputLabelProps={{ shrink: true }}
                        value={sellDate} onChange={e => setSellDate(e.target.value)}
                        style={{ marginBottom: 20 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button fullWidth variant="contained" onClick={handleTickSubmit} className='!bg-[#1664c5] !font-bold'>Done</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={cancelModalOpen} onClose={() => setCancelModalOpen(false)}>
                <DialogTitle><b>Cancel Property Offer</b></DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to cancel this offer and set the status back to Pending?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelModalOpen(false)}>No</Button>
                    <Button onClick={handleCancelSubmit} color="error">Yes, Cancel Offer</Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
}
