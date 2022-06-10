import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { SMTransferRankListParams, SMTransferRankListResponse } from 'redux/types/SmartMoney/TransferData/TransferRecordTypes'
import ApiClient from 'utils/ApiClient'
import Global from 'utils/Global'

// redux action 
export const SM_TRANSFER_RANK_LIST_LOADING = 'sm_transfer_rank_list_loading'

export const SM_TRANSFER_RANK_LIST_SUCCESS = 'sm_transfer_rank_list_success'
export const SM_TRANSFER_RANK_LIST_FAIL = 'sm_transfer_rank_list_fail'

export const smTransferListLoading = (data: boolean) => ({
  type: SM_TRANSFER_RANK_LIST_LOADING,
  payload: data,
})

export const getSMTransferRankList = (params: SMTransferRankListParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  dispatch(smTransferListLoading(true))
  try {
    const apiClient = new ApiClient<SMTransferRankListResponse>()
    const data = await apiClient.post(
      `/smart/money/transfer/record`,
      {
        data: {
          ...params,
          startTime: Global.getDayStart(params.startTime as number | null, 1000),
          endTime: Global.getDayEnd(params.endTime as number | null, 1000),
        }
      }
    )
    data.data.list = data.data.list ? data.data.list : []
    dispatch(getSMTransferRankListSuccess(data))
  } catch (e) {
    dispatch(getSMTransferRankListFail((e as unknown as Error)))
  }
}

export const getSMTransferRankListSuccess = (data: Response<SMTransferRankListResponse>) => ({
  type: SM_TRANSFER_RANK_LIST_SUCCESS,
  payload: data,
})

export const getSMTransferRankListFail = (e: Error) => ({
  type: SM_TRANSFER_RANK_LIST_FAIL,
  payload: e,
})