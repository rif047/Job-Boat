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