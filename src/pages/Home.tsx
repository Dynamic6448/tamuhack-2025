// File: src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeButton from '../components/HomeButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faPlane, faTemperatureHalf, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import * as helper from '../scripts/Helper';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('.../backend/mydatabase.db');

export const HomePage: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();
  
    const [flightStats] = useState({
        flightNumber: 'AA1234', // from DB
        departureArptCode: 'DFW', // from DB
        departureArptName: 'Dallas-Fort Worth', // from DB
        departureArptTime: new Date(), // from DB
        arrivalArptCode: 'LAX', // from DB
        arrivalArptName: 'Los Angeles', // from DB
        arrivalArptTime: new Date(), // from DB
        altitude: 34000, // in feet
        outsideTemp: -64, // in degrees Fahrenheit
        remainingTime: 96, // in minutes
        flightProgress: 0.5, // 0.0 to 1.0
    });

    const [remainingHours, setRemainingHours] = useState(0);
    const [remainingMinutes, setRemainingMinutes] = useState(0);
    useEffect(() => {
        setRemainingHours(Math.floor(flightStats.remainingTime / 60));
        setRemainingMinutes(flightStats.remainingTime % 60);
    }, [flightStats.remainingTime]);

    useEffect(() => {
      const fetchFoods = async () => {
          try {
              const response = await fetch('http://localhost:5000/flight_data'); //change to localhost
              if (!response.ok) {
                  throw new Error(`Server error: ${response.status}`);
              }

              type flight_data_structure = {
                FLIGHT_NUMBER: string,
                DEPARTURE_CITY: string,
                DEPARTURE_CODE: string,
                DEPARTURE_TIME: Date,
                ARRIVAL_CITY: string,
                ARRIVAL_CODE: string,
                ARRIVAL_TIME: Date,
              }

              function updateFlightData(data : flight_data_structure){
                flightStats.flightNumber = data.FLIGHT_NUMBER;
                flightStats.departureArptName = data.DEPARTURE_CITY;
                flightStats.departureArptCode = data.DEPARTURE_CITY;
                flightStats.departureArptTime = data.DEPARTURE_TIME;
                flightStats.arrivalArptName = data.ARRIVAL_CITY;
                flightStats.arrivalArptCode = data.ARRIVAL_CODE;
                flightStats.arrivalArptTime = data.ARRIVAL_TIME;
                flightStats.remainingTime = helper.constrain(helper.calculateRemainingMinutes(flightStats.arrivalArptTime), 0, 10000);
                flightStats.flightProgress = helper.constrain(
                    helper.lerp(new Date().getTime(), flightStats.departureArptTime.getTime(), flightStats.arrivalArptTime.getTime()), 0, 1);
              }

              const data: flight_data_structure = await response.json();
              updateFlightData(data);
              console.log(data);
              
          } catch (err) {
              console.error('Failed to fetch flight data.', err);
              if (err instanceof Error) {
                  console.log(err.message);
              }
          } finally {
              console.log(false);
          }
      };

      fetchFoods();
  }, []);

    const handleMenuClick = () => {
        navigate('/menu');
    };

    return (
        <div className="grid grid-cols-5 grid-rows-3 gap-4 p-6 bg-gradient-to-br from-aa-blue to-aa-red h-screen">
            {/* Footer Icons */}
            <div className="col-start-1 col-end-4 row-start-1 row-end-2 flex justify-around mt-6">
                <div className="bg-red-500 w-16 h-16 rounded-full flex items-center justify-center">
                    <div className="text-white">🔢</div>
                </div>
                <div className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center">
                    <div className="text-gray-700">⚙️</div>
                </div>
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center">
                    <div className="text-white">✈️</div>
                </div>
            </div>

            {/* Flight Information */}
            <div className="col-start-1 col-end-4 row-start-2 row-end-4 rounded-2xl flex relative group cursor-pointer select-none">
                {/* Background Image */}
                <div
                    className="group-hover:scale-105 transition duration-300"
                    style={{
                        backgroundImage: 'url(a321_tail.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        filter: 'brightness(0.5)', // Darken the background image
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                    }}
                />
                <div className="w-full flex flex-col justify-between z-10">
                    <div className="p-4">
                        <div className="w-full flex flex-row justify-between">
                            {/* Time Remaining */}
                            <div>
                                <div className="flex flex-row items-baseline space-x-1.5">
                                    <p className="text-white text-6xl font-bold">{remainingHours}</p>
                                    <p className="text-gray-300 text-lg">hrs</p>
                                    <p className="text-white text-6xl font-bold">
                                        {remainingMinutes.toString().padStart(2, '0')}
                                    </p>
                                    <p className="text-gray-300 text-lg">mins</p>
                                </div>
                                <p className="text-gray-300 text-lg ml-2">until arrival</p>
                            </div>
                            {/* Altitude/Temperature Data */}
                            <div className="flex items-center space-x-10">
                                <FlightStatistic icon={faArrowTrendUp} value="34,000" unit="feet" />
                                <FlightStatistic icon={faTemperatureHalf} value="-64" unit="°F" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Portion of Flight Info Card */}
                    <div className="w-full bg-[rgba(0,0,0,0.50)] p-4 flex flex-col">
                        {/* Flight Number */}
                        <p className="text-white text-2xl font-bold">{flightStats.flightNumber}</p>

                        {/* Airports/Progress Indicator */}
                        <div className="flex flex-row items-center">
                            <Airport code={flightStats.departureArptCode} name={flightStats.departureArptName} />

                            {/* Progress Indication */}
                            <div className="flex flex-row items-center flex-grow mx-4 relative h-full">
                                {/* Full width gray background line */}
                                <div className="absolute w-full h-1 bg-gray-500 rounded-full"></div>

                                {/* Progress highlight */}
                                <div
                                    className="absolute h-1 bg-white rounded-full transition-all duration-500"
                                    style={{ width: `${flightStats.flightProgress * 100}%` }} // Update this percentage
                                ></div>

                                {/* Airport dots */}
                                <div className="absolute left-0 w-3 h-3 bg-white rounded-full" />
                                <div
                                    className={`absolute right-0 w-3 h-3 rounded-full ${
                                        flightStats.flightProgress * 100 >= 99 ? 'bg-white' : 'bg-gray-500'
                                    }`}
                                />

                                {/* Airplane Icon*/}
                                <FontAwesomeIcon
                                    icon={faPlane}
                                    className="absolute text-white text-3xl"
                                    style={{
                                        left: `${Math.max(0, Math.min(87, flightStats.flightProgress * 100 - 7))}%`,
                                    }}
                                />
                            </div>

                            <Airport
                                code={flightStats.arrivalArptCode}
                                name={flightStats.arrivalArptName}
                                className="text-end"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right-Side Nav Buttons */}
            <HomeButton
                className="col-start-4 col-end-5 row-start-1 row-end-2"
                imgPath="menu_icon.png"
                onClick={handleMenuClick}
            >
                Menu
            </HomeButton>
            <HomeButton
                className="col-start-5 col-end-6 row-start-1 row-end-2"
                imgPath="games_icon.png"
                onClick={() => {}}
            >
                Games
            </HomeButton>
            <HomeButton
                className="col-start-4 col-end-6 row-start-2 row-end-4"
                imgPath="entertainment_icon.png"
                onClick={() => {}}
            >
                Entertainment
            </HomeButton>
        </div>
    );
};

export default HomePage;

interface FlightStatisticProps {
    icon: IconDefinition;
    value: string;
    unit: string;
}
const FlightStatistic: React.FC<FlightStatisticProps> = ({ icon, value, unit }) => (
    <div className="flex flex-col items-end">
        <div className="flex flex-row items-center space-x-2 text-white text-2xl">
            <FontAwesomeIcon icon={icon} />
            <p>{value}</p>
        </div>
        <p className="text-gray-300 text-md">{unit}</p>
    </div>
);

interface AirportProps {
    code: string;
    name: string;
    className?: string;
}
const Airport: React.FC<AirportProps> = ({ code, name, className = '' }) => (
    <div className={'flex flex-col ' + className}>
        <p className="text-white text-2xl font-semibold">{code}</p>
        <p className="text-gray-300 text-xs">{name}</p>
    </div>
);
