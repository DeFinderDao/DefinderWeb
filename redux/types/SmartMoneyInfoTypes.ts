import { Action } from "redux";
import { Response } from "redux/types";


export interface SMInfoRankDataRankState {
  infoLoading: boolean,
  infoList: SMInfoRankListResponse | null,
  infoListUpdateTime: number | null,
  infoRecordLoading: boolean,
  infoRecordList: SMInfoRecordListResponse | null,
  e: Error | null,
}

export interface SMInfoRankListParams {
  symbolAddr: string | null,
  addressType: string,
  sortType?: number | undefined,   
  sortField?: string | undefined,   
  pageNo: number,
  pageSize: number,
}

  
export interface SMInfoRankListResponse {
  endDate: number | null,
  startDate: number | null,
  totalSize: number | null,
  list: ColumnsItem[]
}
  
export interface SMInfoRecordListResponse {
  endDate: number | null,
  startDate: number | null,
  totalSize: number | null,
  list: InfoRecordItem[]
}

export interface ColumnsItem {
  address: string,   
  addressLabel: string,   
  holdAmount: string,   
  holdRate: string,   
  holdChange24h: string,   
  holdChange24hRate: number,   
  holdChange3d: string,   
  holdChange3dRate: number,  
  profit: number,   
  costPrice: string,   
  profitRate: string,   
  orders: string,   
  firstTime: string,   
}

export interface InfoRecordItem {
  timestamp: number,
  address: string,
  addressLabel: string,
  takerAmount: string,
  takerToken: string,
  takerTokenAddr: string,
  makerAmount: string,
  makerToken: string,
  makerTokenAddr: string,
  type: number,	  
  takerAmountA: string,
  takerTokenA: string,
  takerTokenAddrA: string,
  takerAmountB: string,
  takerTokenB: string,
  takerTokenAddrB: string,
  dex: string,
  txHash: string,
  index: string,
  price: string,   
  priceSymbol: string,   
  direction: string,   
  usdPrice: string,   
}

export interface ChangeLoadingAction extends Action<string> {
  payload: boolean
}

export interface SMInfoRankErrorAction extends Action<string> {
  payload: Error
}

export interface SMInfoRankListSuccess extends Action<string> {
  payload: Response<SMInfoRankListResponse>
}

export interface SMInfoRecordListSuccess extends Action<string> {
  payload: Response<SMInfoRecordListResponse>
}

export type SMInfoRankActions =
  SMInfoRankErrorAction |
  SMInfoRankListSuccess |
  SMInfoRecordListSuccess |
  ChangeLoadingAction;