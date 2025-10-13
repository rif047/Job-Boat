import { NavLink } from "react-router-dom";

import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import WhatshotOutlinedIcon from '@mui/icons-material/WhatshotOutlined';
import Person4OutlinedIcon from '@mui/icons-material/Person4Outlined';

export default function SideMenuItem() {
    const userType = localStorage.getItem("userType");

    const baseItem = "group relative flex items-center gap-3 text-[15px] font-medium px-4 py-1.5 rounded-xl transition-all duration-300 cursor-pointer";
    const activeItem = "bg-gradient-to-r from-[#4ea863] to-[#3b8d52] text-white shadow-[0_4px_15px_rgba(78,168,99,0.2)] scale-[1.02]";
    const inactiveItem = "text-gray-700 hover:text-[#1664c5] hover:bg-white/70 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:scale-[1.01] backdrop-blur-sm";

    const iconWrapper = "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300";
    const baseIcon = "text-[22px] transition-all duration-300";

    const Menu_Item = (url, Icon, name) => (
        <NavLink
            to={url}
            className={({ isActive }) =>
                `${baseItem} ${isActive ? activeItem : inactiveItem}`
            }
        >
            {({ isActive }) => (
                <>
                    <div className={`${iconWrapper} ${isActive ? "bg-white/20" : "bg-[#4ea863]/10 group-hover:bg-[#1664c5]/10"}`}                    >
                        <Icon
                            className={`${baseIcon} ${isActive
                                ? "text-white scale-110 drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                                : "text-[#4ea863] group-hover:text-[#1664c5] group-hover:scale-110"
                                }`}
                        />
                    </div>
                    <span className={`tracking-wide transition-all duration-300 ${isActive ? "font-semibold" : "font-medium"}`} >
                        {name}
                    </span>

                    {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[4px] bg-white/90 rounded-r-md shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300"></span>
                    )}
                </>
            )}
        </NavLink>
    );

    return (
        <nav className="space-y-2 px-1">
            <p className="text-[11px] uppercase font-semibold text-gray-400 mb-2 ml-4 tracking-[0.15em]">
                Main Menu
            </p>

            <div className="space-y-1">
                {Menu_Item('/', SpaceDashboardOutlinedIcon, 'Dashboard')}
                {Menu_Item('/jobs', WhatshotOutlinedIcon, 'Hot Leads')}
                {Menu_Item('/owners', Person4OutlinedIcon, 'Owners')}
                {Menu_Item('/employees', GroupsOutlinedIcon, 'Employees')}
                {Menu_Item('/pending_payment', PaymentsOutlinedIcon, 'Pending Payments')}
                {Menu_Item('/closed', DoneAllOutlinedIcon, 'Closed Jobs')}
                {Menu_Item('/lead_lost', EventBusyIcon, 'Lost Leads')}
            </div>

            {userType !== "Agent" && (
                <>
                    <p className="text-[11px] uppercase font-semibold text-gray-400 mt-6 mb-2 ml-4 tracking-[0.15em]">
                        Admin
                    </p>

                    <div className="space-y-1">
                        {Menu_Item('/agents', SupportAgentOutlinedIcon, 'Agents')}
                        {Menu_Item('/users', ManageAccountsOutlinedIcon, 'Users')}
                        {Menu_Item('/settings', SettingsSuggestOutlinedIcon, 'Settings')}
                    </div>
                </>
            )}

            <div className="mt-6 border-t border-gray-200/50"></div>
        </nav>
    );
}
