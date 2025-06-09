import {apiClient} from './apiClient';
import {Map} from '../models/Map/Map';
import {IMapConfig} from '../interfaces/MapConfig.ts';
import {DEFAULT_CENTER, DEFAULT_ZOOM, MAP_STYLE, MAX_ZOOM, MIN_ZOOM} from '../config/MapConfig.ts';
import * as turf from '@turf/turf';
import { apiClient } from "./apiClient";
import { Map } from "../models/Map/Map";


interface MapApiResponse {
    items: Array<Map>;
}

export const fetchMaps = async (): Promise<Map[]> => {
    const response = await apiClient.get<MapApiResponse>('/map');
    if (response.data && response.data.items) {
        return response.data.items.map(item => ({
            id: item.id,
            name: item.name,
            area: item.area,
            bounds: item.bounds,
            imageUrl: item.imageUrl,
            pointsOfInterest: item.pointsOfInterest,
        }));
    }

    return [];
    };

export const fetchClosestMap = async (
  latitude: number,
  longitude: number
): Promise<Map> => {
  const response = await apiClient.get<Map>('/map/closest', {
    params: {
      latitude,
      longitude,
    },
  });

  return response.data;
};

export const fetchMap = async (id: string): Promise<IMapConfig> => {
    const response = await apiClient.get('/map/' + id);
    const map: Map = response.data;

    if (!map) {
        throw new Error('Map not found');
    }

    const coordinates = map.area
        ?.map(point => [point.longitude, point.latitude])
        .filter(point => point[0] !== undefined && point[1] !== undefined);

    if (!coordinates || coordinates.length === 0) {
        throw new Error('Invalid area coordinates');
    }

    const geoJsonArea = {
        type: 'MultiPolygon' as const,
        coordinates: [[[...coordinates]]],
    };
    const center = turf.center(geoJsonArea).geometry.coordinates || DEFAULT_CENTER;

    return {
        mapId: map.id,
        mapStyle: MAP_STYLE,
        center: [center[1], center[0]],
        zoom: DEFAULT_ZOOM,
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
        area: map.area || null,
        bounds: map.bounds || null,
        imageUrl: map.imageUrl?.replace('localhost', '10.0.2.2') || null,
    };
};
