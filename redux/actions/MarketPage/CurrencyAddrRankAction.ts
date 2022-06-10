import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { AddrRankListParams, AddrRankListResponse, AddrRankPieResponse } from 'redux/types/CurrencyAddrRankTypes'
import ApiClient from 'utils/ApiClient'

export const CURRENCY_ADDR_RANK_LIST_LOADING = 'currency_addr_rank_list_loading'
export const CURRENCY_ADDR_RANK_LIST_NOMORE = 'currency_addr_rank_list_nomore'

export const CURRENCY_ADDR_RANK_PIE_SUCCESS = 'currency_addr_rank_pie_success'
export const CURRENCY_ADDR_RANK_PIE_FAIL = 'currency_addr_rank_pie_fail'

export const CURRENCY_ADDR_RANK_LIST_SUCCESS = 'currency_addr_rank_list_success'
export const CURRENCY_ADDR_RANK_LIST_FAIL = 'currency_addr_rank_list_fail'

// loading
export const currencyAddrListLoading = (data: boolean) => ({
    type: CURRENCY_ADDR_RANK_LIST_LOADING,
    payload: data,
})
// nomore
export const listNoMore = (data: boolean) => ({
    type: CURRENCY_ADDR_RANK_LIST_NOMORE,
    payload: data,
})


export const getCurrencyAddrRankPie = (params: { symbolAddr: string }): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const apiClient = new ApiClient<AddrRankPieResponse>()
        const data = await apiClient.get(
            `/market/hold/pie/chart?symbolAddr=${params.symbolAddr}`
        )
        dispatch(getCurrencyAddrRankPieSuccess(data))
    } catch (e) {
        dispatch(getCurrencyAddrRankPieFail((e as unknown as Error)))
    }
}

export const getCurrencyAddrRankPieSuccess = (data: Response<AddrRankPieResponse>) => ({
    type: CURRENCY_ADDR_RANK_PIE_SUCCESS,
    payload: data,
})

export const getCurrencyAddrRankPieFail = (e: Error) => ({
    type: CURRENCY_ADDR_RANK_PIE_FAIL,
    payload: e,
})

export const getCurrencyAddrRankList = (params: AddrRankListParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(currencyAddrListLoading(true))
    try {
        const apiClient = new ApiClient<AddrRankListResponse>()
        const data = await apiClient.post(
            `/market/hold/list`,
            { data: params }
        )
        data.data.list = data.data.list ? data.data.list : []
        if (
            (params.pageNo > 1 && data.data.list.length > 0) ||
            params.pageNo == 1
        ) {
            
            dispatch(getCurrencyAddrRankListSuccess(data))
            if (data.data.list.length < (params.pageSize as number)) {
                dispatch(listNoMore(true))
            }
        } else {
            
            dispatch(listNoMore(true))
        }
    } catch (e) {
        dispatch(getCurrencyAddrRankListFail((e as unknown as Error)))
    }
}

export const getCurrencyAddrRankListSuccess = (data: Response<AddrRankListResponse>) => ({
    type: CURRENCY_ADDR_RANK_LIST_SUCCESS,
    payload: data,
})

export const getCurrencyAddrRankListFail = (e: Error) => ({
    type: CURRENCY_ADDR_RANK_LIST_FAIL,
    payload: e,
})
