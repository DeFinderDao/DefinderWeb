import { Action } from 'redux';
import { Response } from 'redux/types';

export interface ResponseBodyList<T> {
    endDate: string | number,
    startDate: string | number,
    totalSize: number,
    list: T;
}
export interface AddressDynamicState {
    searchInfo: SearchInfo | null,
    symbolList: SymbolList[],
    tradeList: ResponseBodyList<TradeList[]>,
    transferList: ResponseBodyList<TransferList[]>,
    lpList: ResponseBodyList<LpList[]>,
    loading: boolean,
    e: Error | null,
    noMore: boolean,
}
export interface SearchInfo {
    address: string | null,
    direction: number | string,
    directionList: any[],
    endTime: number | any,
    max: number | string,
    min: number | string,
    pageNo: number,
    pageSize: number,
    startTime: number | any,
    symbol: string | null,
    symbolAddr: string | null,
    symbolContractAddr: string | null,
    type: number | string,
}
export interface SymbolList {
    address: string,
    logo: string,
    symbol: string,
}
export interface TradeList {
    address: string,
    amount: number,
    date: number,
    direction: number,
    id: number,
    price: number,
    receiptStatus: null,
    symbol: string,
    symbolAddr: string,
    value: number,
    valueSymbol: string,
    valueSymbolAddr: string
}
export interface TransferList {
    amount: number,
    date: number,
    direction: number,
    id: number,
    inAddr: string,
    outAddr: string,
    receiptStatus: number,
    symbol: string,
    symbolAddr: string,
    timestamp: number,
}
export interface LpList {
    address: string,
    amount: number,
    amount0: number,
    amount1: number,
    contractAddr: string,
    date: number,
    direction: number,
    id: number,
    pair: string,
    pairAddr: string,
    receiptStatus: number,
    symbol0: string,
    symbol0Addr: string,
    symbol1: string,
    symbol1Addr: string
}


export interface AddrListSimpleAction extends Action<string> {
    payload: boolean
}
export interface AddrListErrorAction extends Action<string> {
    payload: Error
}

export interface SetSearchInfoAction extends Action<string> {
    payload: SearchInfo
}

export interface GetAddrSymbolListSuccessAction extends Action<string> {
    payload: Response<SymbolList[]>
}

export interface GetAddrTradeListSuccessAction extends Action<string> {
    payload: Response<ResponseBodyList<TradeList[]>>
}

export interface GetAddrTransferListSuccessAction extends Action<string> {
    payload: Response<ResponseBodyList<TransferList[]>>
}

export interface GetAddrLpListSuccessAction extends Action<string> {
    payload: Response<ResponseBodyList<LpList[]>>
}

export type AddressDynamicActions = AddrListSimpleAction |
    SetSearchInfoAction |
    GetAddrSymbolListSuccessAction |
    AddrListErrorAction |
    GetAddrTradeListSuccessAction |
    GetAddrTransferListSuccessAction |
    GetAddrLpListSuccessAction
