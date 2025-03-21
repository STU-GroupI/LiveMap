import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import MAP_STYLE, {DEFAULT_CENTER} from './MapConfig.ts';

import {CameraRef, LocationManager} from '@maplibre/maplibre-react-native';
import {IMapConfig, IMapConfigContext} from '../interfaces/MapConfig.ts';
import {POI} from '../models/POI.ts';

import {fetchPois} from '../services/apiService.ts';


const defaultConfig: IMapConfig = {
    mapStyle: MAP_STYLE,
    center: DEFAULT_CENTER,
};

const MapConfigContext = createContext<IMapConfigContext>({
    config: defaultConfig,
    pois: [],
    loading: true,
    handleRecenter: () => {},
});

export const MapConfigProvider = ({ children }: { children: React.ReactNode}) => {
    const [config, setConfig] = useState<IMapConfig>(defaultConfig);
    const [loading, setLoading] = useState(true);
    const cameraRef = useRef<CameraRef>(null);

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
            try {
                const loadedPois = await fetchPois();
                setPois(loadedPois);
            } catch (error) {
                console.error('Failed to load poi config:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPois();
    }, []);

    const handleRecenter = async () => {
        try {
            const location = await LocationManager.getLastKnownLocation();
            if (location) {
                const { coords } = location;
                cameraRef.current?.setCamera({
                    centerCoordinate: [coords.longitude, coords.latitude],
                    zoomLevel: 15,
                    animationDuration: 1000,
                });
            }
        } catch (error) {
            console.warn('Could not get current location:', error);
        }
    };

    return (
        <MapConfigContext.Provider value={{config, pois, loading, cameraRef, handleRecenter}}>
            {children}
        </MapConfigContext.Provider>
    );
};

export const useMapConfig = () => useContext(MapConfigContext);
