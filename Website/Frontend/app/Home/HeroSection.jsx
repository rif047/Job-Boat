import SearchIcon from '@mui/icons-material/Search';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';


export default function HeroSection() {
    return (
        <section className="relative bg-cover bg-center min-h-150 flex items-center" style={{ backgroundImage: 'url(/img/hero-bg.jpg)' }}>
            <div className="absolute inset-0 bg-linear-to-r from-slate-900/50 via-slate-900/30 to-transparent"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
                <div className="max-w-4xl">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                        <span className="text-emerald-400">Job Boat</span>
                        <br />
                        Find The Job That Fits Your Life
                    </h1>
                    <p className="text-white/90 text-lg md:text-xl mb-10 leading-relaxed">
                        Resume-Library is a true performance-based job board. Enjoy custom<br className="hidden sm:block" />
                        hiring products and access to up to 10,000 new resume registrations<br className="hidden sm:block" />
                        daily, with no subscriptions or user licences.
                    </p>



                    <form className="bg-white/95 rounded-lg shadow-xl p-4 flex flex-col md:flex-row gap-3">
                        <div className="flex items-center flex-1 px-4 py-3 bg-gray-50/90 rounded-xl hover:bg-gray-200/70 transition-all">
                            <SearchIcon />
                            <input
                                type="text"
                                placeholder="Job title, keywords or company"
                                className="w-full outline-none text-sm bg-transparent text-gray-900 placeholder:text-gray-500 font-medium ml-2"
                            />
                        </div>
                        <div className="flex items-center flex-1 px-4 py-3 bg-gray-50/90 rounded-xl hover:bg-gray-200/70 transition-all">
                            <LocationOnOutlinedIcon />
                            <input
                                type="text"
                                placeholder="All Location"
                                className="w-full outline-none text-sm bg-transparent text-gray-900 placeholder:text-gray-500 font-medium ml-2"
                            />
                        </div>
                        <button className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white px-10 py-3 rounded-lg font-semibold transition-all hover:scale-103 cursor-pointer">
                            Find Jobs
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
