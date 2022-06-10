import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { IncreaseRankListParams, IncreaseRankListResponse } from 'redux/types/IncreaseAndDecreaseRankTypes'
import ApiClient from 'utils/ApiClient'
const apiClient = new ApiClient()


export const INCREASE_RANK_LIST_LOADING = 'comparison_increase_rank_list_loading'

export const DECREASE_RANK_LIST_LOADING = 'comparison_decrease_rank_list_loading'
// nomore
export const MARKET_DETAIL_INCREASEEANK_LIST_NOMORE =
    'market_detail_increaserank_list_nomore'
export const MARKET_DETAIL_DECREASEEANK_LIST_NOMORE =
    'market_detail_decreaserank_list_nomore'

export const GET_INCREASE_RANK_LIST_SUCCESS = 'market_increase_rank_list_success'
export const GET_INCREASE_RANK_LIST_FAIL = 'market_increase_rank_list_fail'

export const GET_DECREASE_RANK_LIST_SUCCESS = 'market_decrease_rank_list_success'
export const GET_DECREASE_RANK_LIST_FAIL = 'market_decrease_rank_list_fail'
// loading
export const increaseRankListLoading = (data: boolean) => ({
    type: INCREASE_RANK_LIST_LOADING,
    payload: data,
})
export const decreaseRankListLoading = (data: boolean) => ({
    type: DECREASE_RANK_LIST_LOADING,
    payload: data,
})
export const increaseRankListNoMore = (data: boolean) => ({
    type: MARKET_DETAIL_INCREASEEANK_LIST_NOMORE,
    payload: data,
})
export const decreaseRankListNoMore = (data: boolean) => ({
    type: MARKET_DETAIL_DECREASEEANK_LIST_NOMORE,
    payload: data,
})


export const getIncreaseRankList = (params: IncreaseRankListParams) : ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(increaseRankListLoading(true))
    try {
        const response = await apiClient.post(`/market/hold/list/increase`, {
            data: params,
        })
        const data = response as unknown as Response<IncreaseRankListResponse>;
        if (
            (params.pageNo > 1 && data.data.list.length > 0) ||
            params.pageNo == 1
        ) {

            dispatch(getIncreaseRankListSuccess(data))
        } else {

            dispatch(increaseRankListNoMore(true))
        }
    } catch (e) {
        dispatch(getIncreaseRankListFail((e as unknown as Error)))
    }
}

export const getIncreaseRankListSuccess = (data: Response<IncreaseRankListResponse>) => ({
    type: GET_INCREASE_RANK_LIST_SUCCESS,
    payload: data,
})

export const getIncreaseRankListFail = (e: Error) => ({
    type: GET_INCREASE_RANK_LIST_FAIL,
    payload: e,
})


export const getDecreaseRankList = (params: IncreaseRankListParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(decreaseRankListLoading(true))
    try {
        const response = await apiClient.post(`/market/hold/list/decrease`, {
            data: params,
        })
        const data = response as unknown as Response<IncreaseRankListResponse>;
        if (
            (params.pageNo > 1 && data.data.list.length > 0) ||
            params.pageNo == 1
        ) {
 
            dispatch(getDecreaseRankListSuccess(data))
        } else {
 
            dispatch(decreaseRankListNoMore(true))
        }
    } catch (e) {
        dispatch(getDecreaseRankListFail((e as unknown as Error)))
    }
}

export const getDecreaseRankListSuccess = (data: Response<IncreaseRankListResponse>) => ({
    type: GET_DECREASE_RANK_LIST_SUCCESS,
    payload: data,
})

export const getDecreaseRankListFail = (e: Error) => ({
    type: GET_DECREASE_RANK_LIST_FAIL,
    payload: e,
})
