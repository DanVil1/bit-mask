import React, { useState } from 'react';
import './App.css';

// City data with names and their GMT offsets.
const citiesData = [
  { name: "Moscow", gmt: 3 },
  { name: "Paris", gmt: 2 },
  { name: "Berlin", gmt: 2 },
  { name: "Brussels", gmt: 2 },
  { name: "Amsterdam", gmt: 2 },
  { name: "Rome", gmt: 2 },
  { name: "London", gmt: 1 },
  { name: "Dublin", gmt: 1 },
  { name: "New York", gmt: -4 },
  { name: "Washington, DC", gmt: -4 },
  { name: "St. Louis", gmt: -5 },
  { name: "Los Angeles", gmt: -7 },
  { name: "Tokyo", gmt: 9 },
  { name: "Beijing", gmt: 8 },
  { name: "Ho Chi Mihn City", gmt: 7 },
  { name: "Mumbai", gmt: 5 },
];

// Function to convert a GMT offset to a bit mask.
// Assumes offsets between +12 and -11.
const getBitMask = (offset) => {
  const index = 12 - offset; // e.g., for GMT +3, index = 9.
  return 1 << index;
};

function App() {
  // State to store the user's input for GMT offset,
  // the search results, and whether to exclude matching cities.
  const [searchOffset, setSearchOffset] = useState('');
  const [results, setResults] = useState([]);
  const [exclude, setExclude] = useState(false);

  // Precompute each city's bit mask and attach it to the data.
  const cities = citiesData.map(city => ({
    ...city,
    bitMask: getBitMask(city.gmt),
  }));

  // Handler to filter cities using bitwise operations.
  const handleSearch = () => {
    const offsetNumber = parseInt(searchOffset, 10);
    if (isNaN(offsetNumber)) {
      alert('Please enter a valid GMT offset.');
      return;
    }
    const searchMask = getBitMask(offsetNumber);

    const filtered = cities.filter(city => {
      // For inclusion: (city.bitMask & searchMask) equals searchMask.
      // For exclusion: (city.bitMask & searchMask) equals 0.
      if (exclude) {
        return (city.bitMask & searchMask) === 0;
      }
      return (city.bitMask & searchMask) === searchMask;
    });

    setResults(filtered);
  };

  return (
    <div className="App">
      <h1>Bit Masks App</h1>

      {/* City List with Checkboxes */}
      <div className="city-list">
        <h2>Cities</h2>
        {cities.map((city, index) => (
          <div key={index}>
            <input type="checkbox" id={`city-${index}`} />
            <label htmlFor={`city-${index}`}>
              {city.name} (GMT {city.gmt >= 0 ? `+${city.gmt}` : city.gmt})
            </label>
          </div>
        ))}
      </div>

      {/* GMT Search Input */}
      <div className="search">
        <h2>Search by GMT Offset</h2>
        <input
          type="number"
          value={searchOffset}
          onChange={(e) => setSearchOffset(e.target.value)}
          placeholder="Enter GMT offset"
        />
        <div>
          <input 
            type="checkbox" 
            checked={exclude} 
            onChange={() => setExclude(!exclude)} 
            id="exclude"
          />
          <label htmlFor="exclude">
            Search for cities NOT in this GMT offset
          </label>
        </div>
        <button onClick={handleSearch}>Find Cities</button>
      </div>

      {/* Results Area */}
      <div className="results">
        <h2>Results ({results.length})</h2>
        {results.length > 0 ? (
          <ul>
            {results.map((city, index) => (
              <li key={index}>
                {city.name} (GMT {city.gmt >= 0 ? `+${city.gmt}` : city.gmt})
              </li>
            ))}
          </ul>
        ) : (
          <p>No cities found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
