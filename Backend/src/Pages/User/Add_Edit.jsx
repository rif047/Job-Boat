import { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField, MenuItem, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff, Close as CloseIcon } from '@mui/icons-material';
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

export default function AddEditUser({ open, onClose, data, refreshData }) {
    const EndPoint = 'users';

    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };


    useEffect(() => {
        if (data) {
            const { password, ...restData } = data;
            setFormData(restData);
        } else {
            setFormData({});
        }
        setErrors({});
    }, [data]);

    const validate = () => {
        const newErrors = {};
        const { name, phone, username, email, password, userType, answer } = formData;

        if (!name) newErrors.name = 'Name is required.';
        if (!phone) newErrors.phone = 'Phone is required.';
        if (!username) newErrors.username = 'Username is required.';
        if (!email) newErrors.email = 'Email is required.';
        if (!data && !password) newErrors.password = 'Password is required.';
        if (!answer) newErrors.answer = 'Secret Word is required.';
        if (!userType) newErrors.userType = 'User Type is required.';

        if (!/^\d+$/.test(phone || '')) newErrors.phone = 'Phone number must contain numbers.';
        if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { newErrors.email = 'Already exist || Invalid email address' }

        if (password && password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async () => {
        if (!validate() || loading) return;
        setLoading(true);

        try {
            const url = `${import.meta.env.VITE_SERVER_URL}/api/${EndPoint}${data?._id ? `/${data._id}` : ''}`;
            const method = data?._id ? 'patch' : 'post';

            const submissionData = { ...formData };
            if (data && !submissionData.password) {
                delete submissionData.password;
            }

            await axios[method](url, submissionData);
            toast.success(data?._id ? 'Updated successfully.' : 'Created successfully.');
            refreshData();
            onClose();
        } catch (error) {
            const backendErrors = error.response?.data || {};
            toast.error('Failed to update data.');
            setErrors({
                ...backendErrors.includes('Phone already exists. Use different one.') && { phone: 'Phone already exists. Use different one.' },
                ...backendErrors.includes('Email already exists. Use different one.') && { email: 'Email already exists. Use different one.' },
                ...backendErrors.includes('Username already exists. Use different one.') && { username: 'Username already exists. Use different one.' },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open}>
            <Box sx={modalStyle} className='max-h-[90vh]'>
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography className='!font-bold' variant="h6">{data ? 'Update Data' : 'Create New'} </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <TextField
                    select
                    label="User Type*"
                    name="userType"
                    fullWidth
                    margin="normal"
                    size="small"
                    style={{ marginBottom: '15px' }}
                    value={formData.userType || ''}
                    onChange={handleChange}
                    error={!!errors.userType}
                    helperText={errors.userType}
                >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Operator">Operator</MenuItem>
                </TextField>

                {[
                    { name: 'name', label: 'Name*' },
                    { name: 'phone', label: 'Phone*' },
                    { name: 'email', label: 'Email*' },
                    { name: 'username', label: 'Username*' },
                ].map(({ name, label, type = 'text' }) => (
                    <TextField
                        key={name}
                        name={name}
                        label={label}
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


                <TextField
                    key="password"
                    name="password"
                    label={data ? 'New Password' : 'Password*'}
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    margin="normal"
                    size="small"
                    value={formData.password || ''}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={togglePasswordVisibility} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />


                <TextField
                    fullWidth
                    label="Set a Secret Word*"
                    name="answer"
                    size="small"
                    margin="normal"
                    value={formData.answer}
                    onChange={handleChange}
                    error={!!errors.answer}
                    helperText={errors.answer}
                />

                <small className='text-gray-600 ml-2'>You'll need this to recover your password.</small>





                <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSubmit} disabled={loading} className='!bg-[#4ea863] !font-bold'>
                    {data ? 'Update' : 'Create'}
                </Button>
            </Box>
        </Modal>
    );
}