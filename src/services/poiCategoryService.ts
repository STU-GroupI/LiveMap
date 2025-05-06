import { apiClient } from './apiClient';
import {POICategory} from '../models/POI/POICategory.ts';


export const fetchCategories = async (): Promise<POICategory[]> => {
    const response = await apiClient.get('/category');
    return response.data;
};
