// import React, { useEffect, useRef, useState } from 'react'
// import { HttpStatusCode, Shop } from '../../utilities/interface';
// import {  fetchShopData } from '../../../services/userService';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { navigateBookingSlot } from '../../utilities/navigate/userNavigator';
// import { useDispatch } from 'react-redux';
// import { clearbookingdetails, setShopdetails } from '../../../features/bookingSlice';
// import { clearestimateDetails } from '../../../features/estimateSlice';


// const MainBlock:React.FC = () => {
//     const [activeSection, setActiveSection] = useState('Overview');
//     const [shop, setShop] = useState<Shop | null>(null);
//     const [error, setError] = useState<string | null>(null);
//     const location = useLocation();
//     const dispatch = useDispatch();
//     const navigate = useNavigate()
//     const {id} = location.state

//   const overviewRef = useRef<HTMLDivElement>(null);
//   const aboutRef = useRef<HTMLDivElement>(null);
//   const reviewsRef = useRef<HTMLDivElement>(null);

//   const handleScrollToSection = (section: string) => {
//     setActiveSection(section);
//     const sectionRef =
//       section === 'Overview'
//         ? overviewRef
//         : section === 'About'
//         ? aboutRef
//         : reviewsRef;

//     if (sectionRef && sectionRef.current) {
//       sectionRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   const handleScroll = () => {
//     const sections = [
//       { name: 'Overview', ref: overviewRef },
//       { name: 'About', ref: aboutRef },
//       { name: 'Reviews', ref: reviewsRef },
//     ];

//     sections.forEach(({ name, ref }) => {
//       if (ref.current) {
//         const rect = ref.current.getBoundingClientRect();
//         if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
//           setActiveSection(name);
//         }
//       }
//     });
//   };

//   const fetchShops = async () => {
//     try {

//         const response = await fetchShopData(id);
//         console.log('response',response)
//         if(response.status == HttpStatusCode.SUCCESS){            
//             setShop(response.data.shopUser);            
//         }
//     } catch (error) {
//       const errorMessage = (error as Error).message;
//       console.error("error fetching nearby shops:", error);
//       setShop(null);
//       setError(errorMessage);
//       setError("unable to fetch nearby shops.");
//     }
//   };

//   const handleAvailability = () => {
//     if(!shop)return;   
//     dispatch(setShopdetails(shop))
//     navigateBookingSlot(navigate);
//   }


//   useEffect(() => {
//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };    
//   }, []);
  
//   useEffect(()=>{
//     fetchShops();
//     dispatch(clearbookingdetails())
//     dispatch(clearestimateDetails())
//   },[])

//   return (
//     <div className="container max-w-6xl mx-auto px-4">
//       <nav className="p-4 bg-white border-b sticky top-0 z-50">
//         <h1 className="text-2xl font-bold">Shop Details</h1>
//       </nav>

//       <div className="bg-white sticky top-16 z-50 p-4 pb-0 flex space-x-6 border-b">
//         <ul className="flex gap-3 ">
//           <li>
//             <button
//               className={`cursor-pointer py-2 ${
//                 activeSection === "Overview" ? "font-bold text-mainclr-500" : ""
//               }`}
//               onClick={() => handleScrollToSection("Overview")}
//             >
//               Overview
//             </button>
//           </li>
//           <li>
//             <button
//               className={`cursor-pointer py-2 ${
//                 activeSection === "About" ? "font-bold text-mainclr-500" : ""
//               }`}
//               onClick={() => handleScrollToSection("About")}
//             >
//               About
//             </button>
//           </li>
//           <li>
//             <button
//               className={`cursor-pointer py-2 ${
//                 activeSection === "Reviews" ? "font-bold text-mainclr-500" : ""
//               }`}
//               onClick={() => handleScrollToSection("Reviews")}
//             >
//               Reviews
//             </button>
//           </li>
//         </ul>
//       </div>

//       <div className="flex">
//         <div className="p-6 space-y-12 w-2/3">
//           <div ref={overviewRef} className="space-y-4">
//             <div className="">
//               <img
//                 src={shop?.image}
//                 alt="shop img"
//                 className="w-fit object-cover rounded"
//               />
//             </div>
//             <h2 className="text-xl font-semibold">{shop?.shopName}</h2>
//             <p>
//               discription [added in next week]
//               <br />
//               <br />
//               {shop?.address.city}, {shop?.address.street}
//               <br />
//               {shop?.address.state}, {shop?.address.country}
//               <br />
//               {shop?.address.pincode}
//             </p>
//           </div>

//           <div ref={aboutRef} className="space-y-4">
//             <h2 className="text-xl font-semibold">About</h2>
//             <p>
//               This section contains detailed information about the shop,
//               including its history, services, and more.
//             </p>
//           </div>

//           <div ref={reviewsRef} className="space-y-4">
//             <h2 className="text-xl font-semibold">Reviews</h2>
//             <p>
//               Here you can read customer reviews and testimonials about the
//               shop.
//             </p>
//           </div>
//         </div>

//         <div className="w-1/3 ">
//           <div className="border rounded mt-5 px-2 py-5 space-y-3 text-center">
//             <p>Soonest available time:</p>
//             <h2 className="font-bold">Wed, Oct 13, 2024 at 8:00 am</h2>
//             <button onClick={handleAvailability} className="btn-primary w-full">
//               Book Appointment
//             </button>
//             <h2 className="text-mainclr-500">Check Availability</h2>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MainBlock






import React, { useEffect, useState } from "react";
import ShopHeader from "./ShopHeader";
import ShopOverview from "./ShopOverview";
import ShopServices from "./ShopServices";
import ShopReviews from "./ShopReviews";
import BookingPanel from "./BookingPanel";
import { clearestimateDetails } from "../../../features/estimateSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";

const MainBlock: React.FC = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const dispatch = useDispatch();
  const shopDetails = useSelector((state:RootState) => state.shop.shopDetails)
  console.log('shopDetails',shopDetails)

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };


  useEffect(() => {
    dispatch(clearestimateDetails());
  }, []);

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
              <ShopHeader activeSection={activeSection} onSectionChange={scrollToSection} />
              <div className="container max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-12">
                    <ShopOverview />
                    <ShopServices />
                    <ShopReviews />
                  </div>
                  <div className="lg:col-span-1">
                    <BookingPanel />
                  </div>
                </div>
              </div>
      </div>
    </div>
  );
};

export default MainBlock;