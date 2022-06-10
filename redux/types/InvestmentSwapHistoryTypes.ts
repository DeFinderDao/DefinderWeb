import { Key } from "react";
import { Action } from "redux";
import { Response } from ".";

export interface InvestmentSwapHistoryState {
  loadingSwap: boolean,
  investmentSwapHistoryList: InvestmentSwapHistoryResponse,
  swapListTotalsize: number,
  e: Error | null,
}

export interface InvestmentSwapHistoryParams {
  type?: number,  
  startTime?: number | null,
  endTime?: number | null,
  addressList?: string[],
  symbolAddr?: string,
  pageNo?: number,
  pageSize?: number,
}

export interface InvestmentSwapHistoryResponse {
  list: InvestmentSwapHistoryItem[],
  totalSize: 0,
}

export interface InvestmentSwapHistoryItem {
  [key: string]: number | string,
  date: number,
  type: number,
  price: string,
  amount: number,
  symbol: string,
  orderValue: number,
  associateAddr: string,
  associateAddrLabel: string,
  txHashUrl: string,
  isContract: number,
}

export interface InvestmentSwapHistoryLoadingAction extends Action<string> {
  payload: boolean
}

export interface InvestmentSwapHistoryTotalsizeAction extends Action<string> {
  payload: number
}

export interface InvestmentSwapHistoryErrorAction extends Action<string> {
  payload: Error
}

export interface InvestmentSwapHistoryListSuccess extends Action<string> {
  payload: Response<InvestmentSwapHistoryResponse>
}

export type InvestmentSwapHistoryActions =
  InvestmentSwapHistoryListSuccess | InvestmentSwapHistoryLoadingAction |
  InvestmentSwapHistoryErrorAction | InvestmentSwapHistoryTotalsizeAction;
