import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import LocationPicker from "../../admin/mainblock/shopManage/LocationPicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faClock, faPhone, } from "@fortawesome/free-solid-svg-icons";
import { fetchNearbyShops } from "../../../services/userService";
import { Shop } from "../../utilities/interface";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { navigateShopDetailPage } from "../../utilities/navigate/userNavigator";

const Mainbody: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({ latitude: 0, longitude: 0 });
  const [shops, setShops] = useState<Shop[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchShops = async () => {
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        const shopsData = await fetchNearbyShops(latitude, longitude);
        setShops(shopsData);
      });
    } catch (error) {
      console.error("error fetching nearby shops:", error);
      setShops([]);
      setError("unable to fetch nearby shops.");
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);


  return (
    <div className="flex flex-row min-h-screen  ">
      <div className="w-full md:w-1/2 overflow-auto p-5  ">
        <h4 className="text-lg font-semibold">
          {shops.length !== 0 ? shops.length : ""} CarCare Certified shops nearby
        </h4>

        {error && <p>{error}</p>}

        {shops.length !== 0 ? (
          shops.map((shop) => (
            <div key={shop._id} className="flex border-b  p-4 ps-0 ">
              <div className="w-1/4 rounded  p-2  ">
                <img
                  src={`${import.meta.env.VITE_ENDPORTFRONT}/${shop.image}`}
                  alt="shop img"
                  className="w-full h-full object-cover rounded"
                />
              </div>

              <div className=" w-3/4 ms-3">
                <h2 className="text-base font-medium  text-gray-900">
                  {shop.shopName[0].toUpperCase() + shop.shopName.slice(1)}
                </h2>
                <span className="text-sm  text-gray-600">
                  {Object.values(shop.address).join(" ")}
                </span>

                <ul className="flex gap-2 text-sm ms-1 mt-3">
                  <li className="bg-mainclr-100 p-1 px-2 rounded-full hover:cursor-pointer">
                    12K Warranty
                  </li>
                  <li className="bg-mainclr-100 p-1 px-2 rounded-full hover:cursor-pointer">
                    Pickup{" "}
                  </li>
                  <li className="bg-mainclr-100 p-1 px-2 rounded-full hover:cursor-pointer">
                    Rental Car
                  </li>
                </ul>

                <div className="text-gray-600 ms-2 mt-3">
                  <h6>
                    <FontAwesomeIcon icon={faClock} /> Closed Opens 8 AM
                    Tomorrow
                  </h6>
                  <h6>
                    <FontAwesomeIcon icon={faPhone} /> {shop.phoneNumber}
                  </h6>
                  <h6>
                    <FontAwesomeIcon icon={faBolt} />
                    Soonest availability Wed, Oct 15 at 8 am
                  </h6>
                </div>

                <div className="mt-3 px-1 ">
                  <button onClick={()=>navigateShopDetailPage(navigate,shop._id)}
                  // className="bg-maincol rounded w-full p-2 text-white">
                  className=" w-full btn-primary">
                    Check Availability
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <ThreeDots height={10} color="#0098d3" wrapperClass=" mt-2" />
        )}
      </div>

      <div className="md:block hidden w-1/2 ">
        <MapContainer
          center={[11.87508, 75.373848]}
          zoom={15}
          className="h-full w-full z-10"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationPicker
            onLocationChange={setSelectedLocation}
            // initialPosition={shopUserDetails?.location.coordinates? [shopUserDetails.location.coordinates[0],shopUserDetails.location.coordinates[1]] : undefined}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default Mainbody;
