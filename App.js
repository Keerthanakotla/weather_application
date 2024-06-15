import "./App.css";
import React, { useState, useEffect } from "react";

const api = {
  key: "c3e52a93bb6b3412dc1b891c86a93abe",
  base: "https://api.openweathermap.org/data/2.5/",
};

const countries = [
  { name: "India", cities: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"] },
  { name: "USA", cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"] },
  { name: "China", cities: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu"] },
  { name: "Brazil", cities: ["Sao Paulo", "Rio de Janeiro", "Salvador", "Brasilia", "Fortaleza"] },
  { name: "Russia", cities: ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg", "Kazan"] },
  { name: "Japan", cities: ["Tokyo", "Osaka", "Nagoya", "Sapporo", "Fukuoka"] },
  { name: "Germany", cities: ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt"] },
  { name: "France", cities: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"] },
  { name: "United Kingdom", cities: ["London", "Birmingham", "Manchester", "Glasgow", "Liverpool"] },
  { name: "Canada", cities: ["Toronto", "Montreal", "Vancouver", "Calgary", "Ottawa"] },
];

function App() {
  const [search, setSearch] = useState("");
  const [weatherList, setWeatherList] = useState([]);
  const [dateTime, setDateTime] = useState(new Date());
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const searchWeather = (query) => {
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.cod !== 200) {
          setError(result.message);
        } else {
          setWeatherList([result]);
          setError("");
        }
        setSearch("");
      })
      .catch(() => {
        setError("Unable to fetch data. Please check your internet connection.");
      });
  };

  const handleSearch = () => {
    searchWeather(search);
  };

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    setSelectedCountry(countryName);
    setSelectedCity("");
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    searchWeather(cityName);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`App ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <header className="App-header">
        <h1>Weather App</h1>
        <button className="toggle-btn" onClick={toggleTheme}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city or zip code"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="dropdown-box">
          <select value={selectedCountry} onChange={handleCountryChange}>
            <option value="">Select a country</option>
            {countries.map((country, index) => (
              <option key={index} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          <select value={selectedCity} onChange={handleCityChange} disabled={!selectedCountry}>
            <option value="">Select a city</option>
            {selectedCountry &&
              countries.find((country) => country.name === selectedCountry)?.cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
          </select>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="weather-list">
          {weatherList.map((weather) => (
            <div key={weather.id} className="weather-info">
              <p className="location">{weather.name}</p>
              <p className="temp">{weather.main.temp}°C</p>
              <p className="condition">{weather.weather[0].main}</p>
              <p className="description">({weather.weather[0].description})</p>
              <p className="humidity">Humidity: {weather.main.humidity}%</p>
              <p className="wind">Wind Speed: {weather.wind.speed} m/s</p>
              <p className="datetime">{dateTime.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;

