import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { IncreaseAndDecreaseParams, IncreaseAndDecreaseResponse } from 'redux/types/IncreaseAndDecreaseTypes'
import ApiClient from 'utils/ApiClient'


// loading
export const ANALYSIS_INCREASE_LIST_LOADING = 'analysis_increase_list_loading'

export const ANALYSIS_INCREASE_LIST_SUCCESS = 'analysis_increase_list_success'
export const ANALYSIS_INCREASE_LIST_FAIL = 'analysis_increase_list_fail'
// loading
export const ANALYSIS_DECREASE_LIST_LOADING = 'analysis_decrease_list_loading'

export const ANALYSIS_DECREASE_LIST_SUCCESS = 'analysis_decrease_list_success'
export const ANALYSIS_DECREASE_LIST_FAIL = 'analysis_decrease_list_fail'

// loading
export const currencyIncreaseLoading = (data: boolean) => ({
    type: ANALYSIS_INCREASE_LIST_LOADING,
    payload: data,
})
export const currencyDecreaseLoading = (data: boolean) => ({
    type: ANALYSIS_DECREASE_LIST_LOADING,
    payload: data,
})


export const getIncrease = (params: IncreaseAndDecreaseParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(currencyIncreaseLoading(true))
    try {
        const apiClient = new ApiClient<IncreaseAndDecreaseResponse>()
        const data = await apiClient.post(`/market/hold/analysis/increase`, { data: params })
        dispatch(getIncreaseSuccess(data))
    } catch (e) {
        dispatch(getIncreaseFail((e as unknown as Error)))
    }
}

export const getIncreaseSuccess = (data: Response<IncreaseAndDecreaseResponse>) => ({
    type: ANALYSIS_INCREASE_LIST_SUCCESS,
    payload: data,
})

export const getIncreaseFail = (e: Error) => ({
    type: ANALYSIS_INCREASE_LIST_FAIL,
    payload: e,
})


export const getDecrease = (params: IncreaseAndDecreaseParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(currencyIncreaseLoading(true))
    try {
        const apiClient = new ApiClient<IncreaseAndDecreaseResponse>()
        const data = await apiClient.post(`/market/hold/analysis/decrease`, { data: params })
        dispatch(getDecreaseSuccess(data))
    } catch (e) {
        dispatch(getDecreaseFail((e as unknown as Error)))
    }
}

export const getDecreaseSuccess = (data: Response<IncreaseAndDecreaseResponse>) => ({
    type: ANALYSIS_DECREASE_LIST_SUCCESS,
    payload: data,
})

export const getDecreaseFail = (e: Error) => ({
    type: ANALYSIS_DECREASE_LIST_FAIL,
    payload: e,
})
