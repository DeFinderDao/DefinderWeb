import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { InvestmentPriceItem, InvestmentPriceParams } from 'redux/types/InvestmentPriceTypes'
import ApiClient from 'utils/ApiClient'

export const INVESTMENT_DETAILS_PRICE_LOADING = 'investment_details_price_loading'
export const INVESTMENT_DETAILS_PRICE_SUCCEE = 'investment_details_price_success'
export const INVESTMENT_DETAILS_PRICE_FAIL = 'investment_details_price_fail'

// loading
export const investmentPriceLoading = (data: boolean) => ({
    type: INVESTMENT_DETAILS_PRICE_LOADING,
    payload: data,
})

export const getInvestmentPriceList = (params: InvestmentPriceParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(investmentPriceLoading(true))
    try {
        const apiClient = new ApiClient<InvestmentPriceItem[]>()
        const data = await apiClient.post(`/addr/trend/price/hold`, { data: params })
        dispatch(getInvestmentPriceSuccess(data))
    } catch (e) {
        dispatch(getInvestmentPriceFail(e as unknown as Error))
    }
}

export const getInvestmentPriceSuccess = (data: Response<InvestmentPriceItem[]>) => ({
    type: INVESTMENT_DETAILS_PRICE_SUCCEE,
    payload: data,
})

export const getInvestmentPriceFail = (e: Error) => ({
    type: INVESTMENT_DETAILS_PRICE_FAIL,
    payload: e,
})