import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet-routing-machine";
import L from "leaflet";
import { useEffect } from "react";
import { RouteProps } from "../../utilities/interface";



const Routing = ({ destination }: RouteProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const routingControl = L.Routing.control({
          waypoints: [
            L.latLng(latitude, longitude), 
            L.latLng(destination[0], destination[1]),
          ],
          routeWhileDragging: true,
          lineOptions: {
            styles: [{ color: "#6FA1EC", weight: 4 }],
            extendToWaypoints: true, 
            missingRouteTolerance: 0, 
            addWaypoints: false,
          } as L.Routing.LineOptions,
        }).addTo(map);
        return () => map.removeControl(routingControl); 
      },
      (error) => {
        console.error("Geolocation error:", error.message);
      }
    );
  }, [map, destination]);
  return null;
};

const MapComponent = () => {
  const destination:[number, number] = [11.912934, 75.41246];

  return (
    <MapContainer
      center={destination}
      zoom={15}
      className="h-20 w-full "
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Routing destination={destination} />
    </MapContainer>
  );
};

export default MapComponent;




