import { faAngleRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import carcare_logo from '../../../assets/images/Car_Care_logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { HttpStatusCode, Shop } from '../../utilities/interface'
import { fetchShopData } from '../../../services/userService'
import DropOff from './dropOff/DropOff'
import Vehicle from './Vehicle'
import Summary from './Summary'
import ContactInfo from './ContactInfo'
import Footer from '../reusableComponents/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { navigateHome } from '../../utilities/navigate/common'


const BookingSlot:React.FC = () => {
  const [shop,setShop] = useState<Shop | null>(null);
  const [activeSection, setActiveSection] = useState('DropOff')
  const location = useLocation()
  const navigate = useNavigate()
  const { shopId } = useSelector((state:RootState)=> state.bookingdetails.bookingDetails) || {};

  const fetchShops = async () => {
    try {
      const response = await fetchShopData(shopId || '');
      if(response.status == HttpStatusCode.SUCCESS){
        setShop(response.data.shopUser);
      }
    } catch (error) {
      setShop(null);
      // setError("unable to fetch nearby shops.");
    }
  }

  useEffect(()=>{
    if(!shopId){
      console.log('shopId is not herer')
    }
  } ,[shopId])
  
  useEffect(()=> {
    fetchShops();
  },[])

  return (
    <div>
      <nav className="flex p-4 border-b justify-between">
        <button>
          <span onClick={()=>navigateHome(navigate, 'user')}
           className='font-semibold text-gray-700 cursor-pointer'><FontAwesomeIcon icon={faChevronLeft} /> Exit</span> 
        </button>
        <h1 className='font-semibold text-3xl text-gray-700'>{shop?.shopName}</h1>
        <img src={carcare_logo} className="h-8" alt="carCare" />
      </nav>

      <div className="container flex flex-col max-w-6xl mx-auto px-4 mb-10  ">
        <div className="flex p-6 justify-center ">
          <ul className='flex  gap-4 items-center font-semibold text-sm text-gray-600'>
            <li className={activeSection == 'DropOff' ? 'text-mainclr-600' : ''}>Drop Off</li><FontAwesomeIcon icon={faAngleRight} />
            <li className={activeSection == 'Vehicle' ? 'text-mainclr-600' : ''}>Vehicle</li><FontAwesomeIcon icon={faAngleRight} />
            <li className={activeSection == 'ContactInfo' ? 'text-mainclr-600' : ''}>Contact Info</li><FontAwesomeIcon icon={faAngleRight} />
            <li className={activeSection == 'Summary' ? 'text-mainclr-600' : ''}>Summary</li>
          </ul>
        </div>

        {activeSection === 'DropOff' && shop && <DropOff shop={shop} setActiveSection={setActiveSection} />}
        {activeSection === 'Vehicle' && shop && <Vehicle shop={shop} setActiveSection={setActiveSection} />}
        {activeSection === 'ContactInfo' && shop && <ContactInfo shop={shop} setActiveSection={setActiveSection} />}
        {activeSection === 'Summary' && shop && <Summary shop={shop} setActiveSection={setActiveSection} />}          

      </div>

      <Footer />
    </div>
  )
}

export default BookingSlot