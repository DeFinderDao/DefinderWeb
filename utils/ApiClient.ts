import { isClient } from './env'
import { IncomingHttpHeaders } from 'http';
import { message } from 'antd';
import ApiServerError, { CODE_PRO_NO, CODE_SUCCESS, CODE_TOKEN_INVALID, CODE_TOKEN_NO } from './ApiServerError';
import Storage, { KEY_USER_TOKEN, userLoginOut, Context } from './storage';
import { Response } from 'redux/types';
import language from "locales";

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'del';

interface CustomHeaderValues extends IncomingHttpHeaders {
    redirectUrl?: string;
    Authorization?: string;

}

type CustomHeader = CustomHeaderValues | HeadersInit | undefined;

const methods: Array<HttpMethod> = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path: string) {
    if (path.startsWith('/')) {
        path = path.slice(1, path.length);
    }
    if (typeof window !== 'undefined') {
          
        if (path.indexOf("http") == -1) {
            return `/api/${path}`;
        } else {
              
            return `${path}`;
        }
    } else {
          
        if (path.indexOf("http") == -1) {
            return `${process.env.HTTP_PROTOCAL}://${process.env.HTTP_HOSTNAME}/api/${path}`
        } else {
            
            return `${path}`;
        }
    }
}

/**
 * @param {*} req 
 */
function customHeader(context?: Context): CustomHeader {
    const storage = new Storage(context);
    if (typeof window !== 'undefined') {
        
        const redirectUrl = `${window.location.pathname}${window.location.search}`;
        const locale = window.location.pathname.indexOf('/zh') > -1 ? 'zh' : 'en';
        const headers: CustomHeader = { Authorization: storage.get(KEY_USER_TOKEN), locale };
        if (redirectUrl && redirectUrl !== '/') {
            headers.redirectUrl = redirectUrl;
        }
        return headers;
    } else {
        
        let headers = context?.req?.headers;
        const token = storage.get(KEY_USER_TOKEN);
        if (headers) {
            headers['Authorization'] = token;
        } else {
            headers = {
                Authorization: token
            }
        }
        return headers;
    }
}

const https = require('https');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

interface RequestData {
    header?: any;
    params?: any;
    data?: any;
    attach?: any;
    field?: any;
}

type Request<T> = (path: string, data?: RequestData) => Promise<T>;

export default class ApiClient<T> {

    context: Context | undefined;

    get!: Request<Response<T>>;

    post!: Request<Response<T>>;

    put!: Request<Response<T>>;

    patch!: Request<Response<T>>;

    del!: Request<Response<T>>;

    constructor(context?: Context) {
        this.context = context;
        methods.forEach((method: HttpMethod) =>

            this[method] = (path: string, { header, params, data, attach, field }: RequestData = {}) => new Promise((resolve, reject) => {
                let url = formatUrl(path);
                let customHeaderData = customHeader(context);
                const metaData: RequestInit = {
                    method: method.toUpperCase(),
                    headers: {
                        'Content-Type': 'application/json',
                        ...customHeaderData,
                        ...header
                    }
                };

                if (params) {
                    let paramsArray: string[] = [];
                    Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]));
                    if (url.search(/\?/) === -1) {
                        url += '?' + paramsArray.join('&')
                    } else {
                        url += '&' + paramsArray.join('&')
                    }
                }

                if (data) {
                    metaData["body"] = JSON.stringify(data);
                }

                if (attach) {
                    const formData = new FormData();

                    Object.keys(attach).forEach(key => {
                        const files = attach[key];
                        if (files instanceof Array) {
                            files.forEach(file => formData.append(key, file));
                        } else {
                            formData.append(key, files);
                        }
                    })

                    if (field) {
                        Object.keys(field).forEach(key => {
                            formData.append(key, field[key]);
                        })
                    }

                    metaData["body"] = formData;
                }
                
                const whiteUrl = ['/api/warn/check/auth']
                fetch(url, metaData).then(res => {
                    res.json().then((result) => {
                        if (CODE_SUCCESS === result.code || whiteUrl.indexOf(url) > -1) {
                            resolve(result);
                        } else if (CODE_TOKEN_INVALID === result.code || CODE_TOKEN_NO === result.code) {
                            userLoginOut(context);
                            if (isClient()) {
                                const locale = window.location.pathname.indexOf('/zh') > -1 ? 'zh' : 'en';
                                message.error({
                                    content: locale == 'zh' ? language.zh.share.onlyErrorKey : language.en.share.onlyErrorKey,
                                    key: 'only-error-key'
                                });
                                window.location.reload();
                            } else {
                                const apiServerError = new ApiServerError(result.message);
                                apiServerError.code = result.code;
                                reject(apiServerError);
                            }
                        } else if (CODE_PRO_NO === result.code) {
                            if (isClient()) {
                                const locale = window.location.pathname.indexOf('/zh') > -1 ? 'zh' : 'en';
                                message.error({
                                    content: locale == 'zh' ? language.zh.share.onlyErrorPro : language.en.share.onlyErrorPro,
                                    key: 'only-error-pro'
                                });
                                window.location.replace(`/${locale}/member`);
                            } else {
                                const apiServerError = new ApiServerError(result.message);
                                apiServerError.code = result.code;
                                reject(apiServerError);
                            }
                        } else {
                            const apiServerError = new ApiServerError(result.message);
                            apiServerError.code = result.code;
                            reject(result);
                        }
                    })
                }).catch((e: Error) => reject(e));
            }));
    }

    /*
     * There's a V8 bug where, when using Babel, exporting classes with only
     * constructors sometimes fails. Until it's patched, this is a solution to
     * "ApiClient is not defined" from issue #14.
     * https://github.com/erikras/react-redux-universal-hot-example/issues/14
     *
     * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
     *
     * Remove it at your own risk.
     */
    empty() {
    }
}
