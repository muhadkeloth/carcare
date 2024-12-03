import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faArrowRightFromBracket, faArrowLeft, } from '@fortawesome/free-solid-svg-icons';
import { CRUDbarProps, SidebarProps } from '../utilities/interface';



const SidebarCRUD:React.FC<SidebarProps & CRUDbarProps> = ({ title, sections, activeSection, handleActiveSection, handleLogout, showMenu }) => {
  return (
    <>
      <div className="flex w-full mb-6 pe-3 items-center justify-between">
        <h2 className="text-xl font-bold ">{title}</h2>
        {showMenu && ( <FontAwesomeIcon icon={faArrowLeft} onClick={() => handleActiveSection(activeSection)} className='hover:cursor-pointer' /> )}
      </div>

      <nav className="flex flex-col w-full space-y-4">
        {sections.map((section) => (
            <button key={section.key} onClick={() => handleActiveSection(section.key)}
            className={`flex items-center space-x-2 hover:text-mainclr-200 ${
                activeSection == section.key ? "text-mainclr-700 border-r-4 border-mainclr-900" : "" } `} >
          <FontAwesomeIcon icon={section.icon} />
          <span>{section.label}</span>
        </button>
        ))}
        <button className="flex items-center space-x-2 hover:text-mainclr-200 " onClick={handleLogout} >
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          <span>Logout</span>
        </button>
      </nav>
    </>
  );
}

export default SidebarCRUD