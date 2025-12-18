import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CoverageMapSection = () => {
  // Dhaka coordinates
  const center = [23.8103, 90.4125];
  
  const serviceAreas = [
    { name: 'Dhaka Central', lat: 23.8103, lng: 90.4125, radius: 5000 },
    { name: 'Gulshan', lat: 23.7808, lng: 90.4153, radius: 3000 },
    { name: 'Uttara', lat: 23.8759, lng: 90.3795, radius: 4000 },
    { name: 'Dhanmondi', lat: 23.7461, lng: 90.3742, radius: 3000 },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Our <span className="text-primary">Service</span> Coverage
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide decoration services across Dhaka and surrounding areas
          </p>
        </div>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ height: '500px' }}>
          <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {serviceAreas.map((area, index) => (
              <div key={index}>
                <Circle
                  center={[area.lat, area.lng]}
                  radius={area.radius}
                  pathOptions={{
                    color: '#f43f5e',
                    fillColor: '#f43f5e',
                    fillOpacity: 0.2
                  }}
                />
                <Marker position={[area.lat, area.lng]}>
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-bold text-lg">{area.name}</h3>
                      <p className="text-sm text-gray-600">Full Service Available</p>
                    </div>
                  </Popup>
                </Marker>
              </div>
            ))}
          </MapContainer>
        </div>

        {/* Coverage Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          {serviceAreas.map((area, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md flex items-center gap-3">
              <MapPin className="text-primary" size={24} />
              <div>
                <h4 className="font-semibold">{area.name}</h4>
                <p className="text-xs text-gray-500">Coverage: {area.radius / 1000}km radius</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoverageMapSection;