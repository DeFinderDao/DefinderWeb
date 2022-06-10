import {
    INVESTMENT_LP_HISTORY_SUCCEE,
    INVESTMENT_LP_HISTORY_FAIL,
    INVESTMENT_LP_HISTORY_LOADING,
    INVESTMENT_LP_HISTORY_TOTALSIZE
} from 'redux/actions/InvestmentDetails/InvestmentLpHistoryAction'
import { Response } from 'redux/types'
import { InvestmentLpHistoryState, InvestmentLpHistoryResponse, InvestmentLpHistoryActions } from 'redux/types/InvestmentLpHistoryTypes'

const initialState: InvestmentLpHistoryState = {
    loadingLp: false,
    investmentLpHistoryList: {
        list: [],
        totalSize: 0,
    },
    lpListTotalsize: 0,
    e: null,
}

const reducer = (state = initialState, { type, payload }: InvestmentLpHistoryActions) => {
    switch (type) {
        case INVESTMENT_LP_HISTORY_LOADING:
            return {
                ...state,
                loadingLp: payload as boolean,
            }
        case INVESTMENT_LP_HISTORY_TOTALSIZE:
            return {
                ...state,
                lpListTotalsize: payload as number,
            }
        case INVESTMENT_LP_HISTORY_SUCCEE:
            return {
                ...state,
                investmentLpHistoryList: (payload as Response<InvestmentLpHistoryResponse>).data,
                loadingLp: false,
            }
        case INVESTMENT_LP_HISTORY_FAIL:
            return {
                ...state,
                loadingLp: false,
                e: payload as Error,
            }
        default:
            return state
    }
}

export default reducer
