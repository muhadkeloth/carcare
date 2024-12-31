import React, { useCallback, useState } from 'react'
import bg_blue from '../../../assets/images/bg_blue.png';
import { ThreeDots } from 'react-loader-spinner';
import { Suggestion } from '../../utilities/interface';
import { debounce, fetchSuggestions, ToastActive } from '../../utilities/functions';
import { ToastContainer } from 'react-toastify';
import { navigateFindWorkShop } from '../../utilities/navigate/userNavigator';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';


const MainSection:React.FC = () => {
  const [input,setInput] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]); 
  const [coordinates, setCoordinates] = useState<[number,number]|null>(null); 
  const navigate = useNavigate();

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
    <>
      <div className="flex flex-col mt-14 mx-auto max-w-screen-md ">
        <ToastContainer />
        <h1 className="text-3xl mt-2 font-bold md:text-6xl mb-2 text-center">
          Quality Car Service.
        </h1>
        <h1 className="font-bold text-3xl md:text-6xl md:mt-5 text-mainclr-500 text-center">
          Fair Price Guarantee.
        </h1>
        <p className="mt-6 mb-9 text-base font-medium text-center">
          Your One-Stop Solution for Car Car,{" "}
        </p>{" "}
        <div className="m-6 flex flex-col md:flex-row justify-center md:space-x-4 relative">
          <div className="w-full md:w-2/3 relative">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              className="border  border-gray-300 rounded w-full  p-4 mb-4 md:mb-0"
              placeholder="Address"
            />
            {suggestions.length > 0 && (
            <ul className="absolute z-10 left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              {suggestions.map((suggestion, index) => (
              <li 
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="cursor-pointer p-2 hover:bg-gray-100 hover:rounded-lg">
                {suggestion.description}
              </li>
              ))}
            </ul>
            )}
            {isLoading && (
              <p className="absolute w-full mt-2 flex justify-center  bg-white border border-gray-300 rounded-lg shadow-lg">
                <ThreeDots color="black" wrapperClass="" />
              </p>
            )}

          </div>
          <button
            onClick={handleLocation}
            className="btn-primary w-full md:w-1/3 p-4 "
          >
            Find Near WorkShop <span className="ml-2 hidden md:inline"><FontAwesomeIcon icon={faArrowRight} /></span>
          </button>
        </div>
      </div>
      <div
        className="mt-20 w-full h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg_blue})` }}
      >
        <h1 className="text-3xl pt-12 text-white font-bold md:text-6xl mb-2 text-center">
          One place for all your car needs.
        </h1>
        <p className="mt-6 mb-9 text-xs md:text-lg pt-3 text-white font-light text-center">
          Get help with maintaining your vehicle, fixing problems, and more.{" "}
        </p>
        {/* something here */}
      </div>
    </>
  );
}

export default MainSection