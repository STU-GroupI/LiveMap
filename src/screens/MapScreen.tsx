import React, {
    useCallback,
    useEffect, useMemo,
    useRef,
    useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { Feature, Point, Position } from 'geojson';
import SuperCluster from 'supercluster';

import { useMapConfig } from '../context/MapConfigContext.tsx';
import { ScreenState } from '../state/screenStateReducer.ts';
import { setSuggesting, setViewing } from '../state/screenStateActions.ts';

import useBottomSheets from '../hooks/useBottomSheet.tsx';
import { POI } from '../models/POI/POI.ts';

import Loader from '../components/Loader.tsx';
import { Camera, ImageSource, MapView, PointAnnotation, RasterLayer } from '@maplibre/maplibre-react-native';
import MapCenterButton from '../components/map/MapCenterButton.tsx';
import MapZoomInOutButton from '../components/map/MapZoomInOutButton.tsx';
import SuggestPOIButton from '../components/map/suggestion/SuggestPOIButton.tsx';
import POIMarker from '../components/map/POIMarker.tsx';
import POIClusterMarker from '../components/map/POIClusterMarker.tsx';
import SuggestedPOIMarker from '../components/map/suggestion/SuggestedPOIMarker.tsx';
import MapCreateSuggestion from '../components/map/MapCreateSuggestion.tsx';
import MapPOIBottomSheet from '../components/map/MapPOIBottomSheet.tsx';
import EmptyScreen from '../screens/EmptyScreen.tsx';
import {getBoundingBoxFromCoordinates, isCoordinateInPolygon, toFixedCoordinates} from '../util/coordinates.ts';


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
        zoomRef,
        handleRecenter,
        handleZoomIn,
        handleZoomOut,
        setZoomLevel,
        canInteractWithMap,
    } = useMapConfig();

    const { bottomSheetRefs, handleOpen, handleClose } = useBottomSheets([
        'detail',
        'location',
        'dataform',
    ]);

    const [activePoi, setActivePoi] = useState<POI | undefined>();
    const [suggestedLocation, setSuggestedLocation] = useState<[number, number] | undefined>();
    const [visibleBounds, setVisibleBounds] = useState<[[number, number], [number, number]] | null>(null);
    const [clusters, setClusters] = useState<any[]>([]);

    const superclusterRef = useRef<SuperCluster | null>(null);
    const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const boundsBox = useMemo(() => {
        return getBoundingBoxFromCoordinates(config.bounds || []);
    }, [config.bounds]);

    const points = useMemo(() => {
        return pois.map((poi) => ({
            type: 'Feature' as const,
            properties: {
                cluster: false,
                poiId: poi.guid,
                poi,
            },
            geometry: {
                type: 'Point' as const,
                coordinates: [poi.coordinate.longitude, poi.coordinate.latitude],
            },
        }));
    }, [pois]);

    const updateClusters = useCallback(() => {
        if (!superclusterRef.current || !visibleBounds) {
            return;
        }

        if (throttleTimeoutRef.current) {
            clearTimeout(throttleTimeoutRef.current);
        }

        throttleTimeoutRef.current = setTimeout(() => {
            try {
                const [[swLng, swLat], [neLng, neLat]] = visibleBounds;
                const newClusters = superclusterRef.current?.getClusters(
                    [swLng, swLat, neLng, neLat],
                    Math.floor(zoomRef?.current || 0)
                );
                setClusters(newClusters || []);
            } catch (error) {
                console.error('Error updating clusters:', error);
            }
        }, 16);
    }, [visibleBounds, zoomRef]);

    useEffect(() => {
        if (points.length === 0) {
            return;
        }

        const cluster = new SuperCluster({
            radius: 40,
            maxZoom: 17,
            minPoints: 2,
        });

        cluster.load(points);
        superclusterRef.current = cluster;
        updateClusters();
    }, [points, updateClusters]);

    useEffect(() => {
        updateClusters();
    }, [zoomRef, visibleBounds, updateClusters]);

    if((screenState === ScreenState.EMPTY_MAP || !config.mapId) && !loading) {
        return <EmptyScreen />;
    }

    const handlePoiSelect = (selectedPoi: POI) => {
        if (activePoi?.guid !== selectedPoi.guid && canInteractWithMap()) {
            cameraRef?.current?.flyTo([
                selectedPoi.coordinate.longitude,
                selectedPoi.coordinate.latitude,
            ]);

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
        if (suggestedLocation !== undefined && config.area) {
            const coordinates: [number, number][] = config.area.map(coord => [coord.latitude, coord.longitude]);
            const pointCoordinates: [number, number] = [
                event.geometry.coordinates[0],
                event.geometry.coordinates[1],
            ];

            if (isCoordinateInPolygon(pointCoordinates, coordinates)) {
                setSuggestedLocation(pointCoordinates);
            }
        }
    };

    const handleClusterPress = (cluster: any) => {
        if (!superclusterRef.current || !cluster.properties.cluster) {
            return;
        }

        const clusterId = cluster.properties.cluster_id;
        const expansionZoom = superclusterRef.current.getClusterExpansionZoom(clusterId);
        const [longitude, latitude] = cluster.geometry.coordinates;
        const nextZoom = Math.min(expansionZoom + 1, config.maxZoom);

        cameraRef?.current?.setCamera({
            centerCoordinate: [longitude, latitude],
            zoomLevel: nextZoom,
            animationDuration: 1500,
        });
        setZoomLevel(nextZoom);
    };

    const handleMapRegionChange = (event: any) => {
        const { zoomLevel, visibleBounds: bounds } = event.properties || {};
        if (zoomLevel) {
            setZoomLevel(zoomLevel);
        }

        if (bounds) {
            const [ne, sw] = bounds;
            setVisibleBounds([[sw[0], sw[1]], [ne[0], ne[1]]]);
        }
    };

    const fixedCoordinates: [Position, Position, Position, Position] | undefined =
        config.bounds
            ? toFixedCoordinates(config.bounds)
            : undefined;

    if (loading || !hasLocationPermission) {
        return <Loader />;
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                mapStyle={config.mapStyle}
                compassEnabled
                compassViewPosition={3}
                rotateEnabled={false}
                onPress={handleSetSuggestedLocation}
                onRegionDidChange={handleMapRegionChange}
            >
                <Camera
                    ref={cameraRef}
                    centerCoordinate={config.center}
                    zoomLevel={config.zoom}
                    minZoomLevel={config.minZoom}
                    maxZoomLevel={config.maxZoom}
                    followUserLocation={false}
                    maxBounds={boundsBox ? {
                        ne: boundsBox.ne,
                        sw: boundsBox.sw,
                    } : undefined }
                />

                {config.imageUrl && (
                    <ImageSource
                        id={'background-overlay'}
                        url={config.imageUrl}
                        coordinates={fixedCoordinates}
                    >
                        <RasterLayer
                            id="custom-background-layer"
                            sourceID="custom-background-source"
                            style={{ rasterOpacity: 1 }}
                            layerIndex={666}
                        />
                    </ImageSource>
                )}

                {userLocation && (
                    <PointAnnotation id="user-location" coordinate={userLocation}>
                        <View style={styles.mapUserMarker} />
                    </PointAnnotation>
                )}

                {clusters.map((cluster) => {
                    const [lng, lat] = cluster.geometry.coordinates;
                    const { cluster: isCluster, cluster_id, point_count } = cluster.properties;

                    return isCluster ? (
                        <POIClusterMarker
                            key={`cluster-${cluster_id}`}
                            id={`${cluster_id}`}
                            coordinate={[lng, lat]}
                            pointCount={point_count}
                            onPress={() => handleClusterPress(cluster)}
                        />
                    ) : (
                        <POIMarker
                            key={`poi-${cluster.properties.poi.guid}`}
                            poi={cluster.properties.poi}
                            isActive={screenState === ScreenState.VIEWING && activePoi?.guid === cluster.properties.poi.guid}
                            onSelect={handlePoiSelect}
                        />
                    );
                })}

                {suggestedLocation &&
                    (screenState === ScreenState.SUGGESTING || screenState === ScreenState.FORM_POI_NEW) && (
                        <SuggestedPOIMarker location={suggestedLocation} />
                    )}
            </MapView>

            <SuggestPOIButton
                handleCreateSuggestion={handleCreateSuggestion}
                active={screenState === ScreenState.SUGGESTING}
            />
            <MapZoomInOutButton handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} />
            <MapCenterButton handleRecenter={handleRecenter} />

            {activePoi && (
                <MapPOIBottomSheet
                    bottomSheetRef={bottomSheetRefs}
                    poi={activePoi}
                    onClose={() => setActivePoi(undefined)}
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
        backgroundColor: '#fff',
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
