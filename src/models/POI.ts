import { Double } from 'react-native/Libraries/Types/CodegenTypes';

export type POI = {
    guid: string;
    longitude: number;
    latitude: number;
    title: string;
    rating: Double;
    wheelChairAccessible: boolean;
}
