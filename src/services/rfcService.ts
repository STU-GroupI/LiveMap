import { apiClient } from './apiClient';
import {SuggestionRFC} from '../models/RFC/RFCSuggestion.ts';
import {ChangeRFC} from '../models/RFC/RFCChange.ts';

export const createSuggestionRFC = async (data: SuggestionRFC): Promise<any> => {
    const response = await apiClient.post('/rfc/poisuggestion', data);
    return response.data;
};

export const createChangeRFC = async (data: ChangeRFC): Promise<any> => {
    const response = await apiClient.post('/rfc', data);
    return response.data;
};
