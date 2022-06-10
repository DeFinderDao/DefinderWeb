import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { InvestmentSwapHistoryParams, InvestmentSwapHistoryResponse } from 'redux/types/InvestmentSwapHistoryTypes'
import ApiClient from 'utils/ApiClient'
import Global from 'utils/Global'

export const INVESTMENT_SWAP_HISTORY_SUCCEE = 'investment_swap_history_success'
export const INVESTMENT_SWAP_HISTORY_FAIL = 'investment_swap_history_fail'
// loading
export const INVESTMENT_SWAP_HISTORY_LOADING = 'investment_swap_history_loading'
// totalSize
export const INVESTMENT_SWAP_HISTORY_TOTALSIZE = 'investment_swap_history_totalsize'

// loading
export const historySwapListLoading = (data: boolean) => ({
    type: INVESTMENT_SWAP_HISTORY_LOADING,
    payload: data,
})
// totalSize
export const historySwapListTotalsize = (data: number) => ({
    type: INVESTMENT_SWAP_HISTORY_TOTALSIZE,
    payload: data,
})

export const getInvestmentSwapHistoryList = (params: InvestmentSwapHistoryParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(historySwapListLoading(true))
    try {
        const apiClient = new ApiClient<InvestmentSwapHistoryResponse>()
        const data = await apiClient.post(`/addr/history/swap`, {
            data: {
                ...params,
                startTime: Global.getDayStart(params.startTime as number | null, 1000),
                endTime: Global.getDayEnd(params.endTime as number | null, 1000),
            }
        })
        if (params.pageNo == 1) {
            dispatch(historySwapListTotalsize(data.data.totalSize))
        }
        dispatch(getInvestmentSwapHistorySuccess(data))
    } catch (e) {
        dispatch(getInvestmentSwapHistoryFail(e as unknown as Error))
    }
}

export const getInvestmentSwapHistorySuccess = (data: Response<InvestmentSwapHistoryResponse>) => ({
    type: INVESTMENT_SWAP_HISTORY_SUCCEE,
    payload: data,
})

export const getInvestmentSwapHistoryFail = (e: Error) => ({
    type: INVESTMENT_SWAP_HISTORY_FAIL,
    payload: e,
})