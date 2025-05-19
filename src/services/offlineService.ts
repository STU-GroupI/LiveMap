import { OfflineManager, MapView } from '@maplibre/maplibre-react-native';
import { IMapConfig } from '../interfaces/MapConfig';

const offlinePackName = 'test-offlinePack';

export async function createOfflinePack(mapConfig: IMapConfig): Promise<string> {
    return new Promise((resolve, reject) => {
        const progressListener = (_region: any, status: any) => {
            console.log('Progress:', status);
            if (status.percentage === 100) {
                console.log('Download complete');
                OfflineManager.unsubscribe(offlinePackName);
                resolve('Offline pack downloaded successfully');
            }
        };

        const errorListener = (_region: any, err: any) => {
            console.error('Offline pack error:', err);
            OfflineManager.unsubscribe(offlinePackName);
            reject(err);
        };

        OfflineManager.createPack(
            {
                name: offlinePackName,
                styleURL: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
                minZoom: mapConfig.minZoom,
                maxZoom: mapConfig.maxZoom,
                bounds: [
                    [51.646725, 5.043089], // neLng, neLat
                    [51.643082, 5.036585], // swLng, swLat
                ],
            },
            progressListener,
            errorListener
        ).catch((err) => {
            console.error('Failed to create offline pack:', err);
            console.log('Parameters:', {
                name: offlinePackName,
                styleURL: "https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json",
                minZoom: mapConfig.minZoom,
                maxZoom: mapConfig.maxZoom,
                bounds: [
                    [51.646725, 5.043089],
                    [51.643082, 5.036585],
                ],
            });
            reject(err);
        });

        OfflineManager.subscribe(offlinePackName, progressListener, errorListener);
    });
}

export async function deleteOfflinePack(name: string = offlinePackName): Promise<void> {
    try {
        await OfflineManager.deletePack(name);
        console.log(`Offline pack "${name}" deleted`);
    } catch (err) {
        console.error(`Failed to delete offline pack "${name}":`, err);
    }
}

export async function listOfflinePacks(): Promise<any[]> {
    try {
        const packs = await OfflineManager.getPacks();
        console.log('Offline packs:', packs);
        return packs;
    } catch (err) {
        console.error('Error fetching offline packs:', err);
        return [];
    }
}

export async function ensureOfflinePack(mapConfig: IMapConfig): Promise<void> {
    try {
        const packs = await OfflineManager.getPacks();
        const exists = packs.some((p: any) => p.name === offlinePackName);

        if (exists) {
            console.log(`Offline pack "${offlinePackName}" already exists.`);
            return;
        }

        await createOfflinePack(mapConfig);
    } catch (err) {
        console.error('Failed in ensureOfflinePack:', err);
    }
}
