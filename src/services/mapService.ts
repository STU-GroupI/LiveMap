import { apiClient } from './apiClient';
import { Map } from '../models/Map/Map';
import { IMapConfig } from '../interfaces/MapConfig.ts';
import { DEFAULT_CENTER, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM, MAP_STYLE } from '../config/MapConfig.ts';
import * as turf from '@turf/turf';

interface MapApiResponse {
    items: Array<{
        id: string;
        name: string;
    }>;
}

export const fetchMaps = async (): Promise<Map[]> => {
    const response = await apiClient.get<MapApiResponse>('/map');
    if (response.data && response.data.items) {
        const maps = response.data.items.map(item => ({
            guid: item.id,
            name: item.name}));
        return maps;
    }

    return [];
    };

export const fetchClosestMap = async (
  latitude: number,
  longitude: number
): Promise<MapItem> => {
  const response = await apiClient.get<MapItem>('/map/closest', {
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
