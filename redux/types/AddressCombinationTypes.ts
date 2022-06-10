import { Action } from 'redux';
import { Response } from 'redux/types';

export interface ResponseBodyList<T> {
  endDate: string | number,
  startDate: string | number,
  totalSize: number,
  list: T;
}


export interface AddressCombinationState {
  warningFollowLoading: boolean,
  warningRecommendLoading: boolean,
  followData: ResponseBodyList<CombinationFollowDataList[]>,
  recommendData: ResponseBodyList<CombinationRecommendDataList[]>,
  symbolList: CombinationSymbolList[],
  e: Error | null,
}

export interface CombinationSymbolList {
  address: string,
  logo: string,
  symbol: string,
}

export interface CombinationFollowDataList {
  address: string,
  addressAll: string,
  addressTag: string,
  addresses: string[]
  groupId?: number,
  id: number | null,
  isAdmin: number,
  isFollow: number,
  totalMoney: number,
  warnDimension: number,
  warnTimes: number,
  edit: number,
  incomeAmount: string,
  position: string | number,
  isTop: number,
  isWarn: number | string
}

export interface CombinationRecommendDataList {
  address: string,
  addressAll: string,
  addressTag: string,
  addresses: string[],
  id: number,
  groupId?: number,
  isFollow: number,
  lateTime: number,
  totalMoney: number,
  incomeAmount: string,
  position: string | number,
  isTop: number
}

export interface FindGroupAddressInfo {
  groupAddressList: string[],
  groupAddressName: string,
  groupAddressNum?: null,
  id: number | string,
  isAdmin?: number,
  isFollow: boolean | number | null,
  lateTime?: number | null,
  symbol: string | null,
  symbolAddr: string,
  totalMoney?: number | null,
  isWarn?: boolean | number,
  labelList?: LabelListInfo[],
  radioValue?: string,
  groupAddressValue?: string,
}

export interface LabelListInfo {
  key?: number | string,
  address: string,
  label: string
}

export interface CombinationSimpleAction extends Action<string> {
  payload: boolean
}
export interface CombinationErrorAction extends Action<string> {
  payload: Error
}

export interface GetCombinationSymbolListSuccessAction extends Action<string> {
  payload: Response<CombinationSymbolList[]>
}

export interface SetCombinationListSuccessAction extends Action<string> {
  payload: {
    ids: number[],
    isFollow: number
  }
}

export interface GetCombinationFollowListSuccessAction extends Action<string> {
  payload: Response<ResponseBodyList<CombinationFollowDataList[]>>
}

export interface GetCombinationRecommendListSuccessAction extends Action<string> {
  payload: Response<ResponseBodyList<CombinationRecommendDataList[]>>
}


export type AddressCombinationActions = CombinationSimpleAction |
  CombinationErrorAction |
  GetCombinationSymbolListSuccessAction |
  SetCombinationListSuccessAction |
  GetCombinationFollowListSuccessAction |
  GetCombinationRecommendListSuccessAction
