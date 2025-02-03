import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Malaysian cities coordinates
const cities = [
  { name: "Kuala Lumpur", position: [3.1390, 101.6869] },
  { name: "George Town", position: [5.4141, 100.3288] },
  { name: "Johor Bahru", position: [1.4927, 103.7414] },
  { name: "Kota Kinabalu", position: [5.9804, 116.0735] },
  { name: "Kuching", position: [1.5497, 110.3592] }
];

export const DashboardMap = () => {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Regional Activity Map</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <MapContainer
          center={[4.2105, 108.9758]} // Center of Malaysia
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          maxBounds={[[0.8, 98], [7.5, 120]]} // Restrict to Malaysia region
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {cities.map((city) => (
            <Marker 
              key={city.name} 
              position={city.position as [number, number]}
            >
              <Popup>{city.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
};