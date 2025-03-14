import React from 'react';
import {CameraRef} from '@maplibre/maplibre-react-native';

export interface IMapConfig {
    mapStyle: any;
    center: [number, number];
}

export interface IMapConfigContext {
    config: IMapConfig,
    loading: boolean,
    cameraRef?: React.RefObject<CameraRef | null>,
    handleRecenter: () => void,
}
