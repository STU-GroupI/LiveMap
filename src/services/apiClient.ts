import axios from 'axios';
import { API_BASE_URL } from '@env';

/**
 * Keep it http instead of https as that causes SSL issues which we can't solve in the emulator.
 * If we want SSL we'd have to disable that for the request which is not supported without packages.
 */
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});
