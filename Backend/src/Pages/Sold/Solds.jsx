import { useState, useEffect } from 'react';
import Layout from '../../Layout';
import Datatable from '../../Components/Datatable/Datatable';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import View from './View';
import CachedIcon from '@mui/icons-material/Cached';
import 'react-toastify/dist/ReactToastify.css';

export default function Solds() {
    document.title = 'Sold';

    const EndPoint = 'properties';
    const userType = localStorage.getItem("userType"); // 👈 role check

    const [loading, setLoading] = useState(false);
    const [allData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [viewData, setViewData] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);

    const userPermissions = userType === "Admin"
        ? { canEdit: false, canView: true, canDelete: false }
        : { canEdit: false, canView: false, canDelete: false };

    const handleView = row => {
        setViewData(row);
        setViewModalOpen(true);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/${EndPoint}`);
            const allProperties = res.data.reverse();
            setAllData(allProperties);
            const soldProperties = allProperties.filter(property => property.status === "Sell");
            setFilteredData(soldProperties);
        } catch {
            toast.error('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const baseColumns = [
        { accessorKey: 'name', header: 'Name', size: 80 },
        { accessorKey: 'code', header: 'Code', size: 80 },
        { accessorFn: row => `${row.decimal} dec`, header: 'Size', size: 80 },
        { accessorFn: row => `${row.sell_price} tk`, header: 'Sold Price', size: 80 },
        {
            accessorKey: 'images',
            header: 'Image',
            size: 70,
            Cell: ({ cell }) => {
                const images = cell.getValue();
                return Array.isArray(images) && images.length > 0 ? (
                    <img
                        src={`${import.meta.env.VITE_SERVER_URL}/api/Images/${EndPoint}/${images[0]}`}
                        alt="Image"
                        style={{ width: '50px', height: '30px', objectFit: 'cover', borderRadius: '4px', display: 'block', margin: '0 auto' }}
                    />
                ) : (
                    <div style={{ textAlign: 'center' }}>No Image</div>
                );
            },
        },
    ];

    const extraColumns = [
        { accessorFn: row => `${row.owner?.name} (${row.owner?.clientType})`, header: 'Owner', size: 80 },
        { accessorFn: row => `${row.employee?.name} (${row.employee?.phone})`, header: 'Employee', size: 80 },
        { accessorKey: 'city', header: 'City', size: 80 },
    ];

    const columns = userType === "Operator" ? baseColumns : [...extraColumns, ...baseColumns];

    // ✅ Limit text length (except image)
    columns.forEach(col => {
        if (!['images'].includes(col.accessorKey)) {
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
                    <h1 className="font-bold text-sm md:text-lg text-white mr-2">Sold Properties</h1>
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
                        permissions={userPermissions}
                        onView={handleView}
                    />
                )}
            </section>

            {viewModalOpen && <View open={viewModalOpen} onClose={() => setViewModalOpen(false)} viewData={viewData} />}
        </Layout>
    );
}
