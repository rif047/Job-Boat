import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';


const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 500,
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    overflowY: 'auto',
    borderRadius: 2,
};

export default function View({ open, onClose, viewData }) {
    const fieldsToView = [
        { label: 'Employee Name', value: viewData?.name },
        { label: 'Agent Name', value: viewData?.agent?.name },
        { label: 'Phone', value: viewData?.phone },
        { label: 'Alternative Phone', value: viewData?.alt_phone },
        { label: 'Address', value: viewData?.address },
        { label: 'Preferred City', value: viewData?.city },
        { label: 'Availability', value: viewData?.availability },
        { label: 'Experience', value: viewData?.experience },
        { label: 'Skills', value: viewData?.positions },
        { label: 'Right to work', value: viewData?.right_to_work },
        { label: 'Note', value: viewData?.note },
    ];

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} className='max-h-[90vh]'>
                <div className='flex justify-between mb-5'>
                    <Typography variant="h6" component="h2" className='!font-bold !flex !items-center !space-x-1'>
                        <span>{viewData ? viewData.name.toUpperCase() : 'Loading...'} Details</span>
                    </Typography>

                    <div onClick={onClose} className='cursor-pointer'>
                        <CloseIcon />
                    </div>
                </div>

                {viewData ? (
                    <>
                        {fieldsToView.map(
                            (field, index) =>
                                field.value && (
                                    <Typography key={index}>
                                        <strong>{field.label}:</strong> {field.value}
                                    </Typography>
                                )
                        )}
                    </>
                ) : (
                    <Typography>Loading...</Typography>
                )}
            </Box>
        </Modal>
    );
}
