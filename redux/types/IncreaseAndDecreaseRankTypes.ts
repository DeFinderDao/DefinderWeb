import { Action } from "redux";
import { Response } from ".";

  
export interface IncreaseRankListParams {
    field: null | string,
    pageNo: number,
    pageSize: number,
    sort: null | number,
    symbolAddr: string,
    dateType: string,
}

  
export interface IncreaseRankListResponse {
    totalSize: number,
    startDate: string | null,
    endDate: string | null,
    list: IncreaseRankItemResponse[]
}

export interface IncreaseRankItemResponse {
    address: string,
    addressLabel: string,
    costPrice: null | number,
    index: number,
    amount: number,
    netAsset: number,
    symbol: string,
    symbolAddr: string,
    titles: string[],
    logoUrl: string,
    description: number,
    balance?: number,
    asset: number,
    profit: number,
    profitRate: string,
    holdCost: string,
    avgPrice: string
}

export interface IncreaseAndDecreaseRankState {
    increaseRankListLoading: boolean,
    decreaseRankListLoading: boolean,
    increaseRankData: IncreaseRankListResponse | null,
    decreaseRankData: IncreaseRankListResponse | null,
    noMore: boolean,
    e: Error | null
}

export interface ChangeLoadingAction extends Action<string> {
    payload: boolean
}

export interface IncreaseRankListSuccessAction extends Action<string> {
    payload: Response<IncreaseRankListResponse>
}

export interface MarketErrorAction extends Action<string> {
    payload: Error
}

export type IncreaseAndDecreaseRankActions = ChangeLoadingAction
    | IncreaseRankListSuccessAction | MarketErrorAction