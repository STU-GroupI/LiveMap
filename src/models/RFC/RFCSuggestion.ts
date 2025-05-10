export type SuggestionRFC = {
    title: string;
    description: string;
    category: string;
    mapId: string;
    coordinate: {
        longitude: number;
        latitude: number;
    };
    isWheelchairAccessible: boolean;
}
