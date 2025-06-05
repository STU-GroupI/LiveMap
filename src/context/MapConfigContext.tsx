import React, {createContext, useContext, useEffect, useReducer, useRef, useCallback, useState} from 'react';
import MAP_STYLE, {DEFAULT_CENTER, DEFAULT_ZOOM, MAX_ZOOM, MIN_ZOOM} from '../config/MapConfig.ts';

import {CameraRef} from '@maplibre/maplibre-react-native';
import {IMapConfig, IMapConfigContext} from '../interfaces/MapConfig.ts';

import useLocation from '../hooks/UseLocation.tsx';
import {useAppbar} from './AppbarContext.tsx';
import {ScreenState, screenStateReducer} from '../state/screenStateReducer.ts';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {fetchPois} from '../services/poiService.ts';
import {fetchMaps} from '../services/mapService.ts';
import {MAP_DEFAULT_ID} from '@env';

const REFETCH_INTERVAL = 60_000;

const defaultConfig: IMapConfig = {
    mapId: MAP_DEFAULT_ID,
    mapStyle: MAP_STYLE,
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
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
    setMapId: () => {},
});

export const MapConfigProvider = ({ children }: { children: React.ReactNode}) => {
    const [screenState, dispatch] = useReducer(screenStateReducer, ScreenState.VIEWING);
    const queryClient = useQueryClient();
    const [initialMapIdLoaded, setInitialMapIdLoaded] = useState(false);


    const zoomRef = useRef<number>(DEFAULT_ZOOM);
    const cameraRef = useRef<CameraRef>(null);

    const { hasLocationPermission, userLocation } = useLocation();
    const { expandAppbar, collapseAppbar } = useAppbar();

    const { data: maps = [] } = useQuery({
        queryKey: ['maps'],
        queryFn: fetchMaps,
    });

    useEffect(() => {
        if (!initialMapIdLoaded && maps.length > 0) {
            defaultConfig.mapId = maps[0].guid;
            
            const updatedConfig = { ...defaultConfig, mapId: maps[0].guid };
            queryClient.setQueryData(['mapConfig'], updatedConfig);
            
            queryClient.invalidateQueries({ queryKey: ['pois', maps[0].guid] });
            setInitialMapIdLoaded(true);
        }
    }, [maps, initialMapIdLoaded, queryClient]);

    const { data: config = defaultConfig, isLoading: configLoading } = useQuery({
        queryKey: ['mapConfig'],
        queryFn: async () => {
            return { ...defaultConfig };
        },
        enabled: true,
    });

    const { data: fetchedPois = [], isLoading: poisLoading } = useQuery({
        queryKey: ['pois', config.mapId],
        queryFn: () => fetchPois(config.mapId),
        refetchInterval: REFETCH_INTERVAL,
    });

    const pois = React.useMemo(() => fetchedPois, [fetchedPois]);

    const loading = configLoading || poisLoading;

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
    }, [screenState, expandAppbar, collapseAppbar]);

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

    const setMapId = useCallback((mapId: string) => {
        defaultConfig.mapId = mapId;
        
        queryClient.invalidateQueries({ queryKey: ['mapConfig'] });
        queryClient.invalidateQueries({ queryKey: ['pois', mapId] });
        
        const updatedConfig = { ...config, mapId };
        queryClient.setQueryData(['mapConfig'], updatedConfig);
    }, [queryClient, config]);

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
                setMapId,
            }
        }>
            {children}
        </MapConfigContext.Provider>
    );
};

export const useMapConfig = () => useContext(MapConfigContext);
