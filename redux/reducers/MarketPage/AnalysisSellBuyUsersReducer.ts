import {
    ANALYSIS_SELLING_USERS_LIST_LOADING,
    ANALYSIS_SELLING_USERS_LIST_SUCCESS,
    ANALYSIS_SELLING_USERS_LIST_FAIL,
    ANALYSIS_BUYING_USERS_LIST_LOADING,
    ANALYSIS_BUYING_USERS_LIST_SUCCESS,
    ANALYSIS_BUYING_USERS_LIST_FAIL,
} from 'redux/actions/MarketPage/AnalysisSellBuyUsersAction'
import { Response } from 'redux/types'
import { AnalysisSellBuyUsersState, AnalysisSellBuyUsersResponse, AnalysisSellBuyUsersActions } from 'redux/types/AnalysisSellBuyUsersTypes'

const initialState: AnalysisSellBuyUsersState = {
    loadingSelling: true,
    analysisSellingUsersList: {
        holdSymbolList: [],
        holdAssetList: [],
        netPerson: 0,
        netAmount: 0,
    },
    loadingBuying: true,
    analysisBuyingUsersList: {
        holdSymbolList: [],
        holdAssetList: [],
        netPerson: 0,
        netAmount: 0,
    },
    e: null,
}

const reducer = (state = initialState, { type, payload }: AnalysisSellBuyUsersActions) => {
    switch (type) {
        case ANALYSIS_SELLING_USERS_LIST_LOADING:
            return {
                ...state,
                loadingSelling: payload as boolean,
            }
        case ANALYSIS_SELLING_USERS_LIST_SUCCESS:
            return {
                ...state,
                analysisSellingUsersList: (payload as Response<AnalysisSellBuyUsersResponse>).data,
                loadingSelling: false,
            }
        case ANALYSIS_BUYING_USERS_LIST_LOADING:
            return {
                ...state,
                loadingBuying: payload as boolean,
            }
        case ANALYSIS_BUYING_USERS_LIST_SUCCESS:
            return {
                ...state,
                analysisBuyingUsersList: (payload as Response<AnalysisSellBuyUsersResponse>).data,
                loadingBuying: false,
            }
        case ANALYSIS_SELLING_USERS_LIST_FAIL:
        case ANALYSIS_BUYING_USERS_LIST_FAIL:
            return {
                ...state,
                loadingSelling: false,
                loadingBuying: false,
                e: payload as Error,
            }
        default:
            return state
    }
}

export default reducer
