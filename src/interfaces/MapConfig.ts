import React from 'react';
import {CameraRef} from '@maplibre/maplibre-react-native';

export interface IMapConfig {
    mapStyle: any;
    center: [number, number];
    zoom: number;
    minZoom: number;
    maxZoom: number;
}

export interface IMapConfigContext {
    config: IMapConfig,
    loading: boolean,
    cameraRef?: React.RefObject<CameraRef | null>,
    handleRecenter: () => void,
    handleZoomIn: () => void,
    handleZoomOut: () => void,
}
