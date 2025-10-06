import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Under_Offer() {
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [pending, setPending] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/jobs`);
                const letJobs = data.filter(p => p.status === "Offering");
                setTotal(letJobs.length);

                const recentPending = letJobs
                    .sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn))
                    .slice(0, 3)
                    .map(p => ({
                        ...p,
                        text: [p.name, p.code, p.city, p.job_type, p.job_for].filter(Boolean).join(' - ')
                    }));

                setPending(recentPending);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    return (
        <div className="">
            <h2 className="font-bold bg-[#4ea863] px-3 py-3 text-gray-200 rounded-t-lg">Under Offer Jobs: {total}</h2>
            <div className='p-6'>
                <h3 className="mb-6 text-gray-700">Recent Under Offer Jobs:</h3>

                {loading ? (
                    <p>Loading...</p>
                ) : pending.length === 0 ? (
                    <p>No jobs found</p>
                ) : (
                    <div className="space-y-3 pb-2">
                        {pending.map(item => (
                            <div key={item._id} className="relative bg-white p-1 rounded-md shadow overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-200 to-transparent z-10"></div>
                                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10"></div>

                                <div className="flex overflow-hidden">
                                    <div className="flex animate-[marquee_60s_linear_infinite]">
                                        {[...Array(3)].map((_, i) => (
                                            <span key={i} className="whitespace-nowrap pr-20 text-gray-700">({item.text})</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}