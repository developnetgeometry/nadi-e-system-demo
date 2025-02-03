import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map centered on Malaysia
    map.current = L.map(mapContainer.current).setView([4.2105, 108.9758], 5);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map.current);

    // Add Malaysia boundary (approximate)
    const malaysiaBounds = L.latLngBounds(
      [1.0, 99.6], // Southwest corner
      [7.4, 119.3]  // Northeast corner
    );

    map.current.fitBounds(malaysiaBounds);

    // Restrict panning to Malaysia region
    map.current.setMaxBounds(malaysiaBounds.pad(0.1));

    // Add some major cities in Malaysia
    const cities = [
      { name: 'Kuala Lumpur', coords: [3.1390, 101.6869] },
      { name: 'George Town', coords: [5.4141, 100.3288] },
      { name: 'Johor Bahru', coords: [1.4927, 103.7414] },
      { name: 'Kuching', coords: [1.5497, 110.3592] },
      { name: 'Kota Kinabalu', coords: [5.9804, 116.0735] },
    ];

    cities.forEach(city => {
      L.marker(city.coords as [number, number])
        .bindPopup(city.name)
        .addTo(map.current!);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[400px]">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
    </div>
  );
};

export default Map;