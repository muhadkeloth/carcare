import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const Navbar:React.FC = () => {
  return (
    <nav className='p-6 pb-0 bg-white-600 sticky top-0 border-b shadow-md '>
        <h5 className="font-semibold text-4xl">Auto Repair Shops Near Me</h5>
            <ul className='flex gap-2 px-1 py-4 mt-4'>
                <li>
                    <button className="py-1 px-3 border border-slate-500 rounded-full text-sm "><FontAwesomeIcon icon={faLocationDot} className='text-slate-600' /> pincode</button>
                </li>
                <li>
                    <button className="py-1 px-3 border border-slate-500 rounded-full text-sm ">Make</button>
                </li>
                <li>
                    <button className="py-1 px-3 border border-slate-500 rounded-full text-sm ">Sorting by</button>
                </li>
                <li>
                    <button className="py-1 px-3 border border-slate-500 rounded-full text-sm ">Availability</button>
                </li>
                <li>
                    <button className="py-1 px-3 border border-slate-500 rounded-full text-sm ">Specialties</button>
                </li>
            </ul>
    </nav>
  )
}

export default Navbar