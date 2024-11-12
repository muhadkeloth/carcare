import { faCircleInfo, faImages, faKey, faPencil, faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { SidebarProps } from '../../../utilities/interface'

const SidebarShopprofile:React.FC<SidebarProps> = ({activeSection, handleActiveSection, children}) => {
  return (
    <div className="container mx-auto p-4">
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="overflow-x-auto">
        <ul className="flex border-b whitespace-nowrap">
          <li>
            <button 
            onClick={()=>handleActiveSection('EditProfile')}
            className={`inline-block py-2 px-4 ${activeSection == 'EditProfile'? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500' } `}>
              <FontAwesomeIcon icon={faPencil} /> Edit Profile
            </button>
          </li>
          <li>
            <button 
            onClick={()=>handleActiveSection('ChangePass')}
            className={`inline-block py-2 px-4 ${activeSection == 'ChangePass'? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500' } `}>
              <FontAwesomeIcon icon={faKey} /> Change Password
            </button>
          </li>
          <li>
            <button 
            onClick={()=>handleActiveSection('AddImages')}
            className={`inline-block py-2 px-4 ${activeSection == 'AddImages'? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500' } `}>
              <FontAwesomeIcon icon={faImages} /> Add Images
            </button>
          </li>
          <li>
            <button 
            onClick={()=>handleActiveSection('MoreInfo')}
            className={`inline-block py-2 px-4 ${activeSection == 'MoreInfo'? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500' } `}>
              <FontAwesomeIcon icon={faCircleInfo} /> More Info
            </button>
          </li>
          <li>
            <button 
            onClick={()=>handleActiveSection('Reviews')}
            className={`inline-block py-2 px-4 ${activeSection == 'Reviews'? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500' } `}>
              <FontAwesomeIcon icon={faStar} /> Reviews
            </button>
          </li>
        </ul>
        
        {children}

      </div>
    </div>
  </div>
  )
}

export default SidebarShopprofile