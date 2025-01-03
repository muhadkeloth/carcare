import {  BookingProps } from '../../utilities/interface';
import { setPickCarShopdetails } from '../../../features/pickMyCarSlice';
import ShopsbyLocation from '../../reuseComponents/ShopsbyLocation';

const WorkShop = ({setActiveSection}:BookingProps) => {
  return (
    <ShopsbyLocation
    setActiveSection={setActiveSection}
    sliceSelector={(state) => state.pickMyCar.PickCarDetails}
    setShopDetails={setPickCarShopdetails}
    nextSection="Vehicle"
  />
  )
}

export default WorkShop