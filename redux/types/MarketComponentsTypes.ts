import { Action } from "redux";
import { Response } from ".";

  
export interface ComparisonListParams {
    pageNo: number,
    pageSize: number,
    symbolAddr: string,
    type: string,
}

  
export interface ComparisonResponseData {
    addHoldVolume: number,
    addPositionsCount: number,
    addValue: number,
    subHoldVolume: number,
    subPositionsCount: number,
    subValue: number,
    innerData: ComparisonResponseInnerData[]
}

export interface ComparisonResponseInnerData {
    addAddress: string,
    addAddressLabel: string,
    addVolume: number,
    index: number,
    subAddress: string,
    subAddressLabel: string,
    subVolume: number,
    symbol: string,
    symbolAddr: string,
    addTitles?: string[],
    subTitles?: string[],
    addBalance?: number,
    subBalance?: number,
}

  
export interface NewAddressListParams {
    field: string | null,
    pageNo: number,
    pageSize: number,
    sort: number | null,
    symbolAddr: string,
    type: string,
}

  
export interface NewAddressListResponse {
    totalSize: number,
    startDate: string | null,
    endDate: string | null,
    list: NewAddressItemResponse[]
}

export interface NewAddressItemResponse {
    address: string,
    addressLabel: string,
    addressAll: string | null,
    balance: number,
    index: number,
    logoUrl: string,
    symbol: string,
    symbolAddr: string,
    value: number,
    titles?: string[]
}

  
export interface BuyRankListParams {
    field: null | string,
    pageNo: number,
    pageSize: number,
    sort: null | number,
    symbolAddr: string,
    dateType: string,
}

  
export interface BuyRankListResponse {
    totalSize: number,
    startDate: string | null,
    endDate: string | null,
    list: BuyRankItemResponse[]
}

export interface BuyRankItemResponse {
    address: string,
    addressLabel: string,
    costPrice: null | number,
    index: number,
    netBuyAmount: number,
    netAsset: number,
    symbol: string,
    symbolAddr: string,
    titles: string[],
    logoUrl: string,
    description: number,
    balance?: number,
    asset: number,
    profit: number,
    profitRate: string,
    holdCost: string,
}

  
export interface LPRankListParams {
    field: null | string | undefined,
    pageNo: number,
    pageSize: number,
    sort: null | number,
    symbolAddr: string,
    type?: string,
}

  
export interface LPRankListResponse {
    totalSize: number,
    startDate: string | null,
    endDate: string | null,
    list: LPRankItemResponse[]
}

export interface LPRankItemResponse {
    address: string,
    addressLabel: string,
    index: number,
    rate: number,
    symbol: string,
    symbolAddr: string,
    value: number,
    volume: number,
    titles?: string[],
    rank: number,
    asset: string,
    balance: string,
    holdCost: string,
}

export interface SetRankListPageNoAction extends Action<String> {
    payload: number
}

  
export interface LPRankPieResponse {
    symbolList: LPRankPieItemResponse[]
}

export interface LPRankPieItemResponse {
    address: string,
    amount: number,
    balance: number,
    rate: number
}

export interface MarketComponentsState {
    comparisonLoading: boolean,
    newAddrListLoading: boolean,
    buyRankListLoading: boolean,
    rankListPageNo: number,
    sellRankListLoading: boolean,
    lpRankListLoading: boolean,
    lpRankPieLoading: boolean,
    comparisonData: ComparisonResponseData | null,
    newAddressData: NewAddressListResponse | null,
    buyRankData: BuyRankListResponse | null,
    lpRankPageNo: number,
    LPRankData: LPRankListResponse | null,
    LPRankPieData: LPRankPieResponse | null,
    sellRankData: BuyRankListResponse | null,
    noMore: boolean,
    e: Error | null
}

export interface SetLpRankPageNoAction extends Action<string> {
    payload: number
}

export interface ChangeLoadingAction extends Action<string> {
    payload: boolean
}

export interface ComparisonListSuccessAction extends Action<string> {
    payload: Response<ComparisonResponseData>
}

export interface NewAddressListSuccessAction extends Action<string> {
    payload: Response<NewAddressListResponse>
}

export interface BuyRankListSuccessAction extends Action<string> {
    payload: Response<BuyRankListResponse> | null
}

export interface LPRankListSuccessAction extends Action<string> {
    payload: Response<LPRankListResponse>
}

export interface LPRankPieSuccessAction extends Action<string> {
    payload: Response<LPRankPieResponse>
}

export interface MarketErrorAction extends Action<string> {
    payload: Error
}

export type MarketComponentsActions = ChangeLoadingAction | ComparisonListSuccessAction | NewAddressListSuccessAction
    | BuyRankListSuccessAction | LPRankListSuccessAction | LPRankPieSuccessAction | MarketErrorAction | SetRankListPageNoAction
    | SetLpRankPageNoAction