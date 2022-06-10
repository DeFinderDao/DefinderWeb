import { Key } from "react";
import { Action } from "redux";
import { Response } from ".";

export interface InvestmentNumberState {
  investmentNumberLoading: boolean,
  investmentNumberList: InvestmentNumberItem[],
  e: Error | null,
}

export interface InvestmentNumberParams {
  addrName?: string,
  groupId?: string | null,
  symbolAddr: string,
  type: string | number,
}

export interface InvestmentNumberItem {
  [key: string]: number | string,
  date: number,
  amount: number,
  cost: number,
  time: string
}

export interface InvestmentNumberLoadingAction extends Action<string> {
  payload: boolean
}

export interface InvestmentNumberErrorAction extends Action<string> {
  payload: Error
}

export interface InvestmentNumberListSuccess extends Action<string> {
  payload: Response<InvestmentNumberItem[]>
}

export type InvestmentNumberActions =
  InvestmentNumberLoadingAction |
  InvestmentNumberListSuccess |
  InvestmentNumberErrorAction;
