import { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField, IconButton } from '@mui/material';
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


export default function AddEditAgent({ open, onClose, data, refreshData }) {
    const EndPoint = 'agents';

    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFormData(data || {});
        setErrors({});
    }, [data]);

    const validate = () => {
        const newErrors = {};
        const { name, phone, designation } = formData;

        if (!name) newErrors.name = 'Name is required.';
        if (!/^\d+$/.test(phone || '')) newErrors.phone = 'Phone number must contain numbers.';
        if (!designation) newErrors.designation = 'Designation is required.';


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
                ...backendErrors.includes?.('Email already exists') && { email: 'Email already exists.' },
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
                    { name: 'name', label: 'Agent Name*' },
                    { name: 'phone', label: 'Phone*' },
                    { name: 'designation', label: 'Designation' },
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

                <TextField
                    fullWidth
                    label="Remark"
                    name="remark"
                    size="small"
                    margin="normal"
                    multiline
                    minRows={4}
                    value={formData.remark}
                    onChange={handleChange}
                />



                <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSubmit} disabled={loading} className='!bg-[#1664c5] !font-bold'>
                    {data ? 'Update' : 'Create'}
                </Button>
            </Box>
        </Modal>
    );
}