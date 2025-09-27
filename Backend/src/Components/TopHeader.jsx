import { useState } from "react";
import { NavLink } from "react-router-dom";
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ListIcon from '@mui/icons-material/List';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SideMenu from './SideMenu';
import EastIcon from '@mui/icons-material/East';

export default function TopMenu() {
    let pathName = window.location.pathname.split('/').slice(1, 3).join('>');




    let [showMenu, setShowMenu] = useState(false);
    let [showlogout, setLogoutMenu] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };


    return (
        <div className="md:h-[60px] topMenu">
            <div className='container mx-auto px-2'>
                <div className='flex items-center justify-between h-[60px]'>
                    <div className="flex items-center">
                        <EastIcon />
                        <h1 className="tracking-[.2em] font-bold text-sm md:text-lg uppercase ml-1">
                            {pathName ? pathName : 'Dashboard'}
                        </h1>
                    </div>

                    <div className='flex'>
                        <div className={showlogout ? 'flex [&>*]:mr-4 [&>*]:px-2 [&>*]:py-1 [&>*]:bg-[#1664c5] [&>*]:text-[#e5e7eb] [&>*]:rounded-md animate-fade-left' : 'hidden'}>
                            <NavLink to={'/users'}><SettingsOutlinedIcon /> Settings</NavLink>
                            <button className="cursor-pointer" onClick={handleLogout}><LogoutOutlinedIcon /> Logout</button>
                        </div>

                        <div className="cursor-pointer hidden md:block py-1 [&>svg]:text-[25px] border border-gray-400 px-2 rounded-sm" onClick={() => { setLogoutMenu(!showlogout) }}><PersonRoundedIcon /></div>
                        <div className="cursor-pointer ml-7 block md:hidden p-2 border border-gray-400 rounded-md" onClick={() => { setShowMenu(!showMenu) }}><ListIcon /></div>
                    </div>
                </div>

            </div>

            <div className={showMenu ? 'md:hidden animate-fade-left' : 'hidden'}>

                <SideMenu />

                <div className='flex justify-between [&>*]:mx-5 [&>*]:my-4 [&>*]:px-2 [&>*]:py-1 [&>*]:bg-[#1664c5] [&>*]:text-[#e5e7eb] [&>*]:rounded-md'>
                    <NavLink to={'/users'}><SettingsOutlinedIcon /> </NavLink>
                    <button onClick={handleLogout}><LogoutOutlinedIcon /> </button>
                </div>
            </div>
        </div>
    )
}
