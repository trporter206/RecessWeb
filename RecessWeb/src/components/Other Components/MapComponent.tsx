import React, { useContext, useEffect, useRef } from 'react';
import { Game } from '../../models/Game';
import { Location } from '../../models/Location';
import { DataContext } from '../../services/DataProvider';

interface MapComponentProps {
  items: Location[] | Game[];
  onMarkerClick: (item: Location | Game) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({ items, onMarkerClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { locations } = useContext(DataContext);

  useEffect(() => {
    let map: google.maps.Map | null = null;
    const bounds = new google.maps.LatLngBounds();

    const placeMarker = async (item: Location | Game) => {
      let coordinates;
      if ('coordinates' in item) {
        coordinates = item.coordinates;
      } else {
        const local = locations.find(loc => loc.id === item.locationId);
        coordinates = local?.coordinates;
      }

      if (coordinates && map) {
        const marker = new google.maps.Marker({
          position: {
            lat: coordinates.latitude,
            lng: coordinates.longitude
          },
          map: map,
          title: 'coordinates' in item ? item.name : `Game at ${item.locationId}`,
        });

        bounds.extend(marker.getPosition()!);

        marker.addListener('click', () => onMarkerClick(item));
      }
    };

    if (window.google && mapRef.current) {
      map = new google.maps.Map(mapRef.current, {
        zoom: 12,
        center: { lat: 45.523127, lng: -122.686422 },
      });

      items.forEach(item => placeMarker(item));

      if (items.length > 0) {
        map.fitBounds(bounds);

        if (items.length === 1) {
          map.setZoom(12); // Adjust the zoom level for a single pin
        }
      }

      // Smooth transition when the map zoom and center change
      map.panTo(bounds.getCenter()!);
    }
  }, [items]);

  return <div ref={mapRef} className="map-container" />;
};