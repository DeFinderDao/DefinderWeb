import { Key } from "react";
import { Action } from "redux";
import { Response } from ".";

export interface InvestmentPriceState {
  investmentPriceLoading: boolean,
  investmentPriceList: InvestmentPriceItem[],
  e: Error | null,
}

export interface InvestmentPriceParams {
  addrName?: string,
  groupId?: string | null,
  symbolAddr: string,
  type: string | number,
}

export interface InvestmentPriceItem {
  [key: string]: number | string,
  date: number,
  price: number,
  holdAmount: number,
  time: number | string,
}

export interface InvestmentPriceLoadingAction extends Action<string> {
  payload: boolean
}

export interface InvestmentPriceErrorAction extends Action<string> {
  payload: Error
}

export interface InvestmentPriceListSuccess extends Action<string> {
  payload: Response<InvestmentPriceItem[]>
}

export type InvestmentPriceActions =
  InvestmentPriceLoadingAction |
  InvestmentPriceListSuccess |
  InvestmentPriceErrorAction;
