import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const featuredJobs = [
    {
        id: 1,
        company: 'P.K Marketing',
        title: 'Restaurant Team',
        location: 'Dhaka, Bangladesh',
        date: 'Jan 08, 2024',
        type: 'Temporary',
        minSalary: 500,
        maxSalary: 650,
        salaryPeriod: 'month',
        verified: true,
        urgent: false,
    },
    {
        id: 2,
        company: 'G.J Software Ltd',
        title: 'Software Engineer',
        location: 'New York, NY',
        date: 'Jan 06, 2024',
        type: 'Temporary',
        minSalary: 400,
        maxSalary: 450,
        salaryPeriod: 'month',
        verified: true,
        urgent: false,
    },
    {
        id: 3,
        company: 'A.B Marketing',
        title: 'Sales Specialist',
        location: 'Al Hufurah, Iraq',
        date: 'Jun 09, 2024',
        type: 'Full time',
        minSalary: 710,
        maxSalary: 800,
        salaryPeriod: 'month',
        verified: true,
        urgent: true,
    },
    {
        id: 4,
        company: 'C.D Develop It Ltd',
        title: 'Junior Graphic Designer',
        location: 'New York, NY',
        date: 'Jun 06, 2024',
        type: 'On site',
        minSalary: 650,
        maxSalary: 700,
        salaryPeriod: 'month',
        verified: true,
        urgent: true,
    }
];

export default function FeaturedJobs() {
    return (
        <section className="bg-linear-to-b from-gray-50 to-white py-20 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-14 gap-4">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text">
                            Featured Jobs
                        </h2>
                        <p className="text-gray-600 text-lg">Find the job that's perfect for you. about 800+ new jobs everyday</p>
                    </div>
                    <button className="group flex items-center gap-2 font-semibold text-lg transition-all cursor-pointer hover:text-emerald-600">
                        All Employers
                        <ArrowForwardIosIcon />
                    </button>
                </div>




                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredJobs.map((job) => (
                        <div
                            key={job.id}
                            className="group bg-white rounded-2xl p-7 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-400 hover:border-emerald-200 hover:-translate-y-1 cursor-pointer"
                        >
                            <div className="flex items-start gap-4 mb-5">
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300 bg-gray-400"
                                >
                                    {job.company.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-emerald-600 font-semibold mb-2 uppercase tracking-wide">{job.company}</p>
                                    <h3 className="font-bold text-gray-900 text-xl flex items-center gap-2 mb-3 group-hover:text-emerald-600 transition-colors">
                                        {job.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1.5">
                                            <LocationOnOutlinedIcon />
                                            {job.location}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <CalendarMonthOutlinedIcon />
                                            {job.date}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                                <div className="flex gap-2 flex-wrap">
                                    <span className="px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full border border-gray-400">
                                        {job.type}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-emerald-600 font-bold text-lg flex items-center justify-end gap-1">
                                        <span className="text-base">£</span>
                                        {job.minSalary} - £{job.maxSalary}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">per {job.salaryPeriod}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
