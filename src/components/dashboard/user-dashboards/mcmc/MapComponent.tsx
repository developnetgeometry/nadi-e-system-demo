import React, { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { MapPin } from "lucide-react";

interface Location {
  name: string;
  coordinates: [number, number]; // [lng, lat]
  details: string;
}

const locations: Location[] = [
  {
    name: "NADI PPR Desa Tun Razak",
    coordinates: [101.7317, 3.0738],
    details:
      "Launch of NADI PPR Desa Tun Razak by YB Dato' Seri Dr. Wan Azizah",
  },
  {
    name: "NADI Seri Menanti",
    coordinates: [102.3693, 2.8334],
    details: "Launch of NADI Seri Menanti by YB Tuan Muhammad Sufian",
  },
];

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: Number(import.meta.env.VITE_CENTER_MAP_LAT || "4.2105"),
  lng: Number(import.meta.env.VITE_CENTER_MAP_LNG || "108.9758"),
};

// Updated dark mode map styles
const mapStyles = [
  {
    elementType: "geometry",
    stylers: [{ color: "#1A1F2C" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1A1F2C" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#9F9EA1" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#C8C8C9" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#C8C8C9" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#222222" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9F9EA1" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#403E43" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#221F26" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9F9EA1" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#555555" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#333333" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#aaadb0" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#333333" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#C8C8C9" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9F9EA1" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
  {
    // Highlight Malaysia's administrative boundary
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#3b82f6" }, { weight: 3 }],
  },
];

const MapComponent = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Add a state to track if Malaysia is highlighted
  const [malaysiaHighlighted, setMalaysiaHighlighted] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);

    // Set the map styles
    map.setOptions({
      styles: mapStyles,
    });

    // Add GeoJSON for Malaysia to highlight it
    if (map) {
      // Focus on Malaysia
      map.setZoom(6);
      map.setCenter(center);

      // Attempt to highlight Malaysia using Data layer
      try {
        fetch(
          "https://raw.githubusercontent.com/johan/world.geo.json/master/countries/MYS.geo.json"
        )
          .then((response) => response.json())
          .then((data) => {
            map.data.addGeoJson(data);
            map.data.setStyle({
              fillColor: "#3b82f6",
              fillOpacity: 0.4,
              strokeColor: "#1e40af",
              strokeWeight: 2,
            });
            setMalaysiaHighlighted(true);
          })
          .catch((err) => {
            console.error("Error loading Malaysia GeoJSON:", err);
            setError("Failed to highlight Malaysia");
          });
      } catch (err) {
        console.error("Error in Malaysia highlight:", err);
      }
    }
  }, []);

  const onUnmount = useCallback(() => {
    setMapRef(null);
  }, []);

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleInfoWindowClose = () => {
    setSelectedLocation(null);
  };

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-white">Loading maps...</div>
      </div>
    );

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: mapStyles,
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: false,
        }}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={{
              lat: location.coordinates[1],
              lng: location.coordinates[0],
            }}
            onClick={() => handleMarkerClick(location)}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              `)}`,
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        ))}

        {selectedLocation && (
          <InfoWindow
            position={{
              lat: selectedLocation.coordinates[1],
              lng: selectedLocation.coordinates[0],
            }}
            onCloseClick={handleInfoWindowClose}
          >
            <div className="bg-white p-2 rounded">
              <h3 className="font-bold text-black text-sm">
                {selectedLocation.name}
              </h3>
              <p className="text-gray-700 text-xs">
                {selectedLocation.details}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
