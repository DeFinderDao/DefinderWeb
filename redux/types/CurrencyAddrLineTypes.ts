import { Action } from "redux";
import { Response } from ".";

export interface CurrencyAddrLineState {
    e: Error | null,
    currencyAddrLineList: HoldMarketItem[],
    currencyAddrLoading: boolean
}

  
export interface HoldMarketApiResponse {
    innerData: HoldMarketItem[]
}

export interface HoldMarketItem {
    [key: string]: number | string,
    time: number | string,
    accountCount: number,
    averageAccountCount: number,
    averageValue: number
}

export interface CurrencyAddrLineListLoadingAction extends Action<string> {
    payload: boolean
}

export interface GetCurrencyAddrLineListSuccessAction extends Action<string> {
    payload: Response<HoldMarketApiResponse>
}

export interface GetCurrencyAddrLineListFailAction extends Action<string> {
    payload: Error
}

export type CurrencyAddrLineActions = CurrencyAddrLineListLoadingAction | GetCurrencyAddrLineListSuccessAction | GetCurrencyAddrLineListFailAction;