import { OfflineManager } from '@maplibre/maplibre-react-native';
import { IMapConfig } from '../interfaces/MapConfig';
import queryClient from '../persistQueryClient.ts';

const offlinePackName = (id: string = 'default'): string => `offline-pack-${id}`;
const OFFLINE_PACK_QUERY_KEY = (mapId: string) => ['offline-pack-meta', mapId];
const OFFLINE_PACK_STALE_TIME = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function createOfflinePack(mapConfig: IMapConfig): Promise<string> {
    return new Promise((resolve, reject) => {
        const progressListener = (_region: any, status: any) => {
            if (status.percentage === 100) {
                OfflineManager.unsubscribe(offlinePackName(mapConfig.mapId));

                queryClient.setQueryData(OFFLINE_PACK_QUERY_KEY(mapConfig.mapId), {
                    downloadedAt: Date.now(),
                });

                resolve('Offline pack downloaded successfully');
            }
        };

        const errorListener = (_region: any, err: any) => {
            console.error('Offline pack error:', err);
            OfflineManager.unsubscribe(offlinePackName(mapConfig.mapId));
            reject(err);
        };

        OfflineManager.createPack(
            {
                name: offlinePackName(mapConfig.mapId),
                styleURL: mapConfig.mapStyle,
                minZoom: mapConfig.minZoom,
                maxZoom: mapConfig.maxZoom,
                bounds: [
                    // TODO: Replace with dynamic bounds based on mapConfig
                    [51.646725, 5.043089], // neLng, neLat
                    [51.643082, 5.036585], // swLng, swLat
                ],
            },
            progressListener,
            errorListener
        ).catch((err) => {
            console.error('Failed to create offline pack:', err);
            reject(err);
        });

        OfflineManager.subscribe(offlinePackName(mapConfig.mapId), progressListener, errorListener);
    });
}

export async function deleteOfflinePack(name: string = offlinePackName()): Promise<void> {
    try {
        await OfflineManager.deletePack(name);
    } catch (err) {
        console.error(`Failed to delete offline pack "${name}":`, err);
    }
}

export async function listOfflinePacks(): Promise<any[]> {
    try {
        return await OfflineManager.getPacks();
    } catch (err) {
        console.error('Error fetching offline packs:', err);
        return [];
    }
}

export async function ensureOfflinePack(mapConfig: IMapConfig): Promise<void> {
    try {
        const packs = await OfflineManager.getPacks();
        const exists = packs.some((p: any) => p.name === offlinePackName(mapConfig.mapId));

        const meta = queryClient.getQueryData<{ downloadedAt: number }>(OFFLINE_PACK_QUERY_KEY(mapConfig.mapId));
        const isStale = !meta || (Date.now() - meta.downloadedAt > OFFLINE_PACK_STALE_TIME);

        if (exists && !isStale) {
            return;
        }

        if (exists && isStale) {
            await deleteOfflinePack(offlinePackName(mapConfig.mapId));
        }

        await createOfflinePack(mapConfig);
    } catch (err) {
        console.error('Failed in ensureOfflinePack:', err);
    }
}
