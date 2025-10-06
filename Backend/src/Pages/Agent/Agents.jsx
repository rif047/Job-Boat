import { useState, useEffect } from 'react';
import Layout from '../../Layout';
import Datatable from '../../Components/Datatable/Datatable';
import Add_Edit from './Add_Edit';
import View from './View';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CachedIcon from '@mui/icons-material/Cached';

export default function Agents() {
    document.title = 'Agents';

    const EndPoint = 'agents';

    const userPermissions = {
        canEdit: true,
        canView: true,
        canDelete: true,
    };


    const [modalOpen, setModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [viewData, setViewData] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);


    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/${EndPoint}`);
            const reversedData = response.data.reverse();
            setData(reversedData);
        } catch (error) {
            toast.error('Failed to fetch data. Please try again.');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (row) => {
        if (window.confirm(`Are you sure you want to delete ${row.name.toUpperCase()}?`)) {
            try {
                await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/${EndPoint}/${row._id}`);
                toast.success(`${row.name.toUpperCase()} deleted.`);
                fetchData();
            } catch (error) {
                toast.error('Failed to delete. Please try again.');
                console.error('Error deleting data:', error);
            }
        }
    };

    const handleAdd = () => {
        setEditData(null);
        setModalOpen(true);
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



    const columns = [
        { accessorKey: 'name', header: 'Agent Name' },
        { accessorKey: 'phone', header: 'Phone', enableClickToCopy: true, },
        { accessorKey: 'designation', header: 'Designation' },
    ];

    columns.forEach(column => {
        if (column.accessorKey !== 'images') {
            column.Cell = ({ cell }) => {
                const value = cell.getValue();
                if (!value) return '';
                const displayValue = String(value);
                return (
                    <span title={displayValue}>
                        {displayValue.slice(0, 40)}{displayValue.length > 40 && '...'}
                    </span>
                );
            };
        }
    });

    return (
        <Layout>
            <ToastContainer position="bottom-right" autoClose={2000} />

            <section className="flex justify-between px-5 py-2 bg-[#4ea863]">
                <div className='flex justify-center items-center'>
                    <h1 className="font-bold text-sm md:text-lg text-white mr-2">Agent List</h1>

                    {loading ? (
                        <div className="flex justify-center items-center text-white">
                            <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="3" strokeDasharray="10" strokeDashoffset="75" />
                            </svg>
                        </div>
                    ) : <button className="text-gray-200 cursor-pointer" onClick={fetchData}><CachedIcon /></button>
                    }

                    <span className="ml-2 text-xs text-gray-300">
                        Total: {data.length}
                    </span>

                </div>
                <button
                    onClick={handleAdd}
                    className="bg-[#FFFFFF] text-gray-800 px-6 py-1 rounded-md font-bold text-sm hover:bg-gray-200 cursor-pointer"
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
                        data={data}
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