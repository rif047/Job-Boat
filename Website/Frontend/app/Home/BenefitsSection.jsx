

const features = [
    {
        id: 1,
        icon: '🎯',
        title: 'Reduce Hiring bias',
        description: 'Structured digital interviews increase the predictive validity of your hires by 65%.'
    },
    {
        id: 2,
        icon: '⚡',
        title: 'Save time & headspace',
        description: 'Reducing your time-to-hiring up to 70% and time on headspace for others'
    },
    {
        id: 3,
        icon: '🌿',
        title: 'Minimize Environmental Impact',
        description: 'Did you know? U.S. office workers use 10,000 sheets of paper every year.'
    },
    {
        id: 4,
        icon: '📊',
        title: 'Data-Driven Decisions',
        description: 'Make informed hiring choices with comprehensive analytics and insights to build winning teams.'
    }
];
export default function BenefitsSection() {
    return (
        <section className="py-20 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-14 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text">
                        What can I do with Job Boat?
                    </h2>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        Streamline your hiring process with strategic channels to reach qualified candidates
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className="group text-center p-8 rounded-2xl hover:bg-linear-to-br hover:from-emerald-50 hover:to-white transition-all duration-300 hover:shadow-xl border border-transparent hover:border-emerald-200"
                        >
                            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300 inline-block">
                                {feature.icon}
                            </div>
                            <h3 className="font-bold text-gray-900 text-xl mb-4 group-hover:text-emerald-600 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    )
}
