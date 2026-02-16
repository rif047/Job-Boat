import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import {
    Business,
    LocationOn,
    Person,
    Link as LinkIcon,
    Work,
    Badge,
    AssignmentInd,
    PersonPin,
    Event,
    Description,
    MonetizationOn,
    Apartment,
    WorkHistory,
    Gavel,
    SupportAgent,
    HourglassEmpty,
    Note
} from '@mui/icons-material';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    maxWidth: 800,
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    p: 0,
    overflow: 'hidden',
};

export default function View({ open, onClose, viewData }) {
    const sections = [
        {
            title: "Job Information",
            icon: <Work className="text-white text-base" />,
            items: [
                { label: "Owner", value: viewData?.owner, icon: <Person className="text-sm" /> },
                { label: "Business Name", value: viewData?.business_name, icon: <Business className="text-sm" /> },
                { label: "Position", value: viewData?.position, icon: <AssignmentInd className="text-sm" /> },
                { label: "City", value: viewData?.city, icon: <LocationOn className="text-sm" /> },
                { label: "Platform", value: viewData?.source, icon: <PersonPin className="text-sm" /> },
                { label: "Source", value: viewData?.sourceLink, icon: <LinkIcon className="text-sm" />, isLink: true },
            ],
        },
        {
            title: "Requirements",
            icon: <Gavel className="text-white text-base" />,
            items: [
                { label: "Wage", value: viewData?.wages ? `£${viewData.wages}` : 'N/A', icon: <MonetizationOn className="text-sm" /> },
                { label: "Accommodation", value: viewData?.accommodation, icon: <Apartment className="text-sm" /> },
                { label: "Required Experience", value: viewData?.required_experience, icon: <WorkHistory className="text-sm" /> },
                { label: "Right to Work", value: viewData?.right_to_work, icon: <Badge className="text-sm" /> },
            ],
        },
        {
            title: "Progress Details",
            icon: <HourglassEmpty className="text-white text-base" />,
            items: [
                { label: "Agent", value: viewData?.agent, icon: <SupportAgent className="text-sm" /> },
                { label: "Status", value: viewData?.status, icon: <Badge className="text-sm" /> },
                {
                    label: "Created On",
                    value: viewData?.createdOn ? new Date(viewData.createdOn).toISOString().replace("T", " ").split(".")[0] : 'N/A',
                    icon: <Event className="text-sm" />
                },
                {
                    label: "Updated On",
                    value: viewData?.updatedOn ? new Date(viewData.updatedOn).toISOString().replace("T", " ").split(".")[0] : 'N/A',
                    icon: <Event className="text-sm" />
                },

            ],
        },
        {
            title: "Remarks",
            icon: <Note className="text-white text-base" />,
            isRemarks: true,
            items: [
                { label: "Remarks", value: viewData?.remark, icon: <Description className="text-sm" />, isRemarks: true },
            ],
        },
    ];

    const renderItem = (item) => (
        <div className="flex items-start gap-2">
            <div className="p-1 bg-gray-100 rounded mt-0.5">{item.icon}</div>
            <div className="flex-1 min-w-0">
                <Typography variant="caption" className="text-gray-500 font-medium block">
                    {item.label}
                </Typography>
                {item.isLink && item.value ? (
                    <a href={item.value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline text-sm truncate block" title={item.value}>
                        {item.value}
                    </a>
                ) : (
                    <Typography className="text-gray-800 text-sm break-words">{item.value || 'N/A'}</Typography>
                )}
            </div>
        </div>
    );

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <div className="sticky top-0 z-10 bg-gradient-to-r from-[#3e9255] to-[#50a864] text-white p-3 flex justify-between items-center">
                    <Typography variant="h6 font-bold text-lg" className="font-bold">{viewData?.code || 'Job'} ({viewData?.lead_type || 'Lead Type'})</Typography>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
                        <CloseIcon className="text-white text-lg" />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-64px)] p-3 space-y-3">
                    {viewData ? (
                        sections.map((section, i) => (
                            <div key={i} className={`bg-white border border-gray-200 rounded-lg shadow-sm ${section.isRemarks ? '' : 'hover:shadow-md transition-shadow'}`}>
                                <div className="flex items-center gap-2 p-1 bg-gradient-to-r from-[#3e9255] to-[#50a864] text-white rounded-t-lg px-2">
                                    <div className="p-1 bg-white/20 rounded">{section.icon}</div>
                                    <Typography variant="subtitle2" className="font-semibold">{section.title}</Typography>
                                </div>

                                <div className="p-4">
                                    {section.isRemarks ? (
                                        <Typography className="text-gray-800 text-sm whitespace-pre-line break-words min-h-[100px] p-2">
                                            {section.items[0]?.value || 'No remarks added'}
                                        </Typography>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {section.items.map(renderItem)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-center items-center py-10">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3e9255] mx-auto"></div>
                                <Typography className="mt-2 text-gray-600 text-sm">Loading details...</Typography>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <button onClick={onClose} className="px-4 py-1 bg-gradient-to-r from-[#3e9255] to-[#50a864] hover:from-[#2e7245] hover:to-[#409854] text-white rounded text-sm font-medium cursor-pointer">
                            Close
                        </button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}