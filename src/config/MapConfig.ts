export const DEFAULT_CENTER = [5.039800, 51.645067] as [number, number];
export const DEFAULT_ZOOM = 15;
export const MAX_ZOOM = 19;
export const MIN_ZOOM = 15;


export const MAP_STYLE = {
    version: 8,
    sources: {
        osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], // OSM Tiles
            tileSize: 256,
        },
        boundaries: {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [],
                },
            },
        },
    },
    layers: [
        {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19,
        },
        {
            id: 'boundaries',
            type: 'fill',
            source: 'boundaries',
            paint: {
                'fill-color': '#ff0000',
                'fill-opacity': 0.1,
            },
        },
    ],
};

export default MAP_STYLE;
