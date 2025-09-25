import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box } from '@mui/material';
import L from 'leaflet';

// Correction pour le problème d'icône de marqueur par défaut avec Webpack
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapDisplayProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{ position: [number, number]; popupText: string }>;
  height?: string | number;
}

const MapDisplay: React.FC<MapDisplayProps> = ({
  center = [6.3687, 2.4312], // Coordonnées par défaut de Cotonou, Bénin
  zoom = 13,
  markers = [],
  height = '100%',
}) => {
  return (
    <Box sx={{ height: height, width: '100%', '& .leaflet-container': { height: '100%', width: '100%' } }}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position}>
            <Popup>{marker.popupText}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default MapDisplay;
