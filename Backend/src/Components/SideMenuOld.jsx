import { NavLink } from "react-router-dom";
import SideMenuItem from "./SideMenuItem";

export default function SideMenu() {
    return (
        <aside className="w-full md:w-[260px] h-screen bg-white/90 backdrop-blur-md border-r border-gray-200 flex flex-col shadow-[0_8px_20px_rgba(0,0,0,0.05)] transition-all duration-300">

            <div className="h-[60px] flex items-center justify-between px-5 bg-gradient-to-r from-[#4ea863] to-[#3b8d52] shadow-[0_4px_12px_rgba(78,168,99,0.3)]">
                <NavLink to="/" className="flex items-center space-x-2 hover:opacity-90 transition-all duration-300"                >
                    <img
                        className="w-[160px] h-[28px] object-contain drop-shadow-[0_1px_4px_rgba(255,255,255,0.3)]"
                        src="/Assets/Img/a.png"
                        alt="FivoSoft Technology"
                    />
                </NavLink>

                <span className="text-[15px] text-white/90 font-medium tracking-wide select-none">
                    v{import.meta.env.VITE_VERSION}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-5 scrollbar-thin scrollbar-thumb-[#4ea863]/50 scrollbar-track-transparent">
                <SideMenuItem />
            </div>

            <div className="h-[50px] relative bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 flex items-center justify-center text-[13px] font-medium text-gray-500 overflow-hidden group">
                <span className="transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2">
                    © 2025 JobBoat
                </span>

                <span className="absolute transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 text-[#4ea863] font-semibold">
                    Cube In Cloud
                </span>

                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#4ea863]/0 via-[#4ea863]/40 to-[#3b8d52]/0 opacity-70"></div>
            </div>
        </aside>
    );
}


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
