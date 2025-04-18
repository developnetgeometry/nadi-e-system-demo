
import React from 'react';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker 
} from 'react-simple-maps';

// Using a more reliable source for the world map data
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-continents.json";

const markers = [
  { name: "New York", coordinates: [-74.006, 40.7128], size: 12, color: "#F97316" },
  { name: "London", coordinates: [-0.1278, 51.5074], size: 15, color: "#8B5CF6" },
  { name: "Tokyo", coordinates: [139.6917, 35.6895], size: 18, color: "#0EA5E9" },
  { name: "Sydney", coordinates: [151.2093, -33.8688], size: 10, color: "#10B981" },
  { name: "Mumbai", coordinates: [72.8777, 19.0760], size: 13, color: "#F97316" },
  { name: "Sao Paulo", coordinates: [-46.6333, -23.5505], size: 9, color: "#8B5CF6" },
  { name: "Berlin", coordinates: [13.4050, 52.5200], size: 8, color: "#0EA5E9" },
];

const GlobalActivityMap: React.FC = () => {
  return (
    <div className="w-full h-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 120,
          center: [0, 20]
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          {markers.map(({ name, color }) => (
            <radialGradient key={`gradient-${name}`} id={`gradient-${name}`}>
              <stop offset="0%" stopColor={color} stopOpacity={0.8} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </radialGradient>
          ))}
        </defs>
        
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#F1F5F9"
                stroke="#D1D5DB"
                style={{
                  default: { outline: 'none' },
                  hover: { fill: "#E2E8F0", outline: 'none', transition: 'all 0.3s' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>
        
        {markers.map(({ name, coordinates, size, color }) => (
          <React.Fragment key={name}>
            {/* Pulse effect */}
            <Marker coordinates={coordinates}>
              <circle
                r={size + 15}
                fill={`url(#gradient-${name})`}
                className="animate-pulse"
                style={{ animationDuration: '3s' }}
              />
            </Marker>
            
            {/* Main marker */}
            <Marker coordinates={coordinates}>
              <g>
                <circle
                  r={size}
                  fill={color}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  opacity={0.9}
                />
                <circle
                  r={size - 3}
                  fill={color}
                  stroke="#FFFFFF"
                  strokeWidth={1}
                  opacity={0.5}
                />
              </g>
            </Marker>
          </React.Fragment>
        ))}
      </ComposableMap>
    </div>
  );
};

export default GlobalActivityMap;
