import {
    INVESTMENT_SWAP_HISTORY_SUCCEE,
    INVESTMENT_SWAP_HISTORY_FAIL,
    INVESTMENT_SWAP_HISTORY_LOADING,
    INVESTMENT_SWAP_HISTORY_TOTALSIZE
} from 'redux/actions/InvestmentDetails/InvestmentSwapHistoryAction'
import { Response } from 'redux/types'
import { InvestmentSwapHistoryState, InvestmentSwapHistoryResponse, InvestmentSwapHistoryActions } from 'redux/types/InvestmentSwapHistoryTypes'

const initialState: InvestmentSwapHistoryState = {
    loadingSwap: false,
    investmentSwapHistoryList: {
        list: [],
        totalSize: 0,
    },
    swapListTotalsize: 0,
    e: null,
}

const reducer = (state = initialState, { type, payload }: InvestmentSwapHistoryActions) => {
    switch (type) {
        case INVESTMENT_SWAP_HISTORY_LOADING:
            return {
                ...state,
                loadingSwap: payload as boolean,
            }
        case INVESTMENT_SWAP_HISTORY_TOTALSIZE:
            return {
                ...state,
                swapListTotalsize: payload as number,
            }
        case INVESTMENT_SWAP_HISTORY_SUCCEE:
            return {
                ...state,
                investmentSwapHistoryList: (payload as Response<InvestmentSwapHistoryResponse>).data,
                loadingSwap: false,
            }
        case INVESTMENT_SWAP_HISTORY_FAIL:
            return {
                ...state,
                loadingSwap: false,
                e: payload as Error,
            }
        default:
            return state
    }
}

export default reducer
