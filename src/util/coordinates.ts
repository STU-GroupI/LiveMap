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

export function getAreaBoxFromCoordinates(coords: POICoordinate[]) {
    if (!coords || coords.length === 0) {
        return null;
    }

    let minLat = coords[0].latitude;
    let maxLat = coords[0].latitude;
    let minLng = coords[0].longitude;
    let maxLng = coords[0].longitude;

    for (let i = 1; i < coords.length; i++) {
        const { latitude, longitude } = coords[i];
        minLat = Math.min(minLat, latitude);
        maxLat = Math.max(maxLat, latitude);
        minLng = Math.min(minLng, longitude);
        maxLng = Math.max(maxLng, longitude);
    }

    return {
        sw: [minLng, minLat] as [number, number],
        ne: [maxLng, maxLat] as [number, number],
    };
}
