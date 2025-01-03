import React from 'react'
import { SectionMainProps } from '../../utilities/interface'
import ProfileDetails from './ProfileDetails'
import EditProfile from './EditProfile'
import ChangePassword from './ChangePassword'
import Bookings from './bookings/Bookings'
import Pickups from './pickups/Pickups'

const ProfileMain:React.FC<SectionMainProps> = ({ activeSection }) => {

  const renderSection = () => {
    switch (activeSection){
      case 'editProfile':
        return <EditProfile />;
      case 'bookings':
        return <Bookings />;
      case 'pickups':
        return <Pickups />;
      case 'changePassword':
        return <ChangePassword />;
      default:
        return <ProfileDetails />;
    }
  }
  return (
    <div className='flex-1 p-1 sm:p-2 bg-gray-100 '>
      {renderSection()}
    </div>
  )
}

export default ProfileMain