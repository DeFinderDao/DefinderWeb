import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { SMCEXRankListParams, SMCEXRankListResponse } from 'redux/types/SmartMoney/TransferData/CEXInteractiveRankTypes'
import ApiClient from 'utils/ApiClient'

export const SM_CEX_RANK_LIST_LOADING = 'sm_cex_rank_list_loading'

export const SM_CEX_RANK_LIST_SUCCESS = 'sm_cex_rank_list_success'
export const SM_CEX_RANK_LIST_FAIL = 'sm_cex_rank_list_fail'

export const smCEXListLoading = (data: boolean) => ({
  type: SM_CEX_RANK_LIST_LOADING,
  payload: data,
})

export const getSMCEXRankList = (params: SMCEXRankListParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  dispatch(smCEXListLoading(true))
  try {
    const apiClient = new ApiClient<SMCEXRankListResponse>()
    const data = await apiClient.post(
      `/smart/money/transfer/cex/symbol/rank`,
      { data: params }
    )
    data.data.list = data.data.list ? data.data.list : []
    dispatch(getSMCEXRankListSuccess(data))
  } catch (e) {
    dispatch(getSMCEXRankListFail((e as unknown as Error)))
  }
}

export const getSMCEXRankListSuccess = (data: Response<SMCEXRankListResponse>) => ({
  type: SM_CEX_RANK_LIST_SUCCESS,
  payload: data,
})

export const getSMCEXRankListFail = (e: Error) => ({
  type: SM_CEX_RANK_LIST_FAIL,
  payload: e,
})