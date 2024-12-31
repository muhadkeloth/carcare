import { useDispatch } from 'react-redux';
import { clearPickCarDetails, setPickCarAddress,  } from '../../../features/pickMyCarSlice';
import { BookingProps, LocationDetails } from '../../utilities/interface';
import LocationInput from '../../reuseComponents/LocationInput';



const Location:React.FC<BookingProps> = ({setActiveSection}) => {
    const dispatch = useDispatch();

    const handleDispatch = (data: LocationDetails) => {
      dispatch(setPickCarAddress(data));
    };

  return (
    <LocationInput
    onDispatch={handleDispatch}
    onSectionChange={setActiveSection}
    clearDetails={() => dispatch(clearPickCarDetails())}
  />
  );
}

export default Location