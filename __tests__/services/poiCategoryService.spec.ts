import { fetchCategories } from '../../src/services/poiCategoryService';
import { apiClient } from '../../src/services/apiClient';

jest.mock('../../src/services/apiClient', () => ({
    apiClient: {
        get: jest.fn(),
    },
}));

describe('poiCategoryService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('fetchCategories returns categories from API', async () => {
        const mockCategories = [
            { categoryName: 'Food', iconName: 'food' },
            { categoryName: 'Transport', iconName: 'bus' },
        ];
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockCategories });

        const categories = await fetchCategories();
        expect(apiClient.get).toHaveBeenCalledWith('/category');
        expect(categories).toEqual(mockCategories);
    });

    it('fetchCategories returns empty array if API returns empty', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });
        const categories = await fetchCategories();
        expect(categories).toEqual([]);
    });
});
