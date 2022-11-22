import { get } from '../utils/request';
import qs from 'qs'
export const getTopicApi = () => {
    return get('/data.json', {
        params: {
        }
    });
}