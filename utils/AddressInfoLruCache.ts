import type { InfoResponse } from 'components/MarketComponents/AddressDetail';
import { Response } from 'redux/types';
import LRUCache from 'lru-cache';
import LRU from 'lru-cache';
import ApiClient from './ApiClient';

const options : LRUCache.Options<string,string> = {
    max: 1024 * 50,  
    length: function(n,k) {return n.length},
    maxAge: 1000 * 60 * 60 * 12,   
};

const cache = new LRU(options);

const apiClient = new ApiClient<InfoResponse>();

export function getAddressInfo(addr: string,symbolAddr: string) : Promise<Response<InfoResponse>>{
    const url = `/market/address/info?address=${addr}&symbolAddr=${symbolAddr}`;
    const info = cache.get(url);
    if(info === undefined) {
        return new Promise(async (resolve,reject) => {
            try {
                const data = await apiClient.get(url)
                cache.set(url,JSON.stringify(data));
                resolve(data);
            } catch(e) {
                reject(e);
            }
        });
    } else {
        return Promise.resolve(JSON.parse(info!) as Response<InfoResponse>);
    }
}