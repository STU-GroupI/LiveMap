import React, {useState} from 'react';
import {useMapConfig} from '../config/MapConfigContext.tsx';
import useBottomSheet from '../hooks/useBottomSheet.tsx';
import Loader from '../components/Loader.tsx';
import {StyleSheet, View} from 'react-native';
import {Camera, MapView, PointAnnotation} from '@maplibre/maplibre-react-native';

import MapTopBarButton from '../components/map/MapTopBarButton.tsx';
import MapCenterButton from '../components/map/MapCenterButton.tsx';
import MapZoomInOutButton from '../components/map/MapZoomInOutButton.tsx';
import SuggestPOIButton from '../components/map/SuggestPOIButton.tsx'

import { POI } from '../models/POI/POI.ts';
import MapPOIBottomSheet from '../components/map/MapPOIBottomSheet.tsx';
import POIMarker from '../components/map/POIMarker.tsx';

const MapScreen = () => {
    const {
        config,
        pois,
        loading,
        hasLocationPermission,
        userLocation,
        cameraRef,
        handleRecenter,
        handleZoomIn,
        handleZoomOut,
    } = useMapConfig();
    const { bottomSheetRef, handleOpen, handleClose } = useBottomSheet();
    const [activePoi, setActivePoi] = useState<POI|undefined>();

    if (loading || !hasLocationPermission) {
        return <Loader />;
    }

    const handlePoiSelect = (selectedPoi: POI) => {
        if (activePoi?.guid !== selectedPoi.guid) {
            cameraRef?.current?.flyTo([selectedPoi.coordinate.longitude, selectedPoi.coordinate.latitude]);
            handleClose(() => setActivePoi(undefined));

            setActivePoi({ ...selectedPoi });
            setTimeout(() => handleOpen(), 0);
        }
    };

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

                {pois.length > 0 && pois.map((mapPoi) => (
                    <POIMarker
                        key={`poi-${mapPoi.guid}`}
                        poi={mapPoi}
                        isActive={activePoi?.guid === mapPoi.guid}
                        onSelect={handlePoiSelect}
                    />
                ))}

                {userLocation && (
                    <PointAnnotation id="user-location" coordinate={userLocation}>
                        <View
                            style={styles.mapUserMarker}
                        />
                    </PointAnnotation>
                )}
            </MapView>

            <SuggestPOIButton handleZoomIn={handleZoomIn}/>
            <MapZoomInOutButton handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} />
            <MapCenterButton handleRecenter={handleRecenter} />
            <MapTopBarButton />

            {activePoi && (
                <MapPOIBottomSheet bottomSheetRef={bottomSheetRef} poi={activePoi} onClose={() => setActivePoi(undefined)}/>
            )}
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
    markerWrapper: {
        padding: 10,
        backgroundColor: 'transparent',
    },
    markerHitbox: {
        padding: 10,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    markerSelected: {
        backgroundColor: 'rgba(0, 23, 238, 0.1)',
    },
    mapUserMarker: {
        width: 18,
        height: 18,
        borderRadius: 10,
        backgroundColor: '#0017EE',
        borderWidth: 2,
        borderColor: '#fff',
    },
});

export default MapScreen;
