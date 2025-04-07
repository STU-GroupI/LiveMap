import React, {useState} from 'react';
import {Feature, Point} from 'geojson';
import {useMapConfig} from '../config/MapConfigContext.tsx';
import Loader from '../components/Loader.tsx';
import {StyleSheet, View} from 'react-native';
import {Camera, MapView, PointAnnotation} from '@maplibre/maplibre-react-native';
import MapCenterButton from '../components/map/MapCenterButton.tsx';
import MapZoomInOutButton from '../components/map/MapZoomInOutButton.tsx';
import SuggestPOIButton from '../components/map/suggestion/SuggestPOIButton.tsx';

import {POI} from '../models/POI/POI.ts';
import {ScreenState} from '../interfaces/MapConfig.ts';
import useBottomSheets from '../hooks/useBottomSheet.tsx';
import POIMarker from '../components/map/POIMarker.tsx';
import SuggestedPOIMarker from '../components/map/suggestion/SuggestedPOIMarker.tsx';
import MapCreateSuggestion from '../components/map/MapCreateSuggestion.tsx';
import MapPOIBottomSheet from '../components/map/MapPOIBottomSheet.tsx';

const MapScreen = () => {
    const {
        config,
        pois,
        screenState,
        setScreenState,
        loading,
        hasLocationPermission,
        userLocation,
        cameraRef,
        handleRecenter,
        handleZoomIn,
        handleZoomOut,
        canInteractWithMap
    } = useMapConfig();

    const { bottomSheetRefs, handleOpen, handleClose } = useBottomSheets(['detail', 'location', 'dataform']);
    const [activePoi, setActivePoi] = useState<POI | undefined>();

    const [suggestedLocation, setSuggestedLocation] = useState<[number, number] | undefined>();

    if (loading || !hasLocationPermission) {
        return <Loader />;
    }

    const handlePoiSelect = (selectedPoi: POI) => {
        if (activePoi?.guid !== selectedPoi.guid && canInteractWithMap()) {
            cameraRef?.current?.flyTo([selectedPoi.coordinate.longitude, selectedPoi.coordinate.latitude]);

            setActivePoi({ ...selectedPoi });
            handleOpen('detail');
        }
    };

    const handleCreateSuggestion = () => {
        if (userLocation) {
            if (suggestedLocation === undefined) {
                setSuggestedLocation(userLocation);
            }
        }

        if (screenState === ScreenState.SUGGESTING) {
            setScreenState(ScreenState.VIEWING);
            handleClose();
        } else {
            setScreenState(ScreenState.SUGGESTING);
            handleOpen('location');
        }
    };

    const handleSetSuggestedLocation = (event: Feature<Point>) => {
        if (suggestedLocation !== undefined) {
            setSuggestedLocation([event.geometry.coordinates[0], event.geometry.coordinates[1]]);
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
                onPress={handleSetSuggestedLocation}
            >
                <Camera
                    ref={cameraRef}
                    centerCoordinate={config.center}
                    zoomLevel={config.zoom}
                    minZoomLevel={config.minZoom}
                    maxZoomLevel={config.maxZoom}
                    followUserLocation={false}
                />

                {pois.length > 0 &&
                    pois.map((mapPoi) => (
                        <POIMarker
                            key={`poi-${mapPoi.guid}`}
                            poi={mapPoi}
                            isActive={activePoi?.guid === mapPoi.guid}
                            onSelect={handlePoiSelect}
                        />
                    ))}

                {(suggestedLocation && screenState === ScreenState.SUGGESTING) && (
                    <SuggestedPOIMarker location={suggestedLocation} />
                )}

                {userLocation && (
                    <PointAnnotation id="user-location" coordinate={userLocation}>
                        <View style={styles.mapUserMarker} />
                    </PointAnnotation>
                )}
            </MapView>

            <SuggestPOIButton handleCreateSuggestion={handleCreateSuggestion} active={screenState === ScreenState.SUGGESTING}/>
            <MapZoomInOutButton handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} />
            <MapCenterButton handleRecenter={handleRecenter} />
            {/*<MapTopBarButton /> HIDDEN FOR NOW DUE TO UNNECESSARY USE*/}

            {activePoi && (
                <MapPOIBottomSheet
                    bottomSheetRef={bottomSheetRefs}
                    poi={activePoi}
                    onClose={() => {
                        setActivePoi(undefined);
                    }}
                />
            )}

            <MapCreateSuggestion
                bottomSheetRef={bottomSheetRefs}
                suggestedLocation={suggestedLocation}
                setSuggestedLocation={setSuggestedLocation}
            />
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
