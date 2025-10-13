import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ListIcon from "@mui/icons-material/List";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import EastIcon from "@mui/icons-material/East";
import SideMenu from "./SideMenu";

export default function TopHeader() {
    const [showMenu, setShowMenu] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const [userName, setUserName] = useState("");

    const pathName = window.location.pathname.split("/").slice(1, 3).join(" > ");

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const user = JSON.parse(userData);
            setUserName(user.name || user.username || "");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userType");
        window.location.href = "/";
    };

    return (
        <header className="sticky top-0 z-40 bg-gradient-to-r from-white to-gray-50 shadow-sm border-b border-gray-200 backdrop-blur-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-[60px]">
                    <div className="flex items-center gap-2">
                        <EastIcon className="text-green-600" />
                        <h1 className="tracking-wide font-semibold text-gray-800 text-base md:text-lg uppercase">
                            {pathName || "Dashboard"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="relative hidden md:flex items-center">
                            <button
                                onClick={() => setShowLogout(!showLogout)}
                                className="flex items-center gap-2 py-1.5 px-4 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                            >
                                <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full">
                                    <PersonRoundedIcon className="text-green-600" fontSize="small" />
                                </div>
                                {userName && (
                                    <span className="font-medium text-gray-700 capitalize">{userName}</span>
                                )}
                            </button>

                            {showLogout && (
                                <div className="absolute right-0 top-12 w-44 bg-white shadow-lg rounded-xl border border-gray-100 animate-fade-down z-30">
                                    <NavLink
                                        to="/settings"
                                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        <SettingsOutlinedIcon fontSize="small" /> Settings
                                    </NavLink>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                                    >
                                        <LogoutOutlinedIcon fontSize="small" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            className="md:hidden p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <ListIcon />
                        </button>
                    </div>
                </div>
            </div>

            {showMenu && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-sm animate-fade-down">
                    <SideMenu />
                    <div className="flex justify-around py-3 border-t border-gray-100">
                        <NavLink
                            to="/settings"
                            className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                        >
                            <SettingsOutlinedIcon />
                        </NavLink>
                        <button
                            onClick={handleLogout}
                            className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        >
                            <LogoutOutlinedIcon />
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
