import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { PositionIncomeParams, PositionIncomeItem } from 'redux/types/PositionIncomeTypes'
import ApiClient from 'utils/ApiClient'

export const INVESTMENT_DETAILS_POSITION_INCOME_LOADING= 'investment_details_position_income_loading'
export const INVESTMENT_DETAILS_POSITION_INCOME_SUCCEE = 'investment_details_position_income_success'
export const INVESTMENT_DETAILS_POSITION_INCOME_FAIL = 'investment_details_position_income_fail'

// loading
export const positionIncomeLoading = (data: boolean) => ({
    type: INVESTMENT_DETAILS_POSITION_INCOME_LOADING,
    payload: data,
})
export const getPositionIncomeList = (params: PositionIncomeParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(positionIncomeLoading(true))
    try {
        const apiClient = new ApiClient<PositionIncomeItem[]>()
        const data = await apiClient.post(`/addr/trend/hold/profit`, { data: params })
        dispatch(getPositionIncomeSuccess(data))
    } catch (e) {
        dispatch(getPositionIncomeFail(e as unknown as Error))
    }
}

export const getPositionIncomeSuccess = (data: Response<PositionIncomeItem[]>) => ({
    type: INVESTMENT_DETAILS_POSITION_INCOME_SUCCEE,
    payload: data,
})

export const getPositionIncomeFail = (e: Error) => ({
    type: INVESTMENT_DETAILS_POSITION_INCOME_FAIL,
    payload: e,
})