import { Cache } from './Cache';

export const apiCache = new Cache({ defaultExpiry: 5 * 60 * 1000, maxSize: 100 });
export const userCache = new Cache({ defaultExpiry: 30 * 60 * 1000, maxSize: 50 });
export const menuCache = new Cache({ defaultExpiry: 10 * 60 * 1000, maxSize: 50 });
