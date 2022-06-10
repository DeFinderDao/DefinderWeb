import { Action } from "redux";
import { Response } from ".";

export interface ResponseBodyList {
    endDate: string | number,
    startDate: string | number,
    totalSize: number,
    whaleNum: number,
    list: NFTHoldRankListItem[];
}

export interface NFTHoldRankParams {
    symbolAddr: string,
    type: number,   
    sortFiled: string | undefined,   
    sort: number | undefined,   
    pageSize: number | undefined,   
    pageNo: number | undefined,   
}

export interface NFTHoldRankListItem {
    id: number,
    address: string,   
    addressLabel: string,
    holdValues: string,   
    holdValuesRate: number,   
    totalValues: string,   
    totalValuesRate: number,   
    estHvValues: string,   
    estHvValuesRate: number,   
    totalCost: string,   
    totalCostRate: number,   
    totalRevenue: string,   
    totalRevenueRate: number,   
    realizedIncome: number | string,   
    realizedIncomeRate: number,   
    estimateProfit: number | string,   
    estimateProfitRate: number | string,   
}

export interface NFTHoldState {
    numList: NFTHoldPieItemResponse[],
    numUpdateTime: number,
    timeList: NFTHoldPieItemResponse[],
    timeUpdateTime: number,
    rankList: ResponseBodyList,
    rankListupdateTime: number | null,
    rankLoading: boolean,
    e: Error | null,
}

  
export interface NFTHoldPieResponse {
    list: NFTHoldPieItemResponse[]
}

export interface NFTHoldPieItemResponse {
    type: string,
    value: number | string,
    rate: number
}

export interface NFTHoldPieSuccessAction extends Action<string> {
    payload: Response<NFTHoldPieItemResponse[]>
}

export interface NFTHoldRankSuccessAction extends Action<string> {
    payload: Response<ResponseBodyList>
}

export interface NFTHoldLoadingAction extends Action<string> {
    payload: boolean
}

export interface NFTHoldErrorAction extends Action<string> {
    payload: Error
}

export type NFTHoldComponentsActions = NFTHoldPieSuccessAction | NFTHoldRankSuccessAction | NFTHoldErrorAction | NFTHoldLoadingAction