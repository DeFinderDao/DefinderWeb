import {
    USER_LOGINOUT_SUCCESS,
    GET_SYMBOL_LIST_SUCCESS,
    COMBINATION_FOLLOW_LOADING,
    COMBINATION_RECOMMEND_LOADING,
    GET_COMBINATION_FOLLOW_LIST_SUCCESS,
    GET_COMBINATION_FOLLOW_LIST_FAIL,
    GET_COMBINATION_RECOMMEND_LIST_SUCCESS,
    GET_COMBINATION_RECOMMEND_LIST_FAIL,
    SET_RECOMMEND_LIST,
} from '../actions/AddressCombinationAction'
import {
    AddressCombinationState,
    AddressCombinationActions,
    CombinationSimpleAction,
    CombinationErrorAction,
    GetCombinationSymbolListSuccessAction,
    SetCombinationListSuccessAction,
    GetCombinationFollowListSuccessAction,
    GetCombinationRecommendListSuccessAction,
} from '../types/AddressCombinationTypes'

const initialState: AddressCombinationState = {
    warningFollowLoading: true,
    warningRecommendLoading: true,
    followData: {
        endDate: '',
        startDate: '',
        totalSize: -1,
        list: [],
    },
    recommendData: {
        endDate: '',
        startDate: '',
        totalSize: 0,
        list: [],
    },
    symbolList: [],
    e: null,
}

const reducer = (state = initialState, actions: AddressCombinationActions) => {
    const { type } = actions
    switch (type) {
        case USER_LOGINOUT_SUCCESS:
            return {
                ...state,
                warningFollowLoading: false,
                followData: {
                    endDate: '',
                    startDate: '',
                    totalSize: 0,
                    list: [],
                },
                symbolList: [],
                e: null,
            }
        case GET_SYMBOL_LIST_SUCCESS: {
            const { payload } = actions as GetCombinationSymbolListSuccessAction
            return {
                ...state,
                symbolList: payload.data,
            }
        }
        case COMBINATION_FOLLOW_LOADING: {
            const { payload } = actions as CombinationSimpleAction
            return {
                ...state,
                warningFollowLoading: payload,
            }
        }
        case COMBINATION_RECOMMEND_LOADING: {
            const { payload } = actions as CombinationSimpleAction
            return {
                ...state,
                warningRecommendLoading: payload,
            }
        }
        case SET_RECOMMEND_LIST: {
            const { payload } = actions as SetCombinationListSuccessAction
            const ids = payload.ids
            let list = state.recommendData.list.map((item, index) => {
                if (ids.includes(item.id)) {
                    item.isFollow = payload.isFollow
                }
                return item
            })
            let listData = state.recommendData
            listData.list = list
            return {
                ...state,
                recommendData: listData,
                warningRecommendLoading: false,
            }
        }
        case GET_COMBINATION_FOLLOW_LIST_SUCCESS: {
            const { payload } = actions as GetCombinationFollowListSuccessAction
            return {
                ...state,
                followData: payload.data,
                warningFollowLoading: false,
            }
        }
        case GET_COMBINATION_RECOMMEND_LIST_SUCCESS: {
            const { payload } = actions as GetCombinationRecommendListSuccessAction
            return {
                ...state,
                recommendData: payload.data,
                warningRecommendLoading: false,
            }
        }
        case GET_COMBINATION_FOLLOW_LIST_FAIL:
        case GET_COMBINATION_RECOMMEND_LIST_FAIL: {
            const { payload } = actions as CombinationErrorAction
            return {
                ...state,
                e: payload,
                warningFollowLoading: false,
                warningRecommendLoading: false,
            }
        }
        default:
            return state
    }
}

export default reducer
