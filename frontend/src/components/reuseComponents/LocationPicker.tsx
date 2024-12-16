// import { useEffect, useState } from "react";
// import { Marker, Tooltip, useMap, useMapEvents } from "react-leaflet";
// import { LocationPickerProps } from "../utilities/interface";



// const LocationPicker: React.FC<LocationPickerProps> = ({onLocationChange, initialPosition, hoverLocation, hoverDetails}) => {
//     const map = useMap();
//     const [position,setPosition] = useState<[number,number] | null>(null);
    

//     useEffect(()=>{
//       if(initialPosition){
//         setPosition(initialPosition);
//         map.setView(initialPosition,15);
//       }else if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(
//           (pos) => {
//             const {latitude, longitude} = pos.coords;
//             const userLocation:[number,number] = [latitude,longitude];
//             setPosition(userLocation);
//             map.setView(userLocation,15);
//             onLocationChange && onLocationChange([latitude,longitude]);
//           },
//           (error)=> {
//             console.error('error getting users location:',error);
//           }
//         )
//       }
//     },[map, onLocationChange, initialPosition ]);

//     useMapEvents({
//         click(e:L.LeafletMouseEvent){
//           if(onLocationChange){
//             const newLocation:[number,number] =[e.latlng.lat,e.latlng.lng];
//             setPosition(newLocation);
//             onLocationChange(newLocation);
//           }
//           }
//         });

//     useEffect(() => {
//       if(hoverLocation){
//         setPosition(hoverLocation);
//         map.setView(hoverLocation,15);
//       }
//     },[hoverLocation, map]);

//         return position ? (
//           <Marker position={position}>
//             {hoverDetails && (
//               <Tooltip direction="top" offset={[0, -10]} permanent>
//                 <div>
//                   <img src={hoverDetails.image} alt="shop img" />
//                   <strong>{hoverDetails.shopName}</strong>
//                   <br />
//                   <p className="text-wrap">{Object.values(hoverDetails.address)}</p>
//                 </div>
//               </Tooltip>
//             )}
//           </Marker>
//         ) : null;
//       };

// export default LocationPicker;


import { useEffect, useState } from "react";
import { Marker, Tooltip, useMap, useMapEvents } from "react-leaflet";
import { HoverDetails, LocationPickerProps } from "../utilities/interface";



const LocationPicker: React.FC<LocationPickerProps> = ({onLocationChange, initialPosition, hoverLocation, hoverDetails}) => {
    const map = useMap();
    const [position,setPosition] = useState<[number,number][]>([]);
    const [hoverMarker, setHoverMarker] = useState<{coordinates:[number,number];details?:HoverDetails;}|null>(null);
    

    useEffect(()=>{
      if(initialPosition?.length){
        setPosition(initialPosition);
        map.setView(initialPosition[0],15);
      }else if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const {latitude, longitude} = pos.coords;
            const userLocation:[number,number] = [latitude,longitude];
            setPosition([userLocation]);
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
            // setPosition((prev) => [...prev,newLocation]);
            setPosition([newLocation]);
            onLocationChange(newLocation);
          }
          }
        });

    useEffect(() => {
      if(hoverLocation && hoverDetails){
        setHoverMarker({ coordinates: hoverLocation, details: hoverDetails });
        // setPosition([hoverLocation]);
        map.setView(hoverLocation,15);
      }else{
        setHoverMarker(null)
      }
    },[hoverLocation, hoverDetails, map]);

        return (
          <>
          {position.map((pos, index) => (
               <Marker key={`init-${index}`} position={pos}>
            {/* {hoverDetails && ( */}
              <Tooltip direction="top" offset={[0, -10]} >
                <div>
                  <strong>Location {index +1}</strong>
                </div>
              </Tooltip>
            {/* )} */}
          </Marker>
          ))}

{hoverMarker && (
  <Marker  position={hoverMarker.coordinates}>
    {hoverMarker.details && (
    <Tooltip direction="top" offset={[0, -10]} permanent>
       <div className="w-28">
             <img src={hoverMarker.details.image} alt="shop img"  className="w-full h-20" />
             <strong>{hoverMarker.details.shopName}</strong>
             <br />
             <p className="text-wrap break-words whitespace-normal">{Object.values(hoverMarker.details.address).join(' ')}</p>
           </div>
    </Tooltip>

    )}
</Marker>
)}

          </>
        ) 
        // position ? (
        //   <Marker position={position}>
        //     {hoverDetails && (
        //       <Tooltip direction="top" offset={[0, -10]} permanent>
        //         <div>
        //           <img src={hoverDetails.image} alt="shop img" />
        //           <strong>{hoverDetails.shopName}</strong>
        //           <br />
        //           <p className="text-wrap">{Object.values(hoverDetails.address)}</p>
        //         </div>
        //       </Tooltip>
        //     )}
        //   </Marker>
        // ) : null;
      };

export default LocationPicker;