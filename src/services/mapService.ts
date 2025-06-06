import { apiClient } from './apiClient';
import { Map } from '../models/Map/Map';

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
