import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

const asyncStoragePersistor = createAsyncStoragePersister({
    storage: AsyncStorage,
});

persistQueryClient({
    queryClient,
    persister: asyncStoragePersistor,
    maxAge: 1000 * 60 * 60 * 24,
});

export default queryClient;
