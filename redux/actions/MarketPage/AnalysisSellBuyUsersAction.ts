import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { AnalysisSellBuyUsersParams, AnalysisSellBuyUsersResponse } from 'redux/types/AnalysisSellBuyUsersTypes'
import ApiClient from 'utils/ApiClient'

// loading
export const ANALYSIS_SELLING_USERS_LIST_LOADING = 'analysis_selling_users_list_loading'

export const ANALYSIS_SELLING_USERS_LIST_SUCCESS = 'analysis_selling_users_list_success'
export const ANALYSIS_SELLING_USERS_LIST_FAIL = 'analysis_selling_users_list_fail'

export const ANALYSIS_BUYING_USERS_LIST_LOADING = 'analysis_buying_users_list_loading'

export const ANALYSIS_BUYING_USERS_LIST_SUCCESS = 'analysis_buying_users_list_success'
export const ANALYSIS_BUYING_USERS_LIST_FAIL = 'analysis_buying_users_list_fail'

// loading
export const currencyAnalysisSellingUsersLoading = (data: boolean) => ({
    type: ANALYSIS_SELLING_USERS_LIST_LOADING,
    payload: data,
})
export const currencyAnalysisBuyingUsersLoading = (data: boolean) => ({
    type: ANALYSIS_BUYING_USERS_LIST_LOADING,
    payload: data,
})

export const getAnalysisSellingUsers = (params: AnalysisSellBuyUsersParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(currencyAnalysisSellingUsersLoading(true))
    try {
        const apiClient = new ApiClient<AnalysisSellBuyUsersResponse>()
        const data = await apiClient.post(`/market/netBuy/analysis/out`, { data: params })
        dispatch(getAnalysisSellingUsersSuccess(data))
    } catch (e) {
        dispatch(getAnalysisSellingUsersFail((e as unknown as Error)))
    }
}

export const getAnalysisSellingUsersSuccess = (data: Response<AnalysisSellBuyUsersResponse>) => ({
    type: ANALYSIS_SELLING_USERS_LIST_SUCCESS,
    payload: data,
})

export const getAnalysisSellingUsersFail = (e: Error) => ({
    type: ANALYSIS_SELLING_USERS_LIST_FAIL,
    payload: e,
})


export const getAnalysisBuyingUsers = (params: AnalysisSellBuyUsersParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(currencyAnalysisSellingUsersLoading(true))
    try {
        const apiClient = new ApiClient<AnalysisSellBuyUsersResponse>()
        const data = await apiClient.post(`/market/netBuy/analysis/in`, { data: params })
        dispatch(getAnalysisBuyingUsersSuccess(data))
    } catch (e) {
        dispatch(getAnalysisBuyingUsersFail((e as unknown as Error)))
    }
}

export const getAnalysisBuyingUsersSuccess = (data: Response<AnalysisSellBuyUsersResponse>) => ({
    type: ANALYSIS_BUYING_USERS_LIST_SUCCESS,
    payload: data,
})

export const getAnalysisBuyingUsersFail = (e: Error) => ({
    type: ANALYSIS_BUYING_USERS_LIST_FAIL,
    payload: e,
})
