"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function WeatherPage() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("Pokhara");
  const [error, setError] = useState("");

  const apiId = "e2f7d0d1b3901045b30a566915bd503a";

  const getWeather = async () => {
    if (!city) return setError("Please Enter a City Name!");
    try {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiId}`,
      );
      setWeather(data);
    } catch (error) {
      setWeather(null);
      setError("City not found. Please try again!");
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      await getWeather();
    };
    fetchWeather();
  }, []);

  const getImage = (status) => {
    switch (status) {
      case "Clear":
        return "/weather/sunny.png";
      case "Clouds":
      case "Mist":
      case "Fog":
      case "Haze":
        return "/weather/cloudy.png";
      case "Rain":
      case "Drizzle":
        return "/weather/rainy.png";
      case "Snow":
        return "/weather/snowy.png";
      default:
        return "/weather/sunny.png";
    }
  };

  const formatTime = (time) => {
    if (!weather) return "";
    return new Date((time + weather.timezone) * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="flex flex-col items-center mt-10 px-4 md:px-0 max-w-xl mx-auto">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">
        Weather Forecast
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 w-full mb-6">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className="flex-1 px-5 py-3 rounded-xl border border-gray-300 text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
        <button
          onClick={getWeather}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-all cursor-pointer"
        >
          Search
        </button>
      </div>

      {error && (
        <p className="bg-red-100 text-red-700 w-full text-center py-2 rounded-xl mb-6 shadow-sm">
          {error}
        </p>
      )}

      {weather && (
        <div className="w-6xl flex flex-col gap-6 text-gray-800">
          <div className="text-center">
            <h2 className="text-4xl font-bold">
              {weather.name}, {weather.sys.country}
            </h2>
            <p className="text-lg text-gray-500 mt-1">
              Timezone: UTC {weather.timezone / 3600}
            </p>
          </div>

          <div className="flex flex-col p-5 justify-center items-center bg-blue-50 rounded-xl shadow-xl">
            <div className="w-150 gap-15 flex justify-center">
              <div className="">
                <Image
                  src={getImage(weather.weather[0].main)}
                  alt="Weather icon"
                  width={300}
                  height={300}
                />
              </div>
              <div>
                <p className="text-3xl font-semibold capitalize mt-4">
                  {weather.weather[0].description}
                </p>
                <p className="text-6xl font-bold mt-2">
                  {Math.round(weather.main.temp)}°C
                </p>
                <p className="font-semibold text-gray-500 mt-1">
                  Feels like: {Math.round(weather.main.feels_like)}°C
                </p>
              </div>
            </div>
            <div className="w-full flex justify-between bg-amber-100 p-9 mt-3 rounded-xl shadow-inner text-sm">
              <div>
                <p className="font-bold text-lg">Humidity</p>
                <p>{weather.main.humidity}%</p>
              </div>
              <div>
                <p className="font-bold text-lg">Pressure</p>
                <p>{weather.main.pressure} hPa</p>
              </div>
              <div>
                <p className="font-bold text-lg">Wind</p>
                <p>{weather.wind.speed} m/s</p>
              </div>
              <div>
                <p className="font-bold text-lg">Cloudiness</p>
                <p>{weather.clouds.all}%</p>
              </div>
              <div>
                <p className="font-bold text-lg">Sunrise</p>
                <p>{formatTime(weather.sys.sunrise)}</p>
              </div>
              <div>
                <p className="font-bold text-lg">Sunset</p>
                <p>{formatTime(weather.sys.sunset)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
