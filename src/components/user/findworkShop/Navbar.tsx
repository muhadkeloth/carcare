import { faCity, faLocationDot, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useEffect, useRef, useState } from 'react';
import { debounce, fetchSuggestions, getAddressFromCoordinates, ToastActive } from '../../utilities/functions';
import { DropMotionWrapper, ZoomMotionWrapper } from '../../reuseComponents/ui/MotionWrapper ';
import {motion } from 'framer-motion'
import { fetchAllVehicle } from '../../../services/userService';
import { ThreeDots } from 'react-loader-spinner';
import { Suggestion } from '../../utilities/interface';
import { ScrollArea } from '../../reuseComponents/ui/scroll-area';

interface Coordinates { 
  coordinates:[number,number] | null ;
  fetchShops: (lat: string, lng: string) => void; 
  onFilterChange: (brand: string) => void;
  onSortChange: (order: string) => void;
}


const Navbar = ({coordinates, fetchShops, onFilterChange, onSortChange}:Coordinates) => {
    const [pincode,setPincode] = useState<string|null>(null);
    const [city,setCity] = useState<string|null>(null);
    const [brands, setBrands] = useState<string[]>([]);
    const [input,setInput] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false); 
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]); 
    const [coordinate, setCoordinate] = useState<[number,number]|null>(null); 


    const sortRef = useRef<HTMLSelectElement>(null);
    const filterRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        const fetchLocationAddress = async () => {
          try {
            if(!coordinates) return;
            const { pincode, street, city } = await getAddressFromCoordinates(coordinates)
            setPincode(pincode ?? null);
            setCity(street?.trim() || city?.trim() || null);            
          } catch (error) {
            console.error("Failed to fetch location:", error);
          }
        };
        fetchLocationAddress();
    }, [coordinates]);

    useEffect(()=>{
      const fetchBrands = async () => {
        try {
          const vehicleDetails = await fetchAllVehicle();
           if (!vehicleDetails || !vehicleDetails.Vehicle)
                  throw new Error("vehicle fetching error");
          setBrands(vehicleDetails.Vehicle.map(v=>v.brand));          
        } catch (error) {
          console.log("failed to fetch vehicle details:", error);  
        }
      }
      fetchBrands();
    },[])

    const handleClear = () => {
      onSortChange('');
      onFilterChange('');
      if (sortRef.current) sortRef.current.value = '';
      if (filterRef.current) filterRef.current.value = '';
    };

      const debounceFetchSuggestions = useCallback(
        debounce(async (userInput:string) => {
            setSuggestions([])
            setIsLoading(true);
            const suggestions = await fetchSuggestions(userInput);
            setIsLoading(false);
            setSuggestions(suggestions);
        },500),[]
    );

      const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const userInput = e.target.value.trimStart();
        setInput(userInput);
        if (userInput === '') {
          setSuggestions([]);
          return;
        }
        debounceFetchSuggestions(userInput);
      };

        const handleSelectSuggestion = (suggestion: Suggestion) => {
          const { geometry:{location}, description } = suggestion;
          setInput(description);
          setCoordinate([location.lat,location.lng])
          setSuggestions([]);
        };
      
        const handleLocation = useCallback( async() => {
          if(!coordinate) { ToastActive('error','location not find'); return; };
          try {
            const [lat, lng] = coordinate.map((coord) => coord.toString());
            await fetchShops(lat, lng);
          } catch (error) {
            console.log('error search by location',error)
          }
        },[coordinate, fetchShops]);


  return (


    <nav className=" p-6 pb-0 bg-white  border-b shadow-md sticky top-0 z-0 ">
      <DropMotionWrapper>
        <h5 className="font-semibold text-2xl sm:text-3xl lg:text-4xl">
          Auto Repair Shops Near Me
        </h5>
      </DropMotionWrapper>
      <ul className="flex flex-wrap items-center gap-4 px-1 py-4 mt-4">
          <motion.div
            initial={{ y: 70, opacity: 0 }}
            whileInView={{ y: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center w-full gap-4"
          >
            <div className="relative  flex-grow">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                className="w-full px-4 py-3 md:py-4 rounded-lg text-gray-900 border border-gray-300"
                placeholder="Enter your location"
              />
              <FontAwesomeIcon
                icon={faTimes}
                onClick={() => setInput("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg ">
                  <ScrollArea className="h-[200px]">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="cursor-pointer p-2 hover:bg-gray-100 hover:rounded-lg"
                    >
                      {suggestion.description}
                    </li>
                  ))}
                  </ScrollArea>
                </ul>
              )}
              {isLoading && (
                <p className="absolute w-full mt-2 flex justify-center bg-white border border-gray-300 rounded-lg shadow-lg">
                  <ThreeDots color="black" wrapperClass="" />
                </p>
              )}
            </div>
            <button
              onClick={handleLocation}
              className="btn-primary  md:w-1/3 py-3 md:py-4 flex items-center justify-center text-base"
            >
                <FontAwesomeIcon icon={faSearch} />
              <span className="ml-2 hidden sm:inline">
              Search
              </span>
            </button>
          </motion.div>

        <div className=" flex  flex-wrap items-center gap-4">
          <motion.li >
            <ZoomMotionWrapper>
              <button
                onClick={handleClear}
                className="py-1 px-3 border border-slate-500 rounded-full text-sm "
              >
                <FontAwesomeIcon icon={faTimes} /> clear
              </button>
            </ZoomMotionWrapper>
          </motion.li>
          <motion.li >
            <ZoomMotionWrapper>
              <select
                ref={sortRef}
                className="py-1 px-3 border border-slate-500 rounded-full text-sm"
                onChange={(e) => onSortChange(e.target.value)}
              >
                <option value="">Popularity</option>
                <option value="desc">Sort by Rating (High to Low)</option>
                <option value="asc">Sort by Rating (Low to High)</option>
                <option value="new">New in Town</option>
              </select>
            </ZoomMotionWrapper>
          </motion.li>
          <motion.li>
            <ZoomMotionWrapper>
              <select
                ref={filterRef}
                className="py-1 px-3 border border-slate-500 rounded-full text-sm"
                onChange={(e) => onFilterChange(e.target.value)}
              >
                <option value="">Filter By Brand</option>
                {brands?.map((ele, index) => (
                  <option key={index} value={ele}>
                    {ele}
                  </option>
                ))}
              </select>
            </ZoomMotionWrapper>
          </motion.li>
        </div>
        
        {pincode && (
          <motion.li
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ZoomMotionWrapper>
              <button className="py-1 px-3 border border-slate-500 rounded-full text-sm ">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-slate-600"
                />{" "}
                {pincode}
              </button>
            </ZoomMotionWrapper>
          </motion.li>
        )}

        {city && (
          <motion.li
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ZoomMotionWrapper>
              <button className="py-1 px-3 border border-slate-500 rounded-full text-sm ">
                <FontAwesomeIcon icon={faCity} className="text-slate-600" />{" "}
                {city}
              </button>
            </ZoomMotionWrapper>
          </motion.li>
        )}

      </ul>
    </nav>
  );
}

export default Navbar