import { Action } from "redux";
import { Response } from ".";

export interface AnalysisBuyingTodayState {
    loading: boolean,
    analysisBuyingTodayList: AnalysisBuyingTodayResponse,
    e: Error | null,
}

export interface AnalysisBuyingTodayParams {
    symbolAddr: string
}

export interface AnalysisBuyingTodayResponse {
    holdAssetList: AnalysisBuyingTodayItem[],
}

export interface AnalysisBuyingTodayItem {
    range: string,
    person: number,
    rate: number,
    index: number,
    amount: number,
}

export interface AnalysisBuyingTodayLoadingAction extends Action<string> {
    payload: boolean
}

export interface AnalysisBuyingTodayErrorAction extends Action<string> {
    payload: Error
}

export interface AnalysisBuyingTodayListSuccess extends Action<string> {
    payload: Response<AnalysisBuyingTodayResponse>
}

export type AnalysisBuyingTodayActions =
    AnalysisBuyingTodayListSuccess |
    AnalysisBuyingTodayLoadingAction |
    AnalysisBuyingTodayErrorAction;
