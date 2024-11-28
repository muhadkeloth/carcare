// import React from 'react'
// import { estimateProps } from './Locationfind'

// const ShopDetails:React.FC<estimateProps> = ({setActiveSection}) => {


//     const handlelocation = () => {
//         setActiveSection('RepairService')
//     }


//   return (
//     <div className="flex justify-center p-5 pt-2  ">
//       <div className="flex max-w-6xl mx-auto px-4 mb-10 py-12  flex-col mt-24 items-center ">
//         <h2 className="text-5xl font-semibold">Choose NearBy Shop</h2>

//         <form className="mt-10 ">
//           <label htmlFor="pincode"
//             className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
//             pincode
//           </label>
//           <div className="relative ">
//             <input type="number" 
//             // value={input}
//               // onChange={(e) => handleinputval(e)}
//               className="block w-96 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 "
//               placeholder="Enter Pincode. . ." required
//             />
//             <button
//               type="button" onClick={() => handlelocation()}
//               className="btn-primary absolute end-2.5 bottom-2.5 px-4 py-2">Continue</button>
//           </div>
//         </form>
//       </div>
//     </div>


// //     <div className='min-h-screen flex flex-col mt-24 items-center'>
// //     <h2 className="text-5xl">Tell us about your vehicle</h2>
// // </div>
//   )
// }

// export default ShopDetails




import React, { useEffect, useState } from 'react';
import { estimateProps } from './Locationfind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { HttpStatusCode } from '../../utilities/interface';
import { fetchShopByPincode } from '../../../services/userService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setEstimateShopdetails } from '../../../features/estimateSlice';

interface Shop {
  id: string;
  shopName: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  image: string;
}

const ShopDetails: React.FC<estimateProps> = ({ setActiveSection }) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);
  const { pincode } = useSelector((state: RootState) => state.estimate.estimateDetails) || {};
  const dispatch = useDispatch()

  const fetchShops = async () => {
    try {
      setLoading(true);
      if(!pincode || pincode.length == 0){
        setActiveSection('Location');
        return;
      }
      const response = await fetchShopByPincode(pincode); 
      if(response.status !== HttpStatusCode.SUCCESS)throw new Error('error fetching shop suggestions')
        const {shops} = response.data;
        setShops(shops);
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectShop = (shop:any) => {
    dispatch(setEstimateShopdetails(shop))
    setActiveSection('RepairService');
  };
  
  useEffect(()=>{
    fetchShops()
  },[])
  
  return (
    <div className="flex justify-center p-5 pt-2">
      <div className="flex max-w-6xl mx-auto px-4 mb-10 py-12 flex-col mt-24 items-center">
        <h2 className="text-5xl font-semibold">Choose Nearby Shop</h2>
        <div className="mt-10 w-full ">
          <div className="grid grid-cols-1  gap-6">
            {shops.map((shop) => (
              <div key={shop.id}
                onClick={() => handleSelectShop(shop)}
                className="border rounded-lg shadow-md cursor-pointer flex items-center hover:shadow-sm" >
                <div className="w-1/4">
                <img
                  src={`${import.meta.env.VITE_ENDPORTFRONT}/${shop.image}`}
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
  );
};

export default ShopDetails;





