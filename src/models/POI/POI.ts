import {POICoordinate} from './POICoordinate.ts';
import {POICategory} from './POICategory.ts';
import {POIStatus} from './POIStatus.ts';
import {POIOpeningHours} from './POIOpeningHours.ts';
import {Map} from '../Map/Map.ts';

export type POI = {
    guid: string;
    title: string;
    rating: number;
    coordinate: POICoordinate;
    category: POICategory;
    status: POIStatus;
    map: Map;
    wheelChairAccessible: boolean;
    openingHours: POIOpeningHours[];
}
