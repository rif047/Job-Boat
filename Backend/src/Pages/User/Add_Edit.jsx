import { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField, IconButton, InputAdornment, Autocomplete } from '@mui/material';
import { Visibility, VisibilityOff, Close as CloseIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { USER_TYPE_OPTIONS, formatUserTypes, normalizeUserTypes } from '../../Utils/userAccess';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 600,
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
    const selectedUserTypes = normalizeUserTypes(formData.userType);
    const hasRestrictedTypeSelected = selectedUserTypes.some((type) => (
        ['Indian Lead Agent', 'Care Agent', 'Other'].includes(type)
    ));

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };


    useEffect(() => {
        if (data) {
            const { password, ...restData } = data;
            setFormData({ ...restData, userType: normalizeUserTypes(restData.userType) });
        } else {
            setFormData({ userType: [] });
        }
        setErrors({});
    }, [data]);

    const validate = () => {
        const newErrors = {};
        const { name, phone, username, email, password, userType, secret_code, designation, remark } = formData;

        if (!name) newErrors.name = 'Name is required.';
        if (!phone) newErrors.phone = 'Phone is required.';
        if (!username) newErrors.username = 'Username is required.';
        if (!email) newErrors.email = 'Email is required.';
        if (!designation) newErrors.designation = 'Designation is required.';
        if (!data && !password) newErrors.password = 'Password is required.';
        if (!secret_code) newErrors.secret_code = 'Secret Word is required.';
        if (!normalizeUserTypes(userType).length) newErrors.userType = 'User Type is required.';


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

    const handleUserTypesChange = (_, value) => {
        const normalizedUserTypes = normalizeUserTypes(value);
        const nextUserTypes = normalizedUserTypes.includes('Admin')
            ? ['Admin']
            : normalizedUserTypes.includes('Agent')
                ? ['Agent']
                : normalizedUserTypes;

        setFormData((prev) => ({ ...prev, userType: nextUserTypes }));
        setErrors((prev) => ({ ...prev, userType: '' }));
    };

    const handleSubmit = async () => {
        if (!validate() || loading) return;
        setLoading(true);

        try {
            const url = `${import.meta.env.VITE_SERVER_URL}/api/${EndPoint}${data?._id ? `/${data._id}` : ''}`;
            const method = data?._id ? 'patch' : 'post';

            const submissionData = { ...formData };
            submissionData.userType = normalizeUserTypes(submissionData.userType);
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
            <Box sx={modalStyle} className='max-h-[95vh]'>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                    sx={{ position: 'sticky', top: 0, backgroundColor: '#fdfdfd', zIndex: 10, borderBottom: '1px solid #ddd', pb: 1 }}
                >
                    <Typography className='!font-bold' variant="h6">
                        {data ? 'Update Data' : 'Create New'}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    options={USER_TYPE_OPTIONS}
                    value={selectedUserTypes}
                    getOptionDisabled={(option) => {
                        if (selectedUserTypes.includes('Admin')) return option !== 'Admin';
                        if (selectedUserTypes.includes('Agent')) return option !== 'Agent';
                        if (hasRestrictedTypeSelected && (option === 'Admin' || option === 'Agent')) return true;
                        return false;
                    }}
                    onChange={handleUserTypesChange}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="User Type*"
                            margin="normal"
                            size="small"
                            error={!!errors.userType}
                            helperText={errors.userType}
                        />
                    )}
                    fullWidth
                    sx={{ mb: 1.5 }}
                />

                {!!selectedUserTypes.length && (
                    <small className='text-gray-600 ml-2'>Selected: {formatUserTypes(formData.userType)}</small>
                )}

                <Box sx={{ mt: 1, mb: 1.5, px: 1.5, py: 1, border: '1px solid #e5e7eb', borderRadius: 1, backgroundColor: '#f9fafb' }}>
                    <Typography variant="caption" sx={{ display: 'block', color: '#4b5563', fontWeight: 600 }}>
                        User Type Instructions
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', color: '#6b7280' }}>
                        Agent: full access (single selection only).
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', color: '#6b7280' }}>
                        Indian Lead Agent: Indian Lead + blank lead type.
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', color: '#6b7280' }}>
                        Care Agent: Care Lead only.
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', color: '#6b7280' }}>
                        Other: Other lead only.
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', color: '#6b7280' }}>
                        Multi-select is allowed for non-Admin and non-Agent types.
                    </Typography>
                </Box>

                {[
                    { name: 'name', label: 'Name*' },
                    { name: 'phone', label: 'Phone*' },
                    { name: 'email', label: 'Email*' },
                    { name: 'designation', label: 'Designation*' },
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
                        disabled={data && name === 'username'}
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
                    name="secret_code"
                    size="small"
                    margin="normal"
                    value={formData.secret_code}
                    onChange={handleChange}
                    error={!!errors.secret_code}
                    helperText={errors.secret_code}
                />

                <small className='text-gray-600 ml-2'>You'll need this to recover your password.</small>

                <TextField
                    fullWidth
                    label="Remark"
                    name="remark"
                    size="small"
                    margin="normal"
                    multiline
                    minRows={8}
                    value={formData.remark}
                    onChange={handleChange}
                />





                <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSubmit} disabled={loading} className='!bg-[#4ea863] hover:!bg-green-700 !font-bold'>
                    {data ? 'Update' : 'Create'}
                </Button>
            </Box>
        </Modal>
    );
}
