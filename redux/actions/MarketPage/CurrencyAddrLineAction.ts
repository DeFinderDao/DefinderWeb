import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { HoldMarketApiResponse } from 'redux/types/CurrencyAddrLineTypes'
import ApiClient from 'utils/ApiClient'
const apiClient = new ApiClient<HoldMarketApiResponse[]>()

// redux action 
export const CURRENCY_ADDR_LINE_LIST_LOADING = 'currency_addr_line_list_loading'
export const CURRENCY_ADDR_LINE_LIST_SUCCESS = 'currency_addr_line_list_success'
export const CURRENCY_ADDR_LINE_LIST_FAIL = 'currency_addr_line_list_fail'
// loading
export const currencyAddrLineLoading = (data: boolean) => ({
    type: CURRENCY_ADDR_LINE_LIST_LOADING,
    payload: data,
})

export const getCurrencyAddrLineList = (params: { symbolAddr: string, startTime: number | null, endTime: number | null }): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(currencyAddrLineLoading(true))
    try {
        const data = await apiClient.post(
            '/market/hold',
            {
                data: { ...params },
            }
        )
        dispatch(getCurrencyAddrLineListSuccess(data))
    } catch (e) {
        dispatch(getCurrencyAddrLineListFail((e as unknown as Error)))
    }
}

export const getCurrencyAddrLineListSuccess = (data: Response<HoldMarketApiResponse[]>) => ({
    type: CURRENCY_ADDR_LINE_LIST_SUCCESS,
    payload: data,
})

export const getCurrencyAddrLineListFail = (e: Error) => ({
    type: CURRENCY_ADDR_LINE_LIST_FAIL,
    payload: e,
})
