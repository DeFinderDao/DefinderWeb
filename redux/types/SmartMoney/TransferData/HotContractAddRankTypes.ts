import { Action } from "redux";
import { Response } from "redux/types";


export interface SMHOTDataRankState {
  HOTLoading: boolean,
  HOTNoMore: boolean,
  HOTRankList: SMHOTRankListResponse | null,
  e: Error | null,
}

export interface SMHOTRankListParams {
  addressType: string,   
  sortField: string | null,   
  sortType: string | null,   
  pageSize: number,
  pageNo: number,
  dateType: string,   
}

  
export interface SMHOTRankListResponse {
  endDate: number | null,
  startDate: number | null,
  totalSize: number | null,
  list: ColumnsItem[]
}

export interface ColumnsItem {
  logo: string,   
  contractName: string,   
  contractAddr: string,   
  contractAddrLabel: string,
  count: number,   
  addressCount: number,   
  asset: string,   
  contractAsset: string,   
  top10Rate: number,   
}

export interface ChangeLoadingAction extends Action<string> {
  payload: boolean
}

export interface SMHOTRankErrorAction extends Action<string> {
  payload: Error
}

export interface SMHOTRankListSuccess extends Action<string> {
  payload: Response<SMHOTRankListResponse>
}

export type SMHOTRankActions =
  SMHOTRankErrorAction |
  SMHOTRankListSuccess |
  ChangeLoadingAction;