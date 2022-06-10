import nookies, { parseCookies, setCookie, destroyCookie } from 'nookies';
import { stopWorker } from 'utils/webWorker/worker'
import * as next from 'next';

const isProductionMode = process.env.SERVICES_ENV === 'production';

  
const MAX_AGE = 60 * 60 * 24 * 365;

export type Context = next.NextPageContext | null | undefined;

export default class Storage {

    context?: Context;

    constructor(context? : Context) {
        this.context = context;
    }

    set = (key:string,value:string) => {
        if(this.context) {
              
            nookies.set(this.context, key, value, {
                maxAge: MAX_AGE,
                path: '/',
                sameSite: 'strict',
                secure: isProductionMode
              })
        } else {
              
            setCookie(null, key, value, {
                maxAge: MAX_AGE,
                path: '/',
                sameSite: 'strict',
                domain: window.location.hostname,
                secure: isProductionMode
              })
        }
    }

    get = (key:string) => {
        if(this.context) {
              
            const cookies = nookies.get(this.context);
            return cookies[key]
        } else {
            const cookies = parseCookies();
            return cookies[key];
        }
    }

    remove = (key : string) => {
        if(this.context) {
            nookies.destroy(this.context,key);
        } else {
            destroyCookie(null,key,{
                path: '/',
                domain: window.location.hostname
            });
              
            destroyCookie(null,key,{
                path: '/',
                domain: '.definder.info'
            });
        }
    }
}

export const KEY_USER_TOKEN = "Authorization";

export const KEY_USER_UUID = "uuid";

export const KEY_USER_ADDRESS = "address";

export const KEY_LOCALE = "locale";

  
export const KEY_CONNECT_WALLET_TYPE = "connect_wallet_type";

export function isUserLogined(context? : Context) : boolean {
    const storage = new Storage(context);
    return !!storage.get(KEY_USER_TOKEN);
}

export function userLoginOut(context?: Context) {
    const storage = new Storage(context);
    storage.remove(KEY_USER_TOKEN);
    storage.remove(KEY_USER_UUID);
    storage.remove(KEY_USER_ADDRESS);
    localStorage.removeItem(KEY_CONNECT_WALLET_TYPE);
    stopWorker()
}