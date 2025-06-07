import { MMKV } from 'react-native-mmkv';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { QueryClient } from '@tanstack/react-query';

const storage = new MMKV();

const syncStoragePersister = createSyncStoragePersister({
    storage: {
        getItem: (key) => storage.getString(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
        removeItem: (key) => storage.delete(key),
    },
});

const queryClient = new QueryClient();

persistQueryClient({
    queryClient,
    persister: syncStoragePersister,
    maxAge: 1000 * 60 * 60 * 24,
    dehydrateOptions: {
        shouldDehydrateQuery: (query) => query.state.status === 'success',
    },
});

export default queryClient;
