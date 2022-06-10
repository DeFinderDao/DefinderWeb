import { Action } from 'redux';
import { Response } from 'redux/types';
import { Moment } from 'moment';
import { NftSwapHistoryItem } from './NftSwapHistoryTypes';

export interface ResponseSwapBodyList<T> {
    endDate: string | number,
    inAmount: number | null,
    inAvgPrice: number | null,
    inBalance: number | null,
    outAmount: number | null,
    outAvgPrice: number | null,
    outBalance: number | null,
    priceSymbol: string | null,
    startDate: string | number,
    swapList: T,
    symbol: string,
    symbolAddr: null | string,
    totalSize: number,
}
export interface ResponseTransferBodyList<T> {
    count: number,
    endDate: string | number,
    inAmount: number | null,
    outAmount: number | null,
    startDate: string | number,
    symbol: string,
    symbolAddr: string | null,
    totalSize: number,
    transferList: T,
}
export interface ResponseLpBodyList<T> {
    endDate: string | number,
    startDate: string | number,
    totalSize: number,
    list: T;
}

export interface TradeListCondition {
    type?: string,
    startTime?: Moment,
    endTime?: Moment,
    pageNo?: number,
    pageSize?: number,
    symbolAddrList?: string[] | null,
    selectedTradeSymbol?: string[],
    addressList?: string[],
}

export interface HistoryHoldDetailFilter {
    addrName?: string,
    groupId?: string,
    sortField?: string,
    sortType?: number,
    pageNo?: number,
    pageSize?: number,
    hidden?: number
}

export interface HistoryHoldDetailItem {
    symbol: string,
    symbolAddr: string,
    symbolLogo: string,
    price: string,
    firstInPrice: string,
    firstInTime: number,
    totalProfit: string,
    profitRate: string
}

export interface HistoryHoldDetailResponse {
    message: string,
    code: string,
    updateTime: number,
    data: {
        list: HistoryHoldDetailItem[],
        totalSize: number
    }
}

export interface NFTHistoryHoldDetailItem {
    symbol: string,
    symbolAddr: string,
    symbolLogo: string,
    totalBuyAmount: string,
    holdAmount: string,
    sellRate: string,
    totalCost: string,
    totalIncome: string,
    updateTime: string,
    firstInTime: number,
    totalProfit: string,
    profitRate: string
}

export interface NFTHistoryHoldDetailResponse {
    message: string,
    code: string,
    updateTime: number,
    data: {
        list: NFTHistoryHoldDetailItem[],
        totalSize: number
    }
}

export interface AddressAssetsFilter {
    addrName?: string,
    groupId?: string,
    holdValueLeft?: string,
    holdValueRight?: string,
    type?: number;
    profit?: string,
    profitRate?: string,
    sortField?: string,
    sortType?: number,
    pageNo?: number,
    pageSize?: number
}

export interface AddressAssetItem {
    symbol: string,
    symbolAddr: string,
    symbolLogo: string,
    price: string,
    holdAmount: string,
    amountValue: string,
    inAvgPrice: string,
    inAmount: string,
    outAvgPrice: string,
    outAmount: string,
    costPrice: string,
    totalProfit: string,
    profitRate: string,
}

export interface AddressNFTAssetItem {
    symbol: string,
    symbolAddr: string,
    symbolLogo: string,
    amountValue: string,
    holdAmount: string,
    totalCost: string,
    totalProfit: string,
    profitRate: string,
    avgCost: string,
    floorPrice: string,
    lastTreadDay: string,
}

export interface AddressAssetsResponse {
    totalSize: number,
    list: AddressAssetItem[]
}

export interface AddressNFTAssetsResponse {
    totalSize: number,
    list: AddressNFTAssetItem[]
}

export interface RelatedAddressItem {
    address: string,
    addressLabel: string,
    addrValue: string,
    addrTime: number,
    transferInValue: string,
    transferInCount: number,
    transferOutValue: string,
    transferOutCount: number,
    txHashUrl: string,
}

export interface RelatedAddressListResponse {
    totalSize: number,
    list: RelatedAddressItem[]
}

export interface CreateAddressItem {
    address: string,
    addressLabel: string,
    newAddress: string,
    newAddressLabel: string,
    newDays: number,
    newTotalValue: string
}

export interface CreateAddressResponse {
    totalSize: number,
    list: CreateAddressItem[]
}

export interface LpDetailItem {
    symbol0: string,
    symbol0Logo: string,
    symbol0Amount: string,
    symbol0Value: string,
    symbol1: string,
    symbol1Logo: string,
    symbol1Amount: string,
    symbol1Value: string,
    lpTotalValue: string,
    pairAddress: string,
}

export interface LpDetailListResponse {
    totalSize: number,
    list: LpDetailItem[],
}

export interface ProjectDistributionItem {
    symbolAddr: string,
    symbol: string,
    symbolLogo: string,
    rate: number,
    profit: string,
    profitRate: string
}

export interface ProjectsDistributionData {
    list: ProjectDistributionItem[],
    totalProfit: string | undefined,
    updateTime: number | undefined
}

export interface ProjectsDistributionResponse {
    type?: "profit" | "loss" | undefined
    code?: string,
    message?: string,
    updateTime?: number,
    data: {
        totalProfit: string,
        list: ProjectDistributionItem[]
    } | null
}

export interface ProjectNumber {
    type: string,
    value: number | null,
    amount: number,
    profit: string,
}

export interface ProjectProfitNumberDistributionResponse {
    code: string,
    message: string,
    updateTime: number,
    data: ProjectNumber[]
}

export interface CurrentHoldRateItem {
    symbolAddr: string,
    symbolLogo: string,
    symbol: string,
    rate: number,
    profitRate: string | null,
    holdValue: string,
    profit: string,
    percent: number,
    holdAmount: undefined | number
}

export interface CurrentHoldRateResponse {
    message: string,
    code: string,
    updateTime: number,
    data: {
        list: CurrentHoldRateItem[],
        totalHoldAsset: string,
        showMore: boolean
    }
}

export interface CurrentHoldRateDetailItem {
    symbol: string,
    symbolAddr: string,
    symbolLogo: string,
    price: string,
    holdAmount: string,
    amountValue: string,
    inAvgPrice: string,
    inAmount: string,
    outAvgPrice: string,
    outAmount: string,
    costPrice: string,
    totalProfit: string,
    profitRate: string
}

export interface CurrentHoldRateDetailResponse {
    message: string,
    code: string,
    updateTime: number,
    data: {
        list: CurrentHoldRateDetailItem[],
        totalSize: number
    }
}

export interface AddressAnalyseState {
    symbolList: SymbolList[],
    lineData: HoldLineData[],
    tradeAddressListLoading: boolean,
    tradeAddressList: AddressItem[],
    tradeNFTAddressListLoading: boolean,
    tradeNFTAddressList: AddressItem[],
    showTab: string,
    tradeClickIndex: number,
      
    baseInfoLoading: boolean,
    addressBaseInfo: InfoDataProps,
      
    tradeListCondition: TradeListCondition,
    tradeListLoading: boolean,
    tradeListHasMore: boolean,
    tradeListData: TradeRecordItem[],
    tradeHeader: ResponseSwapBodyList<AnalyseSwapList[]>,
    tradeData: ResponseSwapBodyList<AnalyseSwapList[]>,
    transferHeader: ResponseTransferBodyList<AnalyseTransferList[]>,
    transferData: ResponseTransferBodyList<AnalyseTransferList[]>,
    lpData: ResponseLpBodyList<AnalyseLpList[]>,
      
    nftTradeListCondition:TradeListCondition,
    nftTradeListLoading: boolean,
    nftTradeListHasMore: boolean,
    nftTradeListData: NftSwapHistoryItem[],
      
    addressAssetsFilter: AddressAssetsFilter,
    addressAssetsTotal: number,
    addressAssetsList: AddressAssetItem[],
    addressAssetsListLoading: boolean,
      
    nftAddressAssetsFilter: AddressAssetsFilter,
    nftAddressAssetsTotal: number,
    nftAddressAssetsList:AddressNFTAssetItem[],
    nftAddressAssetsListLoading: boolean,
      
    relatedAddressLoading: boolean,
    relatedAddressListTotal: number,
    relatedAddressList: RelatedAddressItem[],
    relatedAddressListPageNo: number,
      
    createAddressLoading: boolean,
    createAddressListTotal: number,
    createAddressList: CreateAddressItem[],
    createAddressListPageNo: number,
      
    lpDetailsLoading: boolean,
    lpDetailsTotal: number,
    lpDetailsList: LpDetailItem[],
    lpDetailsListPageNo: number,
      
    profitProjectsDistribution: ProjectsDistributionData,
      
    lossProjectsDistribution: ProjectsDistributionData,
    projectNumberDistribution: ProjectProfitNumberDistributionResponse | null,
    currentHoldRate: CurrentHoldRateResponse | null,
    currentNFTHoldRate: CurrentHoldRateResponse | null,
      
    historyHoldDetailFilter: HistoryHoldDetailFilter | null,
    historyHoldDetailResponse: HistoryHoldDetailResponse | null,
      
    nftHistoryHoldDetailFilter: HistoryHoldDetailFilter | null,
    nftHistoryHoldDetailResponse: NFTHistoryHoldDetailResponse | null,
    goProDialogVisible: boolean,
    e: Error | null,
}
export interface SearchInfo {
    symbol: string | null,
    symbolAddr: string | null,
    direction: string | null,
    startTime: number | null,
    endTime: number | null,
    pageNo: number,
    pageSize: number,
}
export interface SearchHoldInfo {
    symbol: string | null,
    startTime: number | null,
    endTime: number | null,
    timeSpan: number | null,
}
export interface SymbolList {
    address: string,
    logo: string,
    symbol: string,
}
export interface InfoSymbolList {
    symbol: string,
    symbolAddr: string,
    amount: number,
    balance: number,
    rate: number,
}
export interface HoldLineData {
    date: number,
    amount: number,
    balance: number,
}
export interface AnalyseSwapList {
    date: number,
    direction: number,
    inAmount: number,
    inSymbol: string,
    inSymbolAddr: string,
    orderValue: number,
    outAmount: number,
    outSymbol: string,
    outSymbolAddr: string,
    pair: string,
    price: number,
    pricePair: string,
    txHash: string,
}
export interface AnalyseTransferList {
    amount: number,
    date: number,
    direction: number,
    fromAddr: string,
    receiptStatus: number,
    symbol: string,
    symbolAddr: string,
    toAddr: string,
    txHash: string,
}
export interface AnalyseLpList {
    address: string,
    amount: number | null,
    amount0: number | null,
    amount1: number | null,
    contractAddr: string,
    date: number | null,
    direction: number | null,
    pair: string,
    pairAddr: string,
    receiptStatus: number | null,
    symbol0: string,
    symbol0Addr: string,
    symbol1: string,
    symbol1Addr: string,
}

export interface AddressItem {
    symbol: string,
    symbolLogo: string,
    symbolAddr: string,
}

export interface TradeRecordsResponse {
    startDate: number,
    endDate: number,
    list: TradeRecordItem[]
}

export interface TradeNFTRecordsResponse {
    startDate: number,
    endDate: number,
    list: NftSwapHistoryItem[]
}

export interface TradeRecordItem {
    type: number,
    date: string,
    txHashUrl: string,
    txHash: string,
    swap: Swap,
    transfer: Transfer,
    lp: LP,
    id: number,
    titles: string[]
}

export interface Swap {
    symbol0: string,
    symbol0Addr: string,
    symbol0Logo: string,
    symbol0Amount: string,
    symbol0Price: string,
    symbol0Value: string,
    symbol1: string,
    symbol1Addr: string,
    symbol1Logo: string,
    symbol1Amount: string,
    symbol1Price: string,
    symbol1Value: string,
}

export interface Transfer {
    symbol: string,
    symbolAddr: string,
    symbolLogo: string,
    symbolAmount: string,
    symbolPrice: string,
    symbolValue: string,
    address: string,
    addressLabel: string,
    isContract: boolean
}

export interface LP {
    symbol0: string,
    symbol0Addr: string,
    symbol0Logo: string,
    symbol0Amount: string,
    symbol0Price: string,
    symbol0Value: string,
    symbol1: string,
    symbol1Addr: string,
    symbol1Logo: string,
    symbol1Amount: string,
    symbol1Price: string,
    symbol1Value: string,
    lpTotalValue: string,
    contractLogo: string
}

export interface InfoDataProps {
    addrName: string,
    addressList: string[],
    isFollow: boolean,
    isNeedAdd: boolean,
    followCount: number,
    addrUserTagList: string[],
    addrSystemTagList: string[],
    totalAsset: number,
    profit: string,
    operateSymbolList: Symbol[],
    relationAddrCount: number,
    addrTime: number,
    lastActiveTime: number,
    updateTime: number,
    contract: boolean,
    nftTotalAsset: string,
    nftTotalAssetLast: string,
    nftOperateSymbolList: Symbol[],
    nftProfit: string,
    chainUrlMap: Item,
    ethBalance: number | null
}
export interface Item {
    [key: string]: string,
}

export interface Symbol {
    symbol: string,
    symbolAddr: string,
    symbolLogo: string,
}

export interface GetTradeAddressListSuccessAction extends Action<string> {
    payload: Response<AddressItem[]>
}

export interface GetTradeAddressListErrorAction extends Action<string> {
    payload: Error
}

export interface AnaListErrorAction extends Action<string> {
    payload: Error
}

export interface GetAnaSymbolListSuccessAction extends Action<string> {
    payload: Response<SymbolList[]>
}

export interface GetAnaHoldListSuccessAction extends Action<string> {
    payload: Response<HoldLineData[]>
}

export interface GetAnaSwapListSuccessAction extends Action<string> {
    payload: Response<ResponseSwapBodyList<AnalyseSwapList[]>>
}

export interface GetAnaTransferListSuccessAction extends Action<string> {
    payload: Response<ResponseTransferBodyList<AnalyseTransferList[]>>
}

export interface GetAnaLpListSuccessAction extends Action<string> {
    payload: Response<ResponseLpBodyList<AnalyseLpList[]>>
}

export interface ChangeShowTabAction extends Action<string> {
    payload: string
}

export interface ChangeTradeListConditionAction extends Action<string> {
    payload: TradeListCondition
}

export interface GetTradeRecordListSuccessAction extends Action<string> {
    payload: Response<TradeRecordsResponse>
}

export interface GetNFTTradeRecordListSuccessAction extends Action<string> {
    payload: Response<TradeNFTRecordsResponse>
}

export interface GetTradeRecordListFailAction extends Action<string> {
    payload: Error
}

export interface SetTradeListLoadingAction extends Action<string> {
    payload: boolean
}

export interface SetTradeListHasMoreAction extends Action<string> {
    payload: boolean
}

export interface SetTradeListClickIndexAction extends Action<string> {
    payload: number
}

export interface ChangeAddressAssetsFilterAction extends Action<string> {
    payload: AddressAssetsFilter
}

export interface GetAddressAssetsListSuccessAction extends Action<string> {
    payload: Response<AddressAssetsResponse>
}

export interface GetAddressAssetsListFailAction extends Action<string> {
    payload: Error
}

export interface SetAddressAssetsListLoadingAction extends Action<string> {
    payload: boolean
}

export interface GetAddressNFTAssetsListSuccessAction extends Action<string> {
    payload: Response<AddressNFTAssetsResponse>
}

export interface GetAddressNFTAssetsListFailAction extends Action<string> {
    payload: Error
}

export interface SetAddressNFTAssetsListLoadingAction extends Action<string> {
    payload: boolean
}

export interface SetRelatedAddressListLoadingAction extends Action<string> {
    payload: boolean
}

export interface GetRelatedAddressListSuccessAction extends Action<string> {
    payload: RelatedAddressListResponse
}

export interface GetRelatedAddressListFailAction extends Action<string> {
    payload: Error
}

export interface SetRelatedAddressListPageNoAction extends Action<string> {
    payload: number
}

export interface SetLpDetailListLoadingAction extends Action<string> {
    payload: boolean
}

export interface GetLpDetailListSuccessAction extends Action<string> {
    payload: Response<LpDetailListResponse>
}

export interface GetLpDetailListFailAction extends Action<string> {
    payload: Error
}

export interface SetLpDetailListPageNoAction extends Action<string> {
    payload: number
}

export interface SetCreateAddressListLoadingAction extends Action<string> {
    payload: boolean
}

export interface GetCreateAddressListSuccessAction extends Action<string> {
    payload: CreateAddressResponse
}

export interface GetCreateAddressListFailAction extends Action<string> {
    payload: Error
}

export interface SetCreateAddressListPageNoAction extends Action<string> {
    payload: number
}

export interface GetAddressBaseInfoSuccessAction extends Action<string> {
    payload: InfoDataProps
}

export interface GetProjectsDistributionSuccessAction extends Action<string> {
    payload: ProjectsDistributionResponse
}

export interface GetAddressBaseInfoFailAction extends Action<string> {
    payload: Error
}

export interface SetAddressAnalyseDetailLoading extends Action<string> {
    payload: boolean
}

export interface GetProjectsProfitNumberDistributionSuccessAction extends Action<string> {
    payload: ProjectProfitNumberDistributionResponse | null
}

export interface GetCurrentHoldRateSuccessAction extends Action<string> {
    payload: CurrentHoldRateResponse | null
}

export interface GetCurrentHoldRateSuccessAction extends Action<string> {
    payload: CurrentHoldRateResponse | null
}

export interface GetCurrentNFTHoldRateSuccessAction extends Action<string> {
    payload: CurrentHoldRateResponse | null
}

export interface ChangeHistoryHoldDetailFilterAction extends Action<string> {
    payload: HistoryHoldDetailFilter
}

export interface GetHistoryHoldDetailListAction extends Action<string> {
    payload: HistoryHoldDetailResponse | null
}

export interface GetNFTHistoryHoldDetailListAction extends Action<string> {
    payload: NFTHistoryHoldDetailResponse | null
}

export interface SetGoProDialogVisibleAction extends Action<string> {
    payload: boolean
}

export type AddressAnalyseActions = AnaListErrorAction | GetAnaSymbolListSuccessAction |
    GetAnaHoldListSuccessAction |
    GetAnaSwapListSuccessAction |
    GetAnaTransferListSuccessAction |
    GetAnaLpListSuccessAction |
    GetTradeAddressListSuccessAction |
    GetTradeAddressListErrorAction |
    ChangeShowTabAction |
    ChangeTradeListConditionAction |
    GetTradeRecordListSuccessAction |
    GetTradeRecordListFailAction |
    SetTradeListLoadingAction |
    SetTradeListHasMoreAction |
    SetTradeListClickIndexAction |
    ChangeAddressAssetsFilterAction |
    GetAddressAssetsListSuccessAction |
    GetAddressAssetsListFailAction |
    SetAddressAssetsListLoadingAction |
    SetRelatedAddressListLoadingAction |
    GetRelatedAddressListSuccessAction |
    GetRelatedAddressListFailAction |
    SetRelatedAddressListPageNoAction |
    SetLpDetailListLoadingAction |
    GetLpDetailListSuccessAction |
    GetLpDetailListFailAction |
    SetLpDetailListPageNoAction |
    SetCreateAddressListLoadingAction |
    GetCreateAddressListSuccessAction |
    GetCreateAddressListFailAction |
    SetCreateAddressListPageNoAction |
    GetAddressBaseInfoSuccessAction |
    GetAddressBaseInfoFailAction |
    SetAddressAnalyseDetailLoading |
    GetProjectsDistributionSuccessAction |
    GetProjectsProfitNumberDistributionSuccessAction |
    GetCurrentHoldRateSuccessAction |
    ChangeHistoryHoldDetailFilterAction |
    GetHistoryHoldDetailListAction |
    GetNFTTradeRecordListSuccessAction
