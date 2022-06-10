import ApiClient from 'utils/ApiClient'
import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { AnalysisBuyingTodayState, AnalysisBuyingTodayParams, AnalysisBuyingTodayResponse, AnalysisBuyingTodayActions } from 'redux/types/AnalysisBuyingTodayTypes'

// redux actio
// loading
export const ANALYSIS_BUYING_TODAY_LIST_LOADING =
    'analysis_buying_today_list_loading'

export const ANALYSIS_BUYING_TODAY_LIST_SUCCESS =
    'analysis_buying_today_list_success'
export const ANALYSIS_BUYING_TODAY_LIST_FAIL = 'analysis_buying_today_list_fail'

// loading
export const currencyAnalysisBuyingTodayLoading = (data: boolean) => ({
    type: ANALYSIS_BUYING_TODAY_LIST_LOADING,
    payload: data,
})


export const getAnalysisBuyingToday = (params: AnalysisBuyingTodayParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(currencyAnalysisBuyingTodayLoading(true))
    try {
        const apiClient = new ApiClient<AnalysisBuyingTodayResponse>()
        const data = await apiClient.post(`/market/netBuy/analysis/in/today`, { data: params })
        dispatch(getAnalysisBuyingTodaySuccess(data))
    } catch (e) {
        dispatch(getAnalysisBuyingTodayFail(e))
    }
}

export const getAnalysisBuyingTodaySuccess = (data: Response<AnalysisBuyingTodayResponse>) => ({
    type: ANALYSIS_BUYING_TODAY_LIST_SUCCESS,
    payload: data,
})

export const getAnalysisBuyingTodayFail = (e: Error) => ({
    type: ANALYSIS_BUYING_TODAY_LIST_FAIL,
    payload: e,
})
