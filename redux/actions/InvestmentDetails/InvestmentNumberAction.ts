import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { InvestmentNumberParams, InvestmentNumberItem } from 'redux/types/InvestmentNumberTypes'
import ApiClient from 'utils/ApiClient'

export const INVESTMENT_DETAILS_NUMBER_LOADING = 'investment_details_number_loading'
export const INVESTMENT_DETAILS_NUMBER_SUCCEE = 'investment_details_number_success'
export const INVESTMENT_DETAILS_NUMBER_FAIL = 'investment_details_number_fail'

// loading
export const investmentNumberLoading = (data: boolean) => ({
    type: INVESTMENT_DETAILS_NUMBER_LOADING,
    payload: data,
})

export const getInvestmentNumberList = (params: InvestmentNumberParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(investmentNumberLoading(true))
    try {    
        const apiClient = new ApiClient<InvestmentNumberItem[]>()
        const data = await apiClient.post(`/addr/trend/hold/amount/cost`, { data: params })
        dispatch(getInvestmentNumberSuccess(data))
    } catch (e) {
        dispatch(getInvestmentNumberFail(e as unknown as Error))
    }
}

export const getInvestmentNumberSuccess = (data: Response<InvestmentNumberItem[]>) => ({
    type: INVESTMENT_DETAILS_NUMBER_SUCCEE,
    payload: data,
})

export const getInvestmentNumberFail = (e: Error) => ({
    type: INVESTMENT_DETAILS_NUMBER_FAIL,
    payload: e,
})