import {POI} from '../models/POI/POI.ts';
import {POIStatus} from '../models/POI/POIStatus.ts';
import {POICoordinate} from '../models/POI/POICoordinate.ts';
import {POICategory} from '../models/POI/POICategory.ts';
import {POIOpeningHours} from '../models/POI/POIOpeningHours.ts';
import {Map} from '../models/Map/Map.ts';

import axios from 'axios';

/**
 * Keep it http instead of https as that causes SSL issues which we can't solve in the emulator.
 * If we want SSL we'd have to disable that for the request which is not supported without packages.
*/
const API_URL = 'http://10.0.2.2:5006/api';

interface SuggestionRFC {
    title: string,
    description: string,
    category: string,
    mapId: string,
    coordinate: {
        longitude: number,
        latitude: number
    },
    isWheelchairAccessible: boolean
}

interface ChangeRFC {
    poiId: string;
    message: string;
}

function formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}

function dayOfWeekToString(dayOfWeek: number): string {
    const days = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
    return days[dayOfWeek] || days[0];
}

export const fetchPois = async (mapId: String): Promise<POI[]> => {
    try {
        const response = await axios.get(API_URL + '/poi?mapId=' + mapId);

        return response.data.map((item: any) => {
            const latitude = Number(item.coordinate?.latitude);
            const longitude = Number(item.coordinate?.longitude);

            const isValidLatitude = latitude >= -90 && latitude <= 90;
            const isValidLongitude = longitude >= -180 && longitude <= 180;

            const openingHours: POIOpeningHours[] = item.openingHours?.map((entry: any) => ({
                guid: entry.guid,
                dayOfWeek: dayOfWeekToString(entry.dayOfWeek),
                dayIndex: entry.dayOfWeek,
                start: formatTime(entry.start),
                end: formatTime(entry.end),
            })) ?? [];

            return {
                guid: item.id,
                title: item.title,
                image: item.image,
                description: item.description,
                coordinate: {
                    longitude: isValidLongitude ? longitude : 0,
                    latitude: isValidLatitude ? latitude : 0,
                } as POICoordinate,
                category: {
                    category: item.category,
                    categoryName: item.categoryName,
                } as POICategory,
                status: item.status as POIStatus,
                map: {
                    guid: item.mapId,
                    name: item.mapName || '',
                } as Map,
                wheelChairAccessible: item.wheelChairAccessible ?? false,
                openingHours: openingHours,
            } as POI;
        });
    } catch (error) {
        return [];
    }
};

export const createSuggestionRFC = async (data: SuggestionRFC): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        await axios.post(API_URL + '/rfc/poisuggestion', data).then((response) => {
            if (response.status === 201) {
                resolve(response.data);
            }
        }).catch((error) => {
            reject(error);
        });
    });
};

export const createChangeRFC = async (data: ChangeRFC): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        await axios.post(API_URL + '/rfc', data).then((response) => {
          if (response.status === 201) {
            resolve(response.data);
          }
        }).catch((error) => {
          reject(error);
        });
    });
};
