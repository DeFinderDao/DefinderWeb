import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { InvestmentLpHistoryParams, InvestmentLpHistoryResponse } from 'redux/types/InvestmentLpHistoryTypes'
import ApiClient from 'utils/ApiClient'
import Global from 'utils/Global'

export const INVESTMENT_LP_HISTORY_SUCCEE = 'investment_lp_history_success'
export const INVESTMENT_LP_HISTORY_FAIL = 'investment_lp_history_fail'
// loading
export const INVESTMENT_LP_HISTORY_LOADING = 'investment_lp_history_loading'
// totalSize
export const INVESTMENT_LP_HISTORY_TOTALSIZE = 'investment_lp_history_totalsize'

// loading
export const historyLpListLoading = (data: boolean) => ({
    type: INVESTMENT_LP_HISTORY_LOADING,
    payload: data,
})
// totalSize
export const historyLpListTotalsize = (data: number) => ({
    type: INVESTMENT_LP_HISTORY_TOTALSIZE,
    payload: data,
})

export const getInvestmentLpHistoryList = (params: InvestmentLpHistoryParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(historyLpListLoading(true))
    try {
        const apiClient = new ApiClient<InvestmentLpHistoryResponse>()
        const data = await apiClient.post(`/addr/history/lp`, {
            data: {
                ...params,
                startTime: Global.getDayStart(params.startTime as number | null, 1000),
                endTime: Global.getDayEnd(params.endTime as number | null, 1000),
            }
        })
        if (params.pageNo == 1) {
            dispatch(historyLpListTotalsize(data.data.totalSize))
        }
        dispatch(getInvestmentLpHistorySuccess(data))
    } catch (e) {
        dispatch(getInvestmentLpHistoryFail(e as unknown as Error))
    }
}

export const getInvestmentLpHistorySuccess = (data: Response<InvestmentLpHistoryResponse>) => ({
    type: INVESTMENT_LP_HISTORY_SUCCEE,
    payload: data,
})

export const getInvestmentLpHistoryFail = (e: Error) => ({
    type: INVESTMENT_LP_HISTORY_FAIL,
    payload: e,
})