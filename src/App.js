import React, { useState, useEffect } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';

import { getPlaceData, getweatherdata } from './api';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';




const App = () => {

    const [places, setPlaces] = useState([]);
    const [weatherdata, setWeatherData] = useState([]);
    const [childClicked, setChiledClicked] = useState(null);
    const [filteredPlaces, setFilteredPlaces] = useState([])
    const [autocomplete, setAutocommplete] = useState(null);

    const [coordinates, setCoordinates] = useState({});
    const [bounds, setBounds] = useState({});

    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState('');

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            setCoordinates({ lat: latitude, lng: longitude });
        });
    }, []);

    useEffect(() => {
        const filteredPlaces = places.filter((place) => place.rating > rating);
        setFilteredPlaces(filteredPlaces);
    }, [rating]);


    useEffect(() => {
        if (bounds) {
            setIsLoading(true)

            getweatherdata(coordinates.lat, coordinates.lng)
                .then((data) => setWeatherData(data));
            console.log({ weatherdata })

            getPlaceData(type, bounds.sw, bounds.ne)
                .then((data) => {
                    setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
                    setFilteredPlaces([])
                    setIsLoading(false);
                })
        }
    }, [type, bounds]);

    const onLoad = (autoC) => setAutocommplete(autoC);

    const onPlaceChanged = () => {
        const lat = autocomplete.getPlace().geometry.location.lat();
        const lng = autocomplete.getPlace().geometry.location.lng();

        setCoordinates({ lat, lng });
    };

    return (
        <>
            <CssBaseline />
            <Header onLoad={onLoad} onPlaceChanged={onPlaceChanged} />
            <Grid container spacing={3} style={{ width: '100%' }}>
                <Grid item xs={12} md={4}>
                    <List
                        places={filteredPlaces.length ? filteredPlaces : places}
                        childClicked={childClicked}
                        isLoading={isLoading}
                        type={type}
                        setType={setType}
                        rating={rating}
                        setRating={setRating}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Map
                        setCoordinates={setCoordinates}
                        setBounds={setBounds}
                        coordinates={coordinates}
                        places={filteredPlaces.length ? filteredPlaces : places}
                        setChiledClicked={setChiledClicked}
                        weatherdata={weatherdata}

                    />

                </Grid>

            </Grid>
        </>
    );
}

export default App;
