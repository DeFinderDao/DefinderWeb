import { Key } from "react";
import { Action } from "redux";
import { Response } from ".";

export interface AnalysisSellBuyUsersState {
    loadingSelling: boolean,
    analysisSellingUsersList: AnalysisSellBuyUsersResponse,
    loadingBuying: boolean,
    analysisBuyingUsersList: AnalysisSellBuyUsersResponse,
    e: Error | null,
}

export interface AnalysisSellBuyUsersParams {
    dateType: number | string,
    symbolAddr: string
}

export interface AnalysisSellBuyUsersResponse {
    holdSymbolList: AnalysisSellBuyUsersItem[],
    holdAssetList: AnalysisSellBuyUsersItem[],
    netPerson: number,
    netAmount: number,
}

export interface AnalysisSellBuyUsersItem {
    range: string,
    person: number,
    rate: number,
    index: number,
    amount: number,
}

export interface AnalysisSellBuyUsersLoadingAction extends Action<string> {
    payload: boolean
}

export interface AnalysisSellBuyUsersErrorAction extends Action<string> {
    payload: Error
}

export interface AnalysisSellBuyUsersListSuccess extends Action<string> {
    payload: Response<AnalysisSellBuyUsersResponse>
}

export type AnalysisSellBuyUsersActions =
    AnalysisSellBuyUsersListSuccess |
    AnalysisSellBuyUsersLoadingAction |
    AnalysisSellBuyUsersErrorAction;
