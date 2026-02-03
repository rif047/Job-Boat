import HeroSection from './HeroSection';
import IndustrySection from './IndustrySection';
import BenefitsSection from './BenefitsSection';
import FeaturedJobs from './FeaturedJobs';
import EmployerSection from './EmployerSection';

export default function Home() {
    return (
        <main className="min-h-screen bg-white">
            <HeroSection />
            <IndustrySection />
            <BenefitsSection />
            <FeaturedJobs />
            <EmployerSection />
        </main>
    );
}