import { Key } from "react";
import { Action } from "redux";
import { Response } from "redux/types";

export interface SMRecordState {
  busLoading: boolean,
  busList: SMRecordListResponse,
  lpLoading: boolean,
  lpList: SMRecordListResponse,
  e: Error | null,
}

export interface SMRecordParams {
  addressType?: string | number | null   
  startTime?: number | null,
  endTime?: number | null,
  address?: string | null,
  takerTokenKeyword?: string | number | null,
  makerTokenKeyword?: string | number | null,
  symbol0Addr?: string | number | null,
  symbol1Addr?: string | number | null,
  pageSize: number | undefined,
  pageNo: number,
  sortField?: string | null,
  sortType?: string | null,
}

  
export interface SMRecordListResponse {
  endDate: number | null,
  startDate: number | null,
  totalSize: number | null,
  list: RecordColumnsItem[]
}

export interface RecordColumnsItem {
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
}

export interface ChangeLoadingAction extends Action<string> {
  payload: boolean
}

export interface SMRecordErrorAction extends Action<string> {
  payload: Error
}

export interface SMRecordListSuccess extends Action<string> {
  payload: Response<SMRecordListResponse>
}

export type SMRecordActions = SMRecordErrorAction |
  SMRecordListSuccess |
  ChangeLoadingAction;