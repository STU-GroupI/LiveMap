import React, {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useRef,
    useCallback,
    useState,
    useMemo,
} from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CameraRef } from '@maplibre/maplibre-react-native';

import {
    DEFAULT_CENTER,
    DEFAULT_ZOOM,
    MAX_ZOOM,
    MIN_ZOOM,
} from '../config/MapConfig.ts';

import { fetchPois } from '../services/poiService.ts';
import { fetchMaps, fetchClosestMap, fetchMap } from '../services/mapService.ts';

import { setEmpty } from '../state/screenStateActions.ts';
import { screenStateReducer, ScreenState } from '../state/screenStateReducer.ts';
import { useAppbar } from './AppbarContext.tsx';
import useLocation from '../hooks/UseLocation.tsx';

import type { IMapConfig, IMapConfigContext } from '../interfaces/MapConfig.ts';

const REFETCH_INTERVAL = 60_000;

const defaultConfig: IMapConfig = {
    mapId: '',
    mapStyle: '',
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    area: null,
    bounds: null,
    imageUrl: null,
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
    setZoomLevel: () => {},
    canInteractWithMap: () => false,
    setMapId: () => {},
});

export const MapConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const [screenState, dispatch] = useReducer(screenStateReducer, ScreenState.VIEWING);
    const [initialMapIdLoaded, setInitialMapIdLoaded] = useState(false);
    const [mapId, setMapId] = useState<string | null>(null);
    const [isEmptyState, setIsEmptyState] = useState(false);

    const queryClient = useQueryClient();
    const zoomRef = useRef<number>(DEFAULT_ZOOM);
    const cameraRef = useRef<CameraRef>(null);

    const { hasLocationPermission, userLocation } = useLocation();
    const { expandAppbar, collapseAppbar } = useAppbar();

    const locationReady =
        Array.isArray(userLocation) &&
        typeof userLocation[0] === 'number' &&
        typeof userLocation[1] === 'number';

    const {
        data: maps = [],
        isSuccess: mapsCallDone,
        isLoading: isMapsLoading,
    } = useQuery({
        queryKey: ['maps'],
        queryFn: fetchMaps,
    });

    const {
        data: closestMap,
        isSuccess: closestCallDone,
        isError: closestCallError,
        isLoading: isClosestLoading,
    } = useQuery({
        queryKey: ['maps', 'closest', userLocation],
        queryFn: () => {
            if (userLocation) {
                const [lng, lat] = userLocation;
                return fetchClosestMap(lat, lng);
            }
            return null;
        },
        enabled: locationReady,
    });

    useEffect(() => {
        if (
            !initialMapIdLoaded &&
            mapsCallDone &&
            (closestCallDone || closestCallError)
        ) {
            const resolvedId = closestMap?.id || maps[0]?.id || null;

            if (resolvedId) {
                setMapId(resolvedId);
            } else {
                dispatch(setEmpty());
                setIsEmptyState(true);
            }

            setInitialMapIdLoaded(true);
        }
    }, [
        maps,
        closestMap,
        initialMapIdLoaded,
        mapsCallDone,
        closestCallDone,
        closestCallError,
        dispatch,
    ]);

    const {
        data: config,
        isLoading: configLoading,
    } = useQuery({
        queryKey: ['mapConfig', mapId],
        queryFn: () => fetchMap(mapId || ''),
        enabled: !!mapId && !isEmptyState,
    });

    const {
        data: fetchedPois = [],
        isLoading: poisLoading,
    } = useQuery({
        queryKey: ['pois', mapId],
        queryFn: () => fetchPois(mapId as string),
        refetchInterval: REFETCH_INTERVAL,
        enabled: !!mapId && !isEmptyState,
    });

    const loading =
        configLoading || poisLoading || isMapsLoading || isClosestLoading || !initialMapIdLoaded;

    const pois = useMemo(() => fetchedPois, [fetchedPois]);

    useEffect(() => {
        if (screenState === ScreenState.SUGGESTING) {
            expandAppbar({
                title: 'Click on the map to suggest a location',
                actions: [],
                centerTitle: true,
                overlapContent: true,
            });
        } else {
            collapseAppbar();
        }
    }, [screenState, expandAppbar, collapseAppbar]);

    const handleRecenter = async () => {
        try {
            if (userLocation) {
                const [longitude, latitude] = userLocation;
                cameraRef.current?.setCamera({
                    centerCoordinate: [longitude, latitude],
                    zoomLevel: config?.maxZoom || DEFAULT_ZOOM,
                    animationDuration: 1000,
                });
                zoomRef.current = config?.maxZoom || DEFAULT_ZOOM;
            }
        } catch (error) {
            console.warn('Could not recenter to location:', error);
        }
    };

    const handleZoomIn = () => {
        const zoom = Math.min(zoomRef.current + 1, MAX_ZOOM);
        zoomRef.current = zoom;
        cameraRef.current?.zoomTo(zoom);
    };

    const handleZoomOut = () => {
        const zoom = Math.max(zoomRef.current - 1, MIN_ZOOM);
        zoomRef.current = zoom;
        cameraRef.current?.zoomTo(zoom);
    };

    const setZoomLevel = (zoom: number) => {
        const clampedZoom = Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM);
        zoomRef.current = clampedZoom;
        cameraRef.current?.zoomTo(clampedZoom);
    };

    const canInteractWithMap = () =>
        screenState === ScreenState.VIEWING || screenState === ScreenState.SUGGESTING;

    const handleSetMapId = useCallback(
        (newMapId: string) => {
            setMapId(newMapId);
            queryClient.invalidateQueries({ queryKey: ['mapConfig', newMapId] });
            queryClient.invalidateQueries({ queryKey: ['pois', newMapId] });
        },
        [queryClient]
    );

    return (
        <MapConfigContext.Provider
            value={{
                config : config || defaultConfig,
                pois,
                screenState,
                dispatch,
                userLocation,
                hasLocationPermission,
                loading,
                cameraRef,
                zoomRef,
                handleRecenter,
                handleZoomIn,
                handleZoomOut,
                setZoomLevel,
                canInteractWithMap,
                setMapId: handleSetMapId,
            }}
        >
            {children}
        </MapConfigContext.Provider>
    );
};

export const useMapConfig = () => useContext(MapConfigContext);
