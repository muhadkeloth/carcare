import React, { useCallback, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner';
import { Suggestion } from '../../utilities/interface';
import { debounce, fetchSuggestions, ToastActive } from '../../utilities/functions';
import { ToastContainer } from 'react-toastify';
import { navigateFindWorkShop } from '../../utilities/navigate/userNavigator';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faMapPin } from '@fortawesome/free-solid-svg-icons';
import car_main_block from '../../../assets/images/car_main_block.jpg';
import { motion } from 'framer-motion'
import { ScrollArea } from '../../reuseComponents/ui/scroll-area';


const MainSection:React.FC = () => {
  const [input,setInput] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]); 
  const [coordinates, setCoordinates] = useState<[number,number]|null>(null); 
  const navigate = useNavigate();
  const text = "Fair Price Guarantee."; 


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
    setCoordinates([location.lat,location.lng])
    setSuggestions([]);
  };

  const handleLocation = () => {
    if(!coordinates) { ToastActive('error','location not find'); return; };
      navigateFindWorkShop(navigate,coordinates)
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative flex flex-col justify-center items-center  bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${car_main_block})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "2rem",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative w-full max-w-screen-lg px-4 py-8 md:py-16 text-center">
        <ToastContainer />
        <motion.h1
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease:"easeOut" }}
        className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
          Quality Car Service.
        </motion.h1>
        <h1 
        className="font-bold text-3xl md:text-5xl lg:text-6xl text-mainclr-500 mb-6">
          {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          {char}
        </motion.span>
      ))}
        </h1>
        <motion.p 
        initial={{ opacity: 0,scale:0.8 }}
        animate={{ opacity: 1,scale:1 }}
        transition={{ duration: 0.8 }}
        className="text-sm md:text-base font-medium mb-8 text-white">
          Your One-Stop Solution for Car Care
        </motion.p>
        <motion.div 
        initial={{ y: 70, opacity: 0 }}
        whileInView={{ y: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col md:flex-row justify-center items-center md:space-x-4 w-full">
          <div className="relative w-full md:w-2/3 mb-4 md:mb-0">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              className="w-full px-4 py-3 md:py-4 rounded-lg text-gray-900 border border-gray-300"
              placeholder="Enter your location"
            />
            <FontAwesomeIcon
              icon={faMapPin}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                <ScrollArea className='h-[200px]'>
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
            className="btn-primary w-full md:w-1/3 py-3 md:py-4 flex items-center justify-center text-sm md:text-base"
          >
            Find Near WorkShop
            <span className="ml-2 hidden md:inline">
              <FontAwesomeIcon icon={faArrowRight} />
            </span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default MainSection