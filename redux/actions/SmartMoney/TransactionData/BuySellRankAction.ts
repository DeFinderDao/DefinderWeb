import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { SMTransactionRankListParams, SMRankListResponse, SMRankPieResponse } from 'redux/types/SmartMoney/TransactionData/BuySellRankTypes'
import ApiClient from 'utils/ApiClient'

// redux action 
// loading
export const SM_TRANSACTION_BUY_RANK_LIST_LOADING = 'sm_transaction_buy_rank_list_loading'
export const SM_TRANSACTION_BUY_RANK_LIST_NOMORE = 'sm_transaction_buy_rank_list_nomore'
export const SM_TRANSACTION_SELL_RANK_LIST_LOADING = 'sm_transaction_sell_rank_list_loading'
export const SM_TRANSACTION_SELL_RANK_LIST_NOMORE = 'sm_transaction_sell_rank_list_nomore'


export const SM_TRANSACTION_BUY_RANK_LIST_SUCCESS = 'sm_transaction_buy_rank_list_success'
export const SM_TRANSACTION_BUY_RANK_LIST_FAIL = 'sm_transaction_buy_rank_list_fail'

export const SM_TRANSACTION_BUY_RANK_PIE_SUCCESS = 'sm_transaction_buy_rank_pie_success'
export const SM_TRANSACTION_BUY_RANK_PIE_FAIL = 'sm_transaction_buy_rank_pie_fail'


export const SM_TRANSACTION_SELL_RANK_LIST_SUCCESS = 'sm_transaction_sell_rank_list_success'
export const SM_TRANSACTION_SELL_RANK_LIST_FAIL = 'sm_transaction_sell_rank_list_fail'

export const SM_TRANSACTION_SELL_RANK_PIE_SUCCESS = 'sm_transaction_sell_rank_pie_success'
export const SM_TRANSACTION_SELL_RANK_PIE_FAIL = 'sm_transaction_sell_rank_pie_fail'


export const smTransactionBuyListLoading = (data: boolean) => ({
  type: SM_TRANSACTION_BUY_RANK_LIST_LOADING,
  payload: data,
})

export const smTransactionBuyListNoMore = (data: boolean) => ({
  type: SM_TRANSACTION_BUY_RANK_LIST_NOMORE,
  payload: data,
})

export const getSMBuyRankList = (params: SMTransactionRankListParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  dispatch(smTransactionBuyListLoading(true))
  try {
    const apiClient = new ApiClient<SMRankListResponse>()
    const data = await apiClient.post(
      `/smart/money/swap/netBuy/in`,
      { data: params }
    )
    data.data.list = data.data.list ? data.data.list : []
    if (
      (params.pageNo > 1 && data.data.list.length > 0) ||
      params.pageNo == 1
    ) {
      
      dispatch(getSMBuyRankListSuccess(data))
      if (data.data.list.length < (params.pageSize as number)) {
        dispatch(smTransactionBuyListNoMore(true))
      }
    } else {
      
      dispatch(smTransactionBuyListNoMore(true))
    }
  } catch (e) {
    dispatch(getSMBuyRankListFail((e as unknown as Error)))
  }
}

export const getSMBuyRankListSuccess = (data: Response<SMRankListResponse>) => ({
  type: SM_TRANSACTION_BUY_RANK_LIST_SUCCESS,
  payload: data,
})

export const getSMBuyRankListFail = (e: Error) => ({
  type: SM_TRANSACTION_BUY_RANK_LIST_FAIL,
  payload: e,
})


export const getSMBuyRankPie = (params: { symbolAddr: string }): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  try {
    const apiClient = new ApiClient<SMRankPieResponse>()
    const data = await apiClient.get(
      `/market/hold/pie/chart?symbolAddr=${params.symbolAddr}`
    )
    dispatch(getSMBuyRankPieSuccess(data))
  } catch (e) {
    dispatch(getSMBuyRankPieFail((e as unknown as Error)))
  }
}

export const getSMBuyRankPieSuccess = (data: Response<SMRankPieResponse>) => ({
  type: SM_TRANSACTION_BUY_RANK_PIE_SUCCESS,
  payload: data,
})

export const getSMBuyRankPieFail = (e: Error) => ({
  type: SM_TRANSACTION_BUY_RANK_PIE_FAIL,
  payload: e,
})





export const smTransactionSellListLoading = (data: boolean) => ({
  type: SM_TRANSACTION_SELL_RANK_LIST_LOADING,
  payload: data,
})

export const smTransactionSellListNoMore = (data: boolean) => ({
  type: SM_TRANSACTION_SELL_RANK_LIST_NOMORE,
  payload: data,
})


export const getSMSellRankList = (params: SMTransactionRankListParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  dispatch(smTransactionSellListLoading(true))
  try {
    const apiClient = new ApiClient<SMRankListResponse>()
    const data = await apiClient.post(
      `/smart/money/swap/netBuy/out`,
      { data: params }
    )
    data.data.list = data.data.list ? data.data.list : []
    if (
      (params.pageNo > 1 && data.data.list.length > 0) ||
      params.pageNo == 1
    ) {
      
      dispatch(getSMSellRankListSuccess(data))
      if (data.data.list.length < (params.pageSize as number)) {
        dispatch(smTransactionSellListNoMore(true))
      }
    } else {
      
      dispatch(smTransactionSellListNoMore(true))
    }
  } catch (e) {
    dispatch(getSMSellRankListFail((e as unknown as Error)))
  }
}

export const getSMSellRankListSuccess = (data: Response<SMRankListResponse>) => ({
  type: SM_TRANSACTION_SELL_RANK_LIST_SUCCESS,
  payload: data,
})

export const getSMSellRankListFail = (e: Error) => ({
  type: SM_TRANSACTION_SELL_RANK_LIST_FAIL,
  payload: e,
})


export const getSMSellRankPie = (params: { symbolAddr: string }): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  try {
    const apiClient = new ApiClient<SMRankPieResponse>()
    const data = await apiClient.get(
      `/market/hold/pie/chart?symbolAddr=${params.symbolAddr}`
    )
    dispatch(getSMSellRankPieSuccess(data))
  } catch (e) {
    dispatch(getSMSellRankPieFail((e as unknown as Error)))
  }
}

export const getSMSellRankPieSuccess = (data: Response<SMRankPieResponse>) => ({
  type: SM_TRANSACTION_SELL_RANK_PIE_SUCCESS,
  payload: data,
})

export const getSMSellRankPieFail = (e: Error) => ({
  type: SM_TRANSACTION_SELL_RANK_PIE_FAIL,
  payload: e,
})