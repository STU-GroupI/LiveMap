import React, {createContext, useContext, useEffect, useReducer, useRef} from 'react';
import MAP_STYLE, {DEFAULT_CENTER, DEFAULT_ZOOM, MAX_ZOOM, MIN_ZOOM} from '../config/MapConfig.ts';

import {CameraRef} from '@maplibre/maplibre-react-native';
import {IMapConfig, IMapConfigContext} from '../interfaces/MapConfig.ts';

import useLocation from '../hooks/UseLocation.tsx';
import {useAppbar} from './AppbarContext.tsx';
import {ScreenState, screenStateReducer} from '../state/screenStateReducer.ts';
import {useQuery} from '@tanstack/react-query';
import {fetchPois} from '../services/poiService.ts';
import {MAP_DEFAULT_ID} from '@env';
import {ensureOfflinePack} from '../services/offlineService.ts';

const REFETCH_INTERVAL = 60_000;

const defaultConfig: IMapConfig = {
    mapId: MAP_DEFAULT_ID,
    mapStyle: MAP_STYLE,
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    cachingEnabled: false,
};

const MapConfigContext = createContext<IMapConfigContext>({
    config: defaultConfig,
    pois: [],
    screenState: ScreenState.VIEWING,
    dispatch: () => {},
    loading: true,
    userLocation: null,
    hasLocationPermission: false,
    handleRecenter: () => {},
    handleZoomIn: () => {},
    handleZoomOut: () => {},
    canInteractWithMap: () => false,
});

export const MapConfigProvider = ({ children }: { children: React.ReactNode}) => {
    const [screenState, dispatch] = useReducer(screenStateReducer, ScreenState.VIEWING);

    const zoomRef  = useRef<number>(DEFAULT_ZOOM);
    const cameraRef = useRef<CameraRef>(null);

    const { hasLocationPermission, userLocation } = useLocation();
    const { expandAppbar, collapseAppbar } = useAppbar();

    const { data: config = defaultConfig, isLoading: configLoading } = useQuery({
        queryKey: ['mapConfig'],
        queryFn: async () => {
            return { ...defaultConfig };
        },
    });

    const { data: fetchedPois = [], isLoading: poisLoading } = useQuery({
        queryKey: ['pois', config.mapId],
        queryFn: () => fetchPois(config.mapId),
        refetchInterval: REFETCH_INTERVAL,
        enabled: !!config.mapId,
        staleTime: 1000 * 60 * 60,
    });

    const pois = React.useMemo(() => fetchedPois, [fetchedPois]);

    const loading = false;

    useEffect(() => {
        switch (screenState) {
            case ScreenState.SUGGESTING:
                expandAppbar({
                    title: 'Click on the map to suggest a location',
                    actions: [],
                    centerTitle: true,
                    overlapContent: true,
                });
                break;
            default:
                collapseAppbar();
        }
    }, [collapseAppbar, expandAppbar, screenState]);


    useEffect(() => {
        if (!configLoading && config.cachingEnabled) {
            ensureOfflinePack(config)
                .then(() => {
                    console.log('Offline pack ensured');
                })
                .catch((err) => {
                    console.error('Error ensuring offline pack:', err);
                });
        }
    }, [config, configLoading]);


    const handleRecenter = async () => {
        try {
            if (userLocation) {
                const [ longitude, latitude ] = userLocation;
                cameraRef.current?.setCamera({
                    centerCoordinate: [longitude, latitude],
                    zoomLevel: config.maxZoom,
                    animationDuration: 1000,
                });

                zoomRef.current = config.maxZoom;
            }
        } catch (error) {
            console.warn('Could not get current location:', error);
        }
    };

    const handleZoomIn = () => {
        const zoom = Math.max(zoomRef.current + 1, MIN_ZOOM);
        zoomRef.current = zoom;

        cameraRef.current?.zoomTo(zoom);
    };

    const handleZoomOut = () => {
        const zoom = Math.max(zoomRef.current - 1, MIN_ZOOM);
        zoomRef.current = zoom;

        cameraRef.current?.zoomTo(zoom);
    };

    const canInteractWithMap = () => {
        return screenState === ScreenState.VIEWING || screenState === ScreenState.SUGGESTING;
    };

    return (
        <MapConfigContext.Provider value={
            {
                config,
                pois,
                screenState,
                dispatch,
                userLocation,
                hasLocationPermission,
                loading,
                cameraRef,
                handleRecenter,
                handleZoomIn,
                handleZoomOut,
                canInteractWithMap,
            }
        }>
            {children}
        </MapConfigContext.Provider>
    );
};

export const useMapConfig = () => useContext(MapConfigContext);
