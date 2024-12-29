import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { BookingProps, Shop } from "../utilities/interface";
import { RootState } from "../../store";
import { useEffect, useState } from "react";
import { HoverMotionWrapper } from "./ui/MotionWrapper ";
import { useDispatch, useSelector } from "react-redux";
import { fetchNearbyShops } from "../../services/userService";


interface NearbyShopsProps extends BookingProps {
  sliceSelector: (state: RootState) => any;
  setShopDetails: (shop: Shop) => any;
  nextSection: string;
}


const ShopsbyLocation = ({setActiveSection,sliceSelector,setShopDetails,nextSection}:NearbyShopsProps) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);
  const { locationdetails } = useSelector(sliceSelector) || {};
  const dispatch = useDispatch();

  const fetchShops = async () => {
    try {
      setLoading(true);
      if(!locationdetails?.coordinates){
        setActiveSection('Location');
        return;
      }
      const shopsData = await fetchNearbyShops(locationdetails.coordinates[0],locationdetails.coordinates[1]); 
        setShops(shopsData);
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectShop = (shop: Shop) => {
    dispatch(setShopDetails(shop));
    setActiveSection(nextSection);
  };

  useEffect(() => {
    fetchShops();
  }, []);


  return (
    <div className="flex justify-center p-5 pt-2">
    <div className="flex max-w-6xl mx-auto px-4 mb-10 py-12 flex-col mt-24 items-center">
      <h2 className="text-5xl font-semibold">Choose Nearby Shop</h2>
      <div className="mt-10 w-full ">
        <div className="grid grid-cols-1  gap-6">
          {shops.map((shop) => (
            <HoverMotionWrapper key={shop._id} >
            <div             
              onClick={() => handleSelectShop(shop)}
              className="border rounded-lg shadow-md cursor-pointer flex items-center hover:shadow-sm" >
              <div className="w-1/4">
              <img
                src={shop.image}
                alt={shop.shopName}
                className="w-32 h-32 object-cover rounded-md "
              />
              </div>
              <div className="w-3/4 ps-3 mx-2 ">
              <h3 className="flex justify-between text-lg font-semibold">
              {shop.shopName}
              <button
                className="text-sm text-mainclr-600 Hover:text-mainclr-400 hover:underline cursor-pointer">
                Select
              </button>
              </h3>
              <p className="text-sm text-gray-500">
                {Object.values(shop.address).join(' ')}
              </p>
                </div>
            </div>
            </HoverMotionWrapper>
          ))}
        </div>
        {!loading && shops.length === 0 && (
          <div className='flex flex-col items-center py-4  text-center border'>
          <p className="text-gray-500 my-4 ">No shops found for the entered pincode.</p>
          <button className='btn-primary  w-1/2' onClick={()=>setActiveSection('Location')}>
          <FontAwesomeIcon icon={faArrowLeft} /> Change Location
          </button>
          </div>
        )}
      </div>
    </div>
  </div>
  )
}

export default ShopsbyLocation