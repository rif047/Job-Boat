import { useState } from 'react';
import axios from 'axios';
import EastIcon from '@mui/icons-material/East';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function Login() {
    document.title = 'Login';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/login`, { username, password },
                { withCredentials: true, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }
            );
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userType', user.userType);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUsername('');
            setPassword('');
            window.location.href = "/";
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-0 md:p-20">

            <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-2xl max-w-6xl w-full overflow-hidden">

                <div className="flex flex-col justify-between p-10 bg-gray-900 text-white relative">
                    <div className="flex justify-between items-center rounded-xl bg-gray-800 px-6 py-3 mb-10 shadow-md">
                        <img src="/Assets/Img/logo.png" alt="Job Boat" className="w-32" />
                        <a href="https://jobboat.co.uk/" target="_blank" className="font-semibold text-sm flex items-center gap-1 hover:text-gray-300">
                            Visit Website <ArrowOutwardIcon fontSize="small" />
                        </a>
                    </div>

                    <div>
                        <h3 className="font-bold text-xl tracking-wide text-gray-300">JOB BOAT</h3>
                        <h1 className="text-4xl md:text-5xl font-extrabold leading-snug mt-3">Largest Job Site in the UK</h1>
                        <p className="mt-5 text-sm text-gray-400 max-w-sm"> Stay focused on what matters while we handle the technology. </p>
                        <div className="mt-8">
                            <p className="font-medium text-sm">Don’t have an account?</p>
                            <a href="#" className="font-semibold underline flex items-center gap-1 hover:text-gray-300"> Request for Account Creation <EastIcon fontSize="small" />  </a>
                        </div>
                    </div>

                    <div className="mt-12">
                        <img src="/Assets/Img/bg1.jpg" alt="city" className="w-full h-44 object-cover rounded-2xl shadow-lg grayscale" />
                    </div>
                </div>




                <div className="bg-[url(/Assets/Img/bg3.jpg)] bg-cover flex items-center justify-center bg-gray-50 py-8 md:py-0">
                    <div className="bg-white shadow-xl rounded-2xl p-10 w-11/12 max-w-md mx-auto">
                        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Welcome Back</h1>
                        <p className="text-sm text-gray-500 text-center mb-8">Please enter your login details below</p>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="relative">
                                <PersonIcon className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"
                                />
                            </div>

                            <div className="relative">
                                <LockIcon className="absolute left-3 top-3 text-gray-400" />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </button>
                            </div>

                            {error && <div className="bg-red-100 text-red-600 p-2 rounded-md text-sm">{error}</div>}

                            <button type="submit" className="w-full rounded-lg bg-black text-white font-semibold py-3 shadow-md hover:bg-gray-800 transition-colors cursor-pointer"  >
                                Login
                            </button>

                            {/* <p className="text-xs text-gray-500 text-center mt-3 cursor-pointer hover:text-gray-800">  Forgot Password?  </p> */}
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}
