import { useState, useEffect } from "react";
import { Box, Button, Typography, Modal, IconButton, TextField, Autocomplete, MenuItem, } from "@mui/material";
import { Close as CloseIcon, Add as AddIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import AddEditOwner from "../Owner/Add_Edit";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 500,
    bgcolor: "#fdfdfd",
    boxShadow: 24,
    p: 3,
    borderRadius: 2,
    overflowY: "auto",
};

export default function AddEdit({ open, onClose, data, refreshData }) {
    const EndPoint = "jobs";

    const [errors, setErrors] = useState({});
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        position: "",
        city: "",
        business_name: "",
        owner: "",
        wages: "",
        accommodation: "",
        required_experience: "",
        right_to_work: "",
        agent: "",
        remark: "",
        source: "",
        source_link: "",
    });
    const [ownerModalOpen, setOwnerModalOpen] = useState(false);


    const fetchOwners = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/owners`);
            setOwners(res.data);
        } catch {
            toast.error("Failed to fetch owners.");
        }
    };


    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));

        if (data) {
            setFormData((prev) => ({ ...prev, ...data, agent: data.agent || loggedUser?.name }));
        } else {
            setFormData({ agent: loggedUser?.name || '' });
        }

        setErrors({});

        fetchOwners && fetchOwners();
    }, [data]);


    const validate = () => {
        const newErrors = {};
        if (!formData.position) newErrors.position = "Job Position is required.";
        if (!formData.city) newErrors.city = "City is required.";
        if (!formData.owner) newErrors.owner = "Owner is required.";
        if (!formData.agent) newErrors.agent = "Agent is required.";
        if (!formData.source) newErrors.source = "Source is required.";
        if (formData.wages && isNaN(parseFloat(formData.wages))) { newErrors.wages = "Wage must be a number."; }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async () => {
        if (!validate() || loading) return;
        setLoading(true);

        try {
            const url = `${import.meta.env.VITE_SERVER_URL}/api/${EndPoint}${data?._id ? `/${data._id}` : ""
                }`;
            const method = data?._id ? "patch" : "post";

            await axios[method](url, formData, {
                headers: { "Content-Type": "application/json" },
            });

            toast.success(
                data?._id ? "Updated successfully." : "Created successfully."
            );
            refreshData();
            onClose();
        } catch (error) {
            const backendErrors = error.response?.data || {};
            toast.error(error.response?.data || "Failed to submit data.");
            setErrors({
                ...backendErrors.includes?.('Source link already exists') && { source_link: 'Source link already exists.' }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal open={open}>
                <Box sx={modalStyle} className="max-h-[90vh]">
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography className="!font-bold" variant="h6">
                            {data ? "Update Job" : "Create New Job"}
                        </Typography>
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box display="flex" gap={1} alignItems="center">
                        <Autocomplete
                            fullWidth
                            size="small"
                            options={owners}
                            getOptionLabel={(option) => `${option.name} (${option.phone})`}
                            value={
                                owners.find((o) => `${o.name} (${o.phone})` === formData.owner) ||
                                null
                            }
                            onChange={(e, newVal) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    owner: newVal ? `${newVal.name} (${newVal.phone})` : "",
                                }))
                            }
                            autoHighlight
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Owner*"
                                    error={!!errors.owner}
                                    helperText={errors.owner}
                                />
                            )}
                        />

                        <IconButton
                            color="primary"
                            onClick={() => setOwnerModalOpen(true)}
                        >
                            <AddIcon />
                        </IconButton>
                    </Box>

                    <TextField
                        fullWidth
                        label="Business Name"
                        name="business_name"
                        size="small"
                        margin="normal"
                        value={formData.business_name}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        label="City"
                        name="city"
                        size="small"
                        margin="normal"
                        value={formData.city}
                        onChange={handleChange}
                        error={!!errors.city}
                        helperText={errors.city}
                    />

                    <TextField
                        fullWidth
                        label="Position"
                        name="position"
                        size="small"
                        margin="normal"
                        value={formData.position}
                        onChange={handleChange}
                        error={!!errors.position}
                        helperText={errors.position}
                    />

                    <TextField
                        fullWidth
                        label="Wage"
                        name="wages"
                        type="number"
                        size="small"
                        margin="normal"
                        value={formData.wages}
                        onChange={handleChange}
                        error={!!errors.wages}
                        helperText={errors.wages}
                    />

                    <Autocomplete
                        fullWidth
                        size="small"
                        options={["Yes", "No"]}
                        value={formData.accommodation || null}
                        onChange={(e, newVal) =>
                            setFormData((prev) => ({ ...prev, accommodation: newVal || "" }))
                        }
                        autoHighlight
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Accommodation"
                                margin="normal"
                                error={!!errors.accommodation}
                                helperText={errors.accommodation}
                            />
                        )}
                    />

                    <Autocomplete
                        fullWidth
                        size="small"
                        options={[
                            "No Experience",
                            "1 - 6 Months",
                            "7 - 12 Months",
                            "1 Year",
                            "2 - 3 Years",
                            "4 - 5 Years",
                            "6 - 7 Years",
                            "8 - 9 Years",
                            "10+ Years",
                        ]}
                        value={formData.required_experience || null}
                        onChange={(e, newVal) =>
                            setFormData((prev) => ({ ...prev, required_experience: newVal || "" }))
                        }
                        autoHighlight
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Required Experience"
                                margin="normal"
                                error={!!errors.required_experience}
                                helperText={errors.required_experience}
                            />
                        )}
                    />

                    <Autocomplete
                        fullWidth
                        size="small"
                        options={["Yes", "No"]}
                        value={formData.right_to_work || null}
                        onChange={(e, newVal) =>
                            setFormData((prev) => ({ ...prev, right_to_work: newVal || "" }))
                        }
                        autoHighlight
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Need Right To Work?"
                                margin="normal"
                                error={!!errors.right_to_work}
                                helperText={errors.right_to_work}
                            />
                        )}
                    />

                    <Autocomplete
                        fullWidth
                        size="small"
                        options={[
                            "Facebook",
                            "LinkedIn",
                            "Instagram",
                            "TikTok",
                            "Telegram",
                            "Referral",
                            "Other",
                        ]}
                        value={formData.source || null}
                        onChange={(e, newVal) =>
                            setFormData((prev) => ({ ...prev, source: newVal || "" }))
                        }
                        autoHighlight
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Source*"
                                margin="normal"
                                error={!!errors.source}
                                helperText={errors.source}
                            />
                        )}
                    />



                    <TextField
                        fullWidth
                        label="Source Link"
                        name="source_link"
                        size="small"
                        margin="normal"
                        value={formData.source_link}
                        onChange={handleChange}
                        error={!!errors.source_link}
                        helperText={errors.source_link}
                    />


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

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="!bg-[#4ea863] hover:!bg-green-700 !font-bold"
                    >
                        {data ? "Update" : "Create"}
                    </Button>


                </Box>
            </Modal>
            <AddEditOwner
                open={ownerModalOpen}
                onClose={() => {
                    setOwnerModalOpen(false);
                    fetchOwners();
                }}
                refreshData={fetchOwners}
            />
        </>
    );
}
