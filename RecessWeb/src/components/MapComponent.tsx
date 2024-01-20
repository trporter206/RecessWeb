import React, { useEffect, useRef } from 'react';
import { Game } from '../models/Game';
import { Location } from '../models/Location';
import { getLocationCoordinates } from '../services/locationService';

interface MapComponentProps {
  items: Location[] | Game[];
  onMarkerClick: (item: Location | Game) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({ items, onMarkerClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: google.maps.Map | null = null;

    const placeMarker = async (item: Location | Game) => {
      let coordinates;
      if ('coordinates' in item) {
        coordinates = item.coordinates;
      } else {
        coordinates = await getLocationCoordinates(item.locationId);
      }

      if (coordinates && map) {
        const marker = new window.google.maps.Marker({
          position: {
            lat: coordinates.latitude,
            lng: coordinates.longitude
          },
          map: map,
          title: 'coordinates' in item ? item.name : `Game at ${item.locationId}`,
        });

        marker.addListener('click', () => onMarkerClick(item));
      }
    };

    if (window.google && mapRef.current) {
      map = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: { lat: 45.523127, lng: -122.686422 },
      });

      items.forEach(item => placeMarker(item));
    }
  }, [items]);

  return <div ref={mapRef} className="map-container" />;
};
