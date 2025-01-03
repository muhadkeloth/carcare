import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMapPin, faStar } from '@fortawesome/free-solid-svg-icons';
import { HoverMotionWrapper } from '../../reuseComponents/ui/MotionWrapper ';
import { Shop } from '../../utilities/interface';
import { fetchTopShops } from '../../../services/userService';
import { getStatusMessageofShop } from '../../utilities/functions';
import { setShopUser } from '../../../features/shopSlice';
import { navigateBookingSlot, navigateShopDetailPage } from '../../utilities/navigate/userNavigator';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setShopdetails } from '../../../features/bookingSlice';


const Workshops = () => {
    const [shops,setShops] = useState<Shop[]>([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

     const fetchShops = async () => {
           try {
                   const shopsData = await fetchTopShops();
                   if(shopsData instanceof Array){
                     setShops(shopsData);
                   }
           } catch (error) {
             const errorMessage = (error as Error).message;
             console.error("error fetching nearby shops:",errorMessage);
             setShops([]);
           }
       }

        const handleShopDetails = (shop:Shop) => {
           dispatch(setShopUser(shop));
           navigateShopDetailPage(navigate, shop._id)
         }

           const handleAvailability = (event:React.MouseEvent<HTMLDivElement>,shop:Shop) => {
             event.stopPropagation(); 
             dispatch(setShopdetails(shop))
             navigateBookingSlot(navigate);
           }


    useEffect(()=>{
           fetchShops();
       },[]);

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl font-bold text-center mb-10"
        >
          Top Featured Workshops
        </motion.h1>
        <div
          className={`grid gap-8 ${
            shops.length === 1
              ? "grid-cols-1 justify-items-center"
              : shops.length === 2
              ? "grid-cols-2 justify-items-center"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {shops.length > 0 ? (
            shops.map((shop, index) => (
              <HoverMotionWrapper
                key={index}
                className="bg-white rounded-xl cursor-pointer shadow-lg overflow-hidden"
                >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => handleShopDetails(shop)}
                  className="relative aspect-video overflow-hidden"
                >
                  <img
                    src={shop.image}
                    alt={shop.shopName}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <div className="p-6">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-2xl flex justify-between font-bold mb-2"
                  >
                    <h2 className=" font-medium  text-gray-900">
                      {shop.shopName[0].toUpperCase() + shop.shopName.slice(1)}
                    </h2>
                    <p className="text-base">
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
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col text-gray-600 gap-y-1 mt-3"
                  >
                    <div>
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
                    </div>
                    <div>
                      <FontAwesomeIcon icon={faMapPin} className="w-5 h-5" />
                      <span>{Object.values(shop.address).join(" ")}</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-6 flex items-center justify-between"
                    onClick={(event) => handleAvailability(event, shop)} 
                  >
                    <button
                     className="btn-primary w-full">
                      Check Availability
                    </button>
                  </motion.div>
                </div>
              </HoverMotionWrapper>
            ))
          ) : (
            <p>No shops available.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Workshops