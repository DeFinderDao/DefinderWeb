import { Action } from "redux";
import { Response } from "redux/types";


export interface SMCEXLineDataRankState {
  CEXLineLoading: boolean,
  CEXLineData: SMCEXLineItem[],
  CEXLineSearchLoading: boolean,
  CEXLineSearchData: SMCEXLineSearchItem[],
  e: Error | null,
}

export interface SMCEXLineParams {
  startTime?: number | null,
  endTime?: number | null,
  symbolAddr?: string | null,   
  addressType?: string | null,   
}

  
export interface SMCEXLineResponse {
  innerData: SMCEXLineItem[]
}

export interface SMCEXLineItem {
  inAsset: number | null,
  outAsset: number | null,
  inAssetStr: string,
  outAssetStr: string,
  symbol: string | null,
  date: number | null,
  time: number | string,
}

  
export interface SMCEXLineSearchResponse {
  innerData: SMCEXLineSearchItem[]
}

export interface SMCEXLineSearchItem {
  logo: string,   
  symbol: string,   
  symbolAddr: string,   
  price: string,   
  priceIncrease: number,   
  symbolVolume: number,   
  lpVolume: number,   
}

export interface ChangeLoadingAction extends Action<string> {
  payload: boolean
}

export interface SMCEXLineErrorAction extends Action<string> {
  payload: Error
}

export interface SMCEXLineSuccess extends Action<string> {
  payload: Response<SMCEXLineResponse>
}

export interface SMCEXLineSearchSuccess extends Action<string> {
  payload: Response<SMCEXLineSearchResponse>
}

export type SMCEXLineActions = SMCEXLineSearchSuccess |
  SMCEXLineErrorAction |
  SMCEXLineSuccess |
  ChangeLoadingAction;