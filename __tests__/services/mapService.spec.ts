import * as turf from '@turf/turf';
import { fetchMaps, fetchClosestMap, fetchMap } from '../../src/services/mapService';
import { apiClient } from '../../src/services/apiClient';

jest.mock('../../src/services/apiClient', () => ({
    apiClient: {
        get: jest.fn(),
    },
}));

jest.mock('@turf/turf', () => ({
    center: jest.fn(() => ({
        geometry: { coordinates: [4.2, 51.1] },
    })),
}));

describe('mapService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('fetchMaps returns mapped maps', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({
            data: {
                items: [
                    { id: 'map-1', name: 'Map 1', area: [], bounds: [], imageUrl: 'url', pointsOfInterest: [] },
                ],
            },
        });
        const maps = await fetchMaps();
        expect(maps).toHaveLength(1);
        expect(maps[0]).toMatchObject({ id: 'map-1', name: 'Map 1' });
    });

    it('fetchClosestMap returns closest map', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({
            data: { id: 'map-closest', name: 'Closest Map' },
        });
        const map = await fetchClosestMap(51.1, 4.2);
        expect(map).toMatchObject({ id: 'map-closest', name: 'Closest Map' });
    });

    it('fetchMap returns IMapConfig with correct center and imageUrl', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({
            data: {
                id: 'map-1',
                area: [{ latitude: 51.1, longitude: 4.2 }],
                bounds: [],
                imageUrl: 'http://localhost/image.jpg',
                name: 'Map 1',
            },
        });
        const mapConfig = await fetchMap('map-1');
        expect(mapConfig.mapId).toBe('map-1');
        expect(mapConfig.center).toEqual([51.1, 4.2]);
        expect(mapConfig.imageUrl).toBe('http://10.0.2.2/image.jpg');
    });

    it('fetchMap throws if map not found', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: null });
        await expect(fetchMap('bad-id')).rejects.toThrow('Map not found');
    });

    it('fetchMap throws if area is invalid', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({
            data: { id: 'map-1', area: [], bounds: [], imageUrl: '', name: 'Map 1' },
        });
        await expect(fetchMap('map-1')).rejects.toThrow('Invalid area coordinates');
    });
});
