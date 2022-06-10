import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { AddrRankListParams, AddrRankListResponse, AddrRankPieResponse } from 'redux/types/SMAddrRankTypes'
import ApiClient from 'utils/ApiClient'



export const SM_ADDR_RANK_LIST_LOADING = 'sm_addr_rank_list_loading'
export const SM_ADDR_RANK_LIST_NOMORE = 'sm_addr_rank_list_nomore'

export const SM_ADDR_RANK_PIE_SUCCESS = 'sm_addr_rank_pie_success'
export const SM_ADDR_RANK_PIE_FAIL = 'sm_addr_rank_pie_fail'

export const SM_ADDR_RANK_LIST_SUCCESS = 'sm_addr_rank_list_success'
export const SM_ADDR_RANK_LIST_FAIL = 'sm_addr_rank_list_fail'


export const smAddrListLoading = (data: boolean) => ({
    type: SM_ADDR_RANK_LIST_LOADING,
    payload: data,
})

export const listNoMore = (data: boolean) => ({
    type: SM_ADDR_RANK_LIST_NOMORE,
    payload: data,
})


export const getSMAddrRankPie = (params: { symbolAddr: string }): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const apiClient = new ApiClient<AddrRankPieResponse>()
        const data = await apiClient.get(
            `/market/hold/pie/chart?symbolAddr=${params.symbolAddr}`
        )
        dispatch(getSMAddrRankPieSuccess(data))
    } catch (e) {
        dispatch(getSMAddrRankPieFail((e as unknown as Error)))
    }
}

export const getSMAddrRankPieSuccess = (data: Response<AddrRankPieResponse>) => ({
    type: SM_ADDR_RANK_PIE_SUCCESS,
    payload: data,
})

export const getSMAddrRankPieFail = (e: Error) => ({
    type: SM_ADDR_RANK_PIE_FAIL,
    payload: e,
})

export const getSMAddrRankList = (params: AddrRankListParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(smAddrListLoading(true))
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

            dispatch(getSMAddrRankListSuccess(data))
            if (data.data.list.length < (params.pageSize as number)) {
                dispatch(listNoMore(true))
            }
        } else {
            dispatch(listNoMore(true))
        }
    } catch (e) {
        dispatch(getSMAddrRankListFail((e as unknown as Error)))
    }
}

export const getSMAddrRankListSuccess = (data: Response<AddrRankListResponse>) => ({
    type: SM_ADDR_RANK_LIST_SUCCESS,
    payload: data,
})

export const getSMAddrRankListFail = (e: Error) => ({
    type: SM_ADDR_RANK_LIST_FAIL,
    payload: e,
})
