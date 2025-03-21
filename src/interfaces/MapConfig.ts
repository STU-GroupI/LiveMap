import React from 'react';
import {CameraRef} from '@maplibre/maplibre-react-native';
import {POI} from '../models/POI.ts';

export interface IMapConfig {
    mapStyle: any;
    center: [number, number];
    zoom: number;
    minZoom: number;
    maxZoom: number;
}

export interface IMapConfigContext {
    config: IMapConfig,
    pois: POI[],
    loading: boolean,
    userLocation: [number, number] | null,
    hasLocationPermission: boolean,
    cameraRef?: React.RefObject<CameraRef | null>,
    handleRecenter: () => void,
    handleZoomIn: () => void,
    handleZoomOut: () => void,
}
