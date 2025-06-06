import React from 'react';
import {CameraRef} from '@maplibre/maplibre-react-native';
import {POI} from '../models/POI/POI.ts';
import {ScreenState, ScreenStateAction} from '../state/ScreenStateReducer.ts';

export interface IMapConfig {
    mapId: string;
    mapStyle: string;
    center: [number, number];
    zoom: number;
    minZoom: number;
    maxZoom: number;
    cachingEnabled?: boolean;
}

export interface IMapConfigContext {
    config: IMapConfig,
    pois: POI[],
    screenState: ScreenState;
    dispatch: React.Dispatch<ScreenStateAction>;
    loading: boolean,
    userLocation: [number, number] | null,
    hasLocationPermission: boolean,
    cameraRef?: React.RefObject<CameraRef | null>,
    zoomRef?: React.RefObject<number>,
    handleRecenter: () => void,
    handleZoomIn: () => void,
    handleZoomOut: () => void,
    setZoomLevel: (zoomLevel: number) => void,
    canInteractWithMap: () => boolean,
    setMapId: (mapId: string) => void,
}
