import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import FortOutlinedIcon from '@mui/icons-material/FortOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PictureInPictureAltOutlinedIcon from '@mui/icons-material/PictureInPictureAltOutlined';

export default function SideMenuItem() {
    const userType = localStorage.getItem("userType");
    const city = useLocation();
    const [openExtension, setOpenExtension] = useState(false);

    useEffect(() => {
        if (
            city.pathname.startsWith("/agents") ||
            city.pathname.startsWith("/cities") ||
            city.pathname.startsWith("/positions")
        ) {
            setOpenExtension(true);
        }
    }, [city.pathname]);

    function Menu_Item(url, icon, name) {
        return (
            <NavLink
                to={url}
                className={({ isActive }) =>
                    `text-[#4f5664] flex items-center my-2 px-2 py-2 hover:bg-[#1664c6] hover:text-[#FFFFFF] hover:rounded-md ${isActive ? "bg-[#1664c6] text-[#FFFFFF] rounded-md" : ""
                    }`
                }
            >
                {icon}
                <p className="ml-2">{name}</p>
            </NavLink>
        )
    }

    return (
        <div className="mx-3 my-4">
            <nav>
                {Menu_Item('/', <DashboardOutlinedIcon />, 'Dashboard')}
                {Menu_Item('/properties', <WorkOutlineIcon />, 'Job Leads')}
                {Menu_Item('/offering', <WorkHistoryIcon />, 'In Progress')}
                {Menu_Item('/solds', <EventRepeatIcon />, 'Pending Payments')}
                {Menu_Item('/solds', <CreditScoreIcon />, 'Closed')}
                {Menu_Item('/solds', <EventBusyIcon />, 'Cancelled')}
                {Menu_Item('/owners', <FortOutlinedIcon />, 'Owners')}
                {Menu_Item('/employees', <PeopleOutlineIcon />, 'Employees')}


                <div onClick={() => setOpenExtension(!openExtension)} className="cursor-pointer flex items-center justify-between text-[#4f5664] my-2 px-2 py-2 hover:bg-[#1664c6] hover:text-[#FFFFFF] hover:rounded-md">
                    <div className="flex items-center">
                        <LocalAtmIcon />
                        <p className="ml-2">Extension</p>
                    </div>
                    {openExtension ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </div>

                {openExtension && (
                    <div className="ml-6 border-l border-gray-500 pl-2">
                        {Menu_Item('/agents', <SupportAgentOutlinedIcon />, 'Agents')}
                        {Menu_Item('/cities', <LocationOnOutlinedIcon />, 'Cities')}
                        {Menu_Item('/positions', <PictureInPictureAltOutlinedIcon />, 'Positions')}
                    </div>
                )}

                {userType !== "Operator" && (
                    <>
                        {Menu_Item('/users', <SupervisedUserCircleOutlinedIcon />, 'Users')}
                        {Menu_Item('/settings', <SettingsOutlinedIcon />, 'Settings')}
                    </>
                )}
            </nav>
        </div>
    )
}
