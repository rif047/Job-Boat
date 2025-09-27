import { NavLink } from "react-router-dom";
import SideMenuItem from "./SideMenuItem";


export default function SideMenu() {
    return (
        <div className="w-full md:w-[270px] md:h-screen overflow-scroll asideMenu">
            <div className="bg-[#1664c6] h-[60px] flex items-center">
                {/* <NavLink to={'/'} className='noActive'><img className="w-[150px] h-[50px] ml-5" src={'/Assets/Img/logo.png'} alt="FivoSoft Technology" /></NavLink> */}

                <NavLink to={'/'} className='noActive text-3xl tracking-widest font-[900] text-gray-200 ml-7'>JOB BOAT</NavLink>
            </div>

            <SideMenuItem />

        </div>
    )
}
