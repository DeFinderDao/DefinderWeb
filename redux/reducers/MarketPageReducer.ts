import {
    USER_LOGINOUT_SUCCESS,
    MARKET_PAGE_OPTIONAL_LIST_LOADING,
    MARKET_PAGE_ALL_LIST_LOADING,
    MARKET_PAGE_PAGINATION_OPTIONAL_INFO,
    MARKET_PAGE_PAGINATION_ALL_INFO,
    MARKET_PAGE_MENU_TYPE,
    MARKET_PAGE_OPTIONAL_LIST_SUCCESS,
    MARKET_PAGE_OPTIONAL_LIST_FAIL,
    MARKET_PAGE_ALL_LIST_SUCCESS,
    MARKET_PAGE_ALL_LIST_FAIL,
    EDIT_MARKET_PAGE_ALL_LIST,
    EDIT_MARKET_PAGE_OPTIONAL_LIST,
    MARKET_PAGE_OPTIONAL_LIST_REFRESH_SUCCESS,
    MARKET_PAGE_OPTIONAL_LIST_REFRESH_FAIL,
    MARKET_PAGE_ALL_LIST_REFRESH_SUCCESS,
    MARKET_PAGE_ALL_LIST_REFRESH_FAIL,
    MARKET_PAGE_DETAIL_SUCCESS,
    MARKET_PAGE_DETAIL_FAIL,
    MARKET_PAGE_FILTER_FILLED
} from 'redux/actions/MarketPageAction'
import {
    MarketPageState,
    MarketPageActions,
    MarketPageSimpleAction,
    MarketPageErrorAction,
    MarketPageDataAction,
    MarketPagePaginationInfo,
    MarketPageMenuType,
    MarketPageDataListAction,
    MarketPageDataList,
    GetMarketDetailSuccessAction,
    MarketPageFilterFilled
} from 'redux/types/MarketPageTypes'

const initialState: MarketPageState = {
    optionalListLoading: true,
    allListLoading: true,
    marketOptionalList: {
        list: [],
        endDate: '',
        startDate: '',
        totalSize: 0,
    },
    marketAllList: {
        list: [],
        endDate: '',
        startDate: '',
        totalSize: 0,
    },
    paginationOptionalInfo: {
        pageNo: 1,
        pageSize: 20,
        sortFiled: 'symbolTurnover',
        sort: 0,
    },
    paginationAllInfo: {
        pageNo: 1,
        pageSize: 20,
        sortFiled: 'symbolTurnover',
        sort: 0,
    },
    filterFilled: {
        startTime: null,
        endTime: null,
        minSymbolTurnover: null,
        minHoldCount: null,
        minNetBuyCount: null,
        minAddHoldCount: null,
        minLpValue: null,
    },
    menuType: '',
    marketDetail: {
        logo: '',
        symbol: '',
        symbolFullName: '',
        symbolName: '',
        symbolAddr: '',
        symbol1Addr: '',
        pair: '',
        exchange: '',
        contract: '',
        lpVolume: null,
        id: null,
        price: '',
        priceIncrease: '',
        lpBaseSymbolVolume: 0,
        lpPriceSymbolVolume: 0,
        lpBaseSymbol: '',
        lpPriceSymbol: '',
        volume24h: 0,
        volume24hIncrease: '',
        tradeCount: 0,
        tradeCountIncrease: '',
        lpValue: 0,
        onlineTime: 0,
        isStar: false,
        symbolTurnover: 0,
        holdAddressCount: 0,
        communityList: [{
            name: '',
            communityName: '',
            url: ''
        }],
        marketValue: '',
        circulation: '',
        supply: '',
        isHoneypot: null
    },
    e: null,
}

const reducer = (state = initialState, actions: MarketPageActions) => {
    const { type } = actions
    switch (type) {
        case MARKET_PAGE_DETAIL_SUCCESS: {
            const { payload } = actions as GetMarketDetailSuccessAction;
            return {
                ...state,
                marketDetail: payload
            }
        }
        case USER_LOGINOUT_SUCCESS:
            return {
                ...state,
                optionalListLoading: false,
                marketOptionalList: {
                    list: [],
                    endDate: '',
                    startDate: '',
                    totalSize: 0,
                },
                paginationOptionalInfo: {
                    pageNo: 1,
                    pageSize: 20,
                    sortFiled: 'symbolTurnover',
                    sort: 0,
                },
                e: null,
            }
        case MARKET_PAGE_OPTIONAL_LIST_LOADING: {
            const { payload } = actions as MarketPageSimpleAction
            return {
                ...state,
                optionalListLoading: payload,
            }
        }
        case MARKET_PAGE_ALL_LIST_LOADING: {
            const { payload } = actions as MarketPageSimpleAction
            return {
                ...state,
                allListLoading: payload,
            }
        }
        case MARKET_PAGE_OPTIONAL_LIST_SUCCESS: {
            const { payload } = actions as MarketPageDataListAction
            const ids = state.marketOptionalList.list.map((item, index) => {
                return item.id
            })
            const newList =
                (payload.data.list &&
                    payload.data.list.filter((item, index) => {
                        if (!ids.includes(item.id)) {
                            return item
                        }
                    })) ||
                []
            state.marketOptionalList = {
                list: state.marketOptionalList.list.concat(newList || []),
                totalSize: payload.data.totalSize,
                endDate: '',
                startDate: '',
            }
            return {
                ...state,
                optionalListLoading: false,
            }
        }
        case MARKET_PAGE_ALL_LIST_SUCCESS: {
            const { payload } = actions as MarketPageDataListAction
            return {
                ...state,
                marketAllList: {
                    list: state.marketAllList.list.concat(
                        payload.data.list || []
                    ),
                    totalSize: payload.data.totalSize,
                    endDate: '',
                    startDate: '',
                },
                allListLoading: false,
            }
        }
        case MARKET_PAGE_PAGINATION_OPTIONAL_INFO: {
            const { payload } = actions as MarketPagePaginationInfo
            return {
                ...state,
                paginationOptionalInfo: payload,
            }
        }
        case MARKET_PAGE_PAGINATION_ALL_INFO: {
            const { payload } = actions as MarketPagePaginationInfo
            return {
                ...state,
                paginationAllInfo: payload,
            }
        }
        case MARKET_PAGE_FILTER_FILLED: {
            const { payload } = actions as MarketPageFilterFilled
            return {
                ...state,
                filterFilled: payload,
            }
        }
        case MARKET_PAGE_MENU_TYPE: {
            const { payload } = actions as MarketPageMenuType
            return {
                ...state,
                menuType: payload,
            }
        }
        case EDIT_MARKET_PAGE_OPTIONAL_LIST: {
            const { payload } = actions as MarketPageDataAction
              
            const symbolAddr = payload.symbolAddr
            let list0 = state.marketOptionalList.list.filter((item, index) => {
                if (symbolAddr != item.symbolAddr) {
                    return item
                }
            })
            let listData0 = Object.assign({}, state.marketOptionalList)
            listData0.list = list0
            listData0.totalSize =
                listData0.totalSize > 1 ? listData0.totalSize - 1 : 0
            let list1 = state.marketAllList.list.map((item, index) => {
                if (symbolAddr == item.symbolAddr) {
                    item.isStar = payload.isStar ? false : true
                }
                return item
            })
            let listData1 = Object.assign({}, state.marketAllList)
            listData1.list = list1
            return {
                ...state,
                marketOptionalList: listData0,
                optionalListLoading: false,
                marketAllList: listData1,
                allListLoading: false,
            }
        }
        case EDIT_MARKET_PAGE_ALL_LIST: {
            const { payload } = actions as MarketPageDataAction
              
            const isStar = payload.isStar
            const symbolAddr1 = payload.symbolAddr
            let list3: MarketPageDataList[] = []
            let size = state.marketOptionalList.totalSize
            if (isStar) {
                list3 = state.marketOptionalList.list.filter((item) => {
                    if (symbolAddr1 != item.symbolAddr) {
                        return true
                    }
                })
                size = size > 1 ? size - 1 : 0
            } else {
                let arr = state.marketOptionalList.list
                payload.isStar = true
                arr.unshift(payload)
                list3 = arr
                size += 1
            }
            let listData3 = Object.assign({}, state.marketOptionalList)
            listData3.list = list3
            listData3.totalSize = size
            let list4 = state.marketAllList.list.map((item, index) => {
                if (symbolAddr1 == item.symbolAddr) {
                    item.isStar = isStar ? false : true
                }
                return item
            })
            let listData4 = Object.assign({}, state.marketAllList)
            listData4.list = list4
            return {
                ...state,
                marketOptionalList: listData3,
                optionalListLoading: false,
                marketAllList: listData4,
                allListLoading: false,
            }
        }
        case MARKET_PAGE_OPTIONAL_LIST_REFRESH_SUCCESS: {
            const { payload } = actions as MarketPageDataListAction
            return {
                ...state,
                marketOptionalList:
                    payload.data.totalSize == 0
                        ? {
                            list: [],
                            endDate: '',
                            startDate: '',
                            totalSize: 0,
                        }
                        : {
                            list: payload.data.list,
                            totalSize: payload.data.totalSize,
                            endDate: '',
                            startDate: '',
                        },
                optionalListLoading: false,
            }
        }
        case MARKET_PAGE_ALL_LIST_REFRESH_SUCCESS: {
            const { payload } = actions as MarketPageDataListAction
            return {
                ...state,
                marketAllList:
                    payload.data.totalSize == 0
                        ? {
                            list: [],
                            endDate: '',
                            startDate: '',
                            totalSize: 0,
                        }
                        : payload.data,
                allListLoading: false,
            }
        }
        case MARKET_PAGE_OPTIONAL_LIST_FAIL:
        case MARKET_PAGE_ALL_LIST_FAIL:
        case MARKET_PAGE_OPTIONAL_LIST_REFRESH_FAIL:
        case MARKET_PAGE_ALL_LIST_REFRESH_FAIL:
        case MARKET_PAGE_DETAIL_FAIL: {
            const { payload } = actions as MarketPageErrorAction
            return {
                ...state,
                e: payload,
                optionalListLoading: false,
                allListLoading: false,
            }
        }
        default:
            return state
    }
}

export default reducer
