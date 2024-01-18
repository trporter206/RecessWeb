import { useRef, useEffect } from 'react';
import { Location } from '../models/Location';

interface MapComponentProps {
  locations: Location[];
  onMarkerClick: (location: Location) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({ locations, onMarkerClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.google && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: { lat: 45.523127, lng: -122.686422 },
      });

      locations.forEach(location => {
        if (location.coordinates && !isNaN(location.coordinates.latitude) && !isNaN(location.coordinates.longitude)) {
          
          const marker = new window.google.maps.Marker({
            position: {
              lat: Number(location.coordinates.latitude),
              lng: Number(location.coordinates.longitude)
            },
            map: map,
            title: location.name,
          });

          marker.addListener('click', () => {
            onMarkerClick(location);
          });
        } else {
          console.error('Invalid location coordinates:', location);
        }
      });
    }
  }, [locations]);

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
};
