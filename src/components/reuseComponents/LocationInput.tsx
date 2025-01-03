import { useCallback, useEffect, useState } from "react";
import { ZoomInMotionWrapper } from "./ui/MotionWrapper "
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ThreeDots } from "react-loader-spinner";
import { LocationDetails, Suggestion } from "../utilities/interface";
import { debounce, fetchSuggestions, ToastActive } from "../utilities/functions";

interface LocationInputProps {
    onDispatch: (data: LocationDetails) => void;
    onSectionChange: (section: string) => void;
    clearDetails?: () => void;
  }

const LocationInput = ({ onDispatch, onSectionChange, clearDetails }:LocationInputProps) => {
    const [input, setInput] = useState<string>("");
    const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);

    

    const debounceFetchSuggestions = useCallback(
      debounce(async (userInput: string) => {
        setSuggestions([]);
        setIsLoading(true);
        const suggestions = await fetchSuggestions(userInput);
        setIsLoading(false);
        setSuggestions(suggestions);
      }, 500),
      []
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
    setIsButtonEnabled(true);
  };

  const handleLocation = () => {
    if (!coordinates) {
      ToastActive("error", "Location not found");
      return;
    }
    onDispatch({ description: input, coordinates });
    onSectionChange("Workshop");
  };

  useEffect(() => {
    if (clearDetails) {
      clearDetails();
    }
  }, [clearDetails]);

  return (
    <ZoomInMotionWrapper className="flex justify-center p-5 pt-2">
    <div className="flex max-w-6xl mx-auto px-4 mb-10 py-12 flex-col mt-24 items-center border rounded-lg">
      <h2 className="text-5xl font-semibold">Enter your Address</h2>

      <form className="mt-10">
        <label
          htmlFor="address"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Address
        </label>
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            className="block w-96 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
            placeholder="Enter address..."
            required
          />
          <button
            type="button"
            onClick={handleLocation}
            disabled={!isButtonEnabled}
            className={`${
              !isButtonEnabled && "cursor-not-allowed"
            } btn-primary absolute end-2.5 bottom-2.5 px-4 py-2 `}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>

          {suggestions.length > 0 && (
            <ul className="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
          {isLoading && (
            <p className="absolute w-full mt-2 flex justify-center bg-white border border-gray-300 rounded-lg shadow-lg">
              <ThreeDots color="black" wrapperClass="" />
            </p>
          )}
        </div>
      </form>
    </div>
  </ZoomInMotionWrapper>
  )
}

export default LocationInput