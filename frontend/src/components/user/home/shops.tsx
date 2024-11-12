import React, { useEffect, useState } from 'react'
import { fetchNearbyShops } from '../../../services/userService';
import { Shop } from '../../utilities/interface';
import { ThreeDots } from 'react-loader-spinner';



const Shops:React.FC = () => {
    const [shops,setShops] = useState<Shop[]>([]);
    const [error,setError] = useState<string | null>(null);

    const fetchShops = async () => {
        try {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;

                console.log('now showing fetch')

                const shopsData = await fetchNearbyShops(latitude, longitude);
                setShops(shopsData);
            });
        } catch (error) {
            console.error("error fetching nearby shops:",error);
            setShops([]);
            setError("unable to fetch nearby shops.")
        }
    }

    useEffect(()=>{
        fetchShops();
    },[]);

    if(error) return (<p>{error}</p>)
    if(shops.length == 0) return (<p ><ThreeDots height={10} color='#0098d3' wrapperClass="m-10"  /></p>)

  return (
    <div className="flex flex-wrap gap-4 m-14 justify-center ">
      {shops.length > 0 ? (
        shops.map((shop,index) => (
          <div key={index} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 ">
            <a href="#"
              className="flex flex-col  bg-white border border-gray-200 rounded-lg shadow  hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700" >
              <img
                className="object-cover w-full rounded-t-lg h-96 md:h-72 "
                src={`${import.meta.env.VITE_ENDPORTFRONT}/${shop.image}`}
                alt="" />
              <div className="flex-col  p-4">
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {shop.shopName}
                </h5>
                <p className="mb-3 font-normal flex-col text-gray-700 dark:text-gray-400">
                  {shop?.address && Object.values(shop?.address).join(" ")}
                </p>
                <button className="mb-3 bg-maincol rounded text-white p-2 w-full hover:bg-maincoldark hover:cursor-pointer">
                  {" "}
                  Check Availability
                </button>
              </div>
            </a>
          </div>
        ))
      ) : (
        <p>No shops available.</p>
      )}
    </div>
  );
}

export default Shops