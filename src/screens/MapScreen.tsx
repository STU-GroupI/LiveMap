import React from 'react';
import {useMapConfig} from '../config/MapConfigContext.tsx';
import Loader from '../components/Loader.tsx';
import {StyleSheet, View} from 'react-native';
import {Camera, MapView, PointAnnotation} from '@maplibre/maplibre-react-native';

import MapTopBarButton from '../components/map/MapTopBarButton.tsx';
import MapCenterButton from '../components/map/MapCenterButton.tsx';
import MapZoomInOutButton from '../components/map/MapZoomInOutButton.tsx';

const MapScreen = () => {
    const {
        config,
        loading,
        hasLocationPermission,
        userLocation,
        cameraRef,
        handleRecenter,
        handleZoomIn,
        handleZoomOut,
    } = useMapConfig();

    if (loading || !hasLocationPermission) {
        return <Loader />;
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                mapStyle={config.mapStyle}
                compassEnabled={true}
                compassViewPosition={3}
                rotateEnabled={false}
            >
                <Camera
                    ref={cameraRef}
                    centerCoordinate={config.center}
                    zoomLevel={config.zoom}
                    minZoomLevel={config.minZoom}
                    maxZoomLevel={config.maxZoom}
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

            <MapZoomInOutButton handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} />
            <MapCenterButton handleRecenter={handleRecenter} />
            <MapTopBarButton />
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
