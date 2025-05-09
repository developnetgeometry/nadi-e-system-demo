import React, { useEffect, useRef } from "react";

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }`;
    script.async = true;
    script.onload = () => {
      // Initialize Google Map
      const map = new google.maps.Map(mapContainer.current!, {
        center: {
          lat: Number(import.meta.env.VITE_CENTER_MAP_LAT) || 4.2105,
          lng: Number(import.meta.env.VITE_CENTER_MAP_LNG) || 108.9758,
        }, // Centered on Malaysia
        zoom: 5,
      });

      // Add markers for major cities in Malaysia
      const cities = [
        { name: "Kuala Lumpur", coords: { lat: 3.139, lng: 101.6869 } },
        { name: "George Town", coords: { lat: 5.4141, lng: 100.3288 } },
        { name: "Johor Bahru", coords: { lat: 1.4927, lng: 103.7414 } },
        { name: "Kuching", coords: { lat: 1.5497, lng: 110.3592 } },
        { name: "Kota Kinabalu", coords: { lat: 5.9804, lng: 116.0735 } },
      ];

      cities.forEach((city) => {
        const marker = new google.maps.Marker({
          position: city.coords,
          map,
          title: city.name,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<div>${city.name}</div>`,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      });
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup script
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="relative w-full h-[400px]">
      <div
        ref={mapContainer}
        className="absolute inset-0 rounded-lg shadow-lg z-0"
      />
    </div>
  );
};

export default Map;
