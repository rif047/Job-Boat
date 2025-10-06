import { NavLink } from "react-router-dom";
import SideMenuItem from "./SideMenuItem";


export default function SideMenu() {
    return (
        <div className="w-full md:w-[270px] md:h-screen overflow-scroll asideMenu">
            <div className="bg-[#4ea863] h-[60px] flex items-center mb-6">
                <NavLink to={'/'} className='noActive'><img className="w-[170px] h-[30px] ml-5" src={'/Assets/Img/a.png'} alt="FivoSoft Technology" /></NavLink>

                {/* <NavLink to={'/'} className='noActive text-3xl tracking-widest font-[900] text-gray-200 ml-7'>JOB BOAT</NavLink>  */}
                <span className="text-sm text-gray-200">v{import.meta.env.VITE_VERSION}</span>
            </div>

            <SideMenuItem />

        </div>
    )
}
