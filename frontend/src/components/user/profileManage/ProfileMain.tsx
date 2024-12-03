import React from 'react'
import { SectionMainProps } from '../../utilities/interface'
import ProfileDetails from './ProfileDetails'
import EditProfile from './EditProfile'
import ChangePassword from './ChangePassword'

const ProfileMain:React.FC<SectionMainProps> = ({ activeSection }) => {
  return (
    <div className='flex-1 p-1 sm:p-2 bg-gray-100 '>
      {activeSection === 'profile' && <ProfileDetails />}
      {activeSection === 'editProfile' && <EditProfile />}
      {activeSection === 'changePassword' && <ChangePassword />}
    </div>
  )
}

export default ProfileMain