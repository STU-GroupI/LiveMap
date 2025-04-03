import React, {useState} from 'react';
import { Feature, Point } from 'geojson';
import {useMapConfig} from '../config/MapConfigContext.tsx';
import Loader from '../components/Loader.tsx';
import {StyleSheet, View} from 'react-native';
import {Camera, MapView, PointAnnotation} from '@maplibre/maplibre-react-native';

import MapTopBarButton from '../components/map/MapTopBarButton.tsx';
import MapCenterButton from '../components/map/MapCenterButton.tsx';
import MapZoomInOutButton from '../components/map/MapZoomInOutButton.tsx';
import SuggestPOIButton from '../components/map/SuggestPOIButton.tsx';

import { POI } from '../models/POI/POI.ts';
import MapPOIBottomSheet from '../components/map/MapPOIBottomSheet.tsx';
import POIMarker from '../components/map/POIMarker.tsx';
import SuggestedPOIMarker from '../components/map/suggestion/SuggestedPOIMarker.tsx';
import MapSuggestLocationBottomSheet from '../components/map/suggestion/MapSuggestLocationBottomSheet.tsx';
import useBottomSheets from '../hooks/useBottomSheet.tsx';
import SuggestLocationDataSheet from '../components/map/suggestion/SuggestLocationDataSheet.tsx';

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

    // Use the updated dynamic bottom sheet hook
    const { bottomSheetRefs, handleOpen, handleClose } = useBottomSheets(['detail', 'location', 'dataform']);
    const [activePoi, setActivePoi] = useState<POI | undefined>();

    const [suggestedLocation, setSuggestedLocation] = useState<[number, number] | undefined>();
    const [showDataSheet, setShowDataSheet] = useState(false);
    const [showCenterButton, setShowCenterButton] = useState(true);
        const [canAddLocation, setCanAddLocation] = useState(false);

    if (loading || !hasLocationPermission) {
        return <Loader />;
    }

    const handlePoiSelect = (selectedPoi: POI) => {
        if (activePoi?.guid !== selectedPoi.guid) {
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

        setShowCenterButton(false);
        setCanAddLocation(true);
        handleOpen('location');
    };

    const handleSetSuggestedLocation = (event: Feature<Point>) => {
        if(canAddLocation){
        if (suggestedLocation !== undefined) {
            setSuggestedLocation([event.geometry.coordinates[0], event.geometry.coordinates[1]]);
        }
    }};

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

                {suggestedLocation && (
                    <SuggestedPOIMarker location={suggestedLocation} />
                )}

                {userLocation && (
                    <PointAnnotation id="user-location" coordinate={userLocation}>
                        <View style={styles.mapUserMarker} />
                    </PointAnnotation>
                )}
            </MapView>

            <SuggestPOIButton handleCreateSuggestion={handleCreateSuggestion}/>
            <MapZoomInOutButton handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} />
             {showCenterButton && <MapCenterButton handleRecenter={handleRecenter}/>}
            <MapTopBarButton />

            {suggestedLocation && (
                <MapSuggestLocationBottomSheet
                    onConfirm={() => {
                        setSuggestedLocation(suggestedLocation);
                        cameraRef?.current?.flyTo([suggestedLocation[0], suggestedLocation[1]]);
                        handleClose();
                        setShowDataSheet(true);
                        setCanAddLocation(false);
                        handleOpen('dataform');

                    }}
                    onCancel={() => {
                        handleClose();
                        setSuggestedLocation(undefined);
                        setShowCenterButton(true)
                        setCanAddLocation(false);
                    }}
                    onFlyToLocation={() => cameraRef?.current?.flyTo([suggestedLocation[0], suggestedLocation[1]])}
                    bottomSheetRef={(ref) => (bottomSheetRefs.current.location = ref)}
                />
            )}

            {activePoi && (
                <MapPOIBottomSheet
                    bottomSheetRef={(ref) => (bottomSheetRefs.current.detail = ref)}
                    poi={activePoi}
                    onClose={() => {
                        setActivePoi(undefined);
                    }}
                />
            )}
         { showDataSheet && (
             <SuggestLocationDataSheet
                               onCancel={() => {
                                    handleClose();
                                    setShowDataSheet(false);
                                    setShowCenterButton(false)
                                    setCanAddLocation(true);
                                    handleOpen('location')
                                    }}
                                onSubmit={(data) =>{
                                    //The coordinates are added in using this class given there's an instance variable for them.
                                    data.coordinate = { latitude: suggestedLocation[0], longitude: suggestedLocation[1]};
                                    //The mapguid is hardcoded for now, but it will be dynamically set up
                                    data.mapguid = '2b0bf3ea-0f37-dc37-8143-ab809c55727d';
                                    //Console.log for testing purposes
                                    //console.log('Submitted POI Data:', data);

                                    //TO-DO: Create a POST request to the API to store the new data

                                    handleClose();
                                    setShowDataSheet(false);
                                    setShowCenterButton(true)
                                    setSuggestedLocation(undefined);
                                    }
                                }
                                                bottomSheetRef={(ref) => (bottomSheetRefs.current.dataform = ref)}
                            />
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
