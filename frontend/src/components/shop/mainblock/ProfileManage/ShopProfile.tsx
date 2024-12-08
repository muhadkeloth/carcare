import React, {  useEffect, useState } from 'react';
import EditProfile from './editcomponents/EditProfile';
import SidebarShopprofile from './SidebarShopprofile';
import WorkingTime from './editcomponents/WorkingTime';
import MoreInfo from './editcomponents/MoreInfo';
import Reviews from './editcomponents/Reviews';
import ChangePass from './editcomponents/ChangePass';
import { fetchShopUserDetails } from '../../../../services/shopService';
import { useDispatch } from 'react-redux';
import { clearShopUser, setShopUser } from '../../../../features/shopSlice';
import { ThreeDots } from 'react-loader-spinner';
import { ToastActive } from '../../../utilities/functions';



const ShopProfile: React.FC = () => {
  const [isLoading,setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('EditProfile');
  const dispatch = useDispatch()


  const handleActiveSection = (section: string) => {
    setActiveSection(section)
  };
  
  const fetchshopdetails = async () => {
    try {
      const response = await fetchShopUserDetails()
      if(!response || !response.data) throw new Error('canot find shop user details');
      dispatch(setShopUser(response.data.shopUser))
    } catch (error) {
      const errorMessage = (error as Error).message;
      ToastActive('error',errorMessage)
    }finally{
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    fetchshopdetails()
    return ()=>{
      dispatch(clearShopUser())
    }
  },[dispatch])

  return (
    <div className="p-4">

        <h2 className="text-2xl font-bold ms-1 mt-1 mb-4 pe-1 text-gray-800">
          Profile Management
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <ThreeDots color="#0098D3" />
          </div>
        ) : (
          <SidebarShopprofile activeSection={activeSection} handleActiveSection={handleActiveSection} >
        {activeSection === 'EditProfile' && <EditProfile />}
        {activeSection === 'ChangePass' && <ChangePass />}
        {activeSection === 'MoreInfo' && <MoreInfo />}
        {activeSection === 'WorkingTime' && <WorkingTime />}
        {activeSection === 'Reviews' && <Reviews />}
      </SidebarShopprofile>
      )} 
    </div>
  );
};

export default ShopProfile;
