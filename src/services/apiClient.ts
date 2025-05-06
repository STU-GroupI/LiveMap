import axios from 'axios';

/**
 * Keep it http instead of https as that causes SSL issues which we can't solve in the emulator.
 * If we want SSL we'd have to disable that for the request which is not supported without packages.
 */
export const apiClient = axios.create({
    baseURL: 'http://10.0.2.2:5006/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});
