// LocationsList component
import React from 'react';
import { Location } from '../models/Location';
import { LocationItem } from './LocationItem';

type LocationsListProps = {
    locations: Location[];
};

export const LocationsList: React.FC<LocationsListProps> = ({ locations }) => {
    return (
        <div>
            {locations.map(location => (
                <LocationItem 
                    key={location.id} 
                    location={location} // Pass the entire location object
                />
            ))}
        </div>
    );
};
