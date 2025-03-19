import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import {PermissionsAndroid} from 'react-native';

const UseLocation = () => {
    const [hasPermission, setHasPermission] = React.useState<boolean>(false);

    useEffect(() => {
        const requestPermission = async () => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );

                setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
            } else {
                setHasPermission(true); // iOS handles this via Info.plist
            }
        };

        requestPermission();
    });


    return { hasPermission };
};

export default UseLocation;
