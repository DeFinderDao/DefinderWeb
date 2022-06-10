import { Key } from "react";
import { Action } from "redux";
import { Response } from ".";

export interface PositionIncomeState {
  positionIncomeLoading: boolean,
  positionIncomeList: PositionIncomeItem[],
  e: Error | null,
}

export interface PositionIncomeParams {
  addrName?: string,
  groupId?: string | null,
  symbolAddr: string,
  type: string | number,
}

export interface PositionIncomeItem {
  [key: string]: number,
  time: number,
  value: number,
}

export interface PositionIncomeLoadingAction extends Action<string> {
  payload: boolean
}

export interface PositionIncomeErrorAction extends Action<string> {
  payload: Error
}

export interface PositionIncomeListSuccess extends Action<string> {
  payload: Response<PositionIncomeItem[]>
}

export type PositionIncomeActions =
  PositionIncomeLoadingAction |
  PositionIncomeListSuccess |
  PositionIncomeErrorAction;
