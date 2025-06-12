import { fetchPois } from '../../src/services/poiService';
import { apiClient } from '../../src/services/apiClient';

jest.mock('../../src/services/apiClient', () => ({
    apiClient: {
        get: jest.fn(),
    },
}));

describe('poiService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('fetchPois maps API data to POI objects', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({
            data: [
                {
                    id: 'poi-1',
                    title: 'Test POI',
                    image: 'http://localhost/image.jpg',
                    description: 'desc',
                    coordinate: { latitude: '51.1', longitude: '4.2' },
                    category: { categoryName: 'Food', iconName: 'food' },
                    status: 'Active',
                    mapId: 'map-1',
                    map: { name: 'Test Map' },
                    isWheelchairAccessible: true,
                    openingHours: [
                        { guid: 'oh-1', dayOfWeek: 0, start: '08:00:00', end: '17:00:00' },
                    ],
                },
            ],
        });

        const pois = await fetchPois('map-1');
        expect(pois).toHaveLength(1);
        expect(pois[0]).toMatchObject({
            guid: 'poi-1',
            title: 'Test POI',
            image: 'http://10.0.2.2/image.jpg',
            coordinate: { latitude: 51.1, longitude: 4.2 },
            category: { category: 'Food', iconName: 'food' },
            wheelChairAccessible: true,
            openingHours: [
                expect.objectContaining({
                    guid: 'oh-1',
                    dayOfWeek: expect.any(String),
                    start: '08:00',
                    end: '17:00',
                }),
            ],
        });
    });

    it('fetchPois returns empty array if API returns empty', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });
        const pois = await fetchPois('map-1');
        expect(pois).toEqual([]);
    });

    it('fetchPois handles invalid coordinates gracefully', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({
            data: [
                {
                    id: 'poi-2',
                    title: 'Invalid POI',
                    coordinate: { latitude: '999', longitude: '999' },
                    category: {},
                    map: {},
                },
            ],
        });
        const pois = await fetchPois('map-1');
        expect(pois[0].coordinate).toEqual({ latitude: 0, longitude: 0 });
    });
});
