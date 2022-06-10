import {
    GET_ADDRESS_SYMBOL_LIST_SUCCESS,
    GET_ADDRESS_SYMBOL_LIST_FAIL,
    GET_HOLDLIST_SUCCESS,
    GET_HOLDLIST_FAIL,
    GET_TRADEHEADER_SUCCESS,
    GET_TRADELIST_SUCCESS,
    GET_TRADELIST_FAIL,
    GET_TRANSFERHEADER_SUCCESS,
    GET_TRANSFERLIST_SUCCESS,
    GET_TRANSFERLIST_FAIL,
    GET_LPLIST_SUCCESS,
    GET_LPLIST_FAIL,
    GET_TRADE_ADDRESS_LIST_FAIL,
    GET_TRADE_ADDRESS_LIST_SUCCESS,
    START_GET_TRADE_ADDRESS_LIST,
    CHANGE_SHOW_TAB,
    CHANGE_TRADE_LIST_CONDITION,
    GET_TRADE_RECORDS_SUCCESS,
    GET_TRADE_RECORDS_FAIL,
    SET_TRADE_RECORDS_LOADING_STATUS,
    SET_TRADE_RECORDS_HAS_MORE,
    SET_TRADE_HISTORY_CLICK_INDEX,
    CHANGE_ADDRESS_ASSETS_FILTER,
    GET_ADDRESS_ASSETS_SUCCESS,
    GET_ADDRESS_ASSETS_FAIL,
    SET_ADDRESS_ASSETS_LIST_LOADING,
    SET_RELATED_ADDRESS_LIST_LOADING,
    GET_RELATED_ADDRESS_FAIL,
    GET_RELATED_ADDRESS_SUCCESS,
    SET_RELATED_ADDRESS_LIST_PAGENO,
    GET_LP_DETAIL_LIST_SUCCESS,
    GET_LP_DETAIL_LIST_FAIL,
    SET_LP_DETAIL_LIST_LOADING,
    SET_LP_DETAIL_LIST_PAGENO,
    SET_CREATED_ADDRESS_LIST_LOADING,
    SET_CREATED_ADDRESS_LIST_PAGENO,
    GET_CREATED_ADDRESS_SUCCESS,
    GET_CREATED_ADDRESS_FAIL,
    SET_ADDRESS_BASEINFO_LOADING,
    GET_ADDRESS_BASEINFO_SUCCESS,
    GET_ADDRESS_BASEINFO_FAIL,
    GET_ADDRESS_PROJECTS_DISTRIBUTION_SUCCESS,
    GET_PROJECTS_PROFIT_DISTRIBUTION_SUCCESS,
    GET_CURRENT_HOLD_RATE_SUCCESS,
    GET_CURRENT_NFT_HOLD_RATE_SUCCESS,
    CHANGE_HISTORY_HOLD_DETAIL_FILTER,
    GET_HISTORY_HOLD_DETAIL_LIST_SUCCESS,
    CHANGE_NFT_HISTORY_HOLD_DETAIL_FILTER,
    GET_NFT_HISTORY_HOLD_DETAIL_LIST_SUCCESS,
    SET_GO_PRO_DIALOG_VISIBLE,
    CHANGE_NFT_ADDRESS_ASSETS_FILTER,
    GET_ADDRESS_NFT_ASSETS_FAIL,
    GET_ADDRESS_NFT_ASSETS_SUCCESS,
    SET_ADDRESS_NFT_ASSETS_LIST_LOADING,
    CHANGE_NFT_TRADE_LIST_CONDITION,
    START_GET_NFT_TRADE_ADDRESS_LIST,
    GET_NFT_TRADE_ADDRESS_LIST_SUCCESS,
    GET_NFT_TRADE_ADDRESS_LIST_FAIL,
    SET_NFT_TRADE_RECORDS_LOADING_STATUS,
    GET_NFT_TRADE_RECORDS_SUCCESS,
    GET_NFT_TRADE_RECORDS_FAIL,
    SET_NFT_TRADE_RECORDS_HAS_MORE
} from '../actions/AddressAnalyseAction';
import {
    AddressAnalyseState,
    AddressAnalyseActions,
    AnaListErrorAction,
    GetAnaSymbolListSuccessAction,
    GetAnaHoldListSuccessAction,
    GetAnaSwapListSuccessAction,
    GetAnaTransferListSuccessAction,
    GetAnaLpListSuccessAction,
    GetTradeAddressListSuccessAction,
    GetTradeAddressListErrorAction,
    ChangeShowTabAction,
    ChangeTradeListConditionAction,
    GetTradeRecordListSuccessAction,
    GetTradeRecordListFailAction,
    SetTradeListLoadingAction,
    SetTradeListHasMoreAction,
    SetTradeListClickIndexAction,
    ChangeAddressAssetsFilterAction,
    GetAddressAssetsListSuccessAction,
    GetAddressAssetsListFailAction,
    SetAddressAssetsListLoadingAction,
    SetRelatedAddressListLoadingAction,
    GetRelatedAddressListSuccessAction,
    GetRelatedAddressListFailAction,
    SetRelatedAddressListPageNoAction,
    SetLpDetailListLoadingAction,
    SetLpDetailListPageNoAction,
    GetLpDetailListSuccessAction,
    GetLpDetailListFailAction,
    SetCreateAddressListLoadingAction,
    GetCreateAddressListSuccessAction,
    GetCreateAddressListFailAction,
    SetCreateAddressListPageNoAction,
    SetAddressAnalyseDetailLoading,
    GetAddressBaseInfoSuccessAction,
    GetProjectsDistributionSuccessAction,
    GetProjectsProfitNumberDistributionSuccessAction,
    GetCurrentHoldRateSuccessAction,
    ChangeHistoryHoldDetailFilterAction,
    GetHistoryHoldDetailListAction,
    SetGoProDialogVisibleAction,
    GetAddressNFTAssetsListSuccessAction,
    GetNFTHistoryHoldDetailListAction,
    GetNFTTradeRecordListSuccessAction
} from '../types/AddressAnalyseTypes';

const PAGESIZE = 20;

const initAddressBaseInfo = {
    addrName : '',
    addressList: [],
    isFollow: false,
    isNeedAdd: false,
    followCount: 0,
    addrUserTagList: [],
    addrSystemTagList: [],
    totalAsset: 0,
    profit: '',
    operateSymbolList: [],
    relationAddrCount: 0,
    addrTime: 0,
    lastActiveTime: 0,
    updateTime: 0,
    contract: false,
    nftTotalAsset: '',
    nftTotalAssetLast: '',
    nftOperateSymbolList: [],
    nftProfit: '',
    chainUrlMap: {},
    ethBalance: null
}

const initialState: AddressAnalyseState = {
    symbolList: [],
    lineData: [],
      
    showTab: 'address-info',
    tradeListCondition: {
          
        type: '0',
        startTime: undefined,
        endTime: undefined,
        pageNo: 1,
        pageSize: PAGESIZE,
        symbolAddrList: [],
        addressList: [],
    },
    nftTradeListCondition: {
          
        type: '0',
        startTime: undefined,
        endTime: undefined,
        pageNo: 1,
        pageSize: PAGESIZE,
        symbolAddrList: [],
        addressList: [],
    },
    baseInfoLoading: true,
    addressBaseInfo: initAddressBaseInfo,
    tradeListLoading: false,
    tradeListHasMore: true,
    tradeListData: [],
    tradeClickIndex: -1,
    nftTradeListLoading: false,
    nftTradeListHasMore: true,
    nftTradeListData: [],
    tradeAddressListLoading: false,
    tradeAddressList: [],
    tradeNFTAddressListLoading: false,
    tradeNFTAddressList: [],
    tradeHeader: {
        endDate: '',
        inAmount: null,
        inAvgPrice: null,
        inBalance: null,
        outAmount: null,
        outAvgPrice: null,
        outBalance: null,
        priceSymbol: null,
        startDate: '',
        swapList: [],
        symbol: '',
        symbolAddr: null,
        totalSize: 0,
    },
    tradeData: {
        endDate: '',
        inAmount: null,
        inAvgPrice: null,
        inBalance: null,
        outAmount: null,
        outAvgPrice: null,
        outBalance: null,
        priceSymbol: null,
        startDate: '',
        swapList: [],
        symbol: '',
        symbolAddr: null,
        totalSize: 0,
    },
    transferHeader: {
        count: 0,
        endDate: '',
        inAmount: null,
        outAmount: null,
        startDate: '',
        symbol: '',
        symbolAddr: null,
        totalSize: 0,
        transferList: [],
    },
    transferData: {
        count: 0,
        endDate: '',
        inAmount: null,
        outAmount: null,
        startDate: '',
        symbol: '',
        symbolAddr: null,
        totalSize: 0,
        transferList: [],
    },
    lpData: {
        endDate: '',
        startDate: '',
        totalSize: 0,
        list: [],
    },
    addressAssetsFilter: {
        type: 0,
        pageNo: 1,
        pageSize: PAGESIZE
    },
    addressAssetsTotal: 0,
    addressAssetsList:[],
    addressAssetsListLoading: false,
    nftAddressAssetsFilter: {
        type: 0,
        pageNo: 1,
        pageSize: PAGESIZE
    },
    nftAddressAssetsTotal: 0,
    nftAddressAssetsList:[],
    nftAddressAssetsListLoading: false,
    relatedAddressLoading: false,
    relatedAddressListTotal: 0,
    relatedAddressList: [],
    relatedAddressListPageNo: 1,
    lpDetailsLoading: false,
    lpDetailsTotal: 0,
    lpDetailsList: [],
    lpDetailsListPageNo: 1,
    createAddressLoading: false,
    createAddressListTotal: 0,
    createAddressList: [],
    createAddressListPageNo: 1,
    profitProjectsDistribution: {
        list: [],
        totalProfit: undefined,
        updateTime: undefined
    },
    lossProjectsDistribution: {
        list: [],
        totalProfit: undefined,
        updateTime: undefined
    },
    projectNumberDistribution: null,
    currentHoldRate: null,
    currentNFTHoldRate: null,
    historyHoldDetailFilter: null,
    historyHoldDetailResponse: null,
    nftHistoryHoldDetailFilter: null,
    nftHistoryHoldDetailResponse: null,
    goProDialogVisible: false,
    e: null,
}

const reducer = (state = initialState, actions: AddressAnalyseActions) => {
    const { type } = actions
    switch (type) {
        case GET_ADDRESS_SYMBOL_LIST_SUCCESS: {
            const { payload } = actions as GetAnaSymbolListSuccessAction
            return {
                ...state,
                symbolList: payload.data,
            }
        }
        case GET_HOLDLIST_SUCCESS: {
            const { payload } = actions as GetAnaHoldListSuccessAction
            return {
                ...state,
                lineData: payload.data,
            }
        }
        case GET_TRADEHEADER_SUCCESS: {
            const { payload } = actions as GetAnaSwapListSuccessAction
            return {
                ...state,
                tradeHeader: payload.data,
            }
        }
        case GET_TRADELIST_SUCCESS: {
            const { payload } = actions as GetAnaSwapListSuccessAction
            return {
                ...state,
                tradeData: payload.data,
            }
        }
        case GET_TRANSFERHEADER_SUCCESS: {
            const { payload } = actions as GetAnaTransferListSuccessAction
            return {
                ...state,
                transferHeader: payload.data,
            }
        }
        case GET_TRANSFERLIST_SUCCESS: {
            const { payload } = actions as GetAnaTransferListSuccessAction
            return {
                ...state,
                transferData: payload.data,
            }
        }
        case GET_LPLIST_SUCCESS: {
            const { payload } = actions as GetAnaLpListSuccessAction
            return {
                ...state,
                lpData: payload.data,
            }
        }
        case START_GET_TRADE_ADDRESS_LIST: {
            return {
                ...state,
                tradeAddressListLoading: true,
            }
        }
        case START_GET_NFT_TRADE_ADDRESS_LIST: {
            return {
                ...state,
                tradeNFTAddressListLoading: true,
            }
        }
        case GET_TRADE_ADDRESS_LIST_SUCCESS: {
            const { payload } = actions as GetTradeAddressListSuccessAction;
            return {
                ...state,
                tradeAddressList: payload.data,
                tradeAddressListLoading: false,
            }
        }
        case GET_NFT_TRADE_ADDRESS_LIST_SUCCESS: {
            const { payload } = actions as GetTradeAddressListSuccessAction;
            return {
                ...state,
                tradeNFTAddressList: payload.data,
                tradeNFTAddressListLoading: false,
            }
        }
        case CHANGE_SHOW_TAB: {
            const { payload } = actions as ChangeShowTabAction;
            return {
                ...state,
                showTab: payload
            }
        }
        case CHANGE_TRADE_LIST_CONDITION: {
            const { payload } = actions as ChangeTradeListConditionAction;
            const tradeListCondition = { ...state.tradeListCondition, ...payload };
            return { ...state, tradeListCondition };
        }
        case CHANGE_NFT_TRADE_LIST_CONDITION: {
            const { payload } = actions as ChangeTradeListConditionAction;
            const nftTradeListCondition = { ...state.nftTradeListCondition, ...payload };
            return { ...state, nftTradeListCondition };
        }
        case CHANGE_ADDRESS_ASSETS_FILTER: {
            const { payload } = actions as ChangeAddressAssetsFilterAction;
            const addressAssetsFilter = {...state.addressAssetsFilter,...payload};
            return {...state,addressAssetsFilter}
        }
        case CHANGE_NFT_ADDRESS_ASSETS_FILTER: {
            const { payload } = actions as ChangeAddressAssetsFilterAction;
            const nftAddressAssetsFilter = {...state.nftAddressAssetsFilter,...payload};
            return {...state,nftAddressAssetsFilter}
        }
        case SET_TRADE_RECORDS_LOADING_STATUS: {
            const { payload } = actions as SetTradeListLoadingAction;
            return {
                ...state,
                tradeListLoading: payload
            }
        }
        case SET_NFT_TRADE_RECORDS_LOADING_STATUS: {
            const { payload } = actions as SetTradeListLoadingAction;
            return {
                ...state,
                nftTradeListLoading: payload
            }
        }
        case SET_ADDRESS_ASSETS_LIST_LOADING: {
            const {payload} = actions as SetAddressAssetsListLoadingAction;
            return {
                ...state,
                addressAssetsListLoading: payload
            }
        }
        case SET_ADDRESS_NFT_ASSETS_LIST_LOADING: {
            const {payload} = actions as SetAddressAssetsListLoadingAction;
            return {
                ...state,
                nftAddressAssetsListLoading: payload
            }
        }
        case SET_LP_DETAIL_LIST_LOADING: {
            const {payload} = actions as SetLpDetailListLoadingAction;
            return {
                ...state,
                lpDetailsLoading: payload
            }
        }
        case SET_RELATED_ADDRESS_LIST_LOADING: {
            const {payload} = actions as SetRelatedAddressListLoadingAction;
            return {
                ...state,
                relatedAddressLoading: payload
            }
        }
        case SET_CREATED_ADDRESS_LIST_LOADING: {
            const {payload} = actions as SetCreateAddressListLoadingAction;
            return {
                ...state,
                createAddressLoading: payload
            }
        }
        case SET_TRADE_RECORDS_HAS_MORE: {
            const { payload } = actions as SetTradeListHasMoreAction;
            return {
                ...state,
                tradeListHasMore: payload
            }
        }
        case SET_NFT_TRADE_RECORDS_HAS_MORE: {
            const { payload } = actions as SetTradeListHasMoreAction;
            return {
                ...state,
                nftTradeListHasMore: payload
            }
        }
        case GET_TRADE_RECORDS_SUCCESS: {
            const { payload } = actions as GetTradeRecordListSuccessAction;
            return {
                ...state,
                tradeListLoading: false,
                tradeListData: state.tradeListCondition.pageNo! === 1 ?
                    [...payload.data.list] : state.tradeListData.concat(payload.data.list),
                tradeListHasMore: payload.data.list.length === state.tradeListCondition.pageSize,
                tradeClickIndex: state.tradeListCondition.pageNo! === 1 ?
                    -1 : state.tradeClickIndex,    
            }
        }
        case GET_NFT_TRADE_RECORDS_SUCCESS: {
            const { payload } = actions as GetNFTTradeRecordListSuccessAction;
            return {
                ...state,
                nftTradeListLoading: false,
                nftTradeListData: state.nftTradeListCondition.pageNo! === 1 ?
                    [...payload.data.list] : state.nftTradeListData.concat(payload.data.list),
                nftTradeListHasMore: payload.data.list.length === state.nftTradeListCondition.pageSize,
            }
        }
        case GET_TRADE_RECORDS_FAIL: {
            const { payload } = actions as GetTradeRecordListFailAction;
            return {
                ...state,
                tradeListLoading: false,
                e: payload
            }
        }
        case GET_NFT_TRADE_RECORDS_FAIL: {
            const { payload } = actions as GetTradeRecordListFailAction;
            return {
                ...state,
                nftTradeListLoading: false,
                e: payload
            }
        }
        case SET_TRADE_HISTORY_CLICK_INDEX: {
            const { payload } = actions as SetTradeListClickIndexAction;
            return {
                ...state,
                tradeClickIndex: payload === state.tradeClickIndex ? -1 : payload
            }
        }
        case SET_RELATED_ADDRESS_LIST_PAGENO: {
            const {payload} = actions as SetRelatedAddressListPageNoAction;
            return {
                ...state,
                relatedAddressListPageNo: payload
            }
        }
        case SET_CREATED_ADDRESS_LIST_PAGENO: {
            const {payload} = actions as SetCreateAddressListPageNoAction;
            return {
                ...state,
                createAddressListPageNo: payload
            }
        }
        case SET_LP_DETAIL_LIST_PAGENO: {
            const {payload} = actions as SetLpDetailListPageNoAction;
            return {
                ...state,
                lpDetailsListPageNo: payload
            }
        }
        case GET_ADDRESS_ASSETS_SUCCESS: {
            const { payload } = actions as GetAddressAssetsListSuccessAction;
            return {
                ...state,
                addressAssetsList: payload.data.list === null ? [] : [...payload.data.list],
                addressAssetsTotal: payload.data.totalSize
            }
        }
        case GET_ADDRESS_NFT_ASSETS_SUCCESS: {
            const {payload} = actions as GetAddressNFTAssetsListSuccessAction;
            return {
                ...state,
                nftAddressAssetsList: payload.data.list === null ? [] : [...payload.data.list],
                nftAddressAssetsTotal: payload.data.totalSize
            }
        }
        case GET_RELATED_ADDRESS_SUCCESS: {
            const {payload} = actions as GetRelatedAddressListSuccessAction;
            return {
                ...state,
                relatedAddressList: payload.list !== null ? [...payload.list]: [],
                relatedAddressListTotal: payload.totalSize
            }
        }
        case GET_CREATED_ADDRESS_SUCCESS: {
            const {payload} = actions as GetCreateAddressListSuccessAction;
            return {
                ...state,
                createAddressList: payload.list !== null ? [...payload.list]: [],
                createAddressListTotal: payload.totalSize
            }
        }
        case GET_LP_DETAIL_LIST_SUCCESS: {
            const {payload} = actions as GetLpDetailListSuccessAction;
            return {
                ...state,
                lpDetailsList: [...payload.data.list],
                lpDetailsTotal: payload.data.totalSize
            }
        }
        case SET_ADDRESS_BASEINFO_LOADING: {
            const {payload} = actions as SetAddressAnalyseDetailLoading;
            return {
                ...state,
                baseInfoLoading: payload
            }
        }
        case GET_ADDRESS_BASEINFO_SUCCESS: {
            const {payload} = actions as GetAddressBaseInfoSuccessAction;
            return {
                ...state,
                addressBaseInfo : payload,
                tradeListLoading: false,
                tradeListHasMore: true,
                tradeListData: [],
                tradeClickIndex: -1,
            }
        }
        case GET_ADDRESS_PROJECTS_DISTRIBUTION_SUCCESS: {
            const {payload} = actions as GetProjectsDistributionSuccessAction;
            if(payload.type === "profit") {
                return {
                    ...state,
                    profitProjectsDistribution : {
                        list: payload.data ? payload.data.list : [],
                        totalProfit: payload.data ? payload.data.totalProfit : undefined,
                        updateTime: payload.updateTime
                    }
                }
            } else {
                const lossProjectsDistribution = {
                    list: payload.data ? payload.data.list : [],
                    totalProfit: payload.data ? payload.data.totalProfit : undefined,
                    updateTime: payload.updateTime
                }
                return {
                    ...state,
                    lossProjectsDistribution
                }
            }
        }
        case GET_PROJECTS_PROFIT_DISTRIBUTION_SUCCESS: {
            const {payload} = actions as GetProjectsProfitNumberDistributionSuccessAction;
            return {
                ...state,
                projectNumberDistribution: payload
            }
        }
        case GET_CURRENT_HOLD_RATE_SUCCESS: {
            const {payload} = actions as GetCurrentHoldRateSuccessAction;
            return {
                ...state,
                currentHoldRate: payload
            }
        }
        case GET_CURRENT_NFT_HOLD_RATE_SUCCESS: {
            const {payload} = actions as GetCurrentHoldRateSuccessAction;
            return {
                ...state,
                currentNFTHoldRate: payload
            }
        }
        case CHANGE_HISTORY_HOLD_DETAIL_FILTER: {
            const {payload} = actions as ChangeHistoryHoldDetailFilterAction;
            return {
                ...state,
                historyHoldDetailFilter: payload
            }
        }
        case GET_HISTORY_HOLD_DETAIL_LIST_SUCCESS: {
            const {payload} = actions as GetHistoryHoldDetailListAction;
            return {
                ...state,
                historyHoldDetailResponse: payload
            }
        }
        case CHANGE_NFT_HISTORY_HOLD_DETAIL_FILTER: {
            const {payload} = actions as ChangeHistoryHoldDetailFilterAction;
            return {
                ...state,
                nftHistoryHoldDetailFilter: payload
            }
        }
        case GET_NFT_HISTORY_HOLD_DETAIL_LIST_SUCCESS: {
            const {payload} = actions as GetNFTHistoryHoldDetailListAction;
            return {
                ...state,
                nftHistoryHoldDetailResponse: payload
            }
        }
        case GET_TRADE_ADDRESS_LIST_FAIL: {
            const { payload } = actions as GetTradeAddressListErrorAction;
            return {
                ...state,
                tradeAddressListLoading: false,
                e: payload
            }
        }
        case GET_NFT_TRADE_ADDRESS_LIST_FAIL: {
            const { payload } = actions as GetTradeAddressListErrorAction;
            return {
                ...state,
                tradeNFTAddressListLoading: false,
                e: payload
            }
        }
        case SET_GO_PRO_DIALOG_VISIBLE: {
            const {payload} = actions as SetGoProDialogVisibleAction;
            return {
                ...state,
                goProDialogVisible: payload
            }
        }
        case GET_ADDRESS_BASEINFO_FAIL: {
            const { payload } = actions as AnaListErrorAction
            return {
                ...state,
                addressBaseInfo: {
                    ...initAddressBaseInfo
                },
                e: payload,
            }
        }
        case GET_RELATED_ADDRESS_FAIL:
        case GET_CREATED_ADDRESS_FAIL:
        case GET_TRADELIST_FAIL:
        case GET_HOLDLIST_FAIL:
        case GET_ADDRESS_SYMBOL_LIST_FAIL:
        case GET_TRANSFERLIST_FAIL:
        case GET_ADDRESS_ASSETS_FAIL:    
        case GET_ADDRESS_NFT_ASSETS_FAIL:
        case GET_LP_DETAIL_LIST_FAIL:
        case GET_LPLIST_FAIL: {
            const { payload } = actions as AnaListErrorAction
            return {
                ...state,
                e: payload,
            }
        }
        default:
            return state
    }
}

export default reducer
