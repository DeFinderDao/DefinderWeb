import { Action } from "redux"

export interface SMCateroryItem {
    category: string,
    type: string,
    count: number,
    rate: number,
    mark: string,
}

export interface SMCategoryResponse {
    data: SMCateroryItem[],
    total: number
}

export interface HoldInfoListFilter {
    addressType: string,
    pageSize: number,
    pageNo: number,
    sortField: string,
    sortType: string
}

export interface HolderInfoListItem {
    symbol: string,
    symbolAddr: string,
    holdChange4h: string,
    holdChange4hRate: number,
    holdChange24h: string,
    holdChange24hRate: number,
    holdChange3d: string,
    holdChange3dRate: number,
    holdChange7d: string,
    holdChange7dRate: number,
    holdChange30d: string,
    holdChange30dRate: number,
    holdAddress: number,
    holdAddressRate: number
}

export interface HoldInfoListSuccess {
    totalSize: number,
    data: HolderInfoListItem[],
}

export interface HoldAssetRankItem {
    address: string,
    addressLabel: string,
    totalAsset: string,
    totalAssetNum: number,
    totalAssetRate: number,
    unStableAsset: string,
    unStableAssetNum: number,
    unStableAssetRate: number,
    ethAsset: string,
    ethAssetNum: number,
    ethAssetRate: number
}


export interface HoldSymbolRankListResponse {
    totalSize?: number
    list: HoldSymbolRankItem[],
    others: OtherItem
}

export interface OtherItem {
    number: number,
    rate: number,
}

export interface HoldSymbolRankItem {
    symbol: string,
    symbolAddr: string,
    totalAsset: string,
    totalAssetRate: number,
    symbolRate: number,
    holdAddrCount: number,
    holdAddrCountRate: number,
    top10Rate: number,
}

export interface CoinsPercentItem {
    stableRate: number,
    ethRate: number,
    ethRateStr: string,
    stableRateStr: string,
    date: number,
    time: string,
}

export interface PiePercents {
    stableRate: number,
    ethRate: number,
    other: number
}

export interface SmartMoneyState {
      
    showTab: string,
      
    addressType: string,
      
    smCategories: SMCateroryItem[],
    smCategoriesTotal: number,
      
    holdInfoListFilter: HoldInfoListFilter,
    holdInfoListTotalSize: number,
    holdInfoListData: HolderInfoListItem[],
      
    holdAssetRank: HoldAssetRankItem[],
      
    holdSymbolRank: HoldSymbolRankListResponse,
      
    coinsPercent: CoinsPercentItem[],
    coinsPercentUpdateTime: number,
      
    piePercents: PiePercents | undefined
}

export interface SetShowTabAction extends Action<string> {
    payload: string
}

export interface SetAddressTypeAction extends Action<string> {
    payload: string
}

export interface RequestHoldListAction extends Action<string> {
    payload: HoldInfoListFilter
}

export interface RequestHoldListSuccessAction extends Action<string> {
    payload: HoldInfoListSuccess
}

export interface RequestSmTypeAction extends Action<string> {
    payload: SMCategoryResponse
}

export interface RequestHoldAssetRankAction extends Action<string> {
    payload: HoldAssetRankItem[]
}

export interface RequestHoldSymbolRankAction extends Action<string> {
    payload: HoldSymbolRankListResponse
}

export interface RequestCoinPercentsAction extends Action<string> {
    payload: {
        data: CoinsPercentItem[],
        updateTime: number
    }
}

export interface RequestPiePercentsAction extends Action<string> {
    payload: PiePercents
}

export type SmartMoneyActions =
    SetShowTabAction |
    SetAddressTypeAction |
    RequestHoldListAction |
    RequestHoldListSuccessAction |
    RequestSmTypeAction |
    RequestHoldAssetRankAction |
    RequestHoldSymbolRankAction |
    RequestCoinPercentsAction |
    RequestPiePercentsAction
    ;