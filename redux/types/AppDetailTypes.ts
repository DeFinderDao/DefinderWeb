import { Action } from 'redux';
import { Response } from 'redux/types';

export interface ResponseTransferChangeBodyList<T> {
    amount: number | null,
    count: number | null,
    symbol: string | null,
    symbolAddr: string | null,
    trendList: T,
}
export interface ResponseSwapChangeBodyList<T> {
    addrCount: number | null,
    amount: number | null,
    avgPrice: number | null,
    count: number | null,
    symbol: string | null,
    symbolAddr: string | null,
    trendList: T,
    value: number | null,
    valueAmount: number | null,
}
export interface AppDetailseState {
    infoData: {},
      
    transferData: ResponseTransferChangeBodyList<AppDetailData[]>,
    tradeData: ResponseSwapChangeBodyList<AppDetailData[]>,
    e: Error | null,
}
export interface SearchInfo {
    direction: number | null,
    endTime: number | null,
    startTime: number | null,
    symbol: string | null,
    symbolAddr: string | null,
    timeSpan: string | null,
}
export interface AppDetailData {
    amount: number | null,
    count: number | null,
    date: number | null,
    value: number | null,
    time?: string | null,
}
export interface AppDetailDappInfo {
    code: string,
    name: string | null,
    logo: string | null,
    url: string,
    telegram: string | null,
    twitter: string | null,
    discord: string | null,
    symbolList: SymbolList[]
}
export interface SymbolList {
    address: string,
    logo: string,
    symbol: string,
    name: string,
    holderCount: number,
    price: number,
    total: string,
    sort: string | null,
    holdRate: HoldRateList,
}
export interface HoldRateList {
    levelOne: number,
    levelTwo: number,
    levelThree: number,
    levelFour: number,
}

export interface AppDetailErrorAction extends Action<string> {
    payload: Error
}

export interface GetApplicationDetailInfoSuccess extends Action<string> {
    payload: Response<AppDetailDappInfo>
}

export interface GetApplicationTransferChangeSuccess extends Action<string> {
    payload: Response<ResponseTransferChangeBodyList<AppDetailData[]>>
}

export interface GetApplicationTradeChangeSuccess extends Action<string> {
    payload: Response<ResponseSwapChangeBodyList<AppDetailData[]>>
}

export type AppDetailseActions =
    AppDetailErrorAction |
    GetApplicationDetailInfoSuccess |
    GetApplicationTransferChangeSuccess |
    GetApplicationTradeChangeSuccess