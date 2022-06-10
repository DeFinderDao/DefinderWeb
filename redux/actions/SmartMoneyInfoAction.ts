import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { SMInfoRankListParams, SMInfoRankListResponse, SMInfoRecordListResponse } from 'redux/types/SmartMoneyInfoTypes'
import ApiClient from 'utils/ApiClient'
import Global from 'utils/Global'

  
  
export const SM_INFO_RANK_LIST_LOADING = 'sm_info_rank_list_loading'
export const SM_INFO_RECORD_LIST_LOADING = 'sm_info_record_list_loading'

  
export const SM_INFO_RANK_LIST_SUCCESS = 'sm_info_rank_list_success'
export const SM_INFO_RANK_LIST_FAIL = 'sm_info_rank_list_fail'
export const SM_INFO_RECORD_LIST_SUCCESS = 'sm_info_record_list_success'
export const SM_INFO_RECORD_LIST_FAIL = 'sm_info_record_list_fail'

  
export const smInfoRankListLoading = (data: boolean) => ({
  type: SM_INFO_RANK_LIST_LOADING,
  payload: data,
})
  
export const smInfoRecordListLoading = (data: boolean) => ({
  type: SM_INFO_RECORD_LIST_LOADING,
  payload: data,
})

  
export const getSMInfoRankList = (params: SMInfoRankListParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  dispatch(smInfoRankListLoading(true))
  try {
    const apiClient = new ApiClient<SMInfoRankListResponse>()
    const data = await apiClient.post(
      `/smart/money/hold/address/rank`,
      {
        data: {
          ...params,
        }
      }
    )
    data.data.list = data.data.list ? data.data.list : []
    dispatch(getSMInfoRankListSuccess(data))
  } catch (e) {
    dispatch(getSMInfoRankListFail((e as unknown as Error)))
  }
}
  
export const getSMInfoRankListSuccess = (data: Response<SMInfoRankListResponse>) => ({
  type: SM_INFO_RANK_LIST_SUCCESS,
  payload: data,
})
  
export const getSMInfoRankListFail = (e: Error) => ({
  type: SM_INFO_RANK_LIST_FAIL,
  payload: e,
})

  
export const getSMInfoRecordList = (params: SMInfoRankListParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  dispatch(smInfoRecordListLoading(true))
  try {
    const apiClient = new ApiClient<SMInfoRecordListResponse>()
    const data = await apiClient.post(
      `/smart/money/swap/record`,
      {
        data: {
          symbolAddrList: [params.symbolAddr],
          addressType: params.addressType,
          pageNo: params.pageNo,
          pageSize: params.pageSize,
        }
      }
    )
    data.data.list = data.data.list ? data.data.list : []
    dispatch(getSMInfoRecordListSuccess(data))
  } catch (e) {
    dispatch(getSMInfoRecordListFail((e as unknown as Error)))
  }
}
  
export const getSMInfoRecordListSuccess = (data: Response<SMInfoRecordListResponse>) => ({
  type: SM_INFO_RECORD_LIST_SUCCESS,
  payload: data,
})
  
export const getSMInfoRecordListFail = (e: Error) => ({
  type: SM_INFO_RECORD_LIST_FAIL,
  payload: e,
})