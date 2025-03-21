import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import MAP_STYLE, {DEFAULT_CENTER, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM} from './MapConfig.ts';
import {CameraRef, LocationManager} from '@maplibre/maplibre-react-native';
import {IMapConfig, IMapConfigContext} from '../interfaces/MapConfig.ts';

import useLocation from '../hooks/UseLocation.tsx';


const defaultConfig: IMapConfig = {
    mapStyle: MAP_STYLE,
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
};

const MapConfigContext = createContext<IMapConfigContext>({
    config: defaultConfig,
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

    const handleRecenter = async () => {
        try {
            const location = await LocationManager.getLastKnownLocation();
            if (location) {
                const { coords } = location;
                cameraRef.current?.setCamera({
                    centerCoordinate: [coords.longitude, coords.latitude],
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
