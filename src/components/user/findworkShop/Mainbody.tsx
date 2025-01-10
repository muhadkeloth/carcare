import React, { useCallback, useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import LocationPicker from "../../reuseComponents/LocationPicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faBolt, faClock, faPhone, faStar, } from "@fortawesome/free-solid-svg-icons";
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
import { debounce, formatTime, getNextAvailableDate, getStatusMessageofShop } from "../../utilities/functions";
import MotionWrapper, { DropMotionWrapper } from "../../reuseComponents/ui/MotionWrapper ";

const Mainbody: React.FC = () => {
  const [hoveredLocation, setHoveredLocation] = useState<[number, number] | null>(null);
  const [hoveredDetails, setHoveredDetails] = useState<{ shopName: string; image: string; address: any } | null>(null);
  const [allShops, setAllShops] = useState<Shop[]>([]); 
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [sortOrder, setSortOrder] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const limit = 5 ;


  const fetchShops = useCallback(async (latitude?: string, longitude?: string) => {
    try {
      setIsLoading(true)
      const searchParams = new URLSearchParams(location.search);     
      let lat = latitude || searchParams.get("lat");
      let lng = longitude || searchParams.get("lng");

      if(lat && lng){
        const latitude = parseFloat(lat)
        const longitude = parseFloat(lng)
        setHoveredLocation([latitude,longitude])
        const shopsData = await fetchNearbyShops(latitude,longitude);
        setAllShops(shopsData);
        const extractedCoordinates: [number, number][] = shopsData
        .filter((shop) => Array.isArray(shop.location?.coordinates))
        .map((shop) => shop.location?.coordinates as [number, number]);
        setCoordinates(extractedCoordinates);
      }else{
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          setHoveredLocation([latitude,longitude]);        
          const shopsData = await fetchNearbyShops(latitude, longitude);
          setAllShops(shopsData);
          const extractedCoordinates:[number, number][] = shopsData
          .filter((shop) => Array.isArray(shop.location?.coordinates))
          .map((shop) => shop.location?.coordinates as [number,number]);
          setCoordinates(extractedCoordinates)
        });
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("error fetching nearby shops:", error);
      setError(errorMessage);
    }finally{
      setIsLoading(false);
    }
  },[]);


  const applyFilters = useCallback(() => {
    let updatedShops = [...allShops];

    if (vehicleFilter.length > 0) {
      updatedShops = updatedShops.filter((shop) =>
        shop.vehicleIds?.some((vehicle) => vehicle.brand == vehicleFilter)
      );
    }

    switch (sortOrder){
      case 'desc':
        updatedShops.sort((a, b) => (b.rating?.ratingSum || 0) - (a.rating?.ratingSum || 0));
        break;
      case 'asc':
        updatedShops.sort((a, b) => (a.rating?.ratingSum || 0) - (b.rating?.ratingSum || 0));
        break;
      case 'new':
        updatedShops.sort((a, b) => {
          const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      default:
          break 
    }

    const startIndex = (currentPage - 1) * limit;
    const paginatedShops = updatedShops.slice(startIndex, startIndex + limit);

    setFilteredShops(paginatedShops);
  }, [allShops, vehicleFilter, sortOrder, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [vehicleFilter, sortOrder]);

  useEffect(() => {
    applyFilters();
  }, [allShops, vehicleFilter, sortOrder, currentPage, applyFilters]);


  const handlePagination = (page: number) => {
    setCurrentPage(page);
  };

  const handleVehicleFilterChange = (brand: string) => {
    setVehicleFilter(brand);
  };

  const handleSortChange = (order:string) => {
    setSortOrder(order);
  };

  const handleHover = debounce((location:[number,number]|undefined,details:{image:string;shopName:string;address:any}) => {
    setHoveredLocation(location ||null);
    setHoveredDetails(details);
  },200)


  const handleCursorLeave = debounce(() => {
    setHoveredLocation(null);
    setHoveredDetails(null);
  },200)


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
  }, [fetchShops]);


  return (
    <div className="flex flex-row ">
      <div className="w-full md:w-1/2 flex flex-col">
        <Navbar
          coordinates={hoveredLocation}
          fetchShops={fetchShops} 
          onFilterChange={handleVehicleFilterChange}
          onSortChange={handleSortChange}
        />

        <div className="overflow-auto ">
          <DropMotionWrapper>
            <h4 className="text-lg font-semibold p-5">
              {filteredShops.length !== 0 ? filteredShops.length : ""} CarCare Certified shops
              nearby
            </h4>
          </DropMotionWrapper>

          {isLoading && (
            <ThreeDots height={10} color="#0098d3" wrapperClass=" mt-2" />
          )}
          {error && <p>{error}</p>}

          {filteredShops.length !== 0 ? (
            filteredShops.map((shop) => (
              <MotionWrapper key={shop._id}>
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
                        {shop.shopName[0].toUpperCase() +
                          shop.shopName.slice(1)}
                      </h2>
                      <p>
                        {shop?.rating && (
                          <>
                            <FontAwesomeIcon
                              icon={faStar}
                              className="text-yellow-400"
                            />{" "}
                            {(
                              shop.rating.ratingSum / shop.rating.count
                            ).toFixed(1)}{" "}
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
                            </span>
                            {" Today "}
                          </>
                        )}
                      </h6>
                      <h6>
                        <FontAwesomeIcon icon={faPhone} /> {shop.phoneNumber}
                      </h6>
                      <h6>
                        <FontAwesomeIcon icon={faBolt} /> Next availability{" "}
                        {getNextAvailableDate()}
                        {" - "}
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

          
              <div className="flex justify-center items-center my-6">
                <button
                  disabled={currentPage === 1}
                  className="btn-primary disabled:bg-gray-200"
                  onClick={() => handlePagination(currentPage - 1)}
                >
                  <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <span className="text-sm mx-2 text-gray-600">
                  Page {currentPage} of {Math.ceil(allShops.length / limit)}{" "}
                </span>
                <button
                  disabled={currentPage === Math.ceil(allShops.length / limit)}
                  className="btn-primary disabled:bg-gray-200"
                  onClick={() => handlePagination(currentPage + 1)}
                >
                  <FontAwesomeIcon icon={faAngleRight} />
                </button>
              </div>
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
