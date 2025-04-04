import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import MAP_STYLE, {DEFAULT_CENTER, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM} from './MapConfig.ts';

import {CameraRef} from '@maplibre/maplibre-react-native';
import {IMapConfig, IMapConfigContext} from '../interfaces/MapConfig.ts';
import {POI} from '../models/POI/POI.ts';

import useLocation from '../hooks/UseLocation.tsx';
import {fetchPois} from '../services/apiService.ts';


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
    loading: true,
    userLocation: null,
    hasLocationPermission: false,
    handleRecenter: () => {},
    handleZoomIn: () => {},
    handleZoomOut: () => {},
});

export const MapConfigProvider = ({ children }: { children: React.ReactNode}) => {
    const [config, setConfig] = useState<IMapConfig>(defaultConfig);
    const [loading, setLoading] = useState(true);
    const zoomRef  = useRef<number>(DEFAULT_ZOOM);
    const cameraRef = useRef<CameraRef>(null);
    const { hasLocationPermission, userLocation } = useLocation();

    const [pois, setPois] = useState<POI[]>([]);

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
            const loadedPois = await fetchPois('2a4dd4e4-1b93-b975-da6e-3e45df6908cc');
            setPois(loadedPois);
        };

        loadPois();
    }, []);

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

    return (
        <MapConfigContext.Provider value={
            {
                config,
                pois,
                userLocation,
                hasLocationPermission,
                loading,
                cameraRef,
                handleRecenter,
                handleZoomIn,
                handleZoomOut,
            }
        }>
            {children}
        </MapConfigContext.Provider>
    );
};

export const useMapConfig = () => useContext(MapConfigContext);
