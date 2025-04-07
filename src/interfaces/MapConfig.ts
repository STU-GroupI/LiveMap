import React from 'react';
import {CameraRef} from '@maplibre/maplibre-react-native';
import {POI} from '../models/POI/POI.ts';

export interface IMapConfig {
    mapStyle: any;
    center: [number, number];
    zoom: number;
    minZoom: number;
    maxZoom: number;
}

export enum ScreenState {
    VIEWING,        // Normally viewing the map or an item (details too)
    SUGGESTING,     // When suggesting a new location (state in between states)
    FORM_NEW,       // When creating a new POI
    FORM_CHANGE     // When changing an existing POI
}

export interface IMapConfigContext {
    config: IMapConfig,
    pois: POI[],
    screenState: ScreenState,
    setScreenState: (state: ScreenState) => void,
    loading: boolean,
    userLocation: [number, number] | null,
    hasLocationPermission: boolean,
    cameraRef?: React.RefObject<CameraRef | null>,
    handleRecenter: () => void,
    handleZoomIn: () => void,
    handleZoomOut: () => void,
    canInteractWithMap: () => boolean,
}
