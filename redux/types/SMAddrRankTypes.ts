import { Key } from "react";
import { Action } from "redux";
import { Response } from ".";

export interface SMAddrRankState {
    loading: boolean,
    noMore: boolean,
    e: Error | null,
    smAddrRankPie: AddrRankPieItem[],
    smAddrRankList: AddrRankListResponse | null
}

export interface AddrRankPieResponse {
    symbolList: AddrRankPieItem[]
}

export interface AddrRankPieItem {
    address: string,
    amount: number | null,
    balance: number,
    rate: number
}

export interface AddrRankListParams {
    symbolAddr: string,
    field: Key | null | undefined,
    sort: string | null | number,
    addressType: number,
    totalVolume: number | null | string,
    totalValue: number | null | string,
    profit: number | null | string,
    proceeds: number | null | string,
    pageNo: number,
    pageSize: number | undefined
}

  
export interface AddrRankListResponse {
    endDate: number | null,
    startDate: number | null,
    totalSize: number | null,
    list: AddrRankItem[]
}

export interface AddrRankItem {
    address: string,
    firstTime: number,
    isContract: boolean,
    logoUrl: string,
    orders: number,
    proceeds: number,
    rate: number,
    symbol: string,
    symbolAddr: string,
    totalValue: number,
    totalVolume: number,
    ordersType: number,
    titles?: string[],
    costPrice: string,
    profit: string,
    profitRate: string,
}

export interface ChangeLoadingAction extends Action<string> {
    payload: boolean
}

export interface SMAddrRankPieSuccessAction extends Action<string> {
    payload: Response<AddrRankPieResponse>
}

export interface SMAddrRankErrorAction extends Action<string> {
    payload: Error
}

export interface SMAddrRankListSuccess extends Action<string> {
    payload: Response<AddrRankListResponse>
}

export type SMAddrRankActions = SMAddrRankPieSuccessAction | 
SMAddrRankErrorAction | 
SMAddrRankListSuccess | 
ChangeLoadingAction;
