import {Position} from 'geojson';
import {POICoordinate} from '../models/POI/POICoordinate.ts';
import * as turf from '@turf/turf';

export function getFixedCoordinateFromBounds(idx: number, bounds: POICoordinate[] | null): Position | undefined {
    if (!bounds || bounds.length < 4) {
        return undefined;
    }

    const coordinate = bounds[idx];
    return [coordinate.longitude, coordinate.latitude] as Position;
}

export function toFixedCoordinates(bounds: POICoordinate[]): [Position, Position, Position, Position] {
    return [
        getFixedCoordinateFromBounds(0, bounds) || [0, 0],
        getFixedCoordinateFromBounds(2, bounds) || [0, 0],
        getFixedCoordinateFromBounds(1, bounds) || [0, 0],
        getFixedCoordinateFromBounds(3, bounds) || [0, 0],
    ];
}

export const isCoordinateInPolygon = (
    pointCoordinates: [number, number],
    polygonCoordinates: [number, number][]
): boolean => {
    const polygon = turf.polygon([polygonCoordinates]);
    const point = turf.point(pointCoordinates);

    return turf.booleanPointInPolygon(point, polygon);
};
