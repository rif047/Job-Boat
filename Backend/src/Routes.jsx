import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './Pages/Auth/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import Employees from './Pages/Employee/Employees';
import Owners from './Pages/Owner/Owners';
import Jobs from './Pages/Job/Jobs';
import Pending_Payment from './Pages/Job/Pending_Payment/Pending_Payments';
import Closed from './Pages/Job/Closed/Closeds';
import Lead_Lost from './Pages/Job/Lead_Lost/Lead_Losts';
import Agents from './Pages/Agent/Agents';
import Tasks from './Pages/Task/Tasks';
import Task_Report from './Pages/Task/Task_Report';
import Users from './Pages/User/Users';
import Settings from './Pages/Setting/Settings';

export default function MainRoutes() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userType, setUserType] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userType");

        if (token) {
            try {
                const { exp } = JSON.parse(atob(token.split('.')[1]));
                if (exp * 1000 > Date.now()) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    setLoggedIn(true);
                    setUserType(role);
                } else {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userType");
                }
            } catch (error) {
                localStorage.removeItem("token");
                localStorage.removeItem("userType");
            }
        }

        setLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        setLoggedIn(false);
        delete axios.defaults.headers.common['Authorization'];
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={loggedIn ? <Navigate to="/" replace /> : <Login setLoggedIn={setLoggedIn} />} />
            <Route path="/" element={loggedIn ? <Dashboard handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
            <Route path="/jobs" element={loggedIn ? <Jobs handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
            <Route path="/pending_payment" element={loggedIn ? <Pending_Payment handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
            <Route path="/closed" element={loggedIn ? <Closed handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
            <Route path="/lead_lost" element={loggedIn ? <Lead_Lost handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
            <Route path="/employees" element={loggedIn ? <Employees handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
            <Route path="/owners" element={loggedIn ? <Owners handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
            <Route path="/tasks" element={loggedIn ? <Tasks handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />


            {userType === "Admin" && (
                <>
                    <Route path="/task_report" element={loggedIn ? <Task_Report handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
                    <Route path="/agents" element={loggedIn ? <Agents handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
                    <Route path="/users" element={loggedIn ? <Users handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
                    <Route path="/settings" element={loggedIn ? <Settings handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
                </>
            )}

            <Route path="*" element={<Navigate to={loggedIn ? "/" : "/login"} replace />} />
        </Routes>
    );
}
