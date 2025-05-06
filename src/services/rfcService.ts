import { apiClient } from './apiClient';

interface SuggestionRFC {
    title: string;
    description: string;
    category: string;
    mapId: string;
    coordinate: {
        longitude: number;
        latitude: number;
    };
    isWheelchairAccessible: boolean;
}

interface ChangeRFC {
    poiId: string;
    message: string;
}

export const createSuggestionRFC = async (data: SuggestionRFC): Promise<any> => {
    const response = await apiClient.post('/rfc/poisuggestion', data);
    return response.data;
};

export const createChangeRFC = async (data: ChangeRFC): Promise<any> => {
    const response = await apiClient.post('/rfc', data);
    return response.data;
};
