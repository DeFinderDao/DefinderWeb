import {
    ANALYSIS_INCREASE_LIST_LOADING,
    ANALYSIS_INCREASE_LIST_SUCCESS,
    ANALYSIS_INCREASE_LIST_FAIL,
    ANALYSIS_DECREASE_LIST_LOADING,
    ANALYSIS_DECREASE_LIST_SUCCESS,
    ANALYSIS_DECREASE_LIST_FAIL,
} from 'redux/actions/MarketPage/IncreaseAndDecreaseAction'
import { Response } from 'redux/types'
import { IncreaseAndDecreaseState, IncreaseAndDecreaseResponse, IncreaseAndDecreaseActions } from 'redux/types/IncreaseAndDecreaseTypes'

const initialState: IncreaseAndDecreaseState = {
    loadingIncrease: true,
    increaseUsersList: {
        holdSymbolList: [],
        holdAssetList: [],
        netPerson: 0,
        netAmount: 0,
    },
    loadingDecrease: true,
    decreaseUsersList: {
        holdSymbolList: [],
        holdAssetList: [],
        netPerson: 0,
        netAmount: 0,
    },
    e: null,
}

const reducer = (state = initialState, { type, payload }: IncreaseAndDecreaseActions) => {
    switch (type) {
        case ANALYSIS_INCREASE_LIST_LOADING:
            return {
                ...state,
                loadingIncrease: payload as boolean,
            }
        case ANALYSIS_INCREASE_LIST_SUCCESS:
            return {
                ...state,
                increaseUsersList: (payload as Response<IncreaseAndDecreaseResponse>).data,
                loadingIncrease: false,
            }
        case ANALYSIS_DECREASE_LIST_LOADING:
            return {
                ...state,
                loadingDecrease: payload as boolean,
            }
        case ANALYSIS_DECREASE_LIST_SUCCESS:
            return {
                ...state,
                decreaseUsersList: (payload as Response<IncreaseAndDecreaseResponse>).data,
                loadingDecrease: false,
            }
        case ANALYSIS_INCREASE_LIST_FAIL:
        case ANALYSIS_DECREASE_LIST_FAIL:
            return {
                ...state,
                loadingIncrease: false,
                loadingDecrease: false,
                e: payload as Error,
            }
        default:
            return state
    }
}

export default reducer
