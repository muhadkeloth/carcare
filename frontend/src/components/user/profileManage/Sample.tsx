// X4gA7mFt1dx0nK3zy4VYNyG9OWR

import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

interface Suggestion {
  latitude: number;
  longitude: number;
  description: string;
}

interface AddressAutocompleteProps {
  onLocationSelect?: (location: { latitude: number; longitude: number }) => void;
}

const Sample: React.FC<AddressAutocompleteProps> = () => {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    setQuery(userInput);

    if (userInput.trim() === '') {
      setSuggestions([]);
      return;
    }

    try {
    // credentialsname:'carcaresupport'
    // description:'uses autocomplete location'
    // Project ID:9cdaa951-8c9f-4178-99c6-e216e5d87402
    // API Key:wGPuEaNbOUYOfVNQbF3WJc34l5yxRjQFn34xh7kH
    // Client ID:42406b8f-4193-4fcf-9c5d-bd7ed0b50923
    // Client Secret:urpl7mvr2OxpF5bOwpcNRHdcNYxXpxdg
    // https://api.olamaps.io/places/v1/autocomplete?input=kannur&api_key=wGPuEaNbOUYOfVNQbF3WJc34l5yxRjQFn34xh7kH
    const response = await axios.get('https://api.olamaps.io/places/v1/autocomplete', 
        { params: { input: userInput, api_key: 'wGPuEaNbOUYOfVNQbF3WJc34l5yxRjQFn34xh7kH' } }
      );
      
      
      setSuggestions(response.data.predictions); // Assuming API returns an array of suggestions
      console.log('response',response.data.predictions)
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    }
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    const { latitude, longitude, description } = suggestion;
    setQuery(description); // Update input with selected suggestion
    setSuggestions([]); // Clear suggestions
    console.log('latitude',latitude)
    console.log('longitude',longitude)
    // Notify parent component with selected location details
    // onLocationSelect({ latitude, longitude });
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Enter an address"
      />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSelectSuggestion(suggestion)}>
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sample;
