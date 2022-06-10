import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { SMHOTRankListParams, SMHOTRankListResponse } from 'redux/types/SmartMoney/TransferData/HotContractAddRankTypes'
import ApiClient from 'utils/ApiClient'

// redux action 
// loading
export const SM_HOT_RANK_LIST_LOADING = 'sm_ho t_rank_list_loading'
export const SM_HOT_RANK_LIST_NOMORE = 'sm_hot_rank_list_nomore'

export const SM_HOT_RANK_LIST_SUCCESS = 'sm_hot_rank_list_success'
export const SM_HOT_RANK_LIST_FAIL = 'sm_hot_rank_list_fail'

export const smHOTListLoading = (data: boolean) => ({
  type: SM_HOT_RANK_LIST_LOADING,
  payload: data,
})

export const smHOTListNoMore = (data: boolean) => ({
  type: SM_HOT_RANK_LIST_NOMORE,
  payload: data,
})

export const getSMHOTRankList = (params: SMHOTRankListParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  dispatch(smHOTListLoading(true))
  try {
    const apiClient = new ApiClient<SMHOTRankListResponse>()
    const data = await apiClient.post(
      `/smart/money/transfer/hot/contract/rank`,
      { data: params }
    )
    data.data.list = data.data.list ? data.data.list : []
    if (
      (params.pageNo > 1 && data.data.list.length > 0) ||
      params.pageNo == 1
    ) {
      
      dispatch(getSMHOTRankListSuccess(data))
      if (data.data.list.length < (params.pageSize as number)) {
        dispatch(smHOTListNoMore(true))
      }
    } else {
      
      dispatch(smHOTListNoMore(true))
    }
  } catch (e) {
    dispatch(getSMHOTRankListFail((e as unknown as Error)))
  }
}
export const getSMHOTRankListSuccess = (data: Response<SMHOTRankListResponse>) => ({
  type: SM_HOT_RANK_LIST_SUCCESS,
  payload: data,
})

export const getSMHOTRankListFail = (e: Error) => ({
  type: SM_HOT_RANK_LIST_FAIL,
  payload: e,
})