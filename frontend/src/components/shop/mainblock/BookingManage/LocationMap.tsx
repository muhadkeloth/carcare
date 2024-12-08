// import React from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import { Icon } from 'leaflet';

// // Fix for default marker icon
// import icon from 'leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// const defaultIcon = new Icon({
//   iconUrl: icon,
//   shadowUrl: iconShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41]
// });

// interface LocationMapProps {
//   coordinates: [number, number];
//   description: string;
// }

// const LocationMap:React.FC<LocationMapProps> =({ coordinates, description }) => {
//   return (
//     <MapContainer
//       center={coordinates}
//       zoom={13}
//       style={{ height: '100%', width: '100%' }}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />
//       <Marker position={coordinates} icon={defaultIcon}>
//         <Popup>{description}</Popup>
//       </Marker>
//     </MapContainer>
//   );
// }

// export default LocationMap