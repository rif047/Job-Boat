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
    const [agents, setAgents] = useState([]);
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
    });
    const [ownerModalOpen, setOwnerModalOpen] = useState(false);


    const capitalizeWords = (str) => str ? str.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ") : "";


    const fetchOwners = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/owners`);
            setOwners(res.data);
        } catch {
            toast.error("Failed to fetch owners.");
        }
    };


    useEffect(() => {
        if (data) {
            setFormData((prev) => ({ ...prev, ...data }));
        }

        setErrors({});

        axios.get(`${import.meta.env.VITE_SERVER_URL}/api/agents`).then((res) => setAgents(res.data)).catch(() => toast.error("Failed to fetch agents."));

        fetchOwners();
    }, [data]);

    const validate = () => {
        const newErrors = {};
        if (!formData.position) newErrors.position = "Job Position is required.";
        if (!formData.city) newErrors.city = "City is required.";
        if (!formData.owner) newErrors.owner = "Owner is required.";
        if (!formData.agent) newErrors.agent = "Agent is required.";
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
            toast.error(error.response?.data || "Failed to submit data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal open={open} onClose={onClose}>
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

                    <TextField
                        select
                        fullWidth
                        label="Accommodation"
                        name="accommodation"
                        size="small"
                        margin="normal"
                        value={formData.accommodation}
                        onChange={handleChange}
                    >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </TextField>

                    <TextField
                        select
                        fullWidth
                        label="Required Experience"
                        name="required_experience"
                        size="small"
                        margin="normal"
                        value={formData.required_experience}
                        onChange={handleChange}
                    >
                        {[
                            "No Experience",
                            "1 - 6 Months",
                            "7 - 12 Months",
                            "1 Year",
                            "2 - 3 Years",
                            "4 - 5 Years",
                            "6 - 7 Years",
                            "8 - 9 Years",
                            "10+ Years",
                        ].map((exp) => (
                            <MenuItem key={exp} value={exp}>
                                {exp}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        fullWidth
                        label="Need Right To Work?"
                        name="right_to_work"
                        size="small"
                        margin="normal"
                        value={formData.right_to_work}
                        onChange={handleChange}
                    >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </TextField>

                    <Autocomplete
                        fullWidth
                        size="small"
                        options={agents}
                        getOptionLabel={(option) => capitalizeWords(option.name)}
                        value={agents.find((a) => a.name === formData.agent) || null}
                        onChange={(e, newVal) =>
                            setFormData((prev) => ({ ...prev, agent: newVal ? newVal.name : "" }))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Agent*"
                                error={!!errors.agent}
                                helperText={errors.agent}
                            />
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
                        value={formData.remark}
                        onChange={handleChange}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="!bg-[#1664c5] !font-bold"
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
