import React from 'react';
import {useMapConfig} from '../config/MapConfigContext.tsx';
import useLocation from '../hooks/UseLocation.tsx';
import Loader from '../components/Loader.tsx';
import {StyleSheet, View} from 'react-native';
import {Camera, MapView, UserLocation} from '@maplibre/maplibre-react-native';

import MapTopBarButton from '../components/map/MapTopBarButton.tsx';
import MapCenterButton from '../components/map/MapCenterButton.tsx';
import MapZoomInOutButton from '../components/map/MapZoomInOutButton.tsx';

const MapScreen = () => {
    const {
        config,
        loading,
        cameraRef,
        handleRecenter,
        handleZoomIn,
        handleZoomOut,
    } = useMapConfig();
    const { hasPermission } = useLocation();

    if (loading || !hasPermission) {
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
                />

                <UserLocation showsUserHeadingIndicator={true}/>
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
});

export default MapScreen;
