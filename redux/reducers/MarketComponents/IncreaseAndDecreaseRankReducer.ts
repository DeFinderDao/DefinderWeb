import { IncreaseRankListSuccessAction, ChangeLoadingAction, IncreaseAndDecreaseRankActions, IncreaseAndDecreaseRankState, MarketErrorAction } from 'redux/types/IncreaseAndDecreaseRankTypes'
import {
    INCREASE_RANK_LIST_LOADING,
    DECREASE_RANK_LIST_LOADING,
    MARKET_DETAIL_INCREASEEANK_LIST_NOMORE,
    MARKET_DETAIL_DECREASEEANK_LIST_NOMORE,
    GET_INCREASE_RANK_LIST_SUCCESS,
    GET_INCREASE_RANK_LIST_FAIL,
    GET_DECREASE_RANK_LIST_SUCCESS,
    GET_DECREASE_RANK_LIST_FAIL,
} from '../../actions/MarketComponents/IncreaseAndDecreaseRankAction'

const initialState: IncreaseAndDecreaseRankState = {
    increaseRankListLoading: true,
    decreaseRankListLoading: true,
    increaseRankData: null,
    decreaseRankData: null,
    noMore: false,
    e: null,
}

const reducer = (state = initialState, action: IncreaseAndDecreaseRankActions) => {
    const { type } = action;
    switch (type) {
        case INCREASE_RANK_LIST_LOADING: {
            const { payload } = action as ChangeLoadingAction;
            return {
                ...state,
                increaseRankListLoading: payload,
            }
        }
        case DECREASE_RANK_LIST_LOADING: {
            const { payload } = action as ChangeLoadingAction;
            return {
                ...state,
                decreaseRankListLoading: payload,
            }
        }
        case MARKET_DETAIL_INCREASEEANK_LIST_NOMORE: {
            const { payload } = action as ChangeLoadingAction;
            return {
                ...state,
                noMore: payload,
                increaseRankListLoading: false,
            }
        }
        case MARKET_DETAIL_DECREASEEANK_LIST_NOMORE: {
            const { payload } = action as ChangeLoadingAction;
            return {
                ...state,
                noMore: payload,
                decreaseRankListLoading: false,
            }
        }
        case GET_INCREASE_RANK_LIST_SUCCESS: {
            const { payload } = action as IncreaseRankListSuccessAction;
            return {
                ...state,
                increaseRankData: payload.data,
                increaseRankListLoading: false,
                noMore: false,
            }
        }
        case GET_DECREASE_RANK_LIST_SUCCESS: {
            const { payload } = action as IncreaseRankListSuccessAction;
            return {
                ...state,
                decreaseRankData: payload.data,
                decreaseRankListLoading: false,
                noMore: false,
            }
        }
        case GET_INCREASE_RANK_LIST_FAIL: {
            const { payload } = action as MarketErrorAction;
            return {
                ...state,
                e: payload,
                increaseRankListLoading: false,
                noMore: false,
            }
        }
        case GET_DECREASE_RANK_LIST_FAIL: {
            const { payload } = action as MarketErrorAction;
            return {
                ...state,
                e: payload,
                decreaseRankListLoading: false,
                noMore: false,
            }
        }
        default:
            return state
    }
}

export default reducer
