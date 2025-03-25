import {POI} from '../models/POI/POI.ts';
import {POIStatus} from '../models/POI/POIStatus.ts';
import {POICoordinate} from '../models/POI/POICoordinate.ts';
import {POICategory} from '../models/POI/POICategory.ts';
import {Map} from '../models/Map/Map.ts';

import axios from 'axios';

/**
 * Keep it http instead of https as that causes SSL issues which we can't solve in the emulator.
 * If we want SSL we'd have to disable that for the request which is not supported without packages.
*/
const API_URL = 'http://10.0.2.2:5115/api';

export const fetchPois = async (mapId: String): Promise<POI[]> => {
    try {
        const response = await axios.get(API_URL + '/poi?mapId=' + mapId);

        return response.data.map((item: any) => {
            const latitude = Number(item.coordinate?.latitude);
            const longitude = Number(item.coordinate?.longitude);

            const isValidLatitude = latitude >= -90 && latitude <= 90;
            const isValidLongitude = longitude >= -180 && longitude <= 180;

            return {
                guid: item.id,
                title: item.title,
                coordinate: {
                    longitude: isValidLongitude ? longitude : 0,
                    latitude: isValidLatitude ? latitude : 0,
                } as POICoordinate,
                category: {
                    category: item.category,
                    categoryName: item.categoryName,
                } as POICategory,
                status: item.status as POIStatus,
                rating: item.rating ?? 0,
                map: {
                    guid: item.mapId,
                } as Map,
                wheelChairAccessible: item.wheelChairAccessible ?? false,
            } as POI;
        });
    } catch (error) {
        console.error('Fetch failed:', error);
        return [];
    }
};
