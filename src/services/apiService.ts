import {POI} from '../models/POI.ts';

export const fetchPois = async (): Promise<POI[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    guid: '0',
                    longitude: 5.0400051970327695,
                    latitude: 51.645112317326367,
                    title: 'Supermarkt Landal Plus',
                    rating: 4.5,
                    wheelChairAccessible: true,
                },
                {
                    guid: '1',
                    longitude: 5.037716482415021,
                    latitude: 51.64509753870843,
                    title: 'Supermarkt Landal Min',
                    rating: 3.5,
                    wheelChairAccessible: false,
                },
            ]);
        }, 1500);
    });
};
