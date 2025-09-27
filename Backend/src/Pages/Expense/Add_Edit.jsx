import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, IconButton, TextField, Autocomplete } from '@mui/material';
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

export default function AddEdit({ open, onClose, data, refreshData }) {
    const EndPoint = 'expenses';

    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const capitalizeWords = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    useEffect(() => {
        setFormData(data || {});
        setErrors({});
        axios.get(`${import.meta.env.VITE_SERVER_URL}/api/expense_categories`)
            .then(response => setCategories(response.data))
            .catch(error => toast.error('Failed to fetch categories.'));

        if (data?.images) setSelectedImages(data.images);
        if (data?.category?._id) setFormData(prev => ({ ...prev, category: data.category._id }));
    }, [data]);

    const validate = () => {
        const newErrors = {};
        const { name, amount, category } = formData;

        if (!data && !formData.date) newErrors.date = 'Expense Date is required.';
        if (!name) newErrors.name = 'Name is required.';
        if (!amount || !/^\d+$/.test(amount)) newErrors.amount = 'Amount must be a number.';
        if (!category) newErrors.category = 'Category is required.';
        if (selectedImages.length > 5) newErrors.images = 'You can upload up to 5 images only.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        let validFiles = [];
        let hasInvalidFile = false;

        files.forEach(file => {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                toast.error(`Invalid file type: ${file.name}. Only JPG and PNG files are allowed.`);
                hasInvalidFile = true;
                return;
            }

            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                toast.error(`File too large: ${file.name}. Maximum size is 10MB.`);
                hasInvalidFile = true;
                return;
            }

            validFiles.push(file);
        });

        if (hasInvalidFile) {
            return;
        }

        if (validFiles.length + selectedImages.length > 5) {
            toast.error('You can upload up to 5 images only.');
        } else {
            setSelectedImages(prev => [...prev, ...validFiles]);
        }
    };

    const handleSubmit = async () => {
        if (!validate() || loading) return;
        setLoading(true);

        const formDataToSubmit = new FormData();
        Object.entries(formData).forEach(([key, value]) => formDataToSubmit.append(key, value));
        selectedImages.forEach(image => formDataToSubmit.append('images', image));

        try {
            const url = `${import.meta.env.VITE_SERVER_URL}/api/${EndPoint}${data?._id ? `/${data._id}` : ''}`;
            const method = data?._id ? 'patch' : 'post';
            await axios[method](url, formDataToSubmit, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success(data?._id ? 'Updated successfully.' : 'Created successfully.');
            refreshData();
            onClose();
        } catch (error) {
            toast.error('Failed to submit data.');
        } finally {
            setLoading(false);
        }
    };

    const formFields = [
        { label: 'Expense Name*', name: 'name', type: 'text' },
        { label: 'Amount*', name: 'amount', type: 'number' },
        { label: 'Description', name: 'description', type: 'text' }
    ];

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} className='max-h-[90vh]'>
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography className='!font-bold' variant="h6">{data ? 'Update Data' : 'Create New'}</Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Box>

                {!data && (
                    <TextField
                        label=""
                        name="date"
                        type="date"
                        fullWidth
                        margin="normal"
                        size="small"
                        value={formData.date || ''}
                        onChange={handleChange}
                        error={!!errors.date}
                        helperText={errors.date}
                    />
                )}

                <Autocomplete
                    fullWidth
                    size="small"
                    options={categories}
                    getOptionLabel={(option) => capitalizeWords(option.name)}
                    value={categories.find(c => c._id === formData.category) || null}
                    onChange={(event, newValue) => {
                        handleChange({
                            target: {
                                name: "category",
                                value: newValue ? newValue._id : ""
                            }
                        });
                    }}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Category*"
                            error={!!errors.category}
                            helperText={errors.category}
                        />
                    )}
                    sx={{ mt: 2 }}
                />

                {formFields.map(({ label, name, type }) => (
                    <TextField
                        key={name}
                        label={label}
                        name={name}
                        type={type}
                        fullWidth
                        margin="normal"
                        size="small"
                        value={formData[name] || ''}
                        onChange={handleChange}
                        error={!!errors[name]}
                        helperText={errors[name]}
                    />
                ))}

                <h2 className='mt-4 mb-2 text-lg'>Select Voucher:</h2>
                <input
                    type="file"
                    accept="image/jpeg, image/png"
                    multiple
                    onChange={handleImageChange}
                    style={{ marginBottom: '10px', padding: '2px' }}
                />
                <Typography variant="caption" display="block" gutterBottom>
                    Only JPG/PNG files (max 10MB each)
                </Typography>
                <div className='flex mb-3'>
                    {selectedImages.map((image, index) => (
                        <img
                            key={index}
                            src={image instanceof File ? URL.createObjectURL(image) : `${import.meta.env.VITE_SERVER_URL}/api/Images/${EndPoint}/${image}`}
                            alt={`preview-${index}`}
                            style={{ width: '50px', marginRight: '10px' }}
                        />
                    ))}
                </div>
                {errors.images && <Typography color="error">{errors.images}</Typography>}

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={handleSubmit}
                    className='!bg-[#1664c5] !font-bold'
                    disabled={loading}
                >
                    {data ? 'Update' : 'Create'}
                </Button>
            </Box>
        </Modal>
    );
}