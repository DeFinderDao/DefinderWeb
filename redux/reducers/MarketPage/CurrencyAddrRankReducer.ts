import {
    CURRENCY_ADDR_RANK_LIST_LOADING,
    CURRENCY_ADDR_RANK_PIE_SUCCESS,
    CURRENCY_ADDR_RANK_PIE_FAIL,
    CURRENCY_ADDR_RANK_LIST_SUCCESS,
    CURRENCY_ADDR_RANK_LIST_FAIL,
    CURRENCY_ADDR_RANK_LIST_NOMORE,
} from 'redux/actions/MarketPage/CurrencyAddrRankAction'
import { Response } from 'redux/types'
import { AddrRankListResponse, AddrRankPieResponse, CurrencyAddrRankActions, CurrencyAddrRankState } from 'redux/types/CurrencyAddrRankTypes'

const initialState: CurrencyAddrRankState = {
    loading: true,
    currencyAddrRankPie: [],
    currencyAddrRankList: null,
    noMore: false,
    e: null,
}

const reducer = (state = initialState, { type, payload }: CurrencyAddrRankActions) => {
    switch (type) {
        case CURRENCY_ADDR_RANK_LIST_LOADING:
            return {
                ...state,
                loading: payload as boolean,
            }
        case CURRENCY_ADDR_RANK_PIE_SUCCESS:
            return {
                ...state,
                currencyAddrRankPie: (payload as Response<AddrRankPieResponse>).data.symbolList,
            }
        case CURRENCY_ADDR_RANK_LIST_SUCCESS:
            const data = (payload as Response<AddrRankListResponse>).data
            const flag = data.list.length <= (data.totalSize as number) ? true : false
            
            return {
                ...state,
                currencyAddrRankList: data,
                noMore: flag,
                loading: false,
            }
        case CURRENCY_ADDR_RANK_LIST_NOMORE:
            return {
                ...state,
                noMore: payload as boolean,
                loading: false,
            }
            break
        case CURRENCY_ADDR_RANK_PIE_FAIL:
        case CURRENCY_ADDR_RANK_LIST_FAIL:
            return {
                ...state,
                loading: false,
                e: payload as Error,
            }
            break
        default:
            return state
    }
}

export default reducer
