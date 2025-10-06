import { NavLink } from "react-router-dom";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import FortOutlinedIcon from '@mui/icons-material/FortOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

export default function SideMenuItem() {
    const userType = localStorage.getItem("userType");

    function Menu_Item(url, icon, name) {
        return (
            <NavLink
                to={url}
                className={({ isActive }) =>
                    `text-[#4f5664] flex items-center my-2 px-2 py-2 hover:bg-[#1664c5] hover:text-[#FFFFFF] hover:rounded-md ${isActive ? "bg-[#4ea863] text-[#FFFFFF] rounded-md" : ""
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
                {Menu_Item('/jobs', <WorkOutlineIcon />, 'Hot Leads')}
                {Menu_Item('/owners', <FortOutlinedIcon />, 'Owners')}
                {Menu_Item('/employees', <PeopleOutlineIcon />, 'Employees')}
                {Menu_Item('/pending_payment', <EventRepeatIcon />, 'Pending Payments')}
                {Menu_Item('/closed', <CreditScoreIcon />, 'Closed Jobs')}
                {Menu_Item('/lead_lost', <EventBusyIcon />, 'Lost Leads')}



                {userType !== "Operator" && (
                    <>
                        {Menu_Item('/agents', <SupportAgentOutlinedIcon />, 'Agents')}
                        {Menu_Item('/users', <SupervisedUserCircleOutlinedIcon />, 'Users')}
                        {Menu_Item('/settings', <SettingsOutlinedIcon />, 'Settings')}
                    </>
                )}
            </nav>
        </div>
    )
}
