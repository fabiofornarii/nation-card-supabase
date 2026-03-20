import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { Venue } from '@/api/entities';
import { useQuery } from '@tanstack/react-query';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function VenuesMap() {
const { data: venues = [] } = useQuery({
  queryKey: ['venues'],
  queryFn: () => Venue.list(),
});

  const center = [41.953573, 12.073356];

  const schools = [
    { name: "Liceo Pertini Sede Centrale", lat: 41.95585034616367, lng: 12.073844125320631 },
    { name: "Liceo Pertini Sede Succursale", lat: 41.961500561708974, lng: 12.067474838932304 },
  ];

  return (
    <section id="map" className="h-[600px] w-full relative group bg-[#0a0a0a]">
      <div className="absolute top-0 left-0 w-full p-8 z-[400] pointer-events-none">
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-black text-white bg-black/50 backdrop-blur-md inline-block px-4 py-2 rounded-lg"
        >
          TROVA I LOCALI <span className="text-[#255ff1]">VICINO A TE</span>
        </motion.h2>
      </div>

      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        {Array.isArray(venues) && venues.filter(v => v.lat && v.lng).map((venue) => (
          <Marker key={venue.id} position={[venue.lat, venue.lng]}>
            <Popup>
              <div className="p-1 min-w-[150px]">
                <h3 className="font-bold text-lg mb-1">{venue.name}</h3>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{venue.category}</div>
                <p className="text-sm mb-2">{venue.address}</p>
                <div className="bg-[#255ff1] text-white text-xs px-2 py-1 rounded inline-block font-bold">
                  {venue.discount}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        {schools.map((school, idx) => (
          <Marker key={`school-${idx}`} position={[school.lat, school.lng]}>
            <Popup>
              <div className="p-1 min-w-[150px]">
                <h3 className="font-bold text-lg mb-1">{school.name}</h3>
                <div className="text-xs text-[#255ff1] uppercase tracking-wider mb-2 font-bold">ISTITUTO</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style>{`
        .leaflet-container { background: #0a0a0a; }
        .map-tiles { filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%); }
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background: #fff; color: #333; border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
      `}</style>
    </section>
  );
}
