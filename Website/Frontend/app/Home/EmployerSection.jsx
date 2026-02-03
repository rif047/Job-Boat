import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const topEmployers = [
    {
        id: 1,
        name: 'Memedia Ltd',
        industry: 'I.T. & Networking',
        location: '205 North Michigan Avenue, Suite 810, Chicago',
        verified: true,
        logoColor: '#38bdf8'
    },
    {
        id: 2,
        name: 'Aprico Ltd',
        industry: 'Engineering',
        location: '2301 Ravine Way, Glenview',
        verified: false,
        logoColor: '#14b8a6'
    },
    {
        id: 3,
        name: 'Barone Ltd',
        industry: 'Business Development',
        location: '7644 Loomis Boulevard, Skokie',
        verified: true,
        logoColor: '#3b82f6'
    },
    {
        id: 4,
        name: 'Acme Co',
        industry: 'Accounting',
        location: '112 Broadway, Brooklyn',
        verified: true,
        logoColor: '#f97316'
    },
    {
        id: 5,
        name: 'Bifco Ltd',
        industry: 'I.T. & Networking',
        location: '55 East Jackson Boulevard',
        verified: true,
        logoColor: '#ea580c'
    },
    {
        id: 6,
        name: 'Big Kahuna',
        industry: 'Writing',
        location: '2156 North Clark Street',
        verified: false,
        logoColor: '#9333ea'
    },
    {
        id: 7,
        name: 'Abstergo Ltd',
        industry: 'Sales & Marketing',
        location: '361 Newbury Street, Boston, MA',
        verified: true,
        logoColor: '#f97316'
    },
    {
        id: 8,
        name: 'Binford Ltd',
        industry: 'Project Manager',
        location: '122 Waukegan Road, Deerfield',
        verified: true,
        logoColor: '#ef4444'
    },
];

export default function EmployerSection() {
    return (
        <section className="bg-linear-to-b from-gray-50 to-white py-20 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-14 gap-4">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text">
                            Top Employers
                        </h2>
                        <p className="text-gray-600 text-lg">Showing companies based recent job openings</p>
                    </div>
                    <button className="group flex items-center gap-2 font-semibold text-lg transition-all cursor-pointer hover:text-emerald-600">
                        All Employers
                        <ArrowForwardIosIcon />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {topEmployers.map((employer) => (
                        <div
                            key={employer.id}
                            className="group bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-400 hover:border-emerald-200 hover:-translate-y-1"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300 bg-gray-400"
                                >
                                    {employer.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2 flex-wrap mb-1 group-hover:text-emerald-600 transition-colors">
                                        <span className="truncate">{employer.name}</span>
                                    </h3>
                                    <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">{employer.industry}</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 flex items-start gap-2 leading-relaxed">
                                <LocationOnOutlinedIcon />
                                <span>{employer.location}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
