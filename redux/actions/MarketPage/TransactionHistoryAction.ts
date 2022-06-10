import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { TransactionHistoryParams, TransactionHistoryResponse } from 'redux/types/TransactionHistoryTypes'
import ApiClient from 'utils/ApiClient'
import Global from 'utils/Global'
// import { message } from 'antd';

export const TRANSACTION_HISTORY_BUS_LOADING = 'transaction_history_bus_loading'
export const TRANSACTION_HISTORY_LP_LOADING = 'transaction_history_lp_loading'
export const TRANSACTION_HISTORY_TRANSFER_LOADING = 'transaction_history_transfer_loading'
export const TRANSACTION_HISTORY_BUS_LIST_SUCCESS = 'transaction_history_bus_list_success'
export const TRANSACTION_HISTORY_BUS_LIST_FAIL = 'transaction_history_bus_list_fail'
export const TRANSACTION_HISTORY_LP_LIST_SUCCESS = 'transaction_history_lp_list_success'
export const TRANSACTION_HISTORY_LP_LIST_FAIL = 'transaction_history_lp_list_fail'
export const TRANSACTION_HISTORY_TRANSFER_LIST_SUCCESS = 'transaction_history_transfer_list_success'
export const TRANSACTION_HISTORY_TRANSFER_LIST_FAIL = 'transaction_history_transfer_list_fail'

// loading
export const historyBusListLoading = (data: boolean) => ({
    type: TRANSACTION_HISTORY_BUS_LOADING,
    payload: data,
})
export const historyLpListLoading = (data: boolean) => ({
    type: TRANSACTION_HISTORY_LP_LOADING,
    payload: data,
})
export const historyTransferListLoading = (data: boolean) => ({
    type: TRANSACTION_HISTORY_TRANSFER_LOADING,
    payload: data,
})

const apiClient = new ApiClient<TransactionHistoryResponse>()

export const getTransactionHistoryBusList = (params: TransactionHistoryParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(historyBusListLoading(true))
    try {
        const data = await apiClient.post(
            `/market/trade/list`,
            {
                data: {
                    ...params,
                    startTime: Global.getDayStart(params.startTime, 1),
                    endTime: Global.getDayEnd(params.endTime, 1),
                    type: 1
                }
            }
        )
        dispatch(getTransactionHistoryBusListSuccess(data))
    } catch (e) {
        // message.error(e.message);
        dispatch(getTransactionHistoryBusListFail((e as unknown as Error)))
    }
}

export const getTransactionHistoryBusListSuccess = (data: Response<TransactionHistoryResponse>) => ({
    type: TRANSACTION_HISTORY_BUS_LIST_SUCCESS,
    payload: data,
})

export const getTransactionHistoryBusListFail = (e: Error) => ({
    type: TRANSACTION_HISTORY_BUS_LIST_FAIL,
    payload: e,
})


export const getTransactionHistoryLpList = (params: TransactionHistoryParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(historyLpListLoading(true))
    try {
        const data = await apiClient.post(
            `/market/trade/list`,
            {
                data: {
                    ...params,
                    startTime: Global.getDayStart(params.startTime, 1),
                    endTime: Global.getDayEnd(params.endTime, 1),
                    type: 2
                }
            }
        )
        dispatch(getTransactionHistoryLpListSuccess(data))
    } catch (e) {
        // message.error(e.message);
        dispatch(getTransactionHistoryLpListFail((e as unknown as Error)))
    }
}

export const getTransactionHistoryLpListSuccess = (data: Response<TransactionHistoryResponse>) => ({
    type: TRANSACTION_HISTORY_LP_LIST_SUCCESS,
    payload: data,
})

export const getTransactionHistoryLpListFail = (e: Error) => ({
    type: TRANSACTION_HISTORY_LP_LIST_FAIL,
    payload: e,
})


export const getTransactionHistoryTransferList = (params: TransactionHistoryParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(historyTransferListLoading(true))
    try {
        const data = await apiClient.post(
            `/market/trade/transfer/list`,
            {
                data: {
                    ...params,
                    startTime: Global.getDayStart(params.startTime, 1),
                    endTime: Global.getDayEnd(params.endTime, 1),
                }
            }
        )
        dispatch(getTransactionHistoryTransferListSuccess(data))
    } catch (e) {
        // message.error(e.message);
        dispatch(getTransactionHistoryTransferListFail((e as unknown as Error)))
    }
}

export const getTransactionHistoryTransferListSuccess = (data: Response<TransactionHistoryResponse>) => ({
    type: TRANSACTION_HISTORY_TRANSFER_LIST_SUCCESS,
    payload: data,
})

export const getTransactionHistoryTransferListFail = (e: Error) => ({
    type: TRANSACTION_HISTORY_TRANSFER_LIST_FAIL,
    payload: e,
})
