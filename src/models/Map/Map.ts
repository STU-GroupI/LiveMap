import {POI} from '../POI/POI.ts';
import {POICoordinate} from '../POI/POICoordinate.ts';

export type Map = {
    id: string;
    name: string;
    area: POICoordinate[] | null;
    bounds: POICoordinate[] | null;
    imageUrl: string | null;
    pointsOfInterest: POI[] | null;
}
