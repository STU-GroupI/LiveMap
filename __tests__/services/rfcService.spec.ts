import { createSuggestionRFC, createChangeRFC } from '../../src/services/rfcService';
import { apiClient } from '../../src/services/apiClient';

jest.mock('../../src/services/apiClient', () => ({
    apiClient: {
        post: jest.fn(),
    },
}));

describe('rfcService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('createSuggestionRFC posts suggestion and returns data', async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: { result: 'ok' } });
        const data = { foo: 'bar' };
        const res = await createSuggestionRFC(data as any);
        expect(apiClient.post).toHaveBeenCalledWith('/rfc/poisuggestion', data);
        expect(res).toEqual({ result: 'ok' });
    });

    it('createChangeRFC posts change and returns data', async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: { result: 'changed' } });
        const data = { bar: 'baz' };
        const res = await createChangeRFC(data as any);
        expect(apiClient.post).toHaveBeenCalledWith('/rfc', data);
        expect(res).toEqual({ result: 'changed' });
    });
});
