import React, { useState } from 'react';
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
    const [imgCurrentIndex, setImgCurrentIndex] = useState(0);

    const fieldsToView = [
        { label: 'Owner Name', value: `${viewData?.owner?.name}  (${viewData?.owner?.clientType})  (0${viewData?.owner?.phone})` },
        { label: 'Code', value: viewData?.code },
        { label: 'City', value: viewData?.city },
        { label: 'Size in Decimal', value: `${viewData?.decimal} Decimal` },
        { label: 'Size in SQFT', value: `${viewData?.sqft} SQFT` },
        { label: 'Property For', value: viewData?.property_for },
        { label: 'Property Type', value: viewData?.property_type },
        { label: 'Agreed Price', value: `${viewData?.agree_price} tk` },
        { label: 'Sell Price', value: `${viewData?.sell_price} tk` },
        {
            label: 'Expected Profit Margin',
            value: viewData?.agree_price && viewData?.sell_price
                ? `${((viewData.sell_price - viewData.agree_price) * 100 / viewData.agree_price).toFixed(2)}%`
                : '0%'
        },
        { label: 'Source', value: viewData?.source },
        { label: 'File/Image Link', value: viewData?.drive ? (<a href={viewData.drive} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}> Go to link </a>) : null },
        { label: 'Google Map', value: viewData?.map ? (<a href={viewData.map} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}> Go to map </a>) : null },
        { label: 'Comments', value: viewData?.comments },
    ];

    const EndPoint = 'properties';

    const handleNext = () => {
        if (viewData.images) {
            setImgCurrentIndex((prevIndex) => (prevIndex + 1) % viewData.images.length);
        }
    };

    const handlePrev = () => {
        if (viewData.images) {
            setImgCurrentIndex((prevIndex) =>
                prevIndex === 0 ? viewData.images.length - 1 : prevIndex - 1
            );
        }
    };

    const currentImageUrl = `${import.meta.env.VITE_SERVER_URL}/api/Images/${EndPoint}/${viewData?.images?.[imgCurrentIndex]}`;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} className='max-max-h-[90vh]'>
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

                        {viewData.images && viewData.images.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" sx={{ mb: 1, mt: 5, textAlign: 'center', fontWeight: 'bold' }}>
                                    Photos
                                </Typography>
                                <Box
                                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, }}  >

                                    <a href={currentImageUrl} target="_blank" rel="noopener noreferrer">
                                        <Box
                                            component="img"
                                            src={currentImageUrl}
                                            alt={`Image ${imgCurrentIndex + 1}`}
                                            sx={{
                                                height: 200,
                                                borderRadius: 1,
                                                objectFit: 'cover',
                                                boxShadow: 2,
                                            }}
                                        />
                                    </a>
                                </Box>
                                <Box sx={{ display: viewData.images.length > 1 ? 'flex' : 'none', justifyContent: 'space-between', alignItems: 'center' }}  >
                                    <button
                                        className='border border-[#1664c5] text-xs py-1 px-4 rounded-md shadow-xl hover:bg-gray-200'
                                        onClick={handlePrev}
                                    >
                                        {`${'< '} Previous`}
                                    </button>
                                    <button
                                        className='border border-[#1664c5] text-xs py-1 px-4 rounded-md shadow-xl hover:bg-gray-200'
                                        onClick={handleNext}
                                    >
                                        {`Next ${' >'}`}
                                    </button>
                                </Box>

                            </Box>
                        )}
                    </>
                ) : (
                    <Typography>Loading...</Typography>
                )}
            </Box>
        </Modal>
    );
}
