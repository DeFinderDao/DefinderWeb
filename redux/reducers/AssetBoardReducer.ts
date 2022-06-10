import {
    ASSETS_LOADING,
    GET_ASSETS_WALLET_LIST_SUCCESS,
    GET_ASSETS_WALLET_LIST_FAIL,
    GET_ASSETS_LOAN_LIST_SUCCESS,
    GET_ASSETS_LOAN_LIST_FAIL,
    CLEAR_ASSET
} from '../actions/AssetBoardAction'

import {
    AssetBoardState,
    AssetsActions,
    AssetsLoadingAction,
    AssetsListErrorAction,
    GetWalletDataSuccessAction,
    GetLoanDataSuccessAction,
    ClearAssetAction
} from '../types/AssetBoardTypes'

const initialState: AssetBoardState = {
    assetsLoading: true,
    walletData: null,
    loanData: [],
    e: null,
}
const reducer = (state = initialState, actions: AssetsActions) => {
    const { type } = actions
    switch (type) {
        case ASSETS_LOADING: {
            const { payload } = actions as AssetsLoadingAction
            return {
                ...state,
                assetsLoading: payload,
            }
        }
        case GET_ASSETS_WALLET_LIST_SUCCESS: {
            const { payload } = actions as GetWalletDataSuccessAction
            return {
                ...state,
                walletData: payload.data,
                assetsLoading: false,
            }
        }
        case GET_ASSETS_LOAN_LIST_SUCCESS: {
            const { payload } = actions as GetLoanDataSuccessAction
            return {
                ...state,
                loanData: payload,
                assetsLoading: false,
            }
        }
        case CLEAR_ASSET: {
            return {
                ...state,
                assetsLoading: true,
                walletData: null,
                loanData: [],
                e: null,
            }
        }
        case GET_ASSETS_WALLET_LIST_FAIL:
        case GET_ASSETS_LOAN_LIST_FAIL: {
            const { payload } = actions as AssetsListErrorAction
            return {
                ...state,
                e: payload,
                assetsLoading: false,
            }
        }
        default:
            return state
    }
}

export default reducer
