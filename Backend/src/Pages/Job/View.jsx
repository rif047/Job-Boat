import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    maxWidth: 600,
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    overflowY: 'auto',
    borderRadius: 2,
};

export default function View({ open, onClose, viewData }) {
    const capitalizeWords = (str) => str ? str.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ") : "";

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <div className="flex justify-between items-center mb-5 border-b border-gray-400 pb-2">
                    <Typography variant="h6" component="h2" className="!font-bold">
                        {viewData?.code || 'Job'} Details
                    </Typography>
                    <div onClick={onClose} className="cursor-pointer">
                        <CloseIcon />
                    </div>
                </div>

                {viewData ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Job Information
                            </Typography>
                            <Typography><strong>Position:</strong> {viewData.position}</Typography>
                            <Typography><strong>City:</strong> {viewData.city}</Typography>
                            <Typography><strong>Owner:</strong> {viewData.owner}</Typography>
                            <Typography><strong>Business Name:</strong> {viewData.business_name}</Typography>


                        </Box>

                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Requirements
                            </Typography>
                            <Typography><strong>Wage:</strong> {viewData.wages} £</Typography>
                            <Typography><strong>Accommodation:</strong> {viewData.accommodation}</Typography>
                            <Typography><strong>Required Experience:</strong> {viewData.required_experience}</Typography>
                            <Typography><strong>Right to Work:</strong> {viewData.right_to_work}</Typography>
                        </Box>

                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Progress & Remarks
                            </Typography>
                            <Typography><strong>Agent:</strong> {viewData.agent}</Typography>
                            <Typography><strong>Status:</strong> {viewData.status}</Typography>
                            <Typography>
                                <strong>Lead Created On:</strong>{' '}
                                {viewData.createdOn
                                    ? new Date(viewData.createdOn).toLocaleString('en-BD', {
                                        hour12: true,
                                        timeZone: 'Asia/Dhaka'
                                    })
                                    : ''
                                }
                            </Typography>

                            <Typography><strong>Remarks:</strong> {viewData.remark}</Typography>
                        </Box>
                    </Box>
                ) : (
                    <Typography>Loading...</Typography>
                )}
            </Box>
        </Modal>
    );
}