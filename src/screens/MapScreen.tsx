import React from 'react';
import {useMapConfig} from '../config/MapConfigContext.tsx';
import Loader from '../components/Loader.tsx';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Camera, MapView, PointAnnotation} from '@maplibre/maplibre-react-native';
import {Icon} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const MapScreen = () => {
    const {
        config,
        loading,
        hasLocationPermission,
        userLocation,
        cameraRef,
        handleRecenter,
    } = useMapConfig();
    const insets = useSafeAreaInsets();

    if (loading || !hasLocationPermission) {
        return <Loader />;
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                mapStyle={config.mapStyle}
            >
                <Camera
                    ref={cameraRef}
                    centerCoordinate={config.center}
                    followUserLocation={false}
                />

                {userLocation && (
                    <PointAnnotation id="user-location" coordinate={userLocation}>
                        <View
                            style={styles.mapUserMarker}
                        />
                    </PointAnnotation>
                )}
            </MapView>

            <View
                style={[
                    styles.controls,
                    {
                        top: insets.top + 10,
                        right: insets.right + 10,
                    },
                ]}
            >
                <TouchableOpacity style={styles.button} onPress={handleRecenter}>
                    <Icon source="crosshairs-gps" size={26} color="#000" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    mapUserMarker: {
        width: 18,
        height: 18,
        borderRadius: 10,
        backgroundColor: '#0017EE',
        borderWidth: 2,
        borderColor: '#fff',
    },
    controls: {
        position: 'absolute',
    },
    button: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MapScreen;
