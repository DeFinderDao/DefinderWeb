import { Action } from 'redux'
import { Response } from 'redux/types'

export interface ChanceWarningState {
    warningLoading: boolean
    warnLogCondition: SearchInfo
    warningAddrList: null | WarningAddrList<InnerData[]>
    warningData: WarningData<WarningDataItem[]>,
    warningSymbolList: WarnSymbol[],
    statistics: WarnStatistics,
    selectedWarnItemIndex: number,
    warnListHasMore: boolean,
    e: Error | null
}
export interface SearchInfo {
    addressTag: undefined | string
    symbolAddr: undefined | string,
    symbolName: undefined | string,
    pageNo: number | undefined
    pageSize: number | undefined
    warnType: undefined | string,
    money: undefined | string,
    isView: undefined | string,
    days?: string | undefined,
}
export interface WarningAddrList<T> {
    innerData?: T
}
export interface InnerData {
    addressTag: string
}

export interface WarnSymbol {
    symbolAddr: string,
    symbolName: string,
    symbolLogo: string
}

export interface WarningData<T> {
    endDate: null
    list: T | null
    startDate: null
    totalSize: number
}
export interface WarningDataItem {
    address: string
    addressTag: string
    addresses: string[]
    ethUrl: string
    groupId: number
    id: number
    symbol: string
    symbolLogo: string
    symbolAddress: null | string
    symbolLimit: null | number
    symbolNum: number,
    symbolBuyNum: number,
    time: number
    totalMoney: string
    warnTimes: null
    warnType: number
    position: string,
    costPrice: string,
    averagePrice: string,
    walletBalance: string,
    walletValue: string,
    txHash: string,
    isView: number,
    price: string,
    days: number | null,
    isVerified: boolean,
    otherSymbol: string,
    otherSymbolNum: string,
    otherSymbolLogo: string,
    otherSymbolIsVerified: boolean
}
export interface WarnStatistics {
    unreadWarnCount: number,
    unreadAmountCount: number,
    setAmountCount: number,
}

export interface ChanceWarningLoadingAction extends Action<string> {
    payload: boolean
}
export interface ChanceWarningListErrorAction extends Action<string> {
    payload: Error
}
export interface GetWarningAddrListSuccessAction extends Action<string> {
    payload: Response<WarningAddrList<InnerData[]>>
}
export interface GetWarningDataSuccessAction extends Action<string> {
    payload: Response<WarningData<WarningDataItem[]>>
}
export interface GetWarningStatisticsSuccessAction extends Action<string> {
    payload: WarnStatistics
}
export interface SetSelectedWarningItemAction extends Action<string> {
    payload: number
}
export interface SetWarningLogConditionAction extends Action<string> {
    payload: SearchInfo
}
export interface MarkAllWarningLogReadedAction extends Action<string> {

}
export interface MarkOneWarningLogReadedAction extends Action<string> {
    payload: number
}
export interface GetWarningSymbolListSuccessAction extends Action<string> {
    payload: WarnSymbol[]
}

export type WarningAddrListResponse = WarningAddrList<InnerData[]>
export type WarningDataResponse = WarningData<WarningDataItem[]>
export type ChanceWarningActions =
    | ChanceWarningLoadingAction
    | ChanceWarningListErrorAction
    | GetWarningAddrListSuccessAction
    | GetWarningDataSuccessAction
    | GetWarningStatisticsSuccessAction
    | SetSelectedWarningItemAction
    | SetWarningLogConditionAction
    | MarkAllWarningLogReadedAction
    | MarkOneWarningLogReadedAction
    | GetWarningSymbolListSuccessAction
