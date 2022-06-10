import { Action } from 'redux'
import { Response } from 'redux/types'
  
export interface ResponseBodyList<T> {
    endDate: string | number
    startDate: string | number
    totalSize: number
    list: T
}
  
export interface ApplicationState {
    siderList: SiderList[]
    tableList: null | ResponseBodyList<TableList[]>
    loadingList: TableList[]
    loading: boolean
    e: Error | null
}
  
export interface SearchInfo {
    pageSize: number | undefined
    direction: string | number
    startTime?: number
    endTime?: number
    pageNo: number | undefined
}
  
export interface SiderList {
    code: string
    icon: string
    iconActive: string
    name: string
    sort: number
}
  
export interface TableList {
    addrCount: number | null
    amount: number
    avgPrice: number
    code: string
    count: number
    logo: string
    name: string
    value: number
    valueAmount: number
}

export interface AddrListSimpleAction extends Action<string> {
    payload: boolean
}
export interface AddrListErrorAction extends Action<string> {
    payload: Error
}
export interface AddrListClearAction extends Action<string> {
    payload?: null
}
export interface GetSiderListSuccessAction extends Action<string> {
    payload: Response<SiderList[]>
}
export interface GetTableListSuccessAction extends Action<string> {
    payload: Response<ResponseBodyList<TableList[]>>
}

export type ApplicationResponse = ResponseBodyList<SiderList[] | TableList[]>

export type ApplicationSearchInfo = SearchInfo

export type ApplicationActions =
    | AddrListSimpleAction
    | AddrListErrorAction
    | AddrListClearAction
    | GetSiderListSuccessAction
    | GetTableListSuccessAction
