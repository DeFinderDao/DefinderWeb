import {
    USER_LOGINOUT_SUCCESS,
    NFT_ANALYSE_OPTIONAL_LIST_LOADING,
    NFT_ANALYSE_ALL_LIST_LOADING,
    NFT_ANALYSE_PAGINATION_OPTIONAL_INFO,
    NFT_ANALYSE_PAGINATION_ALL_INFO,
    NFT_ANALYSE_OPTIONAL_LIST_SUCCESS,
    NFT_ANALYSE_OPTIONAL_LIST_FAIL,
    NFT_ANALYSE_ALL_LIST_SUCCESS,
    NFT_ANALYSE_ALL_LIST_FAIL,
    EDIT_NFT_ANALYSE_ALL_LIST,
    EDIT_NFT_ANALYSE_OPTIONAL_LIST,
    NFT_ANALYSE_DETAIL_SUCCESS,
    NFT_ANALYSE_DETAIL_FAIL,
    NFT_ANALYSE_FILTER_FILLED,
    NFT_ANALYSE_OPTIONAL_LIST_REFRESH_SUCCESS,
    NFT_ANALYSE_OPTIONAL_LIST_REFRESH_FAIL,
    NFT_ANALYSE_ALL_LIST_REFRESH_SUCCESS,
    NFT_ANALYSE_ALL_LIST_REFRESH_FAIL,
    NFT_ANALYSE_MENU_TYPE
} from 'redux/actions/NFTAnalyseAction'
import {
    NFTAnalyseState,
    NFTAnalyseActions,
    NFTAnalyseSimpleAction,
    NFTAnalyseErrorAction,
    NFTAnalyseDataAction,
    NFTAnalysePaginationInfo,
    NFTAnalyseDataListAction,
    NFTAnalyseDataList,
    GetMarketDetailSuccessAction,
    NFTAnalyseFilterFilled,
    NFTAnalyseMenuType
} from 'redux/types/NFTAnalyseTypes'

const initialState: NFTAnalyseState = {
    menuType: '',
    optionalListLoading: true,
    allListLoading: true,
    nftOptionalList: {
        list: [],
        endDate: '',
        startDate: '',
        totalSize: 0,
    },
    nftAllList: {
        list: [],
        endDate: '',
        startDate: '',
        totalSize: 0,
    },
    paginationOptionalInfo: {
        pageNo: 1,
        pageSize: 20,
        sortFiled: '',
        sort: '',
    },
    paginationAllInfo: {
        pageNo: 1,
        pageSize: 20,
        sortFiled: '',
        sort: '',
    },
    filterFilled: {
        minMarketValue: null,
        minTradingVolume24H: null,
        minTradingVolume7d: null,
        minHoldAddressCount: null,
    },
    nftDetail: {},
    e: null,
}

const reducer = (state = initialState, actions: NFTAnalyseActions) => {
    const { type } = actions
    switch (type) {
        case NFT_ANALYSE_MENU_TYPE: {
            const { payload } = actions as NFTAnalyseMenuType
            return {
                ...state,
                menuType: payload,
            }
        }
        case NFT_ANALYSE_DETAIL_SUCCESS: {
            const { payload } = actions as GetMarketDetailSuccessAction;
            return {
                ...state,
                nftDetail: payload
            }
        }
        case USER_LOGINOUT_SUCCESS:
            return {
                ...state,
                optionalListLoading: false,
                nftOptionalList: {
                    list: [],
                    endDate: '',
                    startDate: '',
                    totalSize: 0,
                },
                paginationOptionalInfo: {
                    pageNo: 1,
                    pageSize: 20,
                    sortFiled: '',
                    sort: '',
                },
                e: null,
            }
        case NFT_ANALYSE_OPTIONAL_LIST_LOADING: {
            const { payload } = actions as NFTAnalyseSimpleAction
            return {
                ...state,
                optionalListLoading: payload,
            }
        }
        case NFT_ANALYSE_ALL_LIST_LOADING: {
            const { payload } = actions as NFTAnalyseSimpleAction
            return {
                ...state,
                allListLoading: payload,
            }
        }
        case NFT_ANALYSE_OPTIONAL_LIST_SUCCESS: {
            const { payload } = actions as NFTAnalyseDataListAction
            const ids = state.nftOptionalList.list.map((item, index) => {
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
            state.nftOptionalList = {
                list: state.nftOptionalList.list.concat(newList || []),
                totalSize: payload.data.totalSize,
                endDate: '',
                startDate: '',
            }
            return {
                ...state,
                optionalListLoading: false,
            }
        }
        case NFT_ANALYSE_ALL_LIST_SUCCESS: {
            const { payload } = actions as NFTAnalyseDataListAction
            return {
                ...state,
                nftAllList: {
                    list: state.nftAllList.list.concat(
                        payload.data.list || []
                    ),
                    totalSize: payload.data.totalSize,
                    endDate: '',
                    startDate: '',
                },
                allListLoading: false,
            }
        }
        case NFT_ANALYSE_PAGINATION_OPTIONAL_INFO: {
            const { payload } = actions as NFTAnalysePaginationInfo
            return {
                ...state,
                paginationOptionalInfo: payload,
            }
        }
        case NFT_ANALYSE_PAGINATION_ALL_INFO: {
            const { payload } = actions as NFTAnalysePaginationInfo
            return {
                ...state,
                paginationAllInfo: payload,
            }
        }
        case NFT_ANALYSE_FILTER_FILLED: {
            const { payload } = actions as NFTAnalyseFilterFilled
            return {
                ...state,
                filterFilled: payload,
            }
        }
        case EDIT_NFT_ANALYSE_OPTIONAL_LIST: {
            const { payload } = actions as NFTAnalyseDataAction
              
            const symbolAddress = payload.symbolAddress
            let list0 = state.nftOptionalList.list.filter((item, index) => {
                if (symbolAddress != item.symbolAddress) {
                    return item
                }
            })
            let listData0 = Object.assign({}, state.nftOptionalList)
            listData0.list = list0
            listData0.totalSize =
                listData0.totalSize > 1 ? listData0.totalSize - 1 : 0
            let list1 = state.nftAllList.list.map((item, index) => {
                if (symbolAddress == item.symbolAddress) {
                    item.isStar = payload.isStar ? false : true
                }
                return item
            })
            let listData1 = Object.assign({}, state.nftAllList)
            listData1.list = list1
            return {
                ...state,
                nftOptionalList: listData0,
                optionalListLoading: false,
                nftAllList: listData1,
                allListLoading: false,
            }
        }
        case EDIT_NFT_ANALYSE_ALL_LIST: {
            const { payload } = actions as NFTAnalyseDataAction
              
            const isStar = payload.isStar
            const symbolAddr1 = payload.symbolAddress
            let list3: NFTAnalyseDataList[] = []
            let size = state.nftOptionalList.totalSize
            if (isStar) {
                list3 = state.nftOptionalList.list.filter((item) => {
                    if (symbolAddr1 != item.symbolAddress) {
                        return true
                    }
                })
                size = size > 1 ? size - 1 : 0
            } else {
                let arr = state.nftOptionalList.list
                payload.isStar = true
                arr.unshift(payload)
                list3 = arr
                size += 1
            }
            let listData3 = Object.assign({}, state.nftOptionalList)
            listData3.list = list3
            listData3.totalSize = size
            let list4 = state.nftAllList.list.map((item, index) => {
                if (symbolAddr1 == item.symbolAddress) {
                    item.isStar = isStar ? false : true
                }
                return item
            })
            let listData4 = Object.assign({}, state.nftAllList)
            listData4.list = list4
            return {
                ...state,
                nftOptionalList: listData3,
                optionalListLoading: false,
                nftAllList: listData4,
                allListLoading: false,
            }
        }
        case NFT_ANALYSE_OPTIONAL_LIST_REFRESH_SUCCESS: {
            const { payload } = actions as NFTAnalyseDataListAction
            return {
                ...state,
                nftOptionalList:
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
        case NFT_ANALYSE_ALL_LIST_REFRESH_SUCCESS: {
            const { payload } = actions as NFTAnalyseDataListAction
            return {
                ...state,
                nftAllList:
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
        case NFT_ANALYSE_OPTIONAL_LIST_FAIL:
        case NFT_ANALYSE_OPTIONAL_LIST_REFRESH_FAIL: {
            const { payload } = actions as NFTAnalyseErrorAction
            return {
                ...state,
                e: payload,
                optionalListLoading: false,
            }
        }
        case NFT_ANALYSE_ALL_LIST_FAIL:
        case NFT_ANALYSE_ALL_LIST_REFRESH_FAIL: {
            const { payload } = actions as NFTAnalyseErrorAction
            return {
                ...state,
                e: payload,
                allListLoading: false,
            }
        }
        case NFT_ANALYSE_DETAIL_FAIL: {
            const { payload } = actions as NFTAnalyseErrorAction
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
