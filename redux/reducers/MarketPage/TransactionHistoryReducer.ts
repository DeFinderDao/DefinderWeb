import {
    TRANSACTION_HISTORY_BUS_LOADING,
    TRANSACTION_HISTORY_LP_LOADING,
    TRANSACTION_HISTORY_BUS_LIST_SUCCESS,
    TRANSACTION_HISTORY_BUS_LIST_FAIL,
    TRANSACTION_HISTORY_LP_LIST_SUCCESS,
    TRANSACTION_HISTORY_LP_LIST_FAIL,
    TRANSACTION_HISTORY_TRANSFER_LOADING,
    TRANSACTION_HISTORY_TRANSFER_LIST_SUCCESS,
    TRANSACTION_HISTORY_TRANSFER_LIST_FAIL,
} from 'redux/actions/MarketPage/TransactionHistoryAction'
import { TransactionHistoryActions, TransactionHistoryResponse, TransactionHistoryState } from 'redux/types/TransactionHistoryTypes'
import { Response } from 'redux/types'
const initialState: TransactionHistoryState = {
    loadingBus: true,
    loadingLp: true,
    loadingTransfer: true,
    transactionHistoryBusList: null,
    transactionHistoryLpList: null,
    transactionHistoryTransferList: null,
    e: null,
}

const reducer = (state = initialState, { type, payload }: TransactionHistoryActions) => {
    switch (type) {
        case TRANSACTION_HISTORY_BUS_LOADING:
            return {
                ...state,
                loadingBus: payload as boolean,
            }
        case TRANSACTION_HISTORY_LP_LOADING:
            return {
                ...state,
                loadingLp: payload as boolean,
            }
        case TRANSACTION_HISTORY_TRANSFER_LOADING:
            return {
                ...state,
                loadingTransfer: payload as boolean,
            }
        case TRANSACTION_HISTORY_BUS_LIST_SUCCESS:
            return {
                ...state,
                transactionHistoryBusList: (payload as Response<TransactionHistoryResponse>).data,
                loadingBus: false,
            }
        case TRANSACTION_HISTORY_LP_LIST_SUCCESS:
            return {
                ...state,
                transactionHistoryLpList: (payload as Response<TransactionHistoryResponse>).data,
                loadingLp: false,
            }
        case TRANSACTION_HISTORY_TRANSFER_LIST_SUCCESS:
            return {
                ...state,
                transactionHistoryTransferList: (payload as Response<TransactionHistoryResponse>).data,
                loadingTransfer: false,
            }
        case TRANSACTION_HISTORY_BUS_LIST_FAIL:
        case TRANSACTION_HISTORY_LP_LIST_FAIL:
        case TRANSACTION_HISTORY_TRANSFER_LIST_FAIL:
            return {
                ...state,
                e: payload as Error,
                loadingBus: false,
                loadingLp: false,
                loadingTransfer: false,
            }
        default:
            return state
    }
}

export default reducer
