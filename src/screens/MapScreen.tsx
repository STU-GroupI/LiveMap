import React, {useEffect, useRef, useState} from 'react';
import {Feature, Point, GeoJSON} from 'geojson';
import {useMapConfig} from '../context/MapConfigContext.tsx';
import Loader from '../components/Loader.tsx';
import {StyleSheet, View} from 'react-native';
import {Camera, MapView, PointAnnotation} from '@maplibre/maplibre-react-native';
import MapCenterButton from '../components/map/MapCenterButton.tsx';
import MapZoomInOutButton from '../components/map/MapZoomInOutButton.tsx';
import SuggestPOIButton from '../components/map/suggestion/SuggestPOIButton.tsx';
import SuperCluster from 'supercluster';

import {POI} from '../models/POI/POI.ts';
import useBottomSheets from '../hooks/useBottomSheet.tsx';
import POIMarker from '../components/map/POIMarker.tsx';
import POIClusterMarker from '../components/map/POIClusterMarker.tsx';
import SuggestedPOIMarker from '../components/map/suggestion/SuggestedPOIMarker.tsx';
import MapCreateSuggestion from '../components/map/MapCreateSuggestion.tsx';
import MapPOIBottomSheet from '../components/map/MapPOIBottomSheet.tsx';

import {ScreenState} from '../state/screenStateReducer.ts';
import {setSuggesting, setViewing} from '../state/screenStateActions.ts';

const MapScreen = () => {
    const {
        config,
        pois,
        screenState,
        dispatch,
        loading,
        hasLocationPermission,
        userLocation,
        cameraRef,
        handleRecenter,
        handleZoomIn,
        handleZoomOut,
        canInteractWithMap,
    } = useMapConfig();

    const { bottomSheetRefs, handleOpen, handleClose } = useBottomSheets(['detail', 'location', 'dataform']);
    const [activePoi, setActivePoi] = useState<POI | undefined>();
    const [suggestedLocation, setSuggestedLocation] = useState<[number, number] | undefined>();
    const [visibleBounds, setVisibleBounds] = useState<[[number, number], [number, number]] | null>(null);
    const [currentZoom, setCurrentZoom] = useState(config.zoom);
    const [clusters, setClusters] = useState<any[]>([]);


    const superclusterRef = useRef<SuperCluster | null>(null);
    const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (pois.length === 0) return;

        const points = pois.map(poi => ({
            type: 'Feature' as const,
            properties: {
                cluster: false,
                poiId: poi.guid,
                poi: poi,
        },
            geometry: {
                type: 'Point' as const,
                coordinates: [poi.coordinate.longitude, poi.coordinate.latitude]
            }
        }));

        const cluster = new SuperCluster({
            radius: 40,
            maxZoom: 17,
            minPoints: 2,
        });

        cluster.load(points);
        superclusterRef.current = cluster;
        updateClusters();
    }, [pois]);

    const updateClusters = () => {
        if (!superclusterRef.current || !visibleBounds) return;

        if (throttleTimeoutRef.current) {
            clearTimeout(throttleTimeoutRef.current);
        }

        const updateWithThrottle = () => {
            try {
                const [[swLng, swLat], [neLng, neLat]] = visibleBounds;
                const clusters = superclusterRef.current!.getClusters(
                    [swLng, swLat, neLng, neLat], 
                    Math.floor(currentZoom)
                );
                setClusters(clusters);
            } catch (error) {
                console.error('Error updating clusters:', error);
            }
        };

        throttleTimeoutRef.current = setTimeout(updateWithThrottle, 16);
    };


    useEffect(() => {
        updateClusters();
    }, [currentZoom, visibleBounds]);

    if (loading || !hasLocationPermission) {
        return <Loader />;
    }

    const handlePoiSelect = (selectedPoi: POI) => {
        if (activePoi?.guid !== selectedPoi.guid && canInteractWithMap()) {
            cameraRef?.current?.flyTo([selectedPoi.coordinate.longitude, selectedPoi.coordinate.latitude]);

            dispatch(setViewing());
            setActivePoi({ ...selectedPoi });
            handleOpen('detail');
        }
    };

    const handleCreateSuggestion = () => {
        if (userLocation && suggestedLocation === undefined) {
            setSuggestedLocation(userLocation);
        }

        if (screenState === ScreenState.SUGGESTING) {
            dispatch(setViewing());
            handleClose();
        } else {
            dispatch(setSuggesting());
            handleOpen('location');
        }
    };

    const handleSetSuggestedLocation = (event: Feature<Point>) => {
        if (suggestedLocation !== undefined) {
            setSuggestedLocation([event.geometry.coordinates[0], event.geometry.coordinates[1]]);
        }
    };

    const handleClusterPress = (cluster: any) => {
        if (!superclusterRef.current) return;

        if (cluster.properties.cluster) {
            const clusterId = cluster.properties.cluster_id;
            const expansionZoom = superclusterRef.current.getClusterExpansionZoom(clusterId);
            const [longitude, latitude] = cluster.geometry.coordinates;
            const nextZoom = Math.min(expansionZoom + 1, config.maxZoom);
            setCurrentZoom(nextZoom);

            cameraRef?.current?.setCamera({
                centerCoordinate: [longitude, latitude],
                zoomLevel: nextZoom,
                animationDuration: 1500,
            });            
        }
    };

    const handleMapRegionChange = (event: any) => {
        if (event.properties) {
            if (event.properties.zoomLevel) {
                setCurrentZoom(event.properties.zoomLevel);
            }

            if (event.properties.visibleBounds) {
                const [ne, sw] = event.properties.visibleBounds;
                setVisibleBounds([[sw[0], sw[1]], [ne[0], ne[1]]]);
            }
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
                onRegionWillChange={(event) => {
                    if (event.properties && event.properties.visibleBounds) {
                        const [ne, sw] = event.properties.visibleBounds;
                        setVisibleBounds([[sw[0], sw[1]], [ne[0], ne[1]]]);
                    }
                    if (event.properties && event.properties.zoomLevel) {
                        setCurrentZoom(event.properties.zoomLevel);
                    }
                }}
                onRegionDidChange={(event) => {
                    if (event.properties && event.properties.visibleBounds) {
                        const [ne, sw] = event.properties.visibleBounds;
                        setVisibleBounds([[sw[0], sw[1]], [ne[0], ne[1]]]);
                    }
                    if (event.properties && event.properties.zoomLevel) {
                        setCurrentZoom(event.properties.zoomLevel);
                    }
                }}
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
                        <View style={styles.mapUserMarker} />
                    </PointAnnotation>
                )}

                {clusters.map(cluster => {
                    const [longitude, latitude] = cluster.geometry.coordinates;
                    const { cluster: isCluster, cluster_id, point_count } = cluster.properties;

                    if (isCluster) {
                        return (
                            <POIClusterMarker
                                key={`cluster-${cluster_id}`}
                                id={`${cluster_id}`}
                                coordinate={[longitude, latitude]}
                                pointCount={point_count}
                                onPress={() => handleClusterPress(cluster)}
                            />
                        );
                    } else {
                        // Individual POI marker
                        const poi = cluster.properties.poi;
                        return (
                            <POIMarker
                                key={`poi-${poi.guid}`}
                                poi={poi}
                                isActive={screenState === ScreenState.VIEWING && activePoi?.guid === poi.guid}
                                onSelect={handlePoiSelect}
                            />
                        );
                    }
                })}

                {(suggestedLocation && (screenState === ScreenState.SUGGESTING || screenState === ScreenState.FORM_POI_NEW)) && (
                    <SuggestedPOIMarker location={suggestedLocation} />
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
