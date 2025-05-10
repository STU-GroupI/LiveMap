import { apiClient } from './apiClient';
import { POI } from '../models/POI/POI';
import { POIOpeningHours } from '../models/POI/POIOpeningHours';
import { POIStatus } from '../models/POI/POIStatus';

const formatTime = (time: string): string => time.slice(0, 5);

const dayOfWeekToString = (day: number): string => {
    const days = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
    return days[day] || 'Onbekend';
};

export const fetchPois = async (mapId: string): Promise<POI[]> => {
    const response = await apiClient.get('/poi', { params: { mapId } });

    return response.data.map((item: any) => {
        const lat = Number(item.coordinate?.latitude);
        const lon = Number(item.coordinate?.longitude);

        const isValidLatitude = lat >= -90 && lat <= 90;
        const isValidLongitude = lon >= -180 && lon <= 180;

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
                longitude: isValidLongitude ? lon : 0,
                latitude: isValidLatitude ? lat : 0,
            },
            category: {
                category: item.category?.categoryName || 'Unknown',
                categoryName: item.category?.categoryName || 'Unknown',
                iconName: item.category?.iconName || 'default-icon',
            },
            status: item.status || 'Unknown',
            map: {
                guid: item.mapId || 'Unknown',
                name: item.map?.name || '',
            },
            wheelChairAccessible: item.isWheelchairAccessible ?? false,
            openingHours,
        } as POI;
    });
};
