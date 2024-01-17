// src/components/LocationsList.tsx
import { useEffect, useState } from 'react';
import fetchLocations from '../services/locationService';
import { Location } from '../models/Location';

export const LocationsList = () => {
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        const getLocations = async () => {
            const locationsData = await fetchLocations();
            setLocations(locationsData);
        };

        getLocations();
    }, []);

    return (
        <div>
            {locations.map(location => (
                <div key={location.id}>
                    <h3>{location.name}</h3>
                    <p>{location.description}</p>
                    {/* Additional details */}
                </div>
            ))}
        </div>
    );
};
