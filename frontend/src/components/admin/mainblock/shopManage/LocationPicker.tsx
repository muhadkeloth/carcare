import { useEffect, useState } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet";

interface LocationPickerProps {
    onLocationChange:(location:{latitude:number;longitude:number}) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({onLocationChange}) => {
    const map = useMap();
    const [position,setPosition] = useState<[number,number] | null>(null);
    
    useEffect(()=>{
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const {latitude, longitude} = pos.coords;
            const userLocation:[number,number] = [latitude,longitude];
            setPosition(userLocation);
            map.setView(userLocation,15);
            onLocationChange({latitude,longitude});
          },
          (error)=> {
            console.error('error getting users location:',error);
          }
        )
      }
    },[map,onLocationChange]);

    useMapEvents({
        click(e:L.LeafletMouseEvent){
            const selectedLocation = {latitude:e.latlng.lat, longitude: e.latlng.lng };
            setPosition([e.latlng.lat,e.latlng.lng]);
            onLocationChange(selectedLocation);
          }
        });
        return position ? <Marker position={position}  /> :null;
      };

export default LocationPicker;