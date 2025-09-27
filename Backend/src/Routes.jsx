import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './Pages/Auth/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import Employees from './Pages/Employee/Employees';
import Owners from './Pages/Owner/Owners';
import Agent_Properties from './Pages/Agent_Property/Agent_Properties';
import Properties from './Pages/Property/Properties';
import Agents from './Pages/Agent/Agents';
import Cities from './Pages/City/Cities';
import Positions from './Pages/Position/Positions';
import Offering from './Pages/Under Offer/Under_Offers';
import Lets from './Pages/Let/Lets';
import Solds from './Pages/Sold/Solds';
import Expenses from './Pages/Expense/Expenses';
import Expense_Categories from './Pages/Expense/Category/Expense_Categories';
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
            <Route path="/agent_properties" element={loggedIn ? <Agent_Properties handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
            <Route path="/properties" element={loggedIn ? <Properties handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
            <Route path="/offering" element={loggedIn ? <Offering handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
            <Route path="/lets" element={loggedIn ? <Lets handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
            <Route path="/solds" element={loggedIn ? <Solds handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
            <Route path="/agents" element={loggedIn ? <Agents handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
            <Route path="/cities" element={loggedIn ? <Cities handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
            <Route path="/positions" element={loggedIn ? <Positions handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />

            {userType !== "Operator" && (
                <>
                    <Route path="/employees" element={loggedIn ? <Employees handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
                    <Route path="/owners" element={loggedIn ? <Owners handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
                    <Route path="/expenses" element={loggedIn ? <Expenses handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
                    <Route path="/expenses/categories" element={loggedIn ? <Expense_Categories handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
                    <Route path="/users" element={loggedIn ? <Users handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
                    <Route path="/settings" element={loggedIn ? <Settings handleLogout={handleLogout} /> : <Navigate to="/login" replace />} />
                </>
            )}

            <Route path="*" element={<Navigate to={loggedIn ? "/" : "/login"} replace />} />
        </Routes>
    );
}
