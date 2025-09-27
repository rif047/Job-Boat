import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, IconButton, TextField, Autocomplete, MenuItem } from '@mui/material';
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
    const EndPoint = 'properties';
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [owners, setClients] = useState([]);
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
        axios.get(`${import.meta.env.VITE_SERVER_URL}/api/owners`)
            .then(response => setClients(response.data))
            .catch(error => toast.error('Failed to fetch owners.'));

        if (data?.images) setSelectedImages(data.images);
        if (data?.owner?._id) setFormData(prev => ({ ...prev, owner: data.owner._id }));
    }, [data]);

    const validate = () => {
        const newErrors = {};
        const { name, code, city, property_type, property_for, agree_price, sell_price, decimal, sqft, owner } = formData;

        if (!name) newErrors.name = 'Name is required.';
        if (!code) newErrors.code = 'Code is required.';
        if (!city) newErrors.city = 'City is required.';
        if (!agree_price) newErrors.agree_price = 'Agreed Price is required.';
        if (!sell_price) newErrors.sell_price = 'Sell Price is required.';
        if (!property_type) newErrors.property_type = 'Property Type is required.';
        if (!property_for) newErrors.property_for = 'Property For is required.';
        if (!decimal) newErrors.decimal = 'Property Size is required.';
        if (!owner) newErrors.owner = 'Owner is required.';

        if (agree_price && isNaN(parseFloat(agree_price))) { newErrors.agree_price = 'Must be a number.'; }
        if (decimal && isNaN(parseFloat(decimal))) { newErrors.decimal = 'Must be a number.'; }
        if (sqft && isNaN(parseFloat(sqft))) { newErrors.sqft = 'Must be a number.'; }

        if (selectedImages.length > 5) newErrors.images = 'You can upload up to 5 images.';

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
            toast.error('You can upload up to 5 images.');
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
            if (error.response && error.response.data) {
                const errorMessage = error.response.data;

                if (errorMessage === 'Name already exists') {
                    setErrors(prev => ({ ...prev, name: 'This property name already exists.' }));
                }
                else if (errorMessage === 'Code already exists') {
                    setErrors(prev => ({ ...prev, code: 'This property code already exists.' }));
                }
                else {
                    toast.error(errorMessage || 'Failed to submit data.');
                }
            } else {
                toast.error('Failed to submit data.');
            }
        } finally {
            setLoading(false);
        }
    };

    const formFields = [
        { label: 'Property Name*', name: 'name', type: 'text' },
        { label: 'City*', name: 'city', type: 'text' },
        { label: 'Size in Decimal*', name: 'decimal', type: 'number' },
        { label: 'Size in SQFT', name: 'sqft', type: 'number' },
        { label: 'Agreed Price*', name: 'agree_price', type: 'number' },
        { label: 'Expected Sell Price*', name: 'sell_price', type: 'number' },
        { label: 'Images Link', name: 'drive', type: 'text' },
        { label: 'Google Map Link', name: 'map', type: 'text' },
        { label: 'Source', name: 'source', type: 'text' },
        { label: 'Describe Property', name: 'comments', type: 'text' },
    ];

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} className='max-h-[90vh]'>
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography className='!font-bold' variant="h6">{data ? 'Update Data' : 'Create New'}</Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Box>

                <Autocomplete
                    fullWidth
                    size="small"
                    options={owners}
                    getOptionLabel={(option) => capitalizeWords(option.name)}
                    value={owners.find(v => v._id === formData.owner) || null}
                    onChange={(event, newValue) => {
                        handleChange({
                            target: {
                                name: "owner",
                                value: newValue ? newValue._id : ""
                            }
                        });
                    }}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Owner*"
                            error={!!errors.owner}
                            helperText={errors.owner}
                        />
                    )}
                />

                <TextField
                    select
                    label="Property For*"
                    name="property_for"
                    fullWidth
                    margin="normal"
                    size="small"
                    style={{ marginBottom: '15px' }}
                    value={formData.property_for || ''}
                    onChange={handleChange}
                    error={!!errors.property_for}
                    helperText={errors.property_for}
                >
                    <MenuItem value="Sell">Sell</MenuItem>
                    <MenuItem value="Let">Let</MenuItem>
                </TextField>

                <Autocomplete
                    fullWidth
                    size="small"
                    options={[
                        "House", "Flat", "Apartment", "Duplex", "Villa/Bungalow", "Office",
                        "Shop", "Showroom", "Hotel", "Restaurant", "Warehouse", "Empty Land",
                        "Residential Land", "Commercial Land", "Agricultural Land", "Other"
                    ]}
                    style={{ marginBottom: '10px' }}
                    getOptionLabel={(option) => option}
                    value={formData.property_type || null}
                    onChange={(event, newValue) => {
                        handleChange({
                            target: {
                                name: "property_type",
                                value: newValue || ""
                            }
                        });
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Property Type*"
                            error={!!errors.property_type}
                            helperText={errors.property_type}
                        />
                    )}
                />

                <TextField
                    label="Code*"
                    name="code"
                    type="text"
                    fullWidth
                    margin="normal"
                    size="small"
                    value={formData.code || ''}
                    onChange={handleChange}
                    error={!!errors.code}
                    helperText={errors.code}
                    disabled={!!data?._id}
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

                <h2 className='mt-8 mb-2 text-lg'>Select Property Images:</h2>
                <input
                    type="file"
                    accept="image/jpeg, image/png"
                    multiple
                    onChange={handleImageChange}
                    style={{ marginBottom: '10px', padding: '2px' }}
                />
                <Typography variant="caption" display="block" gutterBottom>
                    Only JPG/PNG files (max 5 images & 10MB each)
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

                <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSubmit} disabled={loading} className='!bg-[#1664c5] !font-bold'>
                    {data ? 'Update' : 'Create'}
                </Button>
            </Box>
        </Modal>
    );
}