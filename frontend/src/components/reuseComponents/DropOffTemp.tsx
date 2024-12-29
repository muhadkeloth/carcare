import { faArrowRight, faBolt, faCar, faClock, faLocationDot, faPhone, faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { formatDate, formatTime, getNextAvailableDate } from "../utilities/functions"
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { shedule, Shop, VehicleDetails } from "../utilities/interface";

interface DropOffTempProps {
    shopdetails?:Shop;
    shedule?:shedule; 
    vehicleDetails?:VehicleDetails;
    // userDetails?:UserDetails;
}

const DropOffTemp = ({shopdetails,shedule,vehicleDetails}:DropOffTempProps) => {
    // const shopdetails = useSelector((state:RootState)=>{
    //     return state.estimate.estimateDetails 
    //     ? state.estimate.estimateDetails.shopdetails
    //     : state.bookingdetails.bookingDetails?.shopdetails;
    //   } );
    // const { shedule, vehicleDetails } = useSelector((state: RootState) => state.bookingdetails.bookingDetails) || {};


  return (
    <>
  <p className="text-gray-500 text-sm font-semibold uppercase">
          drop off at
        </p>

        {shopdetails && (
        <div className="flex pb-4 pt-2   border-b">
          <div className="w-28  rounded overflow-hidden">
            <img
              src={shopdetails?.image}
              alt="shop img"
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="flex flex-col  ms-3 w-full">
            <div className="flex  justify-between">
              <h2 className=" max-w-full break-words whitespace-normal text-base font-medium  text-gray-900">
                {shopdetails?.shopName &&
                  shopdetails?.shopName[0].toUpperCase() +
                    shopdetails?.shopName.slice(1)}
              </h2>
              <p className="text-gray-500 text-sm">
                {shopdetails?.rating && (
                  <>
                    <FontAwesomeIcon
                      icon={faStar}
                      className="text-yellow-400"
                    />{" "}
                    {(
                      shopdetails.rating.ratingSum / shopdetails.rating.count
                    ).toFixed(1)}{" "}
                    ({shopdetails.rating.count})
                  </>
                )}
              </p>
            </div>
            <span className="mt-3 max-w-full break-words whitespace-normal text-sm  text-gray-600">
            <FontAwesomeIcon icon={faLocationDot} /> {shopdetails?.address &&
                Object.values(shopdetails?.address).join(" ")}
            </span>
            <span className="mt-3 text-sm  text-gray-600">
              <FontAwesomeIcon icon={faPhone} /> {shopdetails?.phoneNumber}
            </span>

            <h6 className="mt-3 text-sm  text-gray-600">
              <FontAwesomeIcon icon={faBolt} /> Soonest availability: {getNextAvailableDate()}{" - "}
              {formatTime(shopdetails?.workingTime?.opening || "")}
            </h6>
          </div>
        </div>
        )}

        {shedule && (
        <div className="w-full mt-2 ms-1  p-4  border-b pb-3">
          <p className="text-gray-500 text-sm font-semibold uppercase">
            drop off at
          </p>
          <p className="text-gray-600">
            <FontAwesomeIcon icon={faClock} /> {formatDate(shedule?.date)} at{" "}
            {shedule?.time}{" "}
          </p>
          {vehicleDetails && (
            <>
          <p className="text-gray-600">
            <FontAwesomeIcon icon={faCar} />{" "}
            {`${vehicleDetails?.make}, ${vehicleDetails?.model} ${vehicleDetails?.year}`}{" "}
          </p>
          <p className="text-gray-600">
            {vehicleDetails?.description && vehicleDetails.description}{" "}
          </p>
            </>
          )}
        </div>

        )}

    </>
  )
}

export default DropOffTemp