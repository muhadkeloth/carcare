import { useEffect, useState } from "react";
import { Marker, Tooltip, useMap, useMapEvents } from "react-leaflet";
import { LocationPickerProps } from "../utilities/interface";



const LocationPicker: React.FC<LocationPickerProps> = ({onLocationChange, initialPosition, hoverLocation, hoverDetails}) => {
    const map = useMap();
    const [position,setPosition] = useState<[number,number] | null>(null);
    

    useEffect(()=>{
      if(initialPosition){
        setPosition(initialPosition);
        map.setView(initialPosition,15);
      }else if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const {latitude, longitude} = pos.coords;
            const userLocation:[number,number] = [latitude,longitude];
            setPosition(userLocation);
            map.setView(userLocation,15);
            onLocationChange && onLocationChange([latitude,longitude]);
          },
          (error)=> {
            console.error('error getting users location:',error);
          }
        )
      }
    },[map, onLocationChange, initialPosition ]);

    useMapEvents({
        click(e:L.LeafletMouseEvent){
          if(onLocationChange){
            const newLocation:[number,number] =[e.latlng.lat,e.latlng.lng];
            setPosition(newLocation);
            onLocationChange(newLocation);
          }
          }
        });

    useEffect(() => {
      if(hoverLocation){
        setPosition(hoverLocation);
        map.setView(hoverLocation,15);
      }
    },[hoverLocation, map]);
        return position ? (
          <Marker position={position}>
            {hoverDetails && (
              <Tooltip direction="top" offset={[0, -10]} permanent>
                <div>
                  <img src={hoverDetails.image} alt="shop img" />
                  <strong>{hoverDetails.shopName}</strong>
                  <br />
                  <p className="text-wrap">{Object.values(hoverDetails.address)}</p>
                </div>
              </Tooltip>
            )}
          </Marker>
        ) : null;
      };

export default LocationPicker;