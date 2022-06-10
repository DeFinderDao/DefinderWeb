import { Key } from "react";
import { Action } from "redux";
import { Response } from "redux/types";

export interface SMTransactionDataRankState {
  buyLoading: boolean,
  buyRankPie: RankPieItem[],
  buyRankList: SMRankListResponse | null,
  buyNoMore: boolean,
  sellLoading: boolean,
  sellRankPie: RankPieItem[],
  sellRankList: SMRankListResponse | null,
  sellNoMore: boolean,
  e: Error | null,
}

export interface SMTransactionRankListParams {
  addressType: string | number | null   
  dateType: string   
  sortField: string
  sortType: string
  pageSize: number | undefined
  pageNo: number,
}

  
export interface SMRankListResponse {
  endDate: number | null,
  startDate: number | null,
  totalSize: number | null,
  list: ColumnsItem[],
  others: OtherItem
}

export interface OtherItem {
  number: number,
  rate: number,
}


export interface SMRankPieResponse {
  symbolList: RankPieItem[]
}

export interface RankPieItem {
  address: string,
  amount: number | null,
  balance: number,
  rate: number
}

export interface ColumnsItem {
  symbol?: string
  symbolAddr?: string
  netSwapAsset?: string   
  netSwapAddrCount?: number   
  holdAsset?: number   
  netSwapAvgPrice?: string   
  rate: number,
  number: number
}

export interface ChangeLoadingAction extends Action<string> {
  payload: boolean
}

export interface SMTransactionRankPieSuccessAction extends Action<string> {
  payload: Response<SMRankPieResponse>
}

export interface SMTransactionRankErrorAction extends Action<string> {
  payload: Error
}

export interface SMTransactionRankListSuccess extends Action<string> {
  payload: Response<SMRankListResponse>
}

export type SMTransactionRankActions = SMTransactionRankPieSuccessAction |
  SMTransactionRankErrorAction |
  SMTransactionRankListSuccess |
  ChangeLoadingAction;