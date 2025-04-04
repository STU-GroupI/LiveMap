import {POICoordinate} from './POICoordinate.ts';
import {POICategory} from './POICategory.ts';
import {POIStatus} from './POIStatus.ts';
import {Map} from '../Map/Map.ts';

export type POI = {
    guid: string;
    title: string;
    description: string;
    coordinate: POICoordinate;
    category: POICategory;
    status: POIStatus;
    map: Map;
    wheelChairAccessible: boolean;
}
