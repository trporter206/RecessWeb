import Hero from '../components/Other Components/Home Components/HeroImage';
import PickleballImage from '../assets/PickleballHero.webp';
import RecessValues from '../components/Other Components/Home Components/RecessValues';
import FreeFeatures from '../components/Other Components/Home Components/FreeFeatures';
import PaidFeatures from '../components/Other Components/Home Components/PaidFeatures';

export const HomePage = () => {
    return (
        <div className="home-page-wrapper">
            <Hero backgroundImage={PickleballImage} />
            <RecessValues />
            <FreeFeatures />
            <PaidFeatures />
        </div>
    )
}