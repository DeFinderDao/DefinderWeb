import { LPRANK_PAGESIZE } from 'pages/market-detail-more/[...detail]';
import { BuyRankListSuccessAction, ChangeLoadingAction, ComparisonListSuccessAction, LPRankListSuccessAction, LPRankPieSuccessAction, MarketComponentsActions, MarketComponentsState, MarketErrorAction, NewAddressListSuccessAction, SetLpRankPageNoAction, SetRankListPageNoAction } from 'redux/types/MarketComponentsTypes'
import {
    COMPARISON_LOADING,
    NEW_ADDRESS_LIST_LOADING,
    BUY_RANK_LIST_LOADING,
    SELL_RANK_LIST_LOADING,
    LP_RANK_LIST_LOADING,
    LP_RANK_PIE_LOADING,
    MARKET_DETAIL_NEWADDR_LIST_NOMORE,
    MARKET_DETAIL_BUYEANK_LIST_NOMORE,
    MARKET_DETAIL_SELLEANK_LIST_NOMORE,
    MARKET_DETAIL_LPRANK_LIST_NOMORE,
    GET_COMPARISON_LIST_SUCCESS,
    GET_COMPARISON_LIST_FAIL,
    GET_NEW_ADDRESS_LIST_SUCCESS,
    GET_NEW_ADDRESS_LIST_FAIL,
    GET_BUY_RANK_LIST_SUCCESS,
    GET_BUY_RANK_LIST_FAIL,
    GET_SELL_RANK_LIST_SUCCESS,
    GET_SELL_RANK_LIST_FAIL,
    GET_LP_RANK_LIST_SUCCESS,
    GET_LP_RANK_LIST_FAIL,
    GET_LP_RANK_PIE_SUCCESS,
    GET_LP_RANK_PIE_FAIL,
    SET_RANK_LIST_PAGENO,
    SET_LP_RANK_LIST_PAGENO
} from '../../actions/MarketComponents/MarketComponentsAction'

const initialState: MarketComponentsState = {
    comparisonLoading: true,
    newAddrListLoading: true,
    buyRankListLoading: true,
    rankListPageNo: 1,
    sellRankListLoading: true,
    lpRankListLoading: true,
    lpRankPieLoading: true,
    comparisonData: null,
    newAddressData: null,
    buyRankData: null,
    lpRankPageNo: 1,
    LPRankData: null,
    LPRankPieData: null,
    sellRankData: null,
    noMore: false,
    e: null,
}

const reducer = (state = initialState, action: MarketComponentsActions) => {
    const { type } = action;
    switch (type) {
        case SET_RANK_LIST_PAGENO: {
            const {payload} = action as SetRankListPageNoAction;
            return {
                ...state,
                rankListPageNo: payload
            }
        }
        case COMPARISON_LOADING: {
            const { payload } = action as ChangeLoadingAction;
            return {
                ...state,
                comparisonLoading: payload,
            }
        }
        case NEW_ADDRESS_LIST_LOADING: {
            const { payload } = action as ChangeLoadingAction;
            return {
                ...state,
                newAddrListLoading: payload,
            }
        }
        case BUY_RANK_LIST_LOADING: {
            const { payload } = action as ChangeLoadingAction;
            return {
                ...state,
                buyRankListLoading: payload,
            }
        }
        case SELL_RANK_LIST_LOADING: {
            const { payload } = action as ChangeLoadingAction;
            return {
                ...state,
                sellRankListLoading: payload,
            }
        }
        case LP_RANK_LIST_LOADING: {
            const { payload } = action as ChangeLoadingAction;
            return {
                ...state,
                lpRankListLoading: payload,
            }
        }
        case LP_RANK_PIE_LOADING: {
            const { payload } = action as ChangeLoadingAction;
            return {
                ...state,
                lpRankPieLoading: payload,
            }
        }
        case MARKET_DETAIL_NEWADDR_LIST_NOMORE: {
            const { payload } = action as ChangeLoadingAction;
            return {
                ...state,
                noMore: payload,
                newAddrListLoading: false,
            }
        }
        case MARKET_DETAIL_BUYEANK_LIST_NOMORE: {
            const { payload } = action as ChangeLoadingAction;
            return {
                ...state,
                noMore: payload,
                buyRankListLoading: false,
            }
        }
        case MARKET_DETAIL_SELLEANK_LIST_NOMORE: {
            const { payload } = action as ChangeLoadingAction;
            return {
                ...state,
                noMore: payload,
                sellRankListLoading: false,
            }
        }
        case MARKET_DETAIL_LPRANK_LIST_NOMORE: {
            const { payload } = action as ChangeLoadingAction;
            return {
                ...state,
                noMore: payload,
                lpRankListLoading: false,
            }
        }
        case GET_COMPARISON_LIST_SUCCESS: {
            const { payload } = action as ComparisonListSuccessAction;
            return {
                ...state,
                comparisonData: payload.data,
                comparisonLoading: false,
                noMore: false,
            }
        }
        case GET_NEW_ADDRESS_LIST_SUCCESS: {
            const { payload } = action as NewAddressListSuccessAction;
            return {
                ...state,
                newAddressData: payload.data,
                newAddrListLoading: false,
                noMore: false,
            }
        }
        case GET_BUY_RANK_LIST_SUCCESS: {
            const { payload } = action as BuyRankListSuccessAction;
            if(payload === null) {
                return {
                    ...state,
                    buyRankData: null,
                    buyRankListLoading: false,
                    noMore: false,
                }
            }
            const {rankListPageNo} = state;
              
            let buyRankData;
            if(state.buyRankData === null || rankListPageNo === 1) {
                buyRankData = payload.data;
            } else {
                buyRankData = {
                    ...state.buyRankData
                }
                buyRankData.list = buyRankData.list.concat(payload.data.list);
            }
            return {
                ...state,
                buyRankData,
                buyRankListLoading: false,
                noMore: false,
            }
        }
        case GET_SELL_RANK_LIST_SUCCESS: {
            const { payload } = action as BuyRankListSuccessAction;
            if(payload === null) {
                return {
                    ...state,
                    sellRankData: null,
                    sellRankListLoading: false,
                    noMore: false,
                }
            }
            const {rankListPageNo} = state;
            let sellRankData;
            if(state.sellRankData === null || rankListPageNo === 1) {
                sellRankData = payload.data;
            } else {
                sellRankData = {
                    ...state.sellRankData
                }
                sellRankData.list = sellRankData.list.concat(payload.data.list);
            }
            return {
                ...state,
                sellRankData,
                sellRankListLoading: false,
                noMore: false,
            }
        }
        case SET_LP_RANK_LIST_PAGENO: {
            const {payload} = action as SetLpRankPageNoAction;
            return {
                ...state,
                lpRankPageNo: payload
            }
        }
        case GET_LP_RANK_LIST_SUCCESS: {
            const { payload } = action as LPRankListSuccessAction;
            const {lpRankPageNo} = state;
            let LPRankData;
            let noMore = false;
            if(state.LPRankData === null || lpRankPageNo === 1) {
                LPRankData = payload.data;
            } else {
                LPRankData = {
                    ...state.LPRankData
                }
                LPRankData.list = LPRankData.list.concat(payload.data.list);
            }

              
            noMore = payload.data.list.length < LPRANK_PAGESIZE;
            return {
                ...state,
                LPRankData,
                lpRankListLoading: false,
                noMore
            }
        }
        case GET_LP_RANK_PIE_SUCCESS: {
            const { payload } = action as LPRankPieSuccessAction;
            return {
                ...state,
                LPRankPieData: payload.data,
                lpRankPieLoading: false,
            }
        }
        case GET_COMPARISON_LIST_FAIL: {
            const { payload } = action as MarketErrorAction;
            return {
                ...state,
                e: payload,
                comparisonLoading: false,
                noMore: false,
            }
        }
        case GET_NEW_ADDRESS_LIST_FAIL: {
            const { payload } = action as MarketErrorAction;
            return {
                ...state,
                e: payload,
                newAddrListLoading: false,
                noMore: false,
            }
        }
        case GET_BUY_RANK_LIST_FAIL: {
            const { payload } = action as MarketErrorAction;
            return {
                ...state,
                e: payload,
                buyRankListLoading: false,
                noMore: false,
            }
        }
        case GET_SELL_RANK_LIST_FAIL: {
            const { payload } = action as MarketErrorAction;
            return {
                ...state,
                e: payload,
                sellRankListLoading: false,
                noMore: false,
            }
        }
        case GET_LP_RANK_LIST_FAIL: {
            const { payload } = action as MarketErrorAction;
            return {
                ...state,
                e: payload,
                lpRankListLoading: false,
                noMore: false,
            }
        }
        case GET_LP_RANK_PIE_FAIL: {
            const { payload } = action as MarketErrorAction;
            return {
                ...state,
                e: payload,
                lpRankPieLoading: false,
            }
        }
        default:
            return state
    }
}

export default reducer
