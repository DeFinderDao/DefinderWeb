import { Action } from 'redux'
import { Response } from './index'

export interface SetWarningState {
    setWarningLoading: boolean
    setWarningData: WarningListResponse
    setWarningDetail: WarningDetailResponse
    warningAddressList: WarningAddressItem[]
    symbolList: SymbolItem[]
    e: Error | null
}

export interface WarningListParams {
    pageNo: number
    pageSize: number
    groupId: string | number
}

export interface WarningListResponse {
    totalSize?: number
    list?: WarningItem[]
}

export interface WarningItem {
    address: string,
    addresses: string[],
    addressTag: string,
    warnType: number,
    symbol: string,
    warnTimes: number,
    symbolAddress: string,
    groupId: number,
    id: number,
    symbolLimit: number,
    money: number | string
}

export interface WarningDetailResponse {
    address?: string
    addressTag?: string
    warnType?: number | string
    warnTypeList?: string[]
    symbolLimit?: string | number
    symbol?: string | number
    symbolAddress?: string
    accountForce?: number | string
    warnWay?: number[]
    groupId?: null | string | number | undefined
    id?: number
}

export interface WarningAddressItem {
    address: string
    addressTag: string
    isAdmin: number
    groupId: number
}

export interface SymbolItem {
    symbol: string
    address: string
    logo: string
}

export interface WarningListSuccessAction extends Action<string> {
    payload: Response<WarningListResponse>
}

export interface WarningError extends Action<string> {
    payload: Error
}

export interface WarningDetailSuccessAction extends Action<string> {
    payload: Response<WarningDetailResponse>
}

export interface WarningAddressSuccessAction extends Action<string> {
    payload: Response<WarningAddressItem[]>
}

export interface SymbolListSuccessAction extends Action<string> {
    payload: Response<SymbolItem[]>
}

export interface SetWarningLoadingAction extends Action<string> {
    payload: boolean
}

export type WarningTypeActions =
    | SetWarningLoadingAction
    | WarningListSuccessAction
    | WarningDetailSuccessAction
    | WarningAddressSuccessAction
    | SymbolListSuccessAction
    | WarningError
