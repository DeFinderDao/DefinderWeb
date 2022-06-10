import { Action } from "redux";
import { Response } from "redux/types";


export interface SMCEXDataRankState {
  CEXLoading: boolean,
  CEXRankList: SMCEXRankListResponse | null,
  e: Error | null,
}

export interface SMCEXRankListParams {
  addressType: string,   
  sortField: string | null,   
  sortType: string | null,   
  pageSize: number,
  pageNo: number,
  dateType: string,   
}

  
export interface SMCEXRankListResponse {
  endDate: number | null,
  startDate: number | null,
  totalSize: number | null,
  list: ColumnsItem[]
}

export interface ColumnsItem {
  symbol: string,
  symbolAddr: string,
  inAsset: number,   
  inCount: number,   
  outAsset: string,
  outCount: number,
  holdAsset: string,
}

export interface ChangeLoadingAction extends Action<string> {
  payload: boolean
}

export interface SMCEXRankErrorAction extends Action<string> {
  payload: Error
}

export interface SMCEXRankListSuccess extends Action<string> {
  payload: Response<SMCEXRankListResponse>
}

export type SMCEXRankActions =
  SMCEXRankErrorAction |
  SMCEXRankListSuccess |
  ChangeLoadingAction;