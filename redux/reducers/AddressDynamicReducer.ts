import {
    ADDR_LIST_LOADING,
    ADDR_LIST_NOMORE,
    SET_SEARCH_INFO,
    GET_ADDR_SYMBOL_LIST_SUCCESS,
    GET_ADDR_SYMBOL_LIST_FAIL,
    GET_ADDR_TRADE_LIST_SUCCESS,
    GET_ADDR_TRADE_LIST_FAIL,
    GET_ADDR_TRANSFER_LIST_SUCCESS,
    GET_ADDR_TRANSFER_LIST_FAIL,
    GET_ADDR_LP_LIST_SUCCESS,
    GET_ADDR_LP_LIST_FAIL,
} from '../actions/AddressDynamicAction'
import {
    AddressDynamicState,
    AddressDynamicActions,
    AddrListSimpleAction,
    SetSearchInfoAction,
    AddrListErrorAction,
    GetAddrSymbolListSuccessAction,
    GetAddrTradeListSuccessAction,
    GetAddrTransferListSuccessAction,
    GetAddrLpListSuccessAction,
} from '../types/AddressDynamicTypes'

const initialState: AddressDynamicState = {
    searchInfo: null,
    symbolList: [],
    tradeList: {
        endDate: '',
        startDate: '',
        totalSize: 0,
        list: [],
    },
    transferList: {
        endDate: '',
        startDate: '',
        totalSize: 0,
        list: [],
    },
    lpList: {
        endDate: '',
        startDate: '',
        totalSize: 0,
        list: [],
    },
    loading: true,
    e: null,
    noMore: false,
}

const reducer = (state = initialState, actions: AddressDynamicActions) => {
    const { type } = actions
    switch (type) {
        case ADDR_LIST_LOADING: {
            const { payload } = actions as AddrListSimpleAction
            return {
                ...state,
                loading: payload,
            }
        }
        case ADDR_LIST_NOMORE: {
            const { payload } = actions as AddrListSimpleAction
            return {
                ...state,
                noMore: payload,
                loading: false,
            }
        }
        case SET_SEARCH_INFO: {
            const { payload } = actions as SetSearchInfoAction
            return {
                ...state,
                searchInfo: payload,
            }
        }
        case GET_ADDR_SYMBOL_LIST_SUCCESS: {
            const { payload } = actions as GetAddrSymbolListSuccessAction
            return {
                ...state,
                symbolList: payload.data,
            }
        }
        case GET_ADDR_TRADE_LIST_SUCCESS: {
            const { payload } = actions as GetAddrTradeListSuccessAction
            return {
                ...state,
                tradeList: payload.data,
                loading: false,
                noMore: false,
            }
        }
        case GET_ADDR_TRANSFER_LIST_SUCCESS: {
            const { payload } = actions as GetAddrTransferListSuccessAction
            return {
                ...state,
                transferList: payload.data,
                loading: false,
                noMore: false,
            }
        }
        case GET_ADDR_LP_LIST_SUCCESS: {
            const { payload } = actions as GetAddrLpListSuccessAction
            return {
                ...state,
                lpList: payload.data,
                loading: false,
                noMore: false,
            }
        }
        case GET_ADDR_TRADE_LIST_FAIL:
        case GET_ADDR_TRANSFER_LIST_FAIL:
        case GET_ADDR_LP_LIST_FAIL:
        case GET_ADDR_SYMBOL_LIST_FAIL: {
            const { payload } = actions as AddrListErrorAction
            return {
                ...state,
                e: payload,
                loading: false,
                noMore: false,
            }
        }
        default:
            return state
    }
}

export default reducer
