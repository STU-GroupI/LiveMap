import Geolocation from '@react-native-community/geolocation';
import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {PermissionsAndroid} from 'react-native';


/**
 * According to react-native this functions as hook to get the user's location
 * BUT here it is not a hook, geolocation makes it so a watcher is created everytime this hook gets called
 * To counter that this should only be called ONCE in a provider
 */
const UseLocation = () => {
    const [hasLocationPermission, setHasLocationPermission] = React.useState<boolean>(false);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

    useEffect(() => {
        const requestPermission = async () => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );

                setHasLocationPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
            } else {
                setHasLocationPermission(true); // iOS handles this via Info.plist
            }
        };

        requestPermission();
    }, []);

    useEffect(() => {
        let watchId: number | null = null;

        if (hasLocationPermission) {
            watchId = Geolocation.watchPosition(
                (position) => {
                    setUserLocation([position.coords.longitude, position.coords.latitude]);
                } ,
                (error) => console.warn('GeoLocation error:', error),
                {
                    enableHighAccuracy: true,
                    distanceFilter: 5,
                    interval: 3000,
                }
            );
        }

        return () => {
            if (watchId) {
                Geolocation.clearWatch(watchId);
            }
        };
    }, [hasLocationPermission]);


    return { hasLocationPermission, userLocation };
};

export default UseLocation;
