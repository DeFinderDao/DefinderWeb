import { Action } from "redux";
import { Response } from "redux/types";


export interface SMTransferDataRankState {
  transferLoading: boolean,
  transferRankList: SMTransferRankListResponse | null,
  e: Error | null,
}

export interface SMTransferRankListParams {
  fromAddr?: string | null,   
  toAddr?: string | null,   
  pageNo: number,
  pageSize: number,
  startTime?: number | null,
  endTime?: number | null,
  makerTokenKeyword?: string | null,   
  minAmountValue?: number | null,   
  addressType?: string | null,
}

  
export interface SMTransferRankListResponse {
  endDate: number | null,
  startDate: number | null,
  totalSize: number | null,
  list: ColumnsItem[]
}

export interface ColumnsItem {
  timestamp: number,
  symbolAddr: string,
  symbol: string,
  from: FromTo,
  fromAddr: string,
  fromAddrLabel: string,
  to: FromTo,
  toAddr: string,
  toAddrLabel: string,
  amount: string,
  value: string,
  price: number,
  txHash: string,
  index: string,
}

export interface FromTo {
  address: string,
  titles: string[],
  logoUrl: string,
  description: number,
}

export interface ChangeLoadingAction extends Action<string> {
  payload: boolean
}

export interface SMTransferRankErrorAction extends Action<string> {
  payload: Error
}

export interface SMTransferRankListSuccess extends Action<string> {
  payload: Response<SMTransferRankListResponse>
}

export type SMTransferRankActions =
  SMTransferRankErrorAction |
  SMTransferRankListSuccess |
  ChangeLoadingAction;