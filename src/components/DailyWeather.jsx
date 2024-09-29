
import React, { useState, useEffect, useContext, memo } from 'react';
import axios from 'axios';
import { context } from './Location';

const DailyWeather = memo(({ img }) => {
    const [loading, setLoading] = useState(false);
    const [dailyData, setDailyData] = useState([]);
    const [error, setError] = useState(null);
    const { location } = useContext(context); 
    
    

    useEffect(() => {
        const fetchWeatherData = async () => {
            if (!location || !location.latitude || !location.longitude) return;

            setLoading(true);
            setError(null); 
            try {
                const response = await axios(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=72b1aa9f3540bd34349eebb97cbbfb7f`);
                const data = response.data.list.map((d) => ({
                    date: d.dt_txt,
                    temp_max: d.main.temp_max,
                    temp_min: d.main.temp_min
                }));
                setDailyData(data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch weather data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [location]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>; 
    }

    return (
        <div className="pt-2">
            <div className="container">
                <p>5 Day Forecasting</p>
            </div>

            <div className="container text-center">
                <div className="row d-flex justify-content-center align-items-center">
                    {  dailyData.map((data, index) => (
                        <div className="col-3 rounded p-2" key={index}>
                            <ul className='border rounded list-unstyled'>
                                <img src={img} alt="" className='h-25 w-25' />
                                <li>{`Date: ${data.date}`}</li>
                                <li>{`Max: ${data.temp_max}°C`}</li>
                                <li>{`Min: ${data.temp_min}°C`}</li>
                            </ul>
                        </div>
                    )).slice(0, 4)}
                </div>
            </div>
        </div>
    );
});

export default DailyWeather;
