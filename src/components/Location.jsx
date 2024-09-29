import React, { useState, useEffect, createContext, useMemo } from 'react';
import { IoHome } from "react-icons/io5";
import axios from 'axios';
export const context = createContext()
const Location = (props) => {
    const [location, setLocation] = useState({ latitude: null, longitude: null, error: null });
    const [address, setAddress] = useState({ name: "", country: "", state: "" });
    const value = useMemo(()=>({location }),[location])
    useEffect(() => {
        if (location.latitude && location.longitude) {
            const fetchAddress = async () => {
                try {
                    const response = await axios(`http://api.openweathermap.org/geo/1.0/reverse?lat=${location.latitude}&lon=${location.longitude}&appid=72b1aa9f3540bd34349eebb97cbbfb7f&units=metric`);
                    setAddress({ name: response.data[0].name, country: response.data[0].country, state: response.data[0].state || "" });
                } catch (error) {
                    console.error("Error fetching address:", error);
                    setAddress({ name: "Unknown", country: "", state: "" });
                }
            };
            fetchAddress();
        }
    }, [location]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        error: null,
                    });
                },
                (error) => {
                    setLocation({
                        latitude: null,
                        longitude: null,
                        error: error.message,
                    });
                }
            );
        } else {
            setLocation({
                latitude: null,
                longitude: null,
                error: "Geolocation is not supported by this browser.",
            });
        }
    }, []);

    return (
        <context.Provider  value={value} className='container'>
            {
                location.error ? (
                    <p>{location.error}</p>
                ) : (


                    <p className='container' > <IoHome className='fs-5' /> {address.name} {address.state} {address.country}</p>

                )
            }
            {props.children}
        </context.Provider >
    );
}

export default Location;



















