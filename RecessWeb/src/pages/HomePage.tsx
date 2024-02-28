import React from 'react';
import Hero from '../components/Other Components/Home Components/HeroImage';
import PickleballImage from '../assets/PickleballHero.webp';
import RecessValues from '../components/Other Components/Home Components/RecessValues';

export const HomePage = () => {
    return (
        <div>
            <Hero backgroundImage={PickleballImage} />
            <RecessValues />
        </div>
    )
}