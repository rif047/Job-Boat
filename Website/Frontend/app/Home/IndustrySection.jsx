import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


const categories = [
    { id: 1, name: 'Human Resource', jobCount: 2 },
    { id: 2, name: 'Project Manager', jobCount: 0 },
    { id: 3, name: 'Delivery Driver', jobCount: 1 },
    { id: 4, name: 'Accounting', jobCount: 3 },
    { id: 5, name: 'Customer Service', jobCount: 2 },
    { id: 6, name: 'Data Science', jobCount: 6 },
    { id: 7, name: 'Engineering', jobCount: 1 },
    { id: 8, name: 'IT & Networking', jobCount: 5 },
    { id: 9, name: 'Sales & Marketing', jobCount: 3 },
    { id: 10, name: 'Writing', jobCount: 2 }
];


export default function IndustrySection() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text">
                        Browse by industry
                    </h2>
                    <p className="text-gray-600 text-lg">Recruitment Made Easy in 100 seconds</p>
                </div>
                <button className="group flex items-center gap-2 font-semibold text-lg transition-all cursor-pointer hover:text-emerald-600">
                    All Categories
                    <ArrowForwardIosIcon />
                </button>
            </div>



            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {categories.map((industry) => (
                    <div
                        key={industry.id}
                        className="group relative overflow-hidden bg-linear-to-br from-white to-gray-50 border border-gray-400 rounded-2xl p-6 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer hover:-translate-y-1"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-emerald-600 transition-colors">{industry.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{industry.jobCount} Job{industry.jobCount !== 1 ? 's' : ''} available</p>
                            <span className="inline-flex items-center gap-2 text-emerald-600 text-sm font-semibold group-hover:gap-3 transition-all">
                                Explore Jobs
                                <ArrowForwardIosIcon />
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
