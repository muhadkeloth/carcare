import React, {   useState } from 'react';
import EditProfile from './editcomponents/EditProfile';
import SidebarShopprofile from './SidebarShopprofile';
import WorkingTime from './editcomponents/WorkingTime';
import MoreInfo from './editcomponents/MoreInfo';
import Reviews from './editcomponents/Reviews/Reviews';
import ChangePass from './editcomponents/ChangePass';
import { ZoomInMotionWrapper } from '../../../reuseComponents/ui/MotionWrapper ';

const ShopProfile: React.FC = () => {
  const [activeSection, setActiveSection] = useState('EditProfile');

  const handleActiveSection = (section: string) => {
    setActiveSection(section)
  };
  

  return (
    <div className="p-4">
        <h2 className="text-2xl font-bold ms-1 mt-1 mb-4 pe-1 text-gray-800">
          Profile Management
        </h2>
        <ZoomInMotionWrapper>
          <SidebarShopprofile activeSection={activeSection} handleActiveSection={handleActiveSection} >
        {activeSection === 'EditProfile' && <EditProfile />}
        {activeSection === 'ChangePass' && <ChangePass />}
        {activeSection === 'MoreInfo' && <MoreInfo />}
        {activeSection === 'WorkingTime' && <WorkingTime />}
        {activeSection === 'Reviews' && <Reviews />}
      </SidebarShopprofile>
      </ZoomInMotionWrapper>      
      
    </div>
  );
};

export default ShopProfile;
