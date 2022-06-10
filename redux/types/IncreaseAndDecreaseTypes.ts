import { Key } from "react";
import { Action } from "redux";
import { Response } from ".";

export interface IncreaseAndDecreaseState {
    loadingIncrease: boolean,
    increaseUsersList: IncreaseAndDecreaseResponse,
    loadingDecrease: boolean,
    decreaseUsersList: IncreaseAndDecreaseResponse,
    e: Error | null,
}

export interface IncreaseAndDecreaseParams {
    dateType: number | string,
    symbolAddr: string
}

export interface IncreaseAndDecreaseResponse {
    holdSymbolList: IncreaseAndDecreaseItem[],
    holdAssetList: IncreaseAndDecreaseItem[],
    netPerson: number,
    netAmount: number,
}

export interface IncreaseAndDecreaseItem {
    range: string,
    person: number,
    rate: number,
    index: number,
    amount: number,
}

export interface IncreaseAndDecreaseLoadingAction extends Action<string> {
    payload: boolean
}

export interface IncreaseAndDecreaseErrorAction extends Action<string> {
    payload: Error
}

export interface IncreaseAndDecreaseListSuccess extends Action<string> {
    payload: Response<IncreaseAndDecreaseResponse>
}

export type IncreaseAndDecreaseActions =
    IncreaseAndDecreaseListSuccess |
    IncreaseAndDecreaseLoadingAction |
    IncreaseAndDecreaseErrorAction;
