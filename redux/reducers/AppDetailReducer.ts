import {
    GET_APPLICATION_DETAIL_INFO_SUCCESS,
    GET_APPLICATION_DETAIL_INFO_FAIL,
      
      
    GET_APPLICATION_TRANSFERCHANGE_SUCCESS,
    GET_APPLICATION_TRANSFERCHANGE_FAIL,
    GET_APPLICATION_TRADECHANGE_SUCCESS,
    GET_APPLICATION_TRADECHANGE_FAIL,
} from '../actions/AppDetailAction'
import {
    AppDetailseState,
    AppDetailseActions,
    AppDetailErrorAction,
    GetApplicationDetailInfoSuccess,
    GetApplicationTransferChangeSuccess,
    GetApplicationTradeChangeSuccess,
} from '../types/AppDetailTypes'

const initialState: AppDetailseState = {
    infoData: {
        code: null,
        name: null,
        logo: null,
        url: null,
        telegram: null,
        twitter: null,
        discord: null,
        symbolList: []
    },
      
    transferData: {
        amount: null,
        count: null,
        symbol: null,
        symbolAddr: null,
        trendList: []
    },
    tradeData: {
        addrCount: null,
        amount: null,
        avgPrice: null,
        count: null,
        symbol: null,
        symbolAddr: null,
        trendList: [],
        value: null,
        valueAmount: null,
    },
    e: null,
}

const reducer = (state = initialState, actions: AppDetailseActions) => {
    const { type } = actions
    switch (type) {
        case GET_APPLICATION_DETAIL_INFO_SUCCESS: {
            const { payload } = actions as GetApplicationDetailInfoSuccess
            return {
                ...state,
                infoData: payload.data,
            }
        }          
        case GET_APPLICATION_TRANSFERCHANGE_SUCCESS: {
            const { payload } = actions as GetApplicationTransferChangeSuccess
            return {
                ...state,
                transferData: payload.data,
            }
        }
        case GET_APPLICATION_TRADECHANGE_SUCCESS: {
            const { payload } = actions as GetApplicationTradeChangeSuccess
            return {
                ...state,
                tradeData: payload.data,
            }
        }
        case GET_APPLICATION_DETAIL_INFO_FAIL:
          
        case GET_APPLICATION_TRANSFERCHANGE_FAIL:
        case GET_APPLICATION_TRADECHANGE_FAIL: {
            const { payload } = actions as AppDetailErrorAction
            return {
                ...state,
                e: payload,
            }
        }
        default:
            return state
    }
}

export default reducer
