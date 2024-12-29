import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import LocationPicker from "../../reuseComponents/LocationPicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faClock, faPhone, faStar, } from "@fortawesome/free-solid-svg-icons";
import { fetchNearbyShops } from "../../../services/userService";
import { Shop } from "../../utilities/interface";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { navigateBookingSlot, navigateShopDetailPage } from "../../utilities/navigate/userNavigator";
import Navbar from "./Navbar";
import { useDispatch } from "react-redux";
import { clearbookingdetails, setShopdetails } from "../../../features/bookingSlice";
import { clearestimateDetails } from "../../../features/estimateSlice";
import { setShopUser } from "../../../features/shopSlice";
import { formatTime, getNextAvailableDate, getStatusMessageofShop } from "../../utilities/functions";
import MotionWrapper, { DropMotionWrapper } from "../../reuseComponents/ui/MotionWrapper ";

const Mainbody: React.FC = () => {
  const [hoveredLocation, setHoveredLocation] = useState<[number, number]|null>(null);
  const [hoveredDetails,setHoveredDetails] = useState<{shopName:string;image:string;address:any}|null>(null); 
  const [shops, setShops] = useState<Shop[]>([]);
  const [coordinates, setCoordinates] = useState<[number,number][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const fetchShops = async () => {
    try {
      setIsLoading(true)
      const searchParams = new URLSearchParams(location.search);
      const lat = searchParams.get("lat");
      const lng = searchParams.get("lng");
      if(lat && lng){
        const latitude = parseFloat(lat)
        const longitude = parseFloat(lng)
        setHoveredLocation([latitude,longitude])
        const shopsData = await fetchNearbyShops(latitude,longitude);
        setShops(shopsData);
        const extractedCoordinates: [number, number][] = shopsData
        .filter((shop) => Array.isArray(shop.location?.coordinates))
        .map((shop) => shop.location?.coordinates as [number, number]);
      setCoordinates(extractedCoordinates);
      }else{
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          setHoveredLocation([latitude,longitude]);        
          const shopsData = await fetchNearbyShops(latitude, longitude);
          setShops(shopsData);
          const extractedCoordinates:[number, number][] = shopsData
          .filter((shop) => Array.isArray(shop.location?.coordinates))
          .map((shop) => shop.location?.coordinates as [number,number]);
          setCoordinates(extractedCoordinates)
        });
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("error fetching nearby shops:", error);
      setShops([]);
      setError(errorMessage);
    }finally{
      setIsLoading(false);
    }
  };

  const handleHover = (location:[number,number]|undefined,details:{image:string;shopName:string;address:any}) => {
    setHoveredLocation(location ||null);
    setHoveredDetails(details);
  }

  const handleCursorLeave = () => {
    setHoveredLocation(null);
    setHoveredDetails(null);
  }

  const handleAvailability = (event:React.MouseEvent<HTMLButtonElement>,shop:Shop) => {
    event.stopPropagation(); 
    dispatch(setShopdetails(shop))
    navigateBookingSlot(navigate);
  }

  const handleShopDetails = (shop:Shop) => {
    dispatch(setShopUser(shop));
    navigateShopDetailPage(navigate, shop._id)
  }

  useEffect(() => {
    fetchShops();
    dispatch(clearbookingdetails())
    dispatch(clearestimateDetails())
  }, []);


  return (
    <div className="flex flex-row ">
      <div className="w-full md:w-1/2 flex flex-col">
        <Navbar coordinates={hoveredLocation} />

        <div className="overflow-auto ">
        <DropMotionWrapper>
          <h4 className="text-lg font-semibold p-5">
            {shops.length !== 0 ? shops.length : ""} CarCare Certified shops
            nearby
          </h4>
        </DropMotionWrapper>

          {isLoading && (
            <ThreeDots height={10} color="#0098d3" wrapperClass=" mt-2" />
          )}
          {error && <p>{error}</p>}

          {shops.length !== 0 ? (
            shops.map((shop) => (
              <MotionWrapper
                key={shop._id}
              >
              <div
                onMouseEnter={() =>
                  handleHover(shop?.location?.coordinates, {
                    shopName: shop.shopName,
                    image: shop.image,
                    address: shop.address,
                  })
                }
                onMouseLeave={() => handleCursorLeave()}
                onClick={() => handleShopDetails(shop)}
                className="flex border-b p-4  ps-4 cursor-pointer hover:bg-sky-50"
              >
                <div className="w-2/6 rounded overflow-hidden ">
                <div className="h-full">
                  <img
                    src={shop.image}
                    alt="shop img"
                    className="w-full h-full object-cover rounded"
                    />
                    </div>
                </div>

                <div className=" w-3/4 ms-3">
                  <div className="flex justify-between">
                    <h2 className="text-base font-medium  text-gray-900">
                      {shop.shopName[0].toUpperCase() + shop.shopName.slice(1)}
                    </h2>
                    <p>
                      {shop?.rating && (
                        <>
                          <FontAwesomeIcon
                            icon={faStar}
                            className="text-yellow-400"
                          />{" "}
                          {(shop.rating.ratingSum / shop.rating.count).toFixed(
                            1
                          )}{" "}
                          ({shop.rating.count})
                        </>
                      )}
                    </p>
                  </div>
                  <span className="text-sm  text-gray-600">
                    {Object.values(shop.address).join(" ")}
                  </span>

                  <ul className="flex flex-wrap gap-2 text-sm ms-1 mt-3 text-gray-500">
                    <li className="bg-mainclr-100 p-1 px-2 rounded-full hover:cursor-pointer">
                      12K Warranty
                    </li>
                    <li className="bg-mainclr-100 p-1 px-2 rounded-full hover:cursor-pointer">
                      Free Support
                    </li>
                    <li className="bg-mainclr-100 p-1 px-2 rounded-full hover:cursor-pointer">
                      Pickup
                    </li>
                  </ul>

                  <div className="text-gray-600 ms-2 mt-3">
                    <h6>
                      {shop.workingTime && (
                        <>
                          <span
                            className={
                              getStatusMessageofShop(
                                shop.workingTime?.opening,
                                shop.workingTime?.closing
                              ).color
                            }
                          >
                            <FontAwesomeIcon icon={faClock} />{" "}
                            {
                              getStatusMessageofShop(
                                shop.workingTime?.opening,
                                shop.workingTime?.closing
                              ).text
                            }
                          </span>{" "}
                          {getNextAvailableDate()}
                        </>
                      )}
                    </h6>
                    <h6>
                      <FontAwesomeIcon icon={faPhone} /> {shop.phoneNumber}
                    </h6>
                    <h6>
                      <FontAwesomeIcon icon={faBolt} /> Next availability{" "}
                      {getNextAvailableDate()}{" - "}
                      {formatTime(shop.workingTime?.opening || "")}
                    </h6>
                  </div>

                  <div className="mt-3 px-1 ">
                    <button
                      onClick={(event) => handleAvailability(event, shop)}
                      className=" w-full btn-primary"
                    >
                      Check Availability
                    </button>
                  </div>
                </div>
              </div>

              </MotionWrapper>
            ))
          ) : (
            <p className="flex justify-center p-4  ps-4">No Shops Found</p>
          )}
        </div>
      </div>

      <div className="md:block hidden  w-1/2 sticky top-0 h-screen">
        <MapContainer
          center={[11.87508, 75.373848]}
          zoom={15}
          className="h-full w-full z-10"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationPicker
            hoverLocation={hoveredLocation}
            hoverDetails={hoveredDetails}
            initialPosition={coordinates}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default Mainbody;
