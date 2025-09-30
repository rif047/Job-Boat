import { useState, useEffect } from 'react';
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

export default function AddEditEmployee({ open, onClose, data, refreshData }) {
    const EndPoint = 'employees';

    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [agents, setAgents] = useState([]);

    const capitalizeWords = (str) => { return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '); };


    useEffect(() => {
        if (data) {
            setFormData({ ...data });
        } else {
            setFormData({});
        }

        setErrors({});

        axios.get(`${import.meta.env.VITE_SERVER_URL}/api/agents`).then((res) => setAgents(res.data)).catch(() => toast.error("Failed to fetch agents."));
    }, [data]);

    const validate = () => {
        const newErrors = {};
        const { agent, name, phone, address, availability, experience, position, city, right_to_work } = formData;

        if (!agent) newErrors.agent = 'Agent is required.';
        if (!name) newErrors.name = 'Name is required.';
        if (!/^\d+$/.test(phone || '')) newErrors.phone = 'Phone number must contain numbers.';
        if (!address) newErrors.address = 'Address is required.';
        if (!availability) newErrors.availability = 'Availability is required.';
        if (!experience) newErrors.experience = 'Experience is required.';
        if (!right_to_work) newErrors.right_to_work = 'Right to work is required.';
        if (!city || city.length === 0) newErrors.city = 'Preferred Cities are required.';
        if (!position || position.length === 0) newErrors.position = 'Position are required.';

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
                ...backendErrors.includes?.('Phone number already exists') && { phone: 'Phone number already exists.' }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} className='max-h-[90vh]'>
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography className='!font-bold' variant="h6">{data ? 'Update Data' : 'Create New'}</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>



                {[
                    { name: 'name', label: 'Employee Name*' },
                    { name: 'phone', label: 'Phone*' },
                    { name: 'alt_phone', label: 'Alternative Phone' },
                    { name: 'address', label: 'Address*' },
                    { name: 'city', label: 'City*' },
                    { name: 'preferred_location', label: 'Preferred Location*' },
                    { name: 'position', label: 'Position*' },
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
                    select
                    label="Experience*"
                    name="experience"
                    fullWidth
                    margin="normal"
                    size="small"
                    value={formData.experience || ''}
                    onChange={handleChange}
                    error={!!errors.experience}
                    helperText={errors.experience}
                >
                    {[
                        "No Experience", "1 - 6 Months", "7 - 12 Months", "1 Year", "2 - 3 Years", "4 - 5 Years", "6 - 7 Years", "8 - 9 Years", "10+ Years",
                    ].map(exp => <MenuItem key={exp} value={exp}>{exp}</MenuItem>)}
                </TextField>


                <TextField
                    select
                    label="Right To Work*"
                    name="right_to_work"
                    fullWidth
                    margin="normal"
                    size="small"
                    value={formData.right_to_work || ''}
                    onChange={handleChange}
                    error={!!errors.right_to_work}
                    helperText={errors.right_to_work}
                >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                </TextField>


                <TextField
                    select
                    label="Availability*"
                    name="availability"
                    fullWidth
                    margin="normal"
                    size="small"
                    value={formData.availability || ''}
                    onChange={handleChange}
                    error={!!errors.availability}
                    helperText={errors.availability}
                >
                    <MenuItem value="Full-Time">Full-Time</MenuItem>
                    <MenuItem value="Part-Time">Part-Time</MenuItem>
                    <MenuItem value="Not Available">Not Available</MenuItem>
                </TextField>


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


                <TextField
                    fullWidth
                    label="Remark"
                    name="remark"
                    size="small"
                    margin="normal"
                    multiline
                    minRows={4}
                    value={formData.remark || ""}
                    onChange={handleChange}
                    error={!!errors.remark}
                    helperText={errors.remark}
                    sx={{ mb: 2 }}
                />


                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    className='!bg-[#1664c5] !font-bold'
                >
                    {data ? 'Update' : 'Create'}
                </Button>
            </Box>
        </Modal>
    );
}
