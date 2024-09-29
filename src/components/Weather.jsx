import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { CiChat1 } from 'react-icons/ci';
import axios from 'axios';
import './weather.css';
import './header.css';
import { MdOutlineInfo } from "react-icons/md";
import broken from "../assets/broken.png";
import clearsky from "../assets/clearsky.png";
import fewcloud from "../assets/fewcloud.png";
import heavyrain from "../assets/heavyrain.png";
import mist from "../assets/mist.png";
import scatteredcloud from "../assets/scatteredcloud.png";
import shower from "../assets/shower.png";
import thunderstorms from "../assets/thunderstorms.png";
import snowy from "../assets/snowy.png";
import Location from './Location'
import n01 from '../assets/01n.png'
import n02 from '../assets/02n.png'
import n03 from '../assets/03n.png'
import n04 from '../assets/04n.png'
import n09 from '../assets/09n.png'
import n10 from '../assets/10n.png'
import n11 from '../assets/11n.png'
import n30 from '../assets/30n.png'
import n50 from '../assets/50n.png'
import DailyWeather from './DailyWeather';

const Weather = () => {
    const [search, setSearch] = useState("chennai");
    const [loading, setLoading] = useState(false);
    const [time, setTime] = useState(new Date());
    const [data, setData] = useState({
        humidity: 0,
        city: "",
        pressure: 0,
        windspeed: 0,
        visibility: 0,
        temp: 0,
        feels: "",
        sea: "",
        error: null
    });
    const [img, setImg] = useState("");

    const weatherIcon = {
        "01d": clearsky,
        "02d": fewcloud,
        "03d": scatteredcloud,
        "04d": broken,
        "09d": shower,
        "10d": heavyrain,
        "11d": thunderstorms,
        "13d": snowy,
        "50d": mist,
        "01n": n01,
        "02n": n02,
        "03n": n03,
        "04n": n04,
        "09n": n09,
        "10n": n10,
        "11n": n11,
        "30n": n30,
        "50n": n50
    };

    const api = async () => {
        setLoading(true);
        setData({ ...data, error: null });
        try {
            const response = await axios(`https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=72b1aa9f3540bd34349eebb97cbbfb7f&units=metric`);
            // console.log(response.data);


            const pressure = response.data.main.pressure;
            const pressureInches = pressure * 0.02953;
            const visibility = response.data.visibility;
            const visibilityMiles = visibility * 0.00062;
            const icon = response.data.weather[0].icon;
            const wind =response.data.wind.speed    
            
            
            setImg(weatherIcon[icon] || clearsky);

            setData({
                humidity: response.data.main.humidity,
                city: response.data.name,
                pressure: pressureInches.toFixed(2),
                windspeed: wind,
                visibility: visibilityMiles.toFixed(1),
                temp: response.data.main.temp,
                error: null
            });

        } catch (error) {
            setData({ ...data, error: "City not found" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        api();
        return () => {
            clearInterval(timer);
        };
    }, []);

    const handleKey = (e) => {
        if (e.key === "Enter") {
            if (!search) {
                return setData({ ...data, error: "Please enter a city name" });
            }
            api();
        } else if (e.key === "Backspace") {
            setData({
                humidity: 0,
                city: "",
                pressure: 0,
                temp: 0,
                visibility: 0,
                windspeed: 0,
                error: null
            });
        }
    };


    return (
        <>

            <div className=" pt-2">
                <div className="container text-center">
                    <div className="row column-gap-2  d-flex justify-content-center align-items-center ">
                        <div className="col-3  rounded p-2">
                            <span>
                                <input
                                    className='text-black'
                                    type="search"
                                    placeholder='Search for location'
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleKey}
                                />
                                {data.error && <p className='text-danger'>{data.error}</p>}
                            </span>
                        </div>

                        <div className="col-2  rounded p-2">
                            Column
                        </div>

                        <div className="col-2 rounded p-2">
                            Column
                        </div>

                        <div className="col-2 rounded p-2">
                            Column
                        </div>

                        <div className="col-2 rounded p-2">
                            Column
                        </div>

                    </div>
                </div>
            </div>
            <Location />

            <div className='container mt-2'>
                <div className="row">
                    <div className="col-6">
                        <p className='fw-bolder'>Current weather: {data.city || search}</p>
                        <h6>{time.toLocaleString()}</h6>
                        <span>
                            <NavLink style={{ textDecoration: "none" }}>
                                <CiChat1 /> Seeing different weather?
                            </NavLink>
                        </span>
                        <div className='d-flex'>
                            <img src={img} alt="Weather icon" className='h-30 w-25' />
                            <h1 className='display-1 fw-semibold'>{`${data.temp}°`} <sup>c</sup></h1>
                        </div>
                        <ul className="list-unstyled d-flex justify-content-between p-3">
                            <li className="p-2 text-white fw-bolder"> {`pressure`}<sup><MdOutlineInfo /></sup> {` ${data.pressure}in`}</li>
                            <li className="p-2 text-white fw-bolder">{`Wind`}<sup><MdOutlineInfo /></sup>{` ${data.windspeed}kmph`}</li>
                            <li className="p-2 text-white fw-bolder">{`Humidity`}<sup><MdOutlineInfo /></sup>{`${data.humidity}%`}</li>
                            <li className="p-2 text-white fw-bolder">{`Visibility`}<sup><MdOutlineInfo /></sup>{` ${data.visibility}miles`}</li>
                        </ul>
                    </div>
                    <div className="col-6">


                    </div>
                </div>
            </div>
            {loading && <p>Loading...</p>}
            <DailyWeather img={img}  setImg={setImg}/>
        </>
    );
};

export default Weather;
