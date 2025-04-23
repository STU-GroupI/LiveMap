import React, {createContext, useContext, useEffect, useReducer, useRef, useState} from 'react';
import MAP_STYLE, {DEFAULT_CENTER, DEFAULT_ZOOM, MAX_ZOOM, MIN_ZOOM} from '../config/MapConfig.ts';

import {CameraRef} from '@maplibre/maplibre-react-native';
import {IMapConfig, IMapConfigContext} from '../interfaces/MapConfig.ts';
import {POI} from '../models/POI/POI.ts';

import useLocation from '../hooks/UseLocation.tsx';
import {fetchPois} from '../services/apiService.ts';
import {useAppbar} from './AppbarContext.tsx';
import {ScreenState, screenStateReducer} from '../state/screenStateReducer.ts';


const defaultConfig: IMapConfig = {
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
});

export const MapConfigProvider = ({ children }: { children: React.ReactNode}) => {
    const [config, setConfig] = useState<IMapConfig>(defaultConfig);
    const [loading, setLoading] = useState(true);
    const [pois, setPois] = useState<POI[]>([]);

    const [screenState, dispatch] = useReducer(screenStateReducer, ScreenState.VIEWING);

    const zoomRef  = useRef<number>(DEFAULT_ZOOM);
    const cameraRef = useRef<CameraRef>(null);

    const { hasLocationPermission, userLocation } = useLocation();
    const { expandAppbar, collapseAppbar } = useAppbar();

    useEffect(() => {
        const loadConfig = async () => {
            try {
                setConfig((prev) => ({...prev}));
            } catch (error) {
                console.error('Failed to load map config:', error);
            } finally {
                setLoading(false);
            }
        };

        loadConfig();
    }, []);

    useEffect(() => {
        const loadPois = async () => {
            const loadedPois = await fetchPois('67611ad5-4ce0-6709-b4cd-17a9f92ceabc');
            setPois(loadedPois);
        };

        loadPois();
    }, []);

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
