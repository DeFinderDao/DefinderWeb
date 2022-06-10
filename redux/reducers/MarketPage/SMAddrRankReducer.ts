import {
    SM_ADDR_RANK_LIST_LOADING,
    SM_ADDR_RANK_PIE_SUCCESS,
    SM_ADDR_RANK_PIE_FAIL,
    SM_ADDR_RANK_LIST_SUCCESS,
    SM_ADDR_RANK_LIST_FAIL,
    SM_ADDR_RANK_LIST_NOMORE,
} from 'redux/actions/MarketPage/SMAddrRankAction'
import { Response } from 'redux/types'
import { AddrRankListResponse, AddrRankPieResponse, SMAddrRankActions, SMAddrRankState } from 'redux/types/SMAddrRankTypes'

const initialState: SMAddrRankState = {
    loading: true,
    smAddrRankPie: [],
    smAddrRankList: null,
    noMore: false,
    e: null,
}

const reducer = (state = initialState, { type, payload }: SMAddrRankActions) => {
    switch (type) {
        case SM_ADDR_RANK_LIST_LOADING:
            return {
                ...state,
                loading: payload as boolean,
            }
        case SM_ADDR_RANK_PIE_SUCCESS:
            return {
                ...state,
                smAddrRankPie: (payload as Response<AddrRankPieResponse>).data.symbolList,
            }
        case SM_ADDR_RANK_LIST_SUCCESS:
            const data = (payload as Response<AddrRankListResponse>).data
            const flag = data.list.length <= (data.totalSize as number) ? true : false
            
            return {
                ...state,
                smAddrRankList: data,
                noMore: flag,
                loading: false,
            }
        case SM_ADDR_RANK_LIST_NOMORE:
            return {
                ...state,
                noMore: payload as boolean,
                loading: false,
            }
            break
        case SM_ADDR_RANK_PIE_FAIL:
        case SM_ADDR_RANK_LIST_FAIL:
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
