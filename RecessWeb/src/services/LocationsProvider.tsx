import React, { createContext, useState, useEffect } from 'react';
import fetchLocations from '../services/locationService';
import { Location } from '../models/Location';

interface LocationsContextType {
  locations: Location[];
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
}

export const LocationsContext = createContext<LocationsContextType>({
  locations: [],
  setLocations: () => {},
});

export const LocationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const getLocations = async () => {
      const fetchedLocations = await fetchLocations();
      setLocations(fetchedLocations);
    };
    getLocations();
  }, []);

  return (
    <LocationsContext.Provider value={{ locations, setLocations }}>
      {children}
    </LocationsContext.Provider>
  );
};
