import { BookingProps } from '../../utilities/interface';
import { setEstimateShopdetails } from '../../../features/estimateSlice';
import ShopsbyLocation from '../../reuseComponents/ShopsbyLocation';


const ShopDetails: React.FC<BookingProps> = ({ setActiveSection }) => {  
  return (
    <ShopsbyLocation
    setActiveSection={setActiveSection}
    sliceSelector={(state) => state.estimate.estimateDetails}
    setShopDetails={setEstimateShopdetails}
    nextSection="RepairService"
  />  
  );
};

export default ShopDetails;





