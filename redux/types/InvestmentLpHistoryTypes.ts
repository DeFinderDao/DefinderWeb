import { Key } from "react";
import { Action } from "redux";
import { Response } from ".";

export interface InvestmentLpHistoryState {
  loadingLp: boolean,
  investmentLpHistoryList: InvestmentLpHistoryResponse,
  lpListTotalsize: number,
  e: Error | null,
}

export interface InvestmentLpHistoryParams {
  type?: number,  
  startTime?: number | null,
  endTime?: number | null,
  addressList?: string[],
  symbolAddr?: string,
  pageNo?: number,
  pageSize?: number,
}

export interface InvestmentLpHistoryResponse {
  list: InvestmentLpHistoryItem[],
  totalSize: 0,
}

export interface InvestmentLpHistoryItem {
  [key: string]: number | string,
  date: number,
  type: number,
  symbol0: string,
  symbol0Logo: string,
  symbol0Amount: number,
  symbol0Price: string,
  symbol0Value: number,
  symbol1: string,
  symbol1Logo: string,
  symbol1Amount: number,
  symbol1Price: string,
  symbol1Value: number,
  lpTotalValue: number,
  txHashUrl: string,
  contractLogo: string,
}

export interface InvestmentLpHistoryLoadingAction extends Action<string> {
  payload: boolean
}

export interface InvestmentLpHistoryTotalsizeAction extends Action<string> {
  payload: number
}

export interface InvestmentLpHistoryErrorAction extends Action<string> {
  payload: Error
}

export interface InvestmentLpHistoryListSuccess extends Action<string> {
  payload: Response<InvestmentLpHistoryResponse>
}

export type InvestmentLpHistoryActions =
  InvestmentLpHistoryListSuccess | InvestmentLpHistoryLoadingAction |
  InvestmentLpHistoryErrorAction | InvestmentLpHistoryTotalsizeAction;
