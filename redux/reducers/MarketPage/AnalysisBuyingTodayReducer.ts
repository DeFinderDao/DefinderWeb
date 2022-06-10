import {
    ANALYSIS_BUYING_TODAY_LIST_LOADING,
    ANALYSIS_BUYING_TODAY_LIST_SUCCESS,
    ANALYSIS_BUYING_TODAY_LIST_FAIL,
} from 'redux/actions/MarketPage/AnalysisBuyingTodayAction'
import { Response } from 'redux/types'
import { AnalysisBuyingTodayState, AnalysisBuyingTodayResponse, AnalysisBuyingTodayActions } from 'redux/types/AnalysisBuyingTodayTypes'

const initialState: AnalysisBuyingTodayState = {
    loading: true,
    analysisBuyingTodayList: {
        holdAssetList: []
    },
    e: null,
}

const reducer = (state = initialState, { type, payload }: AnalysisBuyingTodayActions) => {
    switch (type) {
        case ANALYSIS_BUYING_TODAY_LIST_LOADING:
            return {
                ...state,
                loading: payload as boolean,
            }
            break
        case ANALYSIS_BUYING_TODAY_LIST_SUCCESS:
            return {
                ...state,
                analysisBuyingTodayList: (payload as Response<AnalysisBuyingTodayResponse>).data,
                loading: false,
            }
            break
        case ANALYSIS_BUYING_TODAY_LIST_FAIL:
            return {
                ...state,
                loading: false,
                e: payload as Error,
            }
            break
        default:
            return state
    }
}

export default reducer
