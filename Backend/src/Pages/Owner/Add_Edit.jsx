import { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField, IconButton, Autocomplete } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 500,
    bgcolor: '#fdfdfd',
    boxShadow: 24,
    p: 3,
    borderRadius: 2,
    overflowY: 'auto',
};


export default function AddEditOwner({ open, onClose, data, refreshData }) {
    const EndPoint = 'owners';

    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [agents, setAgents] = useState([]);

    const capitalizeWords = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    useEffect(() => {
        if (data) {
            setFormData({
                ...data,
                agent: data.agent?.name || "",
            });
        } else {
            setFormData({
                agent: "",
            });
        }

        setErrors({});

        axios.get(`${import.meta.env.VITE_SERVER_URL}/api/agents`).then(response => setAgents(response.data)).catch(() => toast.error('Failed to fetch agents.'));

    }, [data]);

    const validate = () => {
        const newErrors = {};
        const { agent, name, phone } = formData;

        if (!agent) newErrors.agent = 'Agent is required.';
        if (!name) newErrors.name = 'Name is required.';
        if (!/^\d+$/.test(phone || '')) newErrors.phone = 'Phone number must contain numbers.';


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async () => {
        if (!validate() || loading) return;
        setLoading(true);

        try {
            const url = `${import.meta.env.VITE_SERVER_URL}/api/${EndPoint}${data?._id ? `/${data._id}` : ''}`;
            const method = data?._id ? 'patch' : 'post';
            await axios[method](url, formData);
            toast.success(data?._id ? 'Updated successfully.' : 'Created successfully.');
            refreshData();
            onClose();
        } catch (error) {
            const backendErrors = error.response?.data || {};
            toast.error('Failed to update data.');
            setErrors({
                ...backendErrors.includes?.('Phone number already exists') && { phone: 'Phone number already exists.' },
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} className='max-h-[90vh]'>
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography className='!font-bold' variant="h6">{data ? 'Update Data' : 'Create New'} </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {[
                    { name: 'name', label: 'Owner Name*' },
                    { name: 'phone', label: 'Phone*' },
                    { name: 'alt_phone', label: 'Alternative Phone' },
                    { name: 'business_name', label: 'Business Name' },
                    { name: 'business_type', label: 'Business Type' },
                    { name: 'business_address', label: 'Business Address' },
                    { name: 'note', label: 'Notes' },

                ].map(({ name, label }) => (
                    <TextField
                        key={name}
                        name={name}
                        label={label}
                        type={'text'}
                        fullWidth
                        margin="normal"
                        size="small"
                        value={formData[name] || ''}
                        onChange={handleChange}
                        error={!!errors[name]}
                        helperText={errors[name]}
                    />
                ))}


                <Autocomplete
                    fullWidth
                    size="small"
                    options={agents}
                    margin="normal"
                    getOptionLabel={(option) => capitalizeWords(option.name)}
                    value={agents.find(c => c.name === formData.agent) || null}
                    onChange={(event, newValue) => {
                        handleChange({
                            target: { name: "agent", value: newValue ? newValue.name : "" }
                        });
                    }}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    renderInput={(params) => (
                        <TextField {...params} label="Select Agent*" error={!!errors.agent} helperText={errors.agent} />
                    )}
                    sx={{ my: 2 }}
                />



                <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSubmit} disabled={loading} className='!bg-[#1664c5] !font-bold'>
                    {data ? 'Update' : 'Create'}
                </Button>
            </Box>
        </Modal>
    );
}