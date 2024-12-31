import { useDispatch } from 'react-redux';
import { setEstimateAddress } from '../../../features/estimateSlice';
import { BookingProps, LocationDetails } from '../../utilities/interface';
import LocationInput from '../../reuseComponents/LocationInput';


const Locationfind = ({setActiveSection}:BookingProps) => {
    const dispatch = useDispatch();

    const handleDispatch = (data:LocationDetails) => {
      dispatch(setEstimateAddress(data))
    }


  return (
    <LocationInput
      onDispatch={handleDispatch}
      onSectionChange={setActiveSection}
    />
  );
}

export default Locationfind